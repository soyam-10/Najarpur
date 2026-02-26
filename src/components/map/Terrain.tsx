"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, MeshStandardMaterial } from "three";
import { useTexture, Grid } from "@react-three/drei";

export default function Terrain() {
  const waterRef = useRef<Mesh>(null);
  const mapTexture = useTexture("/images/map/najarpur-map.png");

  // Animate water shimmer
  useFrame((state) => {
    if (waterRef.current) {
      const mat = waterRef.current.material as MeshStandardMaterial;
      mat.opacity = 0.55 + Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
    }
  });

  return (
    <group>
      {/* Satellite map plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 10, 32, 32]} />
        <meshStandardMaterial
          map={mapTexture}
          roughness={0.85}
          metalness={0.0}
        />
      </mesh>

      {/* Subtle grid overlay — like a topographic feel */}
      <Grid
        position={[0, 0.002, 0]}
        args={[10, 10]}
        cellSize={0.5}
        cellThickness={0.3}
        cellColor="#4ade80"
        sectionSize={2.5}
        sectionThickness={0.6}
        sectionColor="#22c55e"
        fadeDistance={12}
        fadeStrength={2}
        infiniteGrid={false}
      />

      {/* Ground border glow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial
          color="#0a0f1a"
          roughness={1}
        />
      </mesh>
    </group>
  );
}