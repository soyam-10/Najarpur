"use client";

import { useRef, useState } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import { Html, Sparkles } from "@react-three/drei";
import { Mesh, MeshStandardMaterial } from "three";
import { Landmark } from "@/types";
import { useMapStore } from "@/store/mapStore";

interface Props {
  landmark: Landmark;
  accentHex?: string; // village accent — default saffron
}

/**
 * Diya-inspired landmark marker.
 * A small clay bowl shape with a warm flickering flame glow — no generic sphere pins.
 * Colors adapt to the village's accent via accentHex prop.
 */
export default function LandmarkMarker({ landmark, accentHex = "#C97F2A" }: Props) {
  const flameRef = useRef<Mesh>(null);
  const glowRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const { setActiveLandmark, isCameraZooming } = useMapStore();

  // Flicker the flame — random-ish noise for organic feel
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const seed = landmark.position[0] * 17.3; // per-landmark phase offset

    if (flameRef.current) {
      // Vertical bob — like real flame
      flameRef.current.position.y =
        landmark.position[1] +
        0.18 +
        Math.sin(t * 3.2 + seed) * 0.025 +
        Math.sin(t * 7.1 + seed * 0.4) * 0.01;

      // Slight horizontal sway
      flameRef.current.position.x =
        Math.sin(t * 2.1 + seed * 0.6) * 0.012;
      flameRef.current.position.z =
        Math.cos(t * 1.8 + seed * 0.8) * 0.012;

      // Scale flicker
      const flicker = 1 + Math.sin(t * 8.4 + seed) * 0.12;
      flameRef.current.scale.set(flicker * (hovered ? 1.3 : 1), flicker, flicker * (hovered ? 1.3 : 1));

      // Emissive intensity flicker
      const mat = flameRef.current.material as MeshStandardMaterial;
      mat.emissiveIntensity = 1.4 + Math.sin(t * 5.5 + seed) * 0.5;
    }

    if (glowRef.current) {
      const mat = glowRef.current.material as MeshStandardMaterial;
      mat.opacity = (hovered ? 0.45 : 0.25) + Math.sin(t * 3 + seed) * 0.08;
    }
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (isCameraZooming) return;
    setActiveLandmark(landmark._id!);
  };

  return (
    <group position={[landmark.position[0], 0, landmark.position[2]]}>
      {/* Clay bowl base — flat cylinder */}
      <mesh position={[0, 0.025, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.055, 0.04, 0.05, 12]} />
        <meshStandardMaterial
          color="#7A4A2A"
          roughness={0.9}
          metalness={0.0}
        />
      </mesh>

      {/* Flame glow — wide soft sphere beneath flame */}
      <mesh ref={glowRef} position={[0, 0.12, 0]}>
        <sphereGeometry args={[0.09, 8, 8]} />
        <meshStandardMaterial
          color={accentHex}
          transparent
          opacity={0.3}
          depthWrite={false}
        />
      </mesh>

      {/* Flame — teardrop-ish using sphere with Y scale */}
      <mesh
        ref={flameRef}
        position={[0, 0.18, 0]}
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
        <sphereGeometry args={[0.04, 10, 10]} />
        <meshStandardMaterial
          color={accentHex}
          emissive={accentHex}
          emissiveIntensity={1.6}
          roughness={0.1}
          metalness={0.0}
        />
      </mesh>

      {/* Warm point light from flame — makes terrain glow beneath it */}
      <pointLight
        position={[0, 0.2, 0]}
        color={accentHex}
        intensity={hovered ? 1.8 : 0.9}
        distance={1.2}
        decay={2}
      />

      {/* Sparkles — tiny embers floating up */}
      {hovered && (
        <Sparkles
          count={12}
          scale={[0.3, 0.5, 0.3]}
          size={0.6}
          speed={0.5}
          opacity={0.7}
          color={accentHex}
          position={[0, 0.2, 0]}
        />
      )}

      {/* Ground ring — warm ember circle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <ringGeometry args={[0.06, 0.09, 24]} />
        <meshStandardMaterial
          color={accentHex}
          opacity={hovered ? 0.6 : 0.25}
          transparent
          depthWrite={false}
        />
      </mesh>

      {/* Tooltip — shows name on hover, styled like aged parchment label */}
      {hovered && (
        <Html
          position={[0, 0.42, 0]}
          center
          style={{ pointerEvents: "none", whiteSpace: "nowrap" }}
        >
          <div
            style={{
              background: "rgba(15, 8, 0, 0.88)",
              border: `1px solid ${accentHex}55`,
              color: "#F5ECD7",
              fontSize: "11px",
              fontFamily: "'DM Sans', sans-serif",
              letterSpacing: "0.03em",
              padding: "5px 12px",
              borderRadius: "4px",
              backdropFilter: "blur(8px)",
              boxShadow: `0 4px 20px rgba(0,0,0,0.6), 0 0 12px ${accentHex}33`,
            }}
          >
            {landmark.name}
          </div>
        </Html>
      )}
    </group>
  );
}
