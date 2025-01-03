// src/components/SolarSystem.tsx

import { useFrame } from '@react-three/fiber';
import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';

interface Planet {
    distance: number;
    size: number;
    color: string;
    speed: number;
    initialAngle: number;
}

interface SolarSystemProps {
    seed: number;
}

const sunColors = [
    '#ffe680', // Lighter Yellow
    '#ff9933', // Lighter Orange
    '#ff6699', // Lighter Pink
    '#99ccff', // Light Blue
    '#ccccff', // Light Purple
    '#ffffff', // White
    '#ffcccc', // Light Red
    '#ffffcc', // Pale Yellow
];

const SolarSystem: React.FC<SolarSystemProps> = ({ seed }) => {
    const { sunColor, planets } = useMemo(
        () => generateSolarSystem(seed),
        [seed]
    );
    const groupRefs = useRef<Array<THREE.Mesh>>([]);

    useFrame(({ clock }) => {
        const time = clock.getElapsedTime() + 30; // Simulate 30 seconds into the future
        groupRefs.current.forEach((planetMesh, index) => {
            const planet = planets[index];
            if (planetMesh) {
                const angle = time * planet.speed + planet.initialAngle;
                planetMesh.position.x = Math.cos(angle) * planet.distance;
                planetMesh.position.z = Math.sin(angle) * planet.distance;
            }
        });
    });

    return (
        <>
            {/* Starfield Background */}
            <Starfield seed={seed} />

            {/* Sun */}
            <mesh>
                <sphereGeometry args={[2, 32, 32]} />
                <meshBasicMaterial color={sunColor} />
            </mesh>

            {/* Planets */}
            {planets.map((planet, index) => (
                <mesh
                    key={index}
                    ref={(el) => (groupRefs.current[index] = el!)}
                    position={[planet.distance, 0, 0]}
                >
                    <sphereGeometry args={[planet.size, 32, 32]} />
                    <meshStandardMaterial color={planet.color} />
                </mesh>
            ))}

            {/* Ambient Light */}
            <ambientLight intensity={0.5} />
            {/* Point Light at the sun's position */}
            <pointLight
                position={[0, 0, 0]}
                intensity={100}
                color={sunColor}
            />
        </>
    );
};

function generateSolarSystem(seed: number) {
    const random = mulberry32(seed);

    // Randomly select sun color from predefined constants
    

    const sunColor = sunColors[Math.floor(random() * sunColors.length)];

    // Choose number of planets between 3 and 12
    const numPlanets = Math.floor(random() * 10) + 3; // Between 3 and 12 planets
    const planets: Planet[] = [];

    for (let i = 0; i < numPlanets; i++) {
        const distance = (i + 1) * 2 + random(); // Distance from the sun
        const size = random() * 0.5 + 0.2; // Planet size between 0.2 and 0.7
        const color = new THREE.Color(
            random(),
            random(),
            random()
        ).getStyle(); // Random color
        const speed = random() * 0.3 + 0.1; // Orbital speed between 0.1 and 0.4

        // Add a random initial angle between 0 and 2π
        const initialAngle = random() * Math.PI * 2;

        planets.push({ distance, size, color, speed, initialAngle });
    }

    return { sunColor, planets };
}

// Simple deterministic random number generator
function mulberry32(a: number) {
    return function () {
        let t = (a += 0x6d2b79f5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

// Starfield Component
const Starfield: React.FC<{ seed: number }> = ({ seed }) => {
    const starsGeometry = useMemo(() => {
        const geometry = new THREE.BufferGeometry();
        const positions: number[] = [];
        const colors: number[] = [];
        const twinklePhases: number[] = [];
        const random = mulberry32(seed + 1); // Different seed for stars

        // Number of stars
        const numStars = 1000;

        // Sun colors for color variance
        const sunColorsThree = sunColors.map((color) => new THREE.Color(color));

        for (let i = 0; i < numStars; i++) {
            const x = random() * 2000 - 1000;
            const y = random() * 2000 - 1000;
            const z = random() * 2000 - 1000;
            positions.push(x, y, z);

            // Randomly assign color
            let color: THREE.Color;
            if (random() < 0.05) {
                // Use a sun color
                color = sunColorsThree[Math.floor(random() * sunColorsThree.length)];
            } else {
                // use white
                color = new THREE.Color(1, 1, 1);
            }
            colors.push(color.r, color.g, color.b);

            // Twinkle phase
            const twinklePhase = random() * Math.PI * 2;
            twinklePhases.push(twinklePhase);
        }

        geometry.setAttribute(
            'position',
            new THREE.Float32BufferAttribute(positions, 3)
        );
        geometry.setAttribute(
            'color',
            new THREE.Float32BufferAttribute(colors, 3)
        );
        geometry.setAttribute(
            'twinklePhase',
            new THREE.Float32BufferAttribute(twinklePhases, 1)
        );

        return geometry;
    }, [seed]);

    const materialRef = useRef<THREE.ShaderMaterial>(null);

    useFrame(({ clock }) => {
        if (materialRef.current) {
            materialRef.current.uniforms.time.value = clock.getElapsedTime();
        }
    });

    return (
        <points geometry={starsGeometry}>
            <shaderMaterial
                ref={materialRef}
                vertexColors
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                transparent
                uniforms={{
                    time: { value: 0 },
                }}
                vertexShader={`
                    attribute float twinklePhase;
                    varying vec3 vColor;
                    varying float vTwinklePhase;
                    void main() {
                        vColor = color;
                        vTwinklePhase = twinklePhase;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                        gl_PointSize = 3.0;
                    }
                `}
                fragmentShader={`
                    uniform float time;
                    varying vec3 vColor;
                    varying float vTwinklePhase;
                    void main() {
                        float twinkle = 0.5 + 0.5 * sin(time * 0.5 + vTwinklePhase);
                        gl_FragColor = vec4(vColor, twinkle);
                    }
                `}
            />
        </points>
    );
};

export default SolarSystem;
