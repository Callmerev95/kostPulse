"use server";

import { prisma } from "@/lib/prisma";

/**
 * Mengambil ringkasan statistik kamar dan keuangan untuk dashboard overview.
 * Dioptimalkan dengan Promise.all agar query berjalan paralel.
 */
export async function getDashboardStats(userId: string) {
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  try {
    const [rooms, revenue, overdueCount] = await Promise.all([
      // 1. Ambil semua status kamar dalam satu query
      prisma.room.groupBy({
        by: ["status"],
        where: { userId },
        _count: { _all: true },
      }),

      // 2. Hitung Pendapatan (Paid vs Pending) bulan ini
      prisma.transaction.groupBy({
        by: ["status"],
        where: {
          month: currentMonth,
          year: currentYear,
          tenant: { userId: userId },
        },
        _sum: { amount: true },
      }),

      // 3. Hitung Tenant yang belum bayar padahal sudah lewat jatuh tempo
      prisma.transaction.count({
        where: {
          status: "PENDING",
          dueDate: { lt: today },
          tenant: { userId: userId },
        },
      }),
    ]);

    // Mapping Data Kamar
    const stats = {
      total: rooms.reduce((acc, curr) => acc + curr._count._all, 0),
      available: rooms.find((r) => r.status === "AVAILABLE")?._count._all || 0,
      occupied: rooms.find((r) => r.status === "OCCUPIED")?._count._all || 0,
    };

    // Mapping Data Keuangan
    const income = {
      paid: revenue.find((r) => r.status === "PAID")?._sum.amount || 0,
      pending: revenue.find((r) => r.status === "PENDING")?._sum.amount || 0,
    };

    return { stats, income, overdueCount };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      stats: { total: 0, available: 0, occupied: 0 },
      income: { paid: 0, pending: 0 },
      overdueCount: 0,
    };
  }
}
