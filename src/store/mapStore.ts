import { create } from "zustand";

interface MapState {
  activeLandmark: string | null;
  isOverlayOpen: boolean;
  isCameraZooming: boolean;
  isZoomComplete: boolean;
  setActiveLandmark: (id: string) => void;
  closeOverlay: () => void;
  setIsCameraZooming: (value: boolean) => void;
  setIsZoomComplete: (value: boolean) => void;
}

export const useMapStore = create<MapState>((set) => ({
  activeLandmark: null,
  isOverlayOpen: false,
  isCameraZooming: false,
  isZoomComplete: false,
  setActiveLandmark: (id) =>
    set({
      activeLandmark: id,
      isOverlayOpen: false, // don't open overlay yet — wait for zoom
      isCameraZooming: true,
      isZoomComplete: false,
    }),
  closeOverlay: () =>
    set({
      activeLandmark: null,
      isOverlayOpen: false,
      isCameraZooming: false,
      isZoomComplete: false,
    }),
  setIsCameraZooming: (value) => set({ isCameraZooming: value }),
  setIsZoomComplete: (value) => set({ isZoomComplete: value, isOverlayOpen: value }),
}));