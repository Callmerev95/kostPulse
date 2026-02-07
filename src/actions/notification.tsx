"use server";

import { prisma } from "@/lib/prisma";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function saveSubscription(subscription: string) {
  const cookieStore = await cookies();

  // Inisialisasi Supabase Client di sisi Server
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  // Ambil user yang sedang login
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // Cari user di database Prisma berdasarkan ID Supabase-nya
    await prisma.user.update({
      where: { id: user.id },
      data: { pushSubscription: subscription },
    });

    return { success: true };
  } catch (error) {
    console.error("Error saving subscription:", error);
    return { success: false, error: "Failed to save data to database" };
  }
}