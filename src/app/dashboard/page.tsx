import type { Metadata } from "next";
import { Dashboard } from "@/components/dashboard";

export const metadata: Metadata = { title: "Your dashboard" };
export default function DashboardPage() {
  return <Dashboard />;
}
