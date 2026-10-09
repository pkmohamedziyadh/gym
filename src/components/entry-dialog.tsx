"use client";

import { useEffect, useRef, type FormEvent } from "react";
import { X, Plus } from "lucide-react";
import { dateKey } from "@/lib/tracker";

export type EntryKind = "workout" | "calories" | "weight" | "reset";
export function EntryDialog({
  kind,
  onClose,
  onSubmit,
}: {
  kind: EntryKind;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);
  const title = {
    workout: "Log a workout",
    calories: "Log calories",
    weight: "Log your weight",
    reset: "Reset demo data?",
  }[kind];
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(new FormData(event.currentTarget));
  }
  return (
    <dialog
      ref={ref}
      className="entry-dialog"
      onCancel={onClose}
      aria-labelledby="dialog-title"
    >
      <div className="dialog-heading">
        <div>
          <span className="eyebrow">ONE STEP FORWARD</span>
          <h2 id="dialog-title">{title}</h2>
        </div>
        <button
          className="icon-button"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <X size={20} />
        </button>
      </div>
      <form onSubmit={submit}>
        {kind === "reset" ? (
          <p className="muted">
            This replaces all workouts, calorie entries, and weight logs in this
            browser with the original sample data. Your current entries will be
            removed.
          </p>
        ) : (
          <>
            {kind === "workout" && (
              <>
                <label>
                  Workout name
                  <input
                    name="name"
                    placeholder="e.g. Upper body strength"
                    required
                    maxLength={80}
                    autoFocus
                  />
                </label>
                <label>
                  Workout type
                  <select name="category">
                    <option>Strength</option>
                    <option>Cardio</option>
                    <option>Mobility</option>
                  </select>
                </label>
                <label>
                  Duration (minutes)
                  <input
                    type="number"
                    name="minutes"
                    min="1"
                    max="600"
                    step="1"
                    placeholder="45"
                    required
                  />
                </label>
              </>
            )}
            {kind === "calories" && (
              <label>
                Calories (kcal)
                <input
                  type="number"
                  name="calories"
                  min="1"
                  max="10000"
                  step="1"
                  placeholder="450"
                  required
                  autoFocus
                />
                <span className="field-help">
                  Add a meal or snack to your daily intake.
                </span>
              </label>
            )}
            {kind === "weight" && (
              <label>
                Weight (kg)
                <input
                  type="number"
                  name="kg"
                  min="20"
                  max="500"
                  step="0.1"
                  placeholder="79.8"
                  required
                  autoFocus
                />
                <span className="field-help">
                  One entry per day. Logging again updates that day.
                </span>
              </label>
            )}
            <label>
              Date
              <input
                type="date"
                name="date"
                defaultValue={dateKey()}
                max={dateKey()}
                required
              />
            </label>
          </>
        )}
        <div className="dialog-actions">
          <button
            type="button"
            className="button button-ghost"
            onClick={onClose}
          >
            Cancel
          </button>
          <button type="submit" className="button button-primary">
            {kind !== "reset" && <Plus size={17} />}
            {kind === "reset" ? "Reset data" : "Save entry"}
          </button>
        </div>
      </form>
    </dialog>
  );
}
