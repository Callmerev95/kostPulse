"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CopyButton } from "./CopyButton"
import Image from "next/image"

interface PaymentInstructionsProps {
  user: {
    bankName: string | null;
    accountNumber: string | null;
    accountName: string | null;
    ewalletName: string | null;
    ewalletNumber: string | null;
    qrisImage: string | null;
  }
}

export function PaymentInstructions({ user }: PaymentInstructionsProps) {
  return (
    <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 space-y-4">
      <p className="text-sm font-bold text-blue-900 flex items-center gap-2">
        🏦 Metode Pembayaran
      </p>

      <Tabs defaultValue="bank" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="bank">Bank</TabsTrigger>
          <TabsTrigger value="wallet">E-Wallet</TabsTrigger>
          <TabsTrigger value="qris">QRIS</TabsTrigger>
        </TabsList>

        {/* TAB BANK */}
        <TabsContent value="bank" className="space-y-3 bg-white p-4 rounded-lg border border-blue-200 mt-4">
          {user.bankName ? (
            <>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold">Bank</p>
                <p className="font-bold text-slate-800">{user.bankName}</p>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">No. Rekening</p>
                  <p className="font-mono text-lg font-bold text-blue-700">{user.accountNumber}</p>
                </div>
                <CopyButton text={user.accountNumber || ""} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold">Atas Nama</p>
                <p className="font-medium text-slate-700">{user.accountName}</p>
              </div>
            </>
          ) : <p className="text-xs text-slate-400 italic text-center">Metode tidak tersedia</p>}
        </TabsContent>

        {/* TAB E-WALLET */}
        <TabsContent value="wallet" className="space-y-3 bg-white p-4 rounded-lg border border-blue-200 mt-4">
          {user.ewalletName ? (
            <>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold">E-Wallet</p>
                <p className="font-bold text-slate-800">{user.ewalletName}</p>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Nomor HP</p>
                  <p className="font-mono text-lg font-bold text-blue-700">{user.ewalletNumber}</p>
                </div>
                <CopyButton text={user.ewalletNumber || ""} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold">Atas Nama</p>
                <p className="font-medium text-slate-700">{user.accountName}</p>
              </div>
            </>
          ) : <p className="text-xs text-slate-400 italic text-center">Metode tidak tersedia</p>}
        </TabsContent>

        {/* TAB QRIS */}
        <TabsContent value="qris" className="bg-white p-4 rounded-lg border border-blue-200 mt-4 flex flex-col items-center gap-2">
          {user.qrisImage ? (
            <>
              <div className="relative w-48 h-48 border rounded-lg overflow-hidden">
                <Image src={user.qrisImage} alt="QRIS" fill className="object-contain" unoptimized />
              </div>
              <p className="text-[10px] text-slate-400 italic text-center">Scan atau Screenshot untuk membayar</p>
            </>
          ) : <p className="text-xs text-slate-400 italic text-center">QRIS belum tersedia</p>}
        </TabsContent>
      </Tabs>
    </div>
  )
}