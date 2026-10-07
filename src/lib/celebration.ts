import { create } from "zustand";

export interface ConfettiParticle {
  id: number;
  /** Final offset from the burst origin, in px */
  x: number;
  y: number;
  rotate: number;
  color: string;
  size: number;
  /** Start delay in seconds */
  delay: number;
}

interface CelebrationState {
  burstId: number;
  particles: ConfettiParticle[];
}

const COLORS = ["#10b981", "#ffcf36", "#3b82f6", "#ec4899", "#8b5cf6", "#f97316"];
const PARTICLE_COUNT = 36;

export const useCelebrationStore = create<CelebrationState>(() => ({
  burstId: 0,
  particles: [],
}));

/**
 * Fire a confetti burst, rendered by <CelebrationHost />. Particles are
 * generated here (not during render) so rendering stays pure.
 */
export function celebrate() {
  const particles = Array.from({ length: PARTICLE_COUNT }, (_, id) => {
    const angle = Math.random() * Math.PI * 2;
    const distance = 120 + Math.random() * 220;
    return {
      id,
      x: Math.cos(angle) * distance,
      // Flatten the spread and add a downward drift so it "falls"
      y: Math.sin(angle) * distance * 0.6 + 140,
      rotate: Math.random() * 720 - 360,
      color: COLORS[id % COLORS.length],
      size: 6 + Math.random() * 6,
      delay: Math.random() * 0.15,
    };
  });
  useCelebrationStore.setState((state) => ({
    burstId: state.burstId + 1,
    particles,
  }));
}

export function clearCelebration() {
  useCelebrationStore.setState({ particles: [] });
}
