"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { RoomStatus } from "@prisma/client";

/**
 * Mencatat penghuni baru, update status kamar, dan BUAT TAGIHAN OTOMATIS.
 */
export async function createTenant(formData: FormData, roomId: string) {
  const name = formData.get("name") as string;
  const phoneNumber = formData.get("phoneNumber") as string;
  const price = parseInt(formData.get("price") as string);

  const now = new Date();

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Simpan data penghuni baru
      const newTenant = await tx.tenant.create({
        data: {
          name,
          phoneNumber,
          startDate: new Date(),
          roomId,
        },
      });

      // 2. Update status kamar
      await tx.room.update({
        where: { id: roomId },
        data: { status: RoomStatus.OCCUPIED },
      });

      // 3. Buat Tagihan Otomatis untuk bulan pertama
      await tx.transaction.create({
        data: {
          tenantId: newTenant.id,
          amount: price,
          month: now.getMonth() + 1, // getMonth() itu 0-11
          year: now.getFullYear(),
          status: "PENDING",
          dueDate: new Date(now.getFullYear(), now.getMonth(), 10), // Contoh: Jatuh tempo setiap tanggal 10
        },
      });
    });

    // Refresh data di kedua halaman terkait
    revalidatePath("/dashboard/transactions");
    revalidatePath("/dashboard/rooms");
    revalidatePath("/dashboard/tenants");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Error creating tenant & transaction:", error);
    return { error: "Gagal memproses check-in dan tagihan." };
  }
}

/**
 * Mengambil semua daftar penghuni yang aktif.
 * Menggunakan 'include' untuk join data dengan tabel Room.
 */
export async function getTenants(userId: string) {
  return await prisma.tenant.findMany({
    where: {
      room: {
        userId: userId,
      },
    },
    include: {
      room: true,
    },
    orderBy: {
      startDate: "desc",
    },
  });
}

/**
 * Melakukan proses check-out: Menghapus data tenant dan mengubah status kamar ke AVAILABLE.
 */
export async function checkOutTenant(tenantId: string, roomId: string) {
  try {
    await prisma.$transaction(async (tx) => {
      // 1. Hapus tenant
      await tx.tenant.delete({
        where: { id: tenantId },
      });

      // 2. Kembalikan status kamar ke AVAILABLE
      await tx.room.update({
        where: { id: roomId },
        data: { status: RoomStatus.AVAILABLE },
      });
    });

    revalidatePath("/dashboard/tenants");
    revalidatePath("/dashboard/rooms");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Error during check-out:", error);
    return { error: "Gagal melakukan proses check-out." };
  }
}
