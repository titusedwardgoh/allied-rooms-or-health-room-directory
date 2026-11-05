export async function upsertRoomAlert(admin, { email, suburb, days }) {
  return admin.from("room_alerts").upsert(
    {
      email,
      suburb,
      days,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "email,suburb" },
  );
}
