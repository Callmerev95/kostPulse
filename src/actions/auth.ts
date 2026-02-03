"use server";

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma"; // Kita perlu buat file lib/prisma.ts dulu setelah ini
import { redirect } from "next/navigation";

export async function signUp(formData: FormData) {
  const cookieStore = await cookies();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;
  const kostName = formData.get("kostName") as string;
  const whatsappNumber = formData.get("whatsappNumber") as string;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    },
  );

  // 1. Daftar ke Supabase Auth
  const { data, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    return { error: authError.message };
  }

  // 2. Jika sukses, Sync ke Prisma Database
  if (data.user) {
    try {
      await prisma.user.create({
        data: {
          id: data.user.id, // Kita samakan ID-nya dengan ID Supabase biar gampang tracking
          email,
          password: "", // Password kosong karena auth dikelola Supabase
          name,
          kostName,
          whatsappNumber,
        },
      });
    } catch (dbError) {
      console.error("Database Sync Error:", dbError);
      return {
        error: "Auth berhasil, tapi gagal menyimpan profil. Hubungi admin.",
      };
    }
  }

  return redirect("/login?message=Cek email kamu untuk verifikasi!");
}
