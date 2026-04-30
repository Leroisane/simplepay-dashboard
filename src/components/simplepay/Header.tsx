import { Eye, EyeOff, Bell } from "lucide-react";
import { useState } from "react";
import { formatIDR, type Profile } from "./types";
import { Button } from "@/components/ui/button";
import { NotificationPanel } from "./NotificationPanel";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function Header({ profile, title }: { profile: Profile | null; title: string }) {
  const [show, setShow] = useState(true);
  const [showNotif, setShowNotif] = useState(false);

  const handleCheatTopUp = async () => {
    if (!profile) return;
    const newBalance = Number(profile.balance) + 1000000;

    await supabase.from("profiles").update({ balance: newBalance }).eq("id", profile.id);

    // Opsional: Catat riwayatnya juga biar riwayat transaksi kamu makin rame
    await supabase.from("transactions").insert({
      amount: 1000000,
      type: "Top Up",
      status: "Completed",
      details: "Cheat Developer",
    });

    toast.success("Cheat Top Up 1 Juta Berhasil! Refresh halaman (F5) ya.");
  };

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-8">
      <h1 className="text-lg font-semibold tracking-tight">{title}</h1>

      <div className="flex items-center gap-4">
        {/* US-04: Tombol Lonceng Notifikasi */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 relative"
            onClick={() => setShowNotif((s) => !s)}
            aria-label="Toggle notifications"
          >
            <Bell className="h-5 w-5 text-muted-foreground" />
            {/* Titik merah indikator notifikasi */}
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>

          {/* <Button
            variant="outline"
            size="sm"
            onClick={handleCheatTopUp}
            className="text-xs font-bold text-green-600 border-green-200 hover:bg-green-50"
          >
            +1 Jt
          </Button> */}

          {/* Panel dropdown notifikasi muncul di sini */}
          {showNotif && <NotificationPanel />}
        </div>

        {/* Fitur Bawaan: Info Saldo & Hide/Show */}
        <div className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-2">
          <div className="text-right">
            <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Saldo</div>
            <div className="text-sm font-semibold tabular-nums text-primary">
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
      </div>
    </header>
  );
}
