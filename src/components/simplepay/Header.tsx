import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { formatIDR, type Profile } from "./types";
import { Button } from "@/components/ui/button";

export function Header({ profile, title }: { profile: Profile | null; title: string }) {
  const [show, setShow] = useState(true);
  return (
    <header className="h-16 border-b border-border bg-background flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
      <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-2">
        <div className="text-right">
          <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
            Saldo
          </div>
          <div className="text-sm font-semibold tabular-nums">
            {profile ? (show ? formatIDR(Number(profile.balance)) : "Rp ••••••") : "—"}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setShow((s) => !s)}
          aria-label="Toggle balance"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      </div>
    </header>
  );
}