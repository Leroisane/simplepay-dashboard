import { useState } from "react";
import { Search, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Profile } from "./types";
import { TransferSuccess } from "./TransferSuccess";

interface TransferProps {
  profile: Profile | null;
  onSuccess: () => void;
  onDone: () => void;
}

export function Transfer({ profile, onSuccess, onDone }: TransferProps) {
  const [amountStr, setAmountStr] = useState("");
  const [recipient, setRecipient] = useState(""); // Diubah jadi kosong
  const [accountNumber, setAccountNumber] = useState(""); // Diubah jadi kosong
  const [searchValue, setSearchValue] = useState("");
  const [searchError, setSearchError] = useState(""); // Tambahan baru untuk pesan error
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // --- LOGIKA US-03: Pengecekan Saldo H-Detik ---
  const numericAmount = parseInt(amountStr.replace(/\D/g, "")) || 0;
  const currentBalance = profile?.balance || 300000; // Fallback ke 300rb sesuai desain jika profile belum me-load
  const isInsufficient = numericAmount > currentBalance;
  // ----------------------------------------------

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    setAmountStr(val ? `Rp ${parseInt(val).toLocaleString("id-ID")}` : "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Tambahkan !profile?.id di baris pengecekan ini
    if (isInsufficient || numericAmount <= 0 || !recipient || !profile?.id) return;

    setIsSubmitting(true);
    try {
      // Potong saldo pengirim
      const newBalance = currentBalance - numericAmount;

      // 2. Hapus tanda tanya (?) pada profile.id karena kita sudah jamin datanya ada di atas
      await supabase.from("profiles").update({ balance: newBalance }).eq("id", profile.id);

      // Catat di history transaksi
      // Catat di history transaksi
      await supabase.from("transactions").insert({
        amount: numericAmount,
        type: "Transfer Out",
        status: "Completed",
        details: `To ${recipient} - ${note || "Transfer Dana"}`,
      });

      toast.success("Transfer Berhasil!");
      onSuccess(); // Refresh data di index.tsx
      setIsSuccess(true); // Memunculkan resi
    } catch (error) {
      toast.error("Gagal memproses transfer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <TransferSuccess
        amount={numericAmount}
        recipient={recipient}
        accountNumber={accountNumber}
        onDone={onDone}
      />
    );
  }

  return (
    <div className="w-full max-w-2xl bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mx-auto">
      <div className="p-8 md:p-10">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-slate-900 mb-2 text-3xl font-extrabold tracking-tight">
            Transfer Dana
          </h1>
          <p className="text-slate-500 text-base">Masukkan detail tujuan dan jumlah transfer</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Recipient Section */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wider">
              Rekening Tujuan
            </label>

            {!recipient ? (
              <div className="mb-1">
                {/* Pembungkus relative khusus untuk input dan ikon saja */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    className={`w-full pl-12 pr-4 py-3 bg-white border rounded-lg outline-none transition-all ${
                      searchError
                        ? "border-red-500 focus:ring-2 focus:ring-red-500"
                        : "border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                    placeholder="Masukkan nomor rekening lalu tekan Enter..."
                    type="text"
                    value={searchValue}
                    onChange={(e) => {
                      setSearchValue(e.target.value);
                      if (searchError) setSearchError("");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && searchValue.trim() !== "") {
                        e.preventDefault();
                        if (searchValue.trim() === "12345262003") {
                          setRecipient("Olivia Rodrigo");
                          setAccountNumber("12345262003");
                          setSearchError("");
                          setSearchValue("");
                        } else {
                          setSearchError("Nomor rekening tidak ditemukan");
                        }
                      }
                    }}
                  />
                </div>

                {/* Pesan Error ditaruh di luar div relative biar ikon ga ikut turun */}
                {searchError && (
                  <p className="text-red-500 text-xs mt-2 ml-1 font-medium">{searchError}</p>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-4 p-4 border border-slate-200 rounded-lg bg-slate-50 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold">
                  OR
                </div>
                <div className="flex-grow">
                  <p className="text-sm font-bold text-slate-900">{recipient}</p>
                  <p className="text-sm text-slate-500">Bank Mandiri - {accountNumber}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setRecipient("");
                    setAccountNumber("");
                    setSearchError("");
                  }}
                  className="text-slate-400 hover:bg-slate-200 p-2 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Amount Section (Dinamis: US-01 vs US-03) */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wider">
              Jumlah Transfer
            </label>
            <div className="relative">
              <input
                className={`w-full px-4 py-4 font-semibold border-2 rounded-lg outline-none transition-all text-xl ${
                  isInsufficient
                    ? "text-red-600 border-red-500 bg-red-50 focus:ring-red-500"
                    : "text-slate-900 border-slate-200 bg-white focus:ring-blue-500 focus:border-blue-500"
                }`}
                type="text"
                value={amountStr}
                onChange={handleAmountChange}
                placeholder="Rp 0"
              />
            </div>
            <div className="flex justify-between mt-2">
              <p
                className={`text-sm font-medium ${isInsufficient ? "text-red-500" : "text-transparent"}`}
              >
                Saldo tidak mencukupi
              </p>
              <p className="text-sm font-medium text-slate-500">
                Saldo: Rp {currentBalance.toLocaleString("id-ID")}
              </p>
            </div>
          </div>

          {/* Notes Section */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wider">
              Catatan (Opsional)
            </label>
            <input
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Misal: Bayar makan malam"
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          {/* Summary Section */}
          <div className="bg-slate-50 rounded-lg p-6 mb-10 space-y-4 border border-slate-100">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Sumber Dana
                </p>
                <p className="text-sm font-bold text-slate-900">{profile?.name || "Sofia Wylie"}</p>
                <p className="text-xs text-slate-500">Bank Mandiri - 12345262004</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Penerima
                </p>
                <p className="text-sm font-bold text-slate-900">{recipient}</p>
                <p className="text-xs text-slate-500">Bank Mandiri - {accountNumber}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onDone}
              className="flex-1 py-3 px-6 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 active:scale-[0.98] transition-all"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isInsufficient || numericAmount === 0 || isSubmitting || !recipient}
              className={`flex-1 py-3 px-6 font-semibold rounded-lg transition-all ${
                isInsufficient || numericAmount === 0 || isSubmitting || !recipient
                  ? "bg-blue-300 text-white cursor-not-allowed opacity-70"
                  : "bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]"
              }`}
            >
              {isSubmitting ? "Memproses..." : "Lanjutkan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
