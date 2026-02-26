"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState, useRef } from "react";
import { OrbitControls, Stars, Cloud, Sparkles } from "@react-three/drei";
import Terrain from "./Terrain";
import LandmarkMarker from "./LandmarkMarker";
import CameraController from "./CameraController";
import { Landmark } from "@/types";
import { Color } from "three";
import { useFrame } from "@react-three/fiber";

// Slowly rotating sacred ring of sparkles around the map
function SacredAura() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useRef<any>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.04;
    }
  });
  return (
    <group ref={ref}>
      <Sparkles
        count={180}
        scale={[14, 6, 14]}
        size={1.2}
        speed={0.2}
        opacity={0.5}
        color="#ffd700"
      />
    </group>
  );
}

// Floating sacred particles drifting upward
function FloatingPrayers() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useRef<any>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.3;
    }
  });
  return (
    <group ref={ref}>
      <Sparkles
        count={60}
        scale={[8, 10, 8]}
        size={0.8}
        speed={0.4}
        opacity={0.25}
        color="#c084fc"
        position={[0, 2, 0]}
      />
    </group>
  );
}

export default function MapCanvas() {
  const [landmarks, setLandmarks] = useState<Landmark[]>([]);

  useEffect(() => {
    fetch("/api/landmarks")
      .then((r) => r.json())
      .then((data) => { if (data.success) setLandmarks(data.data); });
  }, []);

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 8, 6], fov: 50, near: 0.1, far: 200 }}
        gl={{ antialias: true, alpha: false }}
        shadows
        scene={{ background: new Color("#07040f") }}
      >
        {/* Sacred night atmosphere fog — deep violet */}
        <fog attach="fog" args={["#0d0520", 18, 65]} />

        {/* Lighting — temple warmth */}
        {/* Main golden sun/lamp light */}
        <directionalLight
          position={[8, 12, 6]}
          intensity={2.2}
          color="#ffd580"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        {/* Cool moonlight from behind — Krishna's midnight blue */}
        <directionalLight
          position={[-6, 5, -8]}
          intensity={0.6}
          color="#4466cc"
        />
        {/* Warm saffron fill — temple diya glow */}
        <pointLight
          position={[0, 2, 0]}
          intensity={1.2}
          color="#ff9933"
          distance={12}
          decay={2}
        />
        {/* Soft violet ambient — Pranami devotion */}
        <ambientLight intensity={0.5} color="#7c3aed" />
        {/* Hemisphere — sacred earth/heaven */}
        <hemisphereLight args={["#1a0a3e", "#2d1a00", 0.6]} />

        <Suspense fallback={null}>
          {/* Dense golden stars — the cosmic universe of Pranami */}
          <Stars
            radius={90}
            depth={50}
            count={6000}
            factor={4}
            saturation={0.8}
            fade
            speed={0.2}
          />

          {/* Milky way band — denser stars in one area */}
          <Stars
            radius={40}
            depth={20}
            count={2000}
            factor={2}
            saturation={1}
            fade
            speed={0.1}
          />

          {/* Sacred golden aura around the village */}
          <SacredAura />

          {/* Floating prayer particles */}
          <FloatingPrayers />

          {/* Soft divine clouds — like celestial realm */}
          <Cloud
            position={[-7, 7, -9]}
            opacity={0.08}
            speed={0.05}
            scale={4}
            color="#9333ea"
          />
          <Cloud
            position={[8, 8, -7]}
            opacity={0.06}
            speed={0.04}
            scale={3}
            color="#7c3aed"
          />
          <Cloud
            position={[0, 9, -12]}
            opacity={0.07}
            speed={0.06}
            scale={5}
            color="#4f46e5"
          />

          <Terrain />

          {landmarks.map((landmark) => (
            <LandmarkMarker key={landmark._id} landmark={landmark} />
          ))}
        </Suspense>

        <CameraController />
        <OrbitControls
          enablePan
          enableZoom
          enableRotate
          minDistance={2}
          maxDistance={20}
          maxPolarAngle={Math.PI / 2.2}
          makeDefault
        />
      </Canvas>
    </div>
  );
}