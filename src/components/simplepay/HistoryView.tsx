import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateTime, formatIDR, type Transaction } from "./types";

const typeColor: Record<string, string> = {
  Transfer: "bg-[oklch(0.95_0.05_25)] text-destructive",
  "Top Up": "bg-[oklch(0.95_0.06_155)] text-[oklch(0.45_0.15_155)]",
  Payment: "bg-accent text-accent-foreground",
};

function parseDetails(details: string | null) {
  if (!details) return { recipient: "—", note: "" };
  // format: "To: Name - Bank · note"
  const m = details.match(/^To:\s*(.+?)(?:\s*·\s*(.+))?$/);
  if (m) return { recipient: m[1], note: m[2] ?? "" };
  return { recipient: details, note: "" };
}

export function HistoryView({ transactions }: { transactions: Transaction[] }) {
  return (
    <Card className="rounded-2xl border-border shadow-[var(--shadow-card)]">
      <CardHeader>
        <CardTitle className="text-lg">Riwayat Transaksi</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipe</TableHead>
              <TableHead>Penerima</TableHead>
              <TableHead>Catatan</TableHead>
              <TableHead>Waktu</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Nominal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                  Belum ada transaksi.
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((t) => {
                const { recipient, note } = parseDetails(t.details);
                return (
                  <TableRow key={t.id}>
                    <TableCell>
                      <span
                        className={`inline-block text-[10px] font-semibold uppercase tracking-wide rounded-full px-2 py-1 ${typeColor[t.type] ?? "bg-secondary text-secondary-foreground"}`}
                      >
                        {t.type}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">{recipient}</TableCell>
                    <TableCell className="text-muted-foreground max-w-[180px] truncate">
                      {note || "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDateTime(t.created_at)}
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-medium text-[oklch(0.45_0.15_155)]">
                        {t.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-semibold tabular-nums">
                      {t.type === "Top Up" ? "+" : "−"}
                      {formatIDR(Number(t.amount))}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
