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

export function HistoryView({ transactions }: { transactions: Transaction[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Riwayat Transaksi</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipe</TableHead>
              <TableHead>Detail</TableHead>
              <TableHead>Waktu</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Nominal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-10">
                  Belum ada transaksi.
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>
                    <span
                      className={`inline-block text-[10px] font-semibold uppercase tracking-wide rounded-full px-2 py-1 ${typeColor[t.type] ?? "bg-secondary text-secondary-foreground"}`}
                    >
                      {t.type}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{t.details ?? "—"}</TableCell>
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
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}