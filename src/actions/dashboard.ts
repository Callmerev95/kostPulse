import { prisma } from "@/lib/prisma";

/**
 * Mengambil ringkasan statistik kamar untuk dashboard overview.
 */
export async function getDashboardStats(userId: string) {
  const totalRooms = await prisma.room.count({
    where: { userId },
  });

  const availableRooms = await prisma.room.count({
    where: {
      userId,
      status: "AVAILABLE",
    },
  });

  const occupiedRooms = await prisma.room.count({
    where: {
      userId,
      status: "OCCUPIED",
    },
  });

  return { totalRooms, availableRooms, occupiedRooms };
}
