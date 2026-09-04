export async function insertHostProfile(admin, profile) {
  return admin.from("profiles").insert(profile).select("id").single();
}

export async function deleteHostProfile(admin, profileId) {
  return admin.from("profiles").delete().eq("id", profileId);
}
