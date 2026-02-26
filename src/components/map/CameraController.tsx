"use client";

import { useRef, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { Vector3, MathUtils } from "three";
import { useMapStore } from "@/store/mapStore";

const DEFAULT_POSITION = new Vector3(0, 8, 6);
const DEFAULT_TARGET = new Vector3(0, 0, 0);
const ZOOM_DURATION = 1.8;
const PAUSE_BEFORE_OVERLAY = 300;

export default function CameraController() {
  const { camera, controls } = useThree();
  const { activeLandmark, setIsCameraZooming, setIsZoomComplete } = useMapStore();

  const targetPosition = useRef(DEFAULT_POSITION.clone());
  const targetLookAt = useRef(DEFAULT_TARGET.clone());
  const currentLookAt = useRef(DEFAULT_TARGET.clone());
  const isAnimating = useRef(false);
  const isReturning = useRef(false);
  const zoomProgress = useRef(0);
  const startPosition = useRef(DEFAULT_POSITION.clone());
  const startLookAt = useRef(DEFAULT_TARGET.clone());

  useEffect(() => {
    if (activeLandmark) {
      isReturning.current = false;

      fetch(`/api/landmarks/${activeLandmark}`)
        .then((r) => r.json())
        .then((data) => {
          if (!data.success || !data.data) return;
          const [x, , z] = data.data.position;

          startPosition.current.copy(camera.position);
          startLookAt.current.copy(currentLookAt.current);

          targetPosition.current.set(x, 1.2, z + 1.0);
          targetLookAt.current.set(x, 0, z);

          zoomProgress.current = 0;
          isAnimating.current = true;
          setIsCameraZooming(true);

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if (controls) (controls as any).enabled = false;
        });
    } else {
      isReturning.current = true;
      isAnimating.current = true;
      zoomProgress.current = 0;
      startPosition.current.copy(camera.position);
      startLookAt.current.copy(currentLookAt.current);
      targetPosition.current.copy(DEFAULT_POSITION);
      targetLookAt.current.copy(DEFAULT_TARGET);
    }
  }, [activeLandmark]);

  useFrame((_, delta) => {
    if (!isAnimating.current) return;

    zoomProgress.current = Math.min(zoomProgress.current + delta / ZOOM_DURATION, 1);
    const t = easeInOutExpo(zoomProgress.current);
    const arcLift = Math.sin(zoomProgress.current * Math.PI) * (isReturning.current ? 3 : 5);

    const px = MathUtils.lerp(startPosition.current.x, targetPosition.current.x, t);
    const py = MathUtils.lerp(startPosition.current.y, targetPosition.current.y, t) + arcLift;
    const pz = MathUtils.lerp(startPosition.current.z, targetPosition.current.z, t);
    camera.position.set(px, py, pz);

    const lx = MathUtils.lerp(startLookAt.current.x, targetLookAt.current.x, t);
    const ly = MathUtils.lerp(startLookAt.current.y, targetLookAt.current.y, t);
    const lz = MathUtils.lerp(startLookAt.current.z, targetLookAt.current.z, t);
    currentLookAt.current.set(lx, ly, lz);
    camera.lookAt(currentLookAt.current);

    if (zoomProgress.current >= 1) {
      isAnimating.current = false;

      if (isReturning.current) {
        isReturning.current = false;
        setIsCameraZooming(false);
        // eslint-disable-next-line react-hooks/immutability, @typescript-eslint/no-explicit-any
        if (controls) (controls as any).enabled = true;
      } else {
        setIsCameraZooming(false);
        setTimeout(() => setIsZoomComplete(true), PAUSE_BEFORE_OVERLAY);
      }
    }
  });

  return null;
}

function easeInOutExpo(t: number): number {
  if (t === 0) return 0;
  if (t === 1) return 1;
  if (t < 0.5) return Math.pow(2, 20 * t - 10) / 2;
  return (2 - Math.pow(2, -20 * t + 10)) / 2;
}