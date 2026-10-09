export type Workout = {
  id: string;
  name: string;
  category: "Strength" | "Cardio" | "Mobility";
  minutes: number;
  date: string;
};
export type Weight = { id: string; kg: number; date: string };
export type CalorieEntry = { id: string; calories: number; date: string };
export type Tracker = {
  version: 1;
  workouts: Workout[];
  weights: Weight[];
  calories: CalorieEntry[];
};
export const STORAGE_KEY = "forma-tracker-v1";
export const CALORIE_GOAL = 2200;

export function dateKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function daysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return dateKey(date);
}

export function createDemo(): Tracker {
  return {
    version: 1,
    workouts: [
      {
        id: "demo-1",
        name: "Upper body push",
        category: "Strength",
        minutes: 55,
        date: daysAgo(1),
      },
      {
        id: "demo-2",
        name: "Easy morning run",
        category: "Cardio",
        minutes: 30,
        date: daysAgo(2),
      },
      {
        id: "demo-3",
        name: "Leg day",
        category: "Strength",
        minutes: 65,
        date: daysAgo(4),
      },
      {
        id: "demo-4",
        name: "Full body strength",
        category: "Strength",
        minutes: 50,
        date: daysAgo(6),
      },
    ],
    weights: [81.2, 80.9, 81.0, 80.6, 80.4, 80.1, 79.8].map((kg, i) => ({
      id: `demo-weight-${i}`,
      kg,
      date: daysAgo((6 - i) * 4),
    })),
    calories: [{ id: "demo-calories", calories: 1640, date: dateKey() }],
  };
}

export function isTracker(value: unknown): value is Tracker {
  if (!value || typeof value !== "object") return false;
  const t = value as Partial<Tracker>;
  const date = (v: unknown) =>
    typeof v === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(v) &&
    !Number.isNaN(Date.parse(v));
  const base = (v: unknown): v is { id: string; date: string } =>
    !!v &&
    typeof v === "object" &&
    typeof (v as { id?: unknown }).id === "string" &&
    date((v as { date?: unknown }).date);
  return (
    t.version === 1 &&
    Array.isArray(t.workouts) &&
    Array.isArray(t.weights) &&
    Array.isArray(t.calories) &&
    t.workouts.every(
      (w) =>
        base(w) &&
        typeof w.name === "string" &&
        ["Strength", "Cardio", "Mobility"].includes(w.category) &&
        Number.isFinite(w.minutes) &&
        w.minutes > 0,
    ) &&
    t.weights.every((w) => base(w) && Number.isFinite(w.kg) && w.kg > 0) &&
    t.calories.every(
      (c) => base(c) && Number.isFinite(c.calories) && c.calories > 0,
    )
  );
}
