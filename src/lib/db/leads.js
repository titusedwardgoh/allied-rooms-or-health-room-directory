export function normalizeLeadEmail(email) {
  return String(email ?? "").trim().toLowerCase();
}

export function normalizePracticeName(name) {
  return String(name ?? "").trim();
}

function samePractice(left, right) {
  return normalizePracticeName(left).toLowerCase() ===
    normalizePracticeName(right).toLowerCase();
}

async function findLead(admin, contactEmail, practiceName) {
  const { data, error } = await admin
    .from("listing_leads")
    .select("id, last_step, practice_name")
    .eq("contact_email", normalizeLeadEmail(contactEmail));

  if (error) return { error };
  const lead = (data ?? []).find((row) =>
    samePractice(row.practice_name, practiceName),
  );
  return { lead: lead ?? null };
}

export async function upsertListingLead(admin, lead) {
  const contactEmail = normalizeLeadEmail(lead.contact_email);
  const practiceName = normalizePracticeName(lead.practice_name);
  const incomingStep = lead.last_step === 3 ? 3 : 2;
  const now = new Date().toISOString();

  const { lead: existing, error: readError } = await findLead(
    admin,
    contactEmail,
    practiceName,
  );
  if (readError) return { error: readError };

  const payload = {
    practice_name: practiceName,
    contact_email: contactEmail,
    phone: lead.phone,
    website_url: lead.website_url,
    is_complete: false,
    last_step: incomingStep,
    updated_at: now,
  };

  if (existing) {
    payload.last_step = Math.max(Number(existing.last_step) || 2, incomingStep);
    return admin.from("listing_leads").update(payload).eq("id", existing.id);
  }

  return admin.from("listing_leads").insert(payload);
}

export async function markListingLeadComplete(admin, contactEmail, practiceName) {
  const { lead, error: readError } = await findLead(
    admin,
    contactEmail,
    practiceName,
  );
  if (readError) return { error: readError };
  if (!lead) return { error: null };

  return admin
    .from("listing_leads")
    .update({
      is_complete: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", lead.id);
}
