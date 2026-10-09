"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  ChevronRight,
  Dumbbell,
  Flame,
  LayoutDashboard,
  Plus,
  RotateCcw,
  Scale,
  Target,
  Timer,
  Trash2,
} from "lucide-react";
import { Brand } from "./brand";
import { Panel, StatCard } from "./ui";
import { ActivityChart, WeightChart } from "./charts";
import { EntryDialog, type EntryKind } from "./entry-dialog";
import {
  CALORIE_GOAL,
  createDemo,
  dateKey,
  daysAgo,
  type Workout,
} from "@/lib/tracker";
import { useTracker } from "@/lib/use-tracker";

export function Dashboard() {
  const { data, update, storageWarning } = useTracker();
  const [dialog, setDialog] = useState<EntryKind | null>(null);
  const [notice, setNotice] = useState("");
  const today = dateKey();
  const shortDate = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  });
  function save(form: FormData) {
    if (!data || !dialog) return;
    const id = crypto.randomUUID();
    const date = String(form.get("date"));
    let next = data;
    if (dialog === "reset") next = createDemo();
    if (dialog === "workout")
      next = {
        ...data,
        workouts: [
          {
            id,
            date,
            name: String(form.get("name")).trim() || "Workout",
            category: String(form.get("category")) as Workout["category"],
            minutes: Number(form.get("minutes")),
          },
          ...data.workouts,
        ],
      };
    if (dialog === "calories")
      next = {
        ...data,
        calories: [
          ...data.calories,
          { id, date, calories: Number(form.get("calories")) },
        ],
      };
    if (dialog === "weight")
      next = {
        ...data,
        weights: [
          ...data.weights.filter((w) => w.date !== date),
          { id, date, kg: Number(form.get("kg")) },
        ],
      };
    const saved = update(next);
    setNotice(
      saved
        ? dialog === "reset"
          ? "Demo data restored."
          : "Entry saved in this browser."
        : "Entry added for this session. Browser storage is unavailable.",
    );
    setDialog(null);
  }
  const week =
    data?.workouts.filter((w) => w.date >= daysAgo(6) && w.date <= today) ?? [];
  const minutes = week.reduce((total, w) => total + w.minutes, 0);
  const calories =
    data?.calories
      .filter((c) => c.date === today)
      .reduce((sum, c) => sum + c.calories, 0) ?? 0;
  const weights = [...(data?.weights ?? [])].sort((a, b) =>
    a.date.localeCompare(b.date),
  );
  const latest = weights.at(-1);
  const change =
    latest && weights.length > 1 ? latest.kg - weights[0].kg : null;
  const bars = Array.from({ length: 7 }, (_, i) => {
    const date = daysAgo(6 - i);
    return {
      label: new Date(`${date}T12:00:00`).toLocaleDateString("en", {
        weekday: "short",
      }),
      minutes: week
        .filter((w) => w.date === date)
        .reduce((sum, w) => sum + w.minutes, 0),
    };
  });
  const workouts = [...(data?.workouts ?? [])].sort((a, b) =>
    b.date.localeCompare(a.date),
  );

  return (
    <div className="dashboard-shell">
      <aside className="sidebar">
        <Brand />
        <span className="sidebar-label">YOUR WORKSPACE</span>
        <nav aria-label="Dashboard navigation">
          <Link className="nav-item active" href="/dashboard">
            <LayoutDashboard size={19} />
            Overview
          </Link>
          <a className="nav-item" href="#workouts">
            <Dumbbell size={19} />
            Workouts
          </a>
          <a className="nav-item" href="#nutrition">
            <Flame size={19} />
            Nutrition
          </a>
          <a className="nav-item" href="#progress">
            <Activity size={19} />
            Progress
          </a>
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-note">
            <span className="small-icon">
              <Target size={20} />
            </span>
            <h3>A little better, every day.</h3>
            <p>Show up. Put in the work. Let progress follow.</p>
          </div>
          <Link href="/" className="back-home">
            Back to homepage <ArrowUpRight size={16} />
          </Link>
          <div className="profile">
            <span className="avatar">Y</span>
            <div>
              <strong>Your space</strong>
              <span>Local demo · no account</span>
            </div>
          </div>
        </div>
      </aside>
      <div className="dashboard-content">
        <header className="topbar">
          <div className="breadcrumb">
            Workspace <ChevronRight size={14} />
            <span>Overview</span>
          </div>
          <span className="local-badge">
            <span />
            Browser-local demo
          </span>
        </header>
        <main className="dashboard-main">
          <div className="page-heading">
            <div>
              <span className="eyebrow">MAKE TODAY COUNT</span>
              <h1>
                Your next chapter<span className="accent">.</span>
              </h1>
              <p>Your effort, at a glance. Keep building your momentum.</p>
            </div>
            <button
              className="button button-primary"
              onClick={() => setDialog("workout")}
            >
              <Plus size={18} />
              Log workout
            </button>
          </div>
          <div className="demo-notice">
            <span>
              <span className="demo-tag">DEMO</span>Starts with sample data.
              Your changes stay in this browser.
            </span>
            <button onClick={() => setDialog("reset")}>
              <RotateCcw size={13} />
              Reset demo
            </button>
          </div>
          <p className="sr-only" role="status" aria-live="polite">
            {notice}
          </p>
          {notice && (
            <div className="notice" aria-hidden="true">
              {notice}
            </div>
          )}
          {storageWarning && (
            <p role="alert" className="storage-warning">
              {storageWarning}
            </p>
          )}
          {!data ? (
            <Panel className="loading">Loading your local dashboard…</Panel>
          ) : (
            <>
              <div className="stats-grid">
                <StatCard
                  label="Workouts"
                  value={week.length}
                  unit="sessions"
                  detail="In the last 7 days"
                  icon={Dumbbell}
                />
                <StatCard
                  label="Time invested"
                  value={minutes}
                  unit="min"
                  detail="Every minute moves you forward"
                  icon={Timer}
                />
                <StatCard
                  label="Calories today"
                  value={calories.toLocaleString()}
                  unit="kcal"
                  detail={`Daily goal: ${CALORIE_GOAL.toLocaleString()} kcal`}
                  icon={Flame}
                />
                <StatCard
                  label="Current weight"
                  value={latest?.kg.toFixed(1) ?? "—"}
                  unit="kg"
                  detail={
                    latest
                      ? `Last logged ${shortDate.format(new Date(`${latest.date}T12:00:00`))}`
                      : "Log your first weigh-in"
                  }
                  icon={Scale}
                />
              </div>
              <div className="dashboard-grid">
                <Panel className="activity-panel">
                  <div className="panel-heading">
                    <div>
                      <h2>Training consistency</h2>
                      <p>Small steps. Stronger habits.</p>
                    </div>
                    <span className="pill">
                      <CalendarDays size={13} />
                      Last 7 days
                    </span>
                  </div>
                  <div className="chart-summary">
                    <strong>
                      {minutes}
                      <span> min</span>
                    </strong>
                    <span className="chart-legend">
                      <i />
                      Training time
                    </span>
                  </div>
                  <ActivityChart values={bars} />
                  <div className="panel-foot">
                    <span>{week.length} sessions in the last 7 days</span>
                    <a href="#workouts">
                      View workouts <ArrowRight size={14} />
                    </a>
                  </div>
                </Panel>
                <Panel className="nutrition-panel" id="nutrition">
                  <div className="panel-heading">
                    <div>
                      <h2>Daily fuel</h2>
                      <p>Stay on track with your intake.</p>
                    </div>
                    <Flame size={21} className="accent" />
                  </div>
                  <div
                    className="calorie-ring"
                    style={{
                      background: `conic-gradient(#c4f56b ${Math.min(calories / CALORIE_GOAL, 1) * 360}deg, #2a3029 0deg)`,
                    }}
                    role="img"
                    aria-label={`${calories} of ${CALORIE_GOAL} calories consumed today`}
                  >
                    <div>
                      <strong>{calories.toLocaleString()}</strong>
                      <span>of {CALORIE_GOAL.toLocaleString()} kcal</span>
                    </div>
                  </div>
                  <div className="calorie-caption">
                    <span className="accent">
                      {Math.round((calories / CALORIE_GOAL) * 100)}% of daily
                      goal
                    </span>
                    <span>
                      {calories <= CALORIE_GOAL
                        ? `${(CALORIE_GOAL - calories).toLocaleString()} kcal remaining`
                        : `${(calories - CALORIE_GOAL).toLocaleString()} kcal over goal`}
                    </span>
                  </div>
                  <button
                    className="button button-outline full-width"
                    onClick={() => setDialog("calories")}
                  >
                    <Plus size={16} />
                    Log calories
                  </button>
                </Panel>
                <Panel className="workout-panel" id="workouts">
                  <div className="panel-heading">
                    <div>
                      <h2>Recent workouts</h2>
                      <p>Your work deserves a record.</p>
                    </div>
                    <Dumbbell size={20} className="muted" />
                  </div>
                  <div className="workout-list">
                    {workouts.length ? (
                      workouts.slice(0, 6).map((w) => (
                        <div className="workout-row" key={w.id}>
                          <span
                            className={`workout-icon ${w.category.toLowerCase()}`}
                          >
                            {w.category === "Strength" ? (
                              <Dumbbell size={19} />
                            ) : (
                              <Activity size={19} />
                            )}
                          </span>
                          <div className="workout-info">
                            <strong>{w.name}</strong>
                            <span>
                              {w.category} <i>·</i>{" "}
                              {shortDate.format(new Date(`${w.date}T12:00:00`))}
                            </span>
                          </div>
                          <span className="workout-duration">
                            {w.minutes}
                            <span> min</span>
                          </span>
                          <button
                            className="icon-button delete-button"
                            aria-label={`Delete ${w.name}`}
                            onClick={() => {
                              const saved = update({
                                ...data,
                                workouts: data.workouts.filter(
                                  (entry) => entry.id !== w.id,
                                ),
                              });
                              setNotice(
                                saved
                                  ? "Workout removed from this browser."
                                  : "Workout removed for this session. Browser storage is unavailable.",
                              );
                            }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="empty-state">
                        Your first session starts here. Log a workout to begin.
                      </p>
                    )}
                  </div>
                  <button
                    className="text-button"
                    onClick={() => setDialog("workout")}
                  >
                    <Plus size={15} />
                    Add a workout
                  </button>
                </Panel>
                <Panel className="weight-panel" id="progress">
                  <div className="panel-heading">
                    <div>
                      <h2>Weight trend</h2>
                      <p>The bigger picture, one check-in at a time.</p>
                    </div>
                    <button
                      className="icon-button"
                      aria-label="Log weight"
                      onClick={() => setDialog("weight")}
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                  <div className="weight-summary">
                    <strong>
                      {latest?.kg.toFixed(1) ?? "—"}
                      <span> kg</span>
                    </strong>
                    {change !== null && (
                      <span className="trend-badge">
                        {change <= 0 ? (
                          <ArrowDownRight size={14} />
                        ) : (
                          <ArrowUpRight size={14} />
                        )}
                        {Math.abs(change).toFixed(1)} kg{" "}
                        {change <= 0 ? "down" : "up"} since first log
                      </span>
                    )}
                  </div>
                  <WeightChart entries={weights} />
                  <button
                    className="button button-outline full-width"
                    onClick={() => setDialog("weight")}
                  >
                    <Scale size={16} />
                    Log weight
                  </button>
                </Panel>
              </div>
              <div className="motivation">
                <span className="motivation-symbol">
                  <ArrowUpRight size={37} aria-hidden="true" />
                </span>
                <p>
                  Progress is built in the ordinary days.
                  <br />
                  <strong>This is one of them.</strong>
                </p>
                <span className="eyebrow">KEEP SHOWING UP</span>
              </div>
            </>
          )}
          <footer className="dashboard-footer">
            <span>Made for your next personal best.</span>
            <span>Local storage only · No sign-in or cloud sync</span>
          </footer>
        </main>
      </div>
      {dialog && (
        <EntryDialog
          kind={dialog}
          onClose={() => setDialog(null)}
          onSubmit={save}
        />
      )}
    </div>
  );
}
