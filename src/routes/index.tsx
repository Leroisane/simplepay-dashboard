import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { Sidebar, MobileNav, type View } from "@/components/simplepay/Sidebar";
import { Header } from "@/components/simplepay/Header";
import { Dashboard } from "@/components/simplepay/Dashboard";
import { Transfer } from "@/components/simplepay/Transfer";
import { HistoryView } from "@/components/simplepay/HistoryView";
import { Scheduled } from "@/components/simplepay/Scheduled";
import type { Profile, Schedule, Transaction } from "@/components/simplepay/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SimplePay — Dashboard Keuangan" },
      {
        name: "description",
        content:
          "SimplePay: aplikasi pembayaran sederhana untuk transfer, kelola jadwal, dan lihat riwayat transaksi.",
      },
    ],
  }),
  component: Index,
});

const titles: Record<View, string> = {
  dashboard: "Dashboard",
  transfer: "Transfer",
  scheduled: "Scheduled",
  history: "History",
};

function Index() {
  const [view, setView] = useState<View>("dashboard");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  const loadAll = useCallback(async () => {
    const [{ data: p }, { data: t }, { data: s }] = await Promise.all([
      supabase.from("profiles").select("*").limit(1).maybeSingle(),
      supabase.from("transactions").select("*").order("created_at", { ascending: false }),
      supabase.from("schedules").select("*").eq("status", "Active").order("next_date"),
    ]);
    if (p) setProfile(p as Profile);
    if (t) setTransactions(t as Transaction[]);
    if (s) setSchedules(s as Schedule[]);
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex items-start justify-center py-6 px-4">
      <div className="flex w-full max-w-[1440px] h-[800px] overflow-hidden rounded-2xl border border-border bg-background shadow-[var(--shadow-card)]">
        <Sidebar active={view} onChange={setView} />
        <div className="flex flex-1 flex-col min-w-0">
          <Header profile={profile} title={titles[view]} />
          <MobileNav active={view} onChange={setView} />
          <main className="flex-1 p-8 overflow-y-auto">
            {view === "dashboard" && (
              <Dashboard profile={profile} schedules={schedules} transactions={transactions} />
            )}
            {view === "transfer" && (
              <Transfer profile={profile} onSuccess={loadAll} onDone={() => setView("dashboard")} />
            )}
            {view === "scheduled" && <Scheduled schedules={schedules} onSuccess={loadAll} />}
            {view === "history" && <HistoryView transactions={transactions} />}
          </main>
        </div>
      </div>
      <Toaster richColors position="top-right" />
    </div>
  );
}
