"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState, useRef } from "react";
import { OrbitControls, Stars, Sparkles } from "@react-three/drei";
import Terrain from "./Terrain";
import LandmarkMarker from "./LandmarkMarker";
import CameraController from "./CameraController";
import { Landmark } from "@/types";
import { Color, PCFShadowMap } from "three";
import { useFrame } from "@react-three/fiber";
import { village } from "@/config/village";

/**
 * Slowly rotating ring of warm ember particles — like fireflies above the fields.
 * Subtle: 80 particles, low opacity, warm gold.
 */
function FieldFireflies() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useRef<any>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.025;
    }
  });
  return (
    <group ref={ref}>
      <Sparkles
        count={80}
        scale={[12, 4, 12]}
        size={1.0}
        speed={0.15}
        opacity={0.35}
        color="#D4952A"
      />
    </group>
  );
}

/**
 * Night sky — dense warm stars like a clear Terai sky far from city light.
 * Two layers: background field + closer band (Milky Way suggestion).
 */
function TeraïSky() {
  return (
    <>
      <Stars
        radius={100}
        depth={60}
        count={5000}
        factor={4}
        saturation={0.6}
        fade
        speed={0.15}
      />
      {/* Slightly denser, closer band */}
      <Stars
        radius={50}
        depth={25}
        count={1500}
        factor={2.5}
        saturation={0.8}
        fade
        speed={0.08}
      />
    </>
  );
}

export default function MapCanvas() {
  const [landmarks, setLandmarks] = useState<Landmark[]>([]);

  useEffect(() => {
    fetch("/api/landmarks")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setLandmarks(data.data);
      });
  }, []);

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 8, 6], fov: 50, near: 0.1, far: 200 }}
        gl={{ antialias: true, alpha: false }}
        shadows={{ type: PCFShadowMap }}
        scene={{ background: new Color("#0F0800") }}
        dpr={[1, 1.5]}
      >
        {/* Warm low-lying haze — like paddy field fog */}
        <fog attach="fog" args={["#1C0E04", 16, 55]} />

        {/* ── Lighting — village lantern night ── */}

        {/* Primary: warm gold directional — harvest moon */}
        <directionalLight
          position={[8, 14, 5]}
          intensity={1.8}
          color="#F5D08A"
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-camera-far={40}
          shadow-camera-left={-8}
          shadow-camera-right={8}
          shadow-camera-top={8}
          shadow-camera-bottom={-8}
        />

        {/* Secondary: cool moonlight from opposite — silver-blue */}
        <directionalLight
          position={[-5, 6, -8]}
          intensity={0.4}
          color="#B8C8E8"
        />

        {/* Central diya/lantern glow — warm amber from ground level */}
        <pointLight
          position={[0, 1.5, 0]}
          intensity={2.0}
          color="#D4892A"
          distance={10}
          decay={2}
        />

        {/* Ambient — warm night, not cold */}
        <ambientLight intensity={0.35} color="#5C3A18" />

        {/* Hemisphere: warm saffron sky / terracotta earth */}
        <hemisphereLight args={["#3A2010", "#1C0E04", 0.5]} />

        <Suspense fallback={null}>
          <TeraïSky />
          <FieldFireflies />
          <Terrain />

          {landmarks.map((landmark) => (
            <LandmarkMarker
              key={landmark._id}
              landmark={landmark}
              accentHex={village.accentColor}
            />
          ))}
        </Suspense>

        <CameraController />

        <OrbitControls
          enablePan
          enableZoom
          enableRotate
          minDistance={2}
          maxDistance={20}
          maxPolarAngle={Math.PI / 2.15}
          makeDefault
        />
      </Canvas>
    </div>
  );
}
