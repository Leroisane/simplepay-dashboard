import { Wallet, Info } from "lucide-react";

export function NotificationPanel() {
  return (
    <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-50">
      <div className="p-4 border-b border-slate-200 bg-slate-50">
        <h3 className="font-bold text-slate-900">Notifikasi Anda</h3>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {/* Active Notification */}
        <button className="w-full text-left p-4 bg-white border-l-4 border-blue-600 border-b border-slate-100 flex items-start gap-3 hover:bg-slate-50 transition-colors">
          <div className="shrink-0 pt-1">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 block"></span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-baseline mb-1">
              <h4 className="text-sm font-bold text-slate-900 truncate">Transfer Berhasil!</h4>
              <span className="text-xs font-medium text-slate-500 shrink-0 ml-2">14:30 WIB</span>
            </div>
            <p className="text-xs text-slate-500 truncate">Dana terkirim ke Olivia Rodrigo</p>
          </div>
        </button>

        {/* Inactive Notification 1 */}
        <button className="w-full text-left p-4 bg-white border-b border-slate-100 flex items-start gap-3 hover:bg-slate-50 transition-colors group">
          <div className="shrink-0 pt-1">
            <Wallet className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-baseline mb-1">
              <h4 className="text-sm font-semibold text-slate-900 truncate">Transfer Masuk</h4>
              <span className="text-xs font-medium text-slate-500 shrink-0 ml-2">21 Apr</span>
            </div>
            <p className="text-xs text-slate-500 truncate">PT Teknologi Canggih</p>
          </div>
        </button>

        {/* Inactive Notification 2 */}
        <button className="w-full text-left p-4 bg-white border-b border-slate-100 flex items-start gap-3 hover:bg-slate-50 transition-colors group">
          <div className="shrink-0 pt-1">
            <Info className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-baseline mb-1">
              <h4 className="text-sm font-semibold text-slate-900 truncate">Top-up Saldo</h4>
              <span className="text-xs font-medium text-slate-500 shrink-0 ml-2">20 Apr</span>
            </div>
            <p className="text-xs text-slate-500 truncate">Melakukan top-up sebesar Rp150.000</p>
          </div>
        </button>
      </div>

      <div className="p-3 border-t border-slate-200 text-center bg-slate-50">
        <button className="text-xs font-semibold text-blue-600 hover:text-blue-800">
          Tandai semua dibaca
        </button>
      </div>
    </div>
  );
}
