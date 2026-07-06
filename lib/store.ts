import { create } from 'zustand'

interface DebugState {
  isDebugSession: boolean
  setIsDebugSession: (value: boolean | ((prev: boolean) => boolean)) => void
}

export const useDebugStore = create<DebugState>((set) => ({
  isDebugSession: process.env.NODE_ENV === "development",
  setIsDebugSession: (value) => set((state) => ({
    isDebugSession: typeof value === 'function' ? value(state.isDebugSession) : value
  })),
}))

interface NavigationState {
  isNavigating: boolean
  setIsNavigating: (value: boolean) => void
}

export const useNavigationStore = create<NavigationState>((set) => ({
  isNavigating: false,
  setIsNavigating: (value) => set({ isNavigating: value }),
}))
