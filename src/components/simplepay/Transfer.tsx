import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle2, Send } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { formatIDR, formatDateTime, type Profile, type Transaction } from "./types";

const schema = z.object({
  recipient: z
    .string()
    .trim()
    .min(2, { message: "Nama penerima minimal 2 karakter" })
    .max(80),
  bank: z.string().trim().min(2, { message: "Nama bank wajib diisi" }).max(40),
  amount: z
    .number({ message: "Nominal harus berupa angka" })
    .positive({ message: "Nominal harus lebih dari 0" })
    .max(100_000_000, { message: "Nominal terlalu besar" }),
  note: z.string().trim().max(140).optional(),
});

export function Transfer({
  profile,
  onSuccess,
  onDone,
}: {
  profile: Profile | null;
  onSuccess: () => void;
  onDone: () => void;
}) {
  const [recipient, setRecipient] = useState("");
  const [bank, setBank] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<Transaction | null>(null);
  const [finalBalance, setFinalBalance] = useState<number | null>(null);
  const [recipientName, setRecipientName] = useState<string>("");

  const reset = () => {
    setRecipient("");
    setBank("");
    setAmount("");
    setNote("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    const parsed = schema.safeParse({
      recipient,
      bank,
      amount: Number(amount),
      note: note || undefined,
    });

    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }

    if (parsed.data.amount > Number(profile.balance)) {
      toast.error("Saldo Tidak Cukup", {
        description: `Saldo Anda ${formatIDR(Number(profile.balance))}.`,
      });
      return;
    }

    setSubmitting(true);
    try {
      const newBalance = Number(profile.balance) - parsed.data.amount;

      const { error: updErr } = await supabase
        .from("profiles")
        .update({ balance: newBalance })
        .eq("id", profile.id);
      if (updErr) throw updErr;

      const details = `To: ${parsed.data.recipient} - ${parsed.data.bank}${parsed.data.note ? ` · ${parsed.data.note}` : ""}`;

      const { data: tx, error: insErr } = await supabase
        .from("transactions")
        .insert({
          type: "Transfer",
          amount: parsed.data.amount,
          status: "Success",
          details,
        })
        .select()
        .single();
      if (insErr) throw insErr;

      setSuccess(tx as Transaction);
      setFinalBalance(newBalance);
      setRecipientName(`${parsed.data.recipient} · ${parsed.data.bank}`);
      reset();
      onSuccess();
    } catch (err) {
      toast.error("Transfer gagal", {
        description: err instanceof Error ? err.message : "Coba lagi.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Card className="mx-auto max-w-[600px] rounded-2xl border-border shadow-[var(--shadow-card)]">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Kirim Uang</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipient">Nama Penerima</Label>
              <Input
                id="recipient"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="cth. Budi Santoso"
                maxLength={80}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bank">Bank Tujuan</Label>
              <Input
                id="bank"
                value={bank}
                onChange={(e) => setBank(e.target.value)}
                placeholder="cth. BCA"
                maxLength={40}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Nominal (IDR)</Label>
              <Input
                id="amount"
                type="number"
                inputMode="numeric"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                min={1}
              />
              {profile && (
                <p className="text-xs text-muted-foreground">
                  Saldo tersedia: {formatIDR(Number(profile.balance))}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="note">Catatan (opsional)</Label>
              <Input
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="cth. Bayar makan"
                maxLength={140}
              />
            </div>
            <Button type="submit" disabled={submitting} className="w-full h-11 rounded-lg">
              <Send className="h-4 w-4" />
              {submitting ? "Memproses..." : "Kirim Sekarang"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Dialog
        open={!!success}
        onOpenChange={(o) => {
          if (!o) {
            setSuccess(null);
            onDone();
          }
        }}
      >
        <DialogContent className="max-w-[600px] rounded-2xl shadow-[var(--shadow-card)]">
          <DialogHeader>
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-[oklch(0.65_0.17_155/0.15)]">
              <CheckCircle2 className="h-6 w-6 text-[oklch(0.65_0.17_155)]" />
            </div>
            <DialogTitle className="text-center">Transfer Berhasil</DialogTitle>
            <DialogDescription className="text-center">
              Dana telah dikirim ke penerima.
            </DialogDescription>
          </DialogHeader>
          {success && (
            <div className="mt-2 rounded-xl border border-border bg-muted/40 p-5 space-y-3 text-sm">
              <Row label="Penerima" value={recipientName || "—"} />
              <Row label="Nominal" value={formatIDR(Number(success.amount))} bold />
              <Row
                label="Saldo Akhir"
                value={finalBalance !== null ? formatIDR(finalBalance) : "—"}
                bold
              />
              <div className="border-t border-border pt-3 space-y-3">
                <Row label="Tipe" value={success.type} />
                <Row label="Status" value={success.status} />
                <Row label="Waktu" value={formatDateTime(success.created_at)} />
                <Row label="ID Transaksi" value={success.id.slice(0, 8).toUpperCase()} mono />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              className="w-full h-11 rounded-lg"
              onClick={() => {
                setSuccess(null);
                onDone();
              }}
            >
              Selesai
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Row({
  label,
  value,
  bold,
  mono,
}: {
  label: string;
  value: string;
  bold?: boolean;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={`text-right ${bold ? "font-semibold" : ""} ${mono ? "font-mono text-xs" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}