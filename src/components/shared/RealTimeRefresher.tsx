"use client"
import { useTransactionRealtime } from "@/hooks/use-transaction-realtime"

export function RealtimeRefresher({ id }: { id?: string }) {
  useTransactionRealtime(id)
  return null // Tidak merender apa-apa, hanya menjalankan logic
}