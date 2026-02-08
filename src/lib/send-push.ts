import webpush from "web-push";

webpush.setVapidDetails(
  "mailto:rchivas108@gmail.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
);

export async function sendNotification(
  subscriptionJson: string,
  title: string,
  body: string,
) {
  try {
    const subscription = JSON.parse(subscriptionJson);

    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title,
        body,
        url: "/dashboard/transactions",
      }),

      {
        headers: {
          Urgency: "high", // Memaksa notifikasi langsung tampil (no delay)
        },
        TTL: 60 * 60 * 24, // Time To Live: Berusaha kirim selama 24 jam jika HP offline
      },
    );

    return { success: true };
  } catch (error) {
    console.error("Gagal kirim push notification:", error);
    // Jika subscription sudah expired atau tidak valid lagi
    return { success: false, error };
  }
}
