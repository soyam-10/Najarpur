"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { OrbitControls, Stars, Cloud, Sky } from "@react-three/drei";
import Terrain from "./Terrain";
import LandmarkMarker from "./LandmarkMarker";
import CameraController from "./CameraController";
import { Landmark } from "@/types";
import { Color } from "three";

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
        scene={{ background: new Color("#0a0f1a") }}
      >
        {/* Atmosphere fog */}
        <fog attach="fog" args={["#0a0f1a", 18, 60]} />

        {/* Lighting */}
        <ambientLight intensity={0.6} color="#b8d4ff" />
        <directionalLight
          position={[8, 12, 6]}
          intensity={2}
          color="#fff8e7"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        {/* Cool blue fill light from opposite side */}
        <directionalLight position={[-6, 4, -8]} intensity={0.4} color="#4488ff" />
        {/* Warm ground bounce */}
        <hemisphereLight args={["#b8d4ff", "#4a7c4e", 0.5]} />

        <Suspense fallback={null}>
          {/* Stars in background */}
          <Stars
            radius={80}
            depth={40}
            count={3000}
            factor={3}
            saturation={0.5}
            fade
            speed={0.3}
          />

          {/* Atmospheric clouds */}
          <Cloud
            position={[-6, 6, -8]}
            opacity={0.15}
            speed={0.1}
            scale={3}
            color="#ffffff"
          />
          <Cloud
            position={[7, 7, -6]}
            opacity={0.1}
            speed={0.08}
            scale={2}
            color="#aaccff"
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
          onStart={() => {
            // Stop auto-rotate when user interacts
          }}
        />
      </Canvas>
    </div>
  );
}