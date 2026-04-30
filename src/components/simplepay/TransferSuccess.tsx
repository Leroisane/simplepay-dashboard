import { CheckCircle2, Download } from "lucide-react";

interface TransferSuccessProps {
  amount: number;
  recipient: string;
  accountNumber: string;
  onDone: () => void;
}

export function TransferSuccess({
  amount,
  recipient,
  accountNumber,
  onDone,
}: TransferSuccessProps) {
  // Buat tanggal dan nomor referensi otomatis
  const today =
    new Date().toLocaleString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }) + " WIB";
  const refNumber = "TRF" + Math.floor(Math.random() * 1000000000);

  return (
    <div className="w-full max-w-[600px] mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col items-center text-center">
      {/* Success Icon */}
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
        <CheckCircle2 className="w-10 h-10 text-green-600" />
      </div>

      {/* Heading */}
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Transaksi Berhasil</h1>
      <div className="flex flex-col gap-1 text-sm text-slate-500 mb-8">
        <span>{today}</span>
        <span>No. Ref: {refNumber}</span>
      </div>

      {/* Amount Section */}
      <div className="mb-8 w-full">
        <p className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">
          Jumlah Transfer
        </p>
        <p className="text-4xl font-bold text-blue-700">Rp {amount.toLocaleString("id-ID")}</p>
      </div>

      {/* Details Section */}
      <div className="w-full bg-slate-50 rounded-xl p-6 flex flex-col gap-4 mb-8 text-left border border-slate-100">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase mb-1">Sumber Dana</p>
          <p className="text-base font-semibold text-slate-900">Sofia Wylie</p>
          <p className="text-sm text-slate-500">Bank Mandiri - 123452*****</p>
        </div>
        <hr className="border-t border-slate-200 w-full" />
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase mb-1">Penerima</p>
          <p className="text-base font-semibold text-slate-900">{recipient}</p>
          <p className="text-sm text-slate-500">Bank Mandiri - {accountNumber}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full flex flex-col sm:flex-row gap-4">
        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition-colors">
          <Download className="w-5 h-5" />
          Unduh Resi
        </button>
        <button
          onClick={onDone}
          className="flex-1 flex items-center justify-center px-4 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 active:scale-[0.98] transition-all"
        >
          Selesai
        </button>
      </div>
    </div>
  );
}
