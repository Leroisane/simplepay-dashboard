import { Search, X } from "lucide-react";
import React from "react";

export function TransferError() {
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

        {/* Recipient Section */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wider">
            Rekening Tujuan
          </label>
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Cari nama atau nomor rekening"
              type="text"
            />
          </div>

          {/* Selected Recipient Card */}
          <div className="flex items-center gap-4 p-4 border border-slate-200 rounded-lg bg-slate-50">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold">
              OR
            </div>
            <div className="flex-grow">
              <p className="text-sm font-bold text-slate-900">Olivia Rodrigo</p>
              <p className="text-sm text-slate-500">Bank Mandiri - 12345262003</p>
            </div>
            <button className="text-slate-400 hover:bg-slate-200 p-2 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Amount Section */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wider">
            Jumlah Transfer
          </label>
          <div className="relative">
            <input
              className="w-full px-4 py-4 text-red-600 font-semibold border-2 border-red-500 rounded-lg bg-red-50 focus:ring-2 focus:ring-red-500 outline-none transition-all text-xl"
              type="text"
              defaultValue="Rp 500.000"
              readOnly
            />
          </div>
          <div className="flex justify-between mt-2">
            <p className="text-sm font-medium text-red-500">Saldo tidak mencukupi</p>
            <p className="text-sm font-medium text-slate-500">Saldo: Rp 300.000</p>
          </div>
        </div>

        {/* Notes Section */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wider">
            Catatan (Opsional)
          </label>
          <textarea
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all h-24 resize-none"
            placeholder="Tambahkan pesan jika diperlukan"
          ></textarea>
        </div>

        {/* Summary Section */}
        <div className="bg-slate-50 rounded-lg p-6 mb-10 space-y-4 border border-slate-100">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Sumber Dana</p>
            <p className="text-base font-medium text-slate-900">Sofia Wylie</p>
            <p className="text-sm text-slate-500">Bank Mandiri - 12345262004</p>
          </div>
          <div className="border-t border-slate-200 pt-4">
            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Penerima</p>
            <p className="text-base font-medium text-slate-900">Olivia Rodrigo</p>
            <p className="text-sm text-slate-500">Bank Mandiri - 12345262003</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button className="flex-1 py-3 px-6 border-2 border-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 active:scale-[0.98] transition-all">
            Batal
          </button>
          <button
            className="flex-1 py-3 px-6 bg-blue-200 text-white font-semibold rounded-lg cursor-not-allowed transition-all"
            disabled
          >
            Lanjutkan
          </button>
        </div>
      </div>
    </div>
  );
}
