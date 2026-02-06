"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export function useTransactionRealtime(transactionId?: string) {
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    // Berlangganan ke perubahan tabel Transaction
    const channel = supabase
      .channel("realtime-transactions")
      .on(
        "postgres_changes",
        {
          event: "*", // Pantau INSERT, UPDATE, dan DELETE
          schema: "public",
          table: "Transaction",
          ...(transactionId && { filter: `id=eq.${transactionId}` }),
        },
        (payload) => {
          console.log("Change detected!", payload);
          // Memicu Server Component untuk ambil data baru tanpa full reload
          router.refresh();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, router, transactionId]);
}
