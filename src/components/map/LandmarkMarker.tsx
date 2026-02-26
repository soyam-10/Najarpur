"use client";

import { useRef, useState } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { Mesh } from "three";
import { Landmark } from "@/types";
import { useMapStore } from "@/store/mapStore";

interface Props {
  landmark: Landmark;
}

export default function LandmarkMarker({ landmark }: Props) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const { setActiveLandmark, isCameraZooming } = useMapStore();

  // Gentle float animation
  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.position.y =
      landmark.position[1] +
      Math.sin(state.clock.elapsedTime * 1.5 + landmark.position[0]) * 0.05 +
      0.15;
  });
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (isCameraZooming) return;
    setActiveLandmark(landmark._id!);
  };

  return (
    <group position={[landmark.position[0], 0, landmark.position[2]]}>
      {/* Pin stem */}
      <mesh position={[0, 0.07, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.14, 8]} />
        <meshStandardMaterial color="#ffffff" opacity={0.6} transparent />
      </mesh>

      {/* Pin head — clickable */}
      <mesh
        ref={meshRef}
        position={[0, 0.15, 0]}
        onClick={handleClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "default";
        }}
      >
        <sphereGeometry args={[hovered ? 0.1 : 0.08, 16, 16]} />
        <meshStandardMaterial
          color={hovered ? "#4ade80" : "#16a34a"}
          emissive={hovered ? "#4ade80" : "#15803d"}
          emissiveIntensity={hovered ? 0.6 : 0.3}
        />
      </mesh>

      {/* Label — shows on hover */}
      {hovered && (
        <Html
          position={[0, 0.35, 0]}
          center
          style={{ pointerEvents: "none" }}
        >
          <div className="bg-black/80 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full whitespace-nowrap border border-green-500/40">
            {landmark.name}
          </div>
        </Html>
      )}

      {/* Ground ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <ringGeometry args={[0.1, 0.13, 32]} />
        <meshStandardMaterial
          color={hovered ? "#4ade80" : "#16a34a"}
          opacity={hovered ? 0.8 : 0.4}
          transparent
        />
      </mesh>
    </group>
  );
}