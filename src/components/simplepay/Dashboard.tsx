import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownLeft, ArrowUpRight, CalendarClock, Wallet } from "lucide-react";
import { formatIDR, formatDate, type Profile, type Schedule, type Transaction } from "./types";

export function Dashboard({
  profile,
  schedules,
  transactions,
}: {
  profile: Profile | null;
  schedules: Schedule[];
  transactions: Transaction[];
}) {
  const monthlyOut = transactions
    .filter((t) => t.type === "Transfer" || t.type === "Payment")
    .reduce((s, t) => s + Number(t.amount), 0);
  const monthlyIn = transactions
    .filter((t) => t.type === "Top Up")
    .reduce((s, t) => s + Number(t.amount), 0);

  const cards = [
    {
      label: "Total Saldo",
      value: profile ? formatIDR(Number(profile.balance)) : "—",
      icon: Wallet,
      tint: "text-primary",
    },
    {
      label: "Pemasukan",
      value: formatIDR(monthlyIn),
      icon: ArrowDownLeft,
      tint: "text-[oklch(0.65_0.17_155)]",
    },
    {
      label: "Pengeluaran",
      value: formatIDR(monthlyOut),
      icon: ArrowUpRight,
      tint: "text-destructive",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Halo, Sofia Wylie</h2>
        <p className="text-sm text-muted-foreground mt-1">Selamat datang kembali di SimplePay.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Card key={c.label} className="rounded-2xl border-border shadow-[var(--shadow-card)]">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      {c.label}
                    </p>
                    <p className="mt-2 text-xl font-semibold tabular-nums">{c.value}</p>
                  </div>
                  <div className={`rounded-lg bg-secondary p-2 ${c.tint}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="rounded-2xl border-border shadow-[var(--shadow-card)]">
        <CardHeader className="flex-row items-center gap-2 space-y-0">
          <CalendarClock className="h-4 w-4 text-primary" />
          <CardTitle className="text-lg">Upcoming Schedules</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {schedules.length === 0 ? (
            <p className="px-6 pb-6 text-sm text-muted-foreground">Tidak ada jadwal aktif.</p>
          ) : (
            <ul className="divide-y divide-border">
              {schedules.map((s) => (
                <li key={s.id} className="flex items-center justify-between px-6 py-4">
                  <div>
                    <p className="text-sm font-medium">{s.recipient}</p>
                    <p className="text-xs text-muted-foreground">
                      {s.frequency} · {formatDate(s.next_date)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold tabular-nums">
                      {formatIDR(Number(s.amount))}
                    </p>
                    <span className="inline-block mt-1 text-[10px] font-medium uppercase tracking-wide rounded-full bg-accent text-accent-foreground px-2 py-0.5">
                      {s.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
