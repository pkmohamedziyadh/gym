"use client";

export function ActivityChart({
  values,
}: {
  values: { label: string; minutes: number }[];
}) {
  const max = Math.max(60, ...values.map((v) => v.minutes));
  return (
    <div
      className="activity-chart"
      role="img"
      aria-label={`Workout minutes over the last seven days: ${values.map((v) => `${v.label} ${v.minutes} minutes`).join(", ")}`}
    >
      <div className="chart-grid">
        <span>{max}m</span>
        <span>{Math.round(max / 2)}m</span>
        <span>0</span>
      </div>
      <div className="bars">
        {values.map((v, i) => (
          <div className="bar-column" key={i}>
            <span className="bar-value">{v.minutes || "—"}</span>
            <div
              className={`bar ${i === values.length - 1 ? "bar-today" : ""}`}
              style={{ height: `${Math.max(3, (v.minutes / max) * 125)}px` }}
            />
            <span className="bar-label">{v.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function WeightChart({
  entries,
}: {
  entries: { date: string; kg: number }[];
}) {
  const data = [...entries]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-8);
  if (!data.length)
    return (
      <p className="empty-state">
        Log your first weight to start your progress chart.
      </p>
    );
  const min = Math.min(...data.map((d) => d.kg)) - 0.5;
  const max = Math.max(...data.map((d) => d.kg)) + 0.5;
  const points = data.map(
    (d, i) =>
      `${24 + (i / Math.max(1, data.length - 1)) * 432},${125 - ((d.kg - min) / (max - min)) * 100}`,
  );
  const line = points.join(" ");
  return (
    <div className="weight-chart">
      <svg
        viewBox="0 0 480 165"
        role="img"
        aria-label={`Weight history in kilograms: ${data.map((d) => `${d.date}: ${d.kg}`).join(", ")}`}
      >
        <defs>
          <linearGradient id="weight-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c4f56b" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#c4f56b" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[30, 75, 125].map((y) => (
          <line
            key={y}
            x1="24"
            x2="456"
            y1={y}
            y2={y}
            stroke="#2b302c"
            strokeDasharray="4 5"
          />
        ))}
        <polygon
          points={`24,140 ${line} ${data.length > 1 ? "456" : "24"},140`}
          fill="url(#weight-fill)"
        />
        <polyline
          points={line}
          fill="none"
          stroke="#c4f56b"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {points.map((p, i) => {
          const [x, y] = p.split(",");
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="4"
              fill="#c4f56b"
              stroke="#151916"
              strokeWidth="3"
            />
          );
        })}
        <text x="24" y="160" fill="#8b948d" fontSize="11">
          {data[0].date}
        </text>
        <text x="456" y="160" textAnchor="end" fill="#8b948d" fontSize="11">
          {data[data.length - 1].date}
        </text>
      </svg>
    </div>
  );
}
