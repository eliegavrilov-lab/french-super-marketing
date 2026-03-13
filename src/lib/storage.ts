import { ContentPiece, DayPlan, Inspiration } from "./types";

const STORAGE_KEYS = {
  plans: "fs-plans",
  inspirations: "fs-inspirations",
} as const;

export function saveDayPlan(plan: DayPlan): void {
  const plans = getAllPlans();
  const idx = plans.findIndex(p => p.date === plan.date);
  if (idx >= 0) {
    plans[idx] = plan;
  } else {
    plans.push(plan);
  }
  localStorage.setItem(STORAGE_KEYS.plans, JSON.stringify(plans));
}

export function getAllPlans(): DayPlan[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEYS.plans);
  return raw ? JSON.parse(raw) : [];
}

export function getPlanForDate(date: string): DayPlan | null {
  const plans = getAllPlans();
  return plans.find(p => p.date === date) || null;
}

export function updatePieceStatus(date: string, pieceId: string, status: ContentPiece["status"]): void {
  const plans = getAllPlans();
  const plan = plans.find(p => p.date === date);
  if (plan) {
    const piece = plan.pieces.find(p => p.id === pieceId);
    if (piece) {
      piece.status = status;
      localStorage.setItem(STORAGE_KEYS.plans, JSON.stringify(plans));
    }
  }
}

export function saveInspirations(items: Inspiration[]): void {
  const existing = getInspirations();
  const updated = [...existing, ...items];
  localStorage.setItem(STORAGE_KEYS.inspirations, JSON.stringify(updated));
}

export function getInspirations(): Inspiration[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEYS.inspirations);
  return raw ? JSON.parse(raw) : [];
}

export function deleteInspiration(id: string): void {
  const items = getInspirations().filter(i => i.id !== id);
  localStorage.setItem(STORAGE_KEYS.inspirations, JSON.stringify(items));
}
