import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GalaxyProps {
    color: string;
}

const Galaxy: React.FC<GalaxyProps> = ({ color }) => {
    const pointsRef = useRef<THREE.Points>(null);

    const galaxyParameters = useMemo(() => {
        const positions = [];
        const colors = [];

        const numStars = 5000;
        const galaxyRadius = 5.5;
        const branches = 5;
        const spin = 1;

        const colorInstance = new THREE.Color(color);

        for (let i = 0; i < numStars; i++) {
            const radius = Math.random() * galaxyRadius;
            const branchAngle = ((i % branches) / branches) * Math.PI * 2;

            const spinAngle = radius * spin;

            const randomX = (Math.random() - 0.5) * 0.5;
            const randomY = (Math.random() - 0.5) * 0.5;
            const randomZ = (Math.random() - 0.5) * 0.5;

            const x = Math.cos(branchAngle + spinAngle) * radius + randomX;
            const y = randomY;
            const z = Math.sin(branchAngle + spinAngle) * radius + randomZ;

            positions.push(x, y, z);

            colors.push(colorInstance.r, colorInstance.g, colorInstance.b);
        }

        return {
            positions: new Float32Array(positions),
            colors: new Float32Array(colors),
        };
    }, [color]);

    useFrame(({ clock }) => {
        if (pointsRef.current) {
            pointsRef.current.rotation.y = clock.getElapsedTime() * 0.03;
        }
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[galaxyParameters.positions, 3]}
                />
                <bufferAttribute
                    attach="attributes-color"
                    args={[galaxyParameters.colors, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                vertexColors
                size={0.1}
                sizeAttenuation
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                transparent
            />
        </points>
    );
};

export default Galaxy;
