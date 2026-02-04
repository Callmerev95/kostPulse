"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase-server";

export async function updateSettings(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) return { error: "Unauthorized" };

  //const name = formData.get("name") as string;
  const bankName = formData.get("bankName") as string;
  const accountNumber = formData.get("accountNumber") as string;
  const accountName = formData.get("accountName") as string;
  const ewalletName = formData.get("ewalletName") as string | null;
  const ewalletNumber = formData.get("ewalletNumber") as string | null;
  const qrisImage = formData.get("qrisImage") as string | null;

  try {
    await prisma.user.update({
      where: { id: authUser.id },
      data: {
        bankName: bankName || null,
        accountNumber: accountNumber || null,
        accountName: accountName || null,
        ewalletName: ewalletName || null,
        ewalletNumber: ewalletNumber || null,
        qrisImage: qrisImage || null,
      },
    });

    // Beritahu Next.js untuk memperbarui tampilan yang menggunakan data ini
    revalidatePath("/dashboard/settings");
    revalidatePath("/pay/[token]", "page");

    return { success: true };
  } catch (error) {
    console.error("FAILED_TO_UPDATE_SETTINGS:", error);
    return { error: "Gagal memperbarui pengaturan. Silakan coba lagi." };
  }
}
