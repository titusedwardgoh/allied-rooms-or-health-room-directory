export async function insertHostProfile(admin, profile) {
  return admin.from("profiles").insert(profile).select("id").single();
}

export async function updateHostProfile(admin, profileId, profile) {
  return admin.from("profiles").update(profile).eq("id", profileId);
}

export async function deleteHostProfile(admin, profileId) {
  return admin.from("profiles").delete().eq("id", profileId);
}
