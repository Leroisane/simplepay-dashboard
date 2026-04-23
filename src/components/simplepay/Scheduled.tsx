import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CalendarPlus } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { formatIDR, formatDate, type Schedule } from "./types";

const schema = z.object({
  recipient: z
    .string()
    .trim()
    .min(2, { message: "Nama penerima minimal 2 karakter" })
    .max(80),
  amount: z
    .number({ message: "Nominal harus berupa angka" })
    .positive({ message: "Nominal harus lebih dari 0" })
    .max(100_000_000, { message: "Nominal terlalu besar" }),
  frequency: z.enum(["Daily", "Weekly", "Monthly"], {
    message: "Pilih frekuensi",
  }),
  next_date: z.string().min(1, { message: "Tanggal wajib diisi" }),
});

const today = () => new Date().toISOString().slice(0, 10);

export function Scheduled({
  schedules,
  onSuccess,
}: {
  schedules: Schedule[];
  onSuccess: () => void;
}) {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [frequency, setFrequency] = useState<string>("Monthly");
  const [nextDate, setNextDate] = useState(today());
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setRecipient("");
    setAmount("");
    setFrequency("Monthly");
    setNextDate(today());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({
      recipient,
      amount: Number(amount),
      frequency,
      next_date: nextDate,
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from("schedules").insert({
        recipient: parsed.data.recipient,
        amount: parsed.data.amount,
        frequency: parsed.data.frequency,
        next_date: parsed.data.next_date,
        status: "Active",
      });
      if (error) throw error;
      toast.success("Jadwal berhasil dibuat", {
        description: `${parsed.data.recipient} · ${formatIDR(parsed.data.amount)}`,
      });
      reset();
      onSuccess();
    } catch (err) {
      toast.error("Gagal membuat jadwal", {
        description: err instanceof Error ? err.message : "Coba lagi.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="mx-auto max-w-[600px] rounded-2xl border-border shadow-[var(--shadow-card)]">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Buat Jadwal Transfer Berulang</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="s-recipient">Nama Penerima</Label>
              <Input
                id="s-recipient"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="cth. Sewa Kantor"
                maxLength={80}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="s-amount">Nominal (IDR)</Label>
              <Input
                id="s-amount"
                type="number"
                inputMode="numeric"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                min={1}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="s-frequency">Frekuensi</Label>
                <Select value={frequency} onValueChange={setFrequency}>
                  <SelectTrigger id="s-frequency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Daily">Harian</SelectItem>
                    <SelectItem value="Weekly">Mingguan</SelectItem>
                    <SelectItem value="Monthly">Bulanan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="s-date">Tanggal Berikutnya</Label>
                <Input
                  id="s-date"
                  type="date"
                  value={nextDate}
                  min={today()}
                  onChange={(e) => setNextDate(e.target.value)}
                />
              </div>
            </div>
            <Button type="submit" disabled={submitting} className="w-full h-11 rounded-lg">
              <CalendarPlus className="h-4 w-4" />
              {submitting ? "Menyimpan..." : "Simpan Jadwal"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="mx-auto max-w-[600px] rounded-2xl border-border shadow-[var(--shadow-card)]">
        <CardHeader>
          <CardTitle className="text-lg">Jadwal Aktif</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {schedules.length === 0 ? (
            <p className="px-6 pb-6 text-sm text-muted-foreground">
              Belum ada jadwal aktif.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Penerima</TableHead>
                  <TableHead>Frekuensi</TableHead>
                  <TableHead>Tanggal Berikutnya</TableHead>
                  <TableHead className="text-right">Nominal</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedules.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.recipient}</TableCell>
                    <TableCell>{s.frequency}</TableCell>
                    <TableCell>{formatDate(s.next_date)}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatIDR(Number(s.amount))}
                    </TableCell>
                    <TableCell>
                      <span className="inline-block text-[10px] font-medium uppercase tracking-wide rounded-full bg-accent text-accent-foreground px-2 py-0.5">
                        {s.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}