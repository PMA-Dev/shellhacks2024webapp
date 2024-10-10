import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
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
            <pointLight position={[0, 0, 0]} intensity={10} color={sunColor} />
        </>
    );
};

function generateSolarSystem(seed: number) {
    const random = mulberry32(seed);

    // Randomly select sun color from predefined constants
    const sunColors = ['#ffcc00', '#ff6600', '#ff0066']; // Yellow, Orange, Pink
    const sunColor = sunColors[Math.floor(random() * sunColors.length)];

    // Choose number of planets between 3 and 12
    const numPlanets = Math.floor(random() * 10) + 3; // Between 3 and 12 planets
    const planets: Planet[] = [];

    for (let i = 0; i < numPlanets; i++) {
        const distance = (i + 1) * 2 + random(); // Distance from the sun
        const size = random() * 0.5 + 0.2; // Planet size between 0.2 and 0.7
        const color = new THREE.Color(random(), random(), random()).getStyle(); // Random color
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
        var t = (a += 0x6d2b79f5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

export default SolarSystem;
