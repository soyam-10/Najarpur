"use client";

import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls, Environment, ContactShadows, Html } from "@react-three/drei";
import { Group } from "three";
import { motion, AnimatePresence } from "framer-motion";
import { Minimize2, RotateCcw, Box } from "lucide-react";
import { Button } from "@/components/ui/button";

function Model({ path }: { path: string }) {
    const { scene } = useGLTF(path);
    const ref = useRef<Group>(null);
    return <primitive ref={ref} object={scene} scale={1} position={[0, -0.5, 0]} />;
}

function LoadingFallback() {
    return (
        <Html center>
            <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin" />
                <p
                    className="text-xs tracking-widest uppercase"
                    style={{ color: "rgba(255,255,255,0.5)", whiteSpace: "nowrap" }}
                >
                    Loading 3D Model
                </p>
            </div>
        </Html>
    );
}

interface CanvasProps {
    modelPath: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    controlsRef: React.RefObject<any>;
    autoRotate: boolean;
}

function ViewerCanvas({ modelPath, controlsRef, autoRotate }: CanvasProps) {
    return (
        <Canvas
            camera={{ position: [3, 2, 5], fov: 45, near: 0.1, far: 100 }}
            gl={{ antialias: true, alpha: false }}
            shadows="soft"  // ← replaces PCFSoftShadowMap
            style={{ background: "#07040f" }}
        >
            <color attach="background" args={["#07040f"]} />
            <fog attach="fog" args={["#0d0520", 15, 50]} />

            <ambientLight intensity={0.5} color="#7c3aed" />
            <directionalLight
                position={[5, 8, 5]}
                intensity={2.5}
                color="#ffd580"
                castShadow
                shadow-mapSize={[1024, 1024]}
            />
            <directionalLight position={[-4, 3, -6]} intensity={0.6} color="#4466cc" />
            <pointLight position={[0, 3, 0]} intensity={1.5} color="#ff9933" distance={10} decay={2} />

            <Environment preset="night" />

            <Suspense fallback={<LoadingFallback />}>
                <Model path={modelPath} />
                <ContactShadows
                    position={[0, -0.8, 0]}
                    opacity={0.5}
                    scale={8}
                    blur={2}
                    far={4}
                    color="#000000"
                />
            </Suspense>

            <OrbitControls
                ref={controlsRef}
                autoRotate={autoRotate}
                autoRotateSpeed={1}
                enablePan={false}
                enableZoom
                enableRotate
                minDistance={1}
                maxDistance={12}
                minPolarAngle={Math.PI / 8}
                maxPolarAngle={Math.PI / 2}
            />
        </Canvas>
    );
}

interface Props {
    modelPath: string;
    landmarkName: string;
    open: boolean;
    onClose: () => void;
}

export default function LandmarkModelViewer({ modelPath, landmarkName, open, onClose }: Props) {
    const [autoRotate, setAutoRotate] = useState(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const controlsRef = useRef<any>(null);

    const resetCamera = () => {
        if (controlsRef.current) controlsRef.current.reset();
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0, y: "100%" }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: "100%" }}
                    transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                    className="fixed inset-0 z-[100] bg-black"
                    style={{ touchAction: "none" }}
                >
                    {/* Sacred glow */}
                    <div
                        className="absolute inset-0 pointer-events-none z-10"
                        style={{
                            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,153,51,0.08) 0%, transparent 70%)`,
                        }}
                    />

                    {/* Canvas — full screen */}
                    <div className="absolute inset-0">
                        <ViewerCanvas
                            modelPath={modelPath}
                            controlsRef={controlsRef}
                            autoRotate={autoRotate}
                        />
                    </div>

                    {/* Top bar */}
                    <div
                        className="absolute top-0 left-0 right-0 z-20 px-4 pt-10 pb-6 md:px-6 md:pt-6"
                        style={{
                            background: "linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, transparent 100%)",
                        }}
                    >
                        <div className="flex items-start justify-between gap-3">
                            {/* Landmark info */}
                            <div className="min-w-0 flex-1">
                                <p className="text-xs tracking-[0.2em] uppercase mb-0.5"
                                    style={{ color: "rgba(255,255,255,0.4)" }}>
                                    3D Model
                                </p>
                                <p className="text-white font-semibold text-sm leading-snug truncate">
                                    {landmarkName}
                                </p>
                            </div>

                            {/* Buttons */}
                            <div className="flex items-center gap-1.5 shrink-0">
                                {/* Rotate toggle */}
                                <button
                                    onClick={() => setAutoRotate(!autoRotate)}
                                    className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium transition-all"
                                    style={{
                                        backdropFilter: "blur(12px)",
                                        WebkitBackdropFilter: "blur(12px)",
                                        background: autoRotate ? "rgba(255,215,0,0.15)" : "rgba(255,255,255,0.08)",
                                        border: autoRotate
                                            ? "1px solid rgba(255,215,0,0.3)"
                                            : "1px solid rgba(255,255,255,0.12)",
                                        color: autoRotate ? "#fde047" : "rgba(255,255,255,0.6)",
                                    }}
                                >
                                    <Box className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">
                                        {autoRotate ? "Stop" : "Rotate"}
                                    </span>
                                </button>

                                {/* Reset */}
                                <button
                                    onClick={resetCamera}
                                    className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium transition-all"
                                    style={{
                                        backdropFilter: "blur(12px)",
                                        WebkitBackdropFilter: "blur(12px)",
                                        background: "rgba(255,255,255,0.08)",
                                        border: "1px solid rgba(255,255,255,0.12)",
                                        color: "rgba(255,255,255,0.6)",
                                    }}
                                >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">Reset</span>
                                </button>

                                {/* Close */}
                                <button
                                    onClick={onClose}
                                    className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium transition-all text-white"
                                    style={{
                                        backdropFilter: "blur(12px)",
                                        WebkitBackdropFilter: "blur(12px)",
                                        background: "rgba(255,255,255,0.15)",
                                        border: "1px solid rgba(255,255,255,0.2)",
                                    }}
                                >
                                    <Minimize2 className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">Close</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Bottom hint */}
                    <div
                        className="absolute bottom-0 left-0 right-0 z-20 pb-8 flex flex-col items-center gap-2"
                        style={{
                            background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%)",
                        }}
                    >
                        <span
                            className="text-xs tracking-widest uppercase px-4 py-2 rounded-full"
                            style={{
                                backdropFilter: "blur(12px)",
                                background: "rgba(255,255,255,0.05)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                color: "rgba(255,255,255,0.3)",
                            }}
                        >
                            <span className="hidden sm:inline">Drag to rotate · Scroll to zoom</span>
                            <span className="sm:hidden">1 finger rotate · 2 fingers zoom</span>
                        </span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}