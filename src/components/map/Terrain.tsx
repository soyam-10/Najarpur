"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, MeshStandardMaterial } from "three";
import { useTexture, Grid } from "@react-three/drei";
import { village } from "@/config/village";

/**
 * Terrain — satellite map plane with a warm amber grid overlay.
 * Replaces the cold blue-black border and green grid from the original.
 */
export default function Terrain() {
  const groundRef = useRef<Mesh>(null);
  const mapTexture = useTexture(village.mapImage);

  // Subtle warm shimmer on the outer border — like heat haze
  useFrame((state) => {
    if (groundRef.current) {
      const mat = groundRef.current.material as MeshStandardMaterial;
      mat.emissiveIntensity = 0.04 + Math.sin(state.clock.elapsedTime * 0.4) * 0.02;
    }
  });

  // Grid color derived from village accent — amber for Najarpur, forest for Kemlipur
  // We use a neutral warm amber for both since grid is subtle regardless
  const gridCellColor = "#6B4A1A";
  const gridSectionColor = "#9B6A2A";

  return (
    <group>
      {/* Main satellite map plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 10, 1, 1]} />
        <meshStandardMaterial
          map={mapTexture}
          roughness={0.9}
          metalness={0.0}
          // Warm slight tint to unify with the saffron/amber atmosphere
          color="#EDD8A8"
        />
      </mesh>

      {/* Topographic grid — subtle, warm, not tech-green */}
      <Grid
        position={[0, 0.003, 0]}
        args={[10, 10]}
        cellSize={0.5}
        cellThickness={0.2}
        cellColor={gridCellColor}
        sectionSize={2.5}
        sectionThickness={0.45}
        sectionColor={gridSectionColor}
        fadeDistance={10}
        fadeStrength={2.5}
        infiniteGrid={false}
      />

      {/* Outer border platform — warm terracotta earth, not cold blue-black */}
      <mesh
        ref={groundRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.005, 0]}
      >
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial
          color="#1C0E04"
          roughness={1}
          emissive="#3A1A08"
          emissiveIntensity={0.04}
        />
      </mesh>

      {/* Soft edge glow — like torchlight spilling onto surrounding earth */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.004, 0]}>
        <ringGeometry args={[5, 7, 64]} />
        <meshStandardMaterial
          color="#C97F2A"
          transparent
          opacity={0.04}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
