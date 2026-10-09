import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export function Panel({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`panel ${className}`}>
      {children}
    </section>
  );
}

export function StatCard({
  label,
  value,
  unit,
  detail,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  unit?: string;
  detail: string;
  icon: LucideIcon;
}) {
  return (
    <Panel className="stat-card">
      <div className="stat-top">
        <span>{label}</span>
        <Icon size={19} aria-hidden="true" />
      </div>
      <div className="stat-value">
        {value}
        <span>{unit}</span>
      </div>
      <p className="stat-detail">{detail}</p>
    </Panel>
  );
}
