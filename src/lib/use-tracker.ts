"use client";

import { useSyncExternalStore } from "react";
import { createDemo, isTracker, STORAGE_KEY, type Tracker } from "./tracker";

let current: Tracker | null = null;
let storageWarning = "";
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((listener) => listener());

function readStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDemo();
    const parsed: unknown = JSON.parse(raw);
    if (!isTracker(parsed)) throw new Error("Invalid tracker data");
    return parsed;
  } catch {
    storageWarning =
      "Saved data could not be read. Demo data is shown; changes will replace the unreadable data if storage is available.";
    return createDemo();
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!current) current = readStorage();
  const sync = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === null) {
      current = readStorage();
      emit();
    }
  };
  window.addEventListener("storage", sync);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", sync);
  };
}

export function useTracker() {
  const data = useSyncExternalStore(
    subscribe,
    () => current,
    () => null,
  );
  function update(next: Tracker) {
    current = next;
    let saved = true;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      storageWarning = "";
    } catch {
      saved = false;
      storageWarning =
        "Browser storage is unavailable. Changes only last until this page reloads.";
    }
    emit();
    return saved;
  }
  return { data, update, storageWarning };
}
