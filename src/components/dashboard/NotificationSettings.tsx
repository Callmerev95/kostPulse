"use client";

import { BellRing, ShieldCheck } from "lucide-react";
import { subscribeUserToPush } from "@/lib/push-notification";
import { saveSubscription } from "@/actions/notification";
import { toast } from "sonner";
import { useState } from "react";

export function NotificationSettings() {
  const [loading, setLoading] = useState(false);

  const handleEnableNotification = async () => {
    setLoading(true);
    try {
      const subscription = await subscribeUserToPush();

      if (subscription) {
        const result = await saveSubscription(subscription);
        if (result.success) {
          toast.success("Push Notification aktif!", {
            description: "Anda akan menerima notifikasi setiap ada pembayaran masuk."
          });
        } else {
          toast.error("Gagal sinkronisasi server.");
        }
      }
    } catch (error) {
      toast.error("Izin ditolak", {
        description: "Pastikan Anda mengizinkan notifikasi di browser/HP Anda."
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/2 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-sm relative overflow-hidden shadow-2xl mb-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] border border-[#D4AF37]/20 shrink-0">
            <BellRing size={24} />
          </div>
          <div>
            <h2 className="text-white font-bold tracking-tight">Push Notifications</h2>
            <p className="text-white/40 text-sm max-w-xs mt-1">
              Dapatkan peringatan instan saat penyewa mengirimkan bukti pembayaran.
            </p>
          </div>
        </div>

        <button
          onClick={handleEnableNotification}
          disabled={loading}
          className="w-full md:w-auto px-8 py-4 bg-[#D4AF37] text-black font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-[#B8962D] transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 group"
        >
          {loading ? (
            <div className="h-4 w-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
          ) : (
            <>
              <ShieldCheck size={16} className="group-hover:scale-110 transition-transform" />
              Aktifkan Sekarang
            </>
          )}
        </button>
      </div>
    </div>
  );
}