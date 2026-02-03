"use server";

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { signUpSchema } from "@/lib/zod";

// Action untuk registrasi dan login menggunakan Supabase Auth dan Prisma
export async function signUp(formData: FormData) {
  const cookieStore = await cookies();

  // Ambil data dari formData
  const rawData = Object.fromEntries(formData.entries());

  // 1. Validasi dengan Zod
  const validatedFields = signUpSchema.safeParse(rawData);

  if (!validatedFields.success) {
    // Balikkan pesan error pertama dari zod
    return console.error(validatedFields.error.flatten().fieldErrors);
  }

  const { email, password, name, kostName, whatsappNumber } =
    validatedFields.data;

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

  const { data, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name }, // Opsional: simpan metadata di Supabase Auth
    },
  });

  if (authError) {
    // Kita handle error lewat redirect atau logging untuk menghindari TS mismatch di action
    return redirect(`/register?error=${encodeURIComponent(authError.message)}`);
  }

  if (data.user) {
    try {
      await prisma.user.create({
        data: {
          id: data.user.id,
          email,
          password: "",
          name,
          kostName,
          whatsappNumber,
        },
      });
    } catch (dbError) {
      console.error("Database Sync Error:", dbError);
      return redirect("/register?error=Gagal sinkronisasi data database");
    }
  }

  return redirect("/login?message=Cek email kamu untuk verifikasi!");
}

// Action untuk login
export async function signIn(formData: FormData) {
  const cookieStore = await cookies();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

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

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  return redirect("/dashboard");
}

// Action untuk logout
export async function signOut() {
  const cookieStore = await cookies();
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

  await supabase.auth.signOut();
  return redirect("/login");
}
