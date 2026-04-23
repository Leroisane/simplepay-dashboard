import { LayoutDashboard, Send, History, Wallet, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export type View = "dashboard" | "transfer" | "scheduled" | "history";

const items: { id: View; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "transfer", label: "Transfer", icon: Send },
  { id: "scheduled", label: "Scheduled", icon: Calendar },
  { id: "history", label: "History", icon: History },
];

function NavItems({
  active,
  onChange,
}: {
  active: View;
  onChange: (v: View) => void;
}) {
  return (
    <>
      {items.map((it) => {
        const Icon = it.icon;
        const isActive = active === it.id;
        return (
          <button
            key={it.id}
            onClick={() => onChange(it.id)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              isActive
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
            )}
          >
            <Icon className="h-4 w-4" />
            {it.label}
          </button>
        );
      })}
    </>
  );
}

export function MobileNav({
  active,
  onChange,
}: {
  active: View;
  onChange: (v: View) => void;
}) {
  return (
    <div className="md:hidden flex items-center gap-1 border-b border-border bg-sidebar px-3 py-2 overflow-x-auto">
      <NavItems active={active} onChange={onChange} />
    </div>
  );
}

export function Sidebar({
  active,
  onChange,
}: {
  active: View;
  onChange: (v: View) => void;
}) {
  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-border bg-sidebar">
      <div className="flex items-center gap-2 px-6 h-16 border-b border-border">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Wallet className="h-4 w-4" />
        </div>
        <span className="text-base font-semibold tracking-tight">SimplePay</span>
      </div>
      <nav className="flex-1 p-3 flex flex-col gap-1">
        <NavItems active={active} onChange={onChange} />
      </nav>
      <div className="p-4 text-xs text-muted-foreground border-t border-border">
        v1.0 · Demo
      </div>
    </aside>
  );
}