import { supabase } from "@/integrations/supabase/client";
import { User, RecordData, CardapioOption, MEALS } from "./data";

// ── Users ──
export async function loadUsers(): Promise<User[]> {
  const { data, error } = await supabase.from("app_users").select("*").order("id");
  if (error || !data) return [];
  return data.map((u) => ({ name: u.name, role: u.role as "gestor" | "cuidador", password: u.password }));
}

export async function saveUsers(users: User[]) {
  // Delete all and re-insert
  await supabase.from("app_users").delete().neq("id", 0);
  if (users.length > 0) {
    await supabase.from("app_users").insert(
      users.map((u) => ({ name: u.name, role: u.role, password: u.password }))
    );
  }
}

// ── Records ──
export async function loadRecords(): Promise<RecordData[]> {
  const { data, error } = await supabase.from("records").select("*").order("date", { ascending: false });
  if (error || !data) return [];
  return data.map((r) => ({
    id: r.id,
    date: r.date,
    caregiver: r.caregiver,
    meals: (r.meals as Record<string, string>) || {},
    liquidos: r.liquidos,
    aceitacao: r.aceitacao,
    humor: r.humor || "",
    degluticao: r.degluticao || "",
    peso: r.peso ? Number(r.peso) : null,
    fezes: (r.fezes as { quantidade: string; obs: string }) || { quantidade: "", obs: "" },
    urina: (r.urina as { qtd: number; obs: string }) || { qtd: 0, obs: "" },
    alertas: r.alertas || [],
  }));
}

export async function saveRecord(record: RecordData): Promise<RecordData> {
  const payload = {
    date: record.date,
    caregiver: record.caregiver,
    meals: record.meals,
    liquidos: record.liquidos,
    aceitacao: record.aceitacao,
    humor: record.humor,
    degluticao: record.degluticao,
    peso: record.peso,
    fezes: record.fezes,
    urina: record.urina,
    alertas: record.alertas,
  };

  if (record.id && record.id > 0) {
    // Check if exists in DB
    const { data: existing } = await supabase.from("records").select("id").eq("id", record.id).single();
    if (existing) {
      const { data, error } = await supabase.from("records").update(payload).eq("id", record.id).select().single();
      if (error) throw error;
      return { ...record, id: data!.id };
    }
  }
  
  const { data, error } = await supabase.from("records").insert(payload).select().single();
  if (error) throw error;
  return { ...record, id: data!.id };
}

export async function deleteRecord(id: number) {
  await supabase.from("records").delete().eq("id", id);
}

// ── Cardápio ──
export async function loadCardapio(): Promise<Record<string, CardapioOption[]>> {
  const { data, error } = await supabase.from("cardapio").select("*").order("id");
  const result: Record<string, CardapioOption[]> = {};
  MEALS.forEach((m) => (result[m.key] = []));
  if (error || !data) return result;
  data.forEach((row) => {
    if (!result[row.meal_key]) result[row.meal_key] = [];
    result[row.meal_key].push({ desc: row.descricao, kcal: row.kcal });
  });
  return result;
}

export async function saveCardapio(cardapio: Record<string, CardapioOption[]>) {
  await supabase.from("cardapio").delete().neq("id", 0);
  const rows: { meal_key: string; descricao: string; kcal: number }[] = [];
  Object.entries(cardapio).forEach(([key, opts]) => {
    opts.forEach((o) => rows.push({ meal_key: key, descricao: o.desc, kcal: o.kcal }));
  });
  if (rows.length > 0) {
    await supabase.from("cardapio").insert(rows);
  }
}

// ── Meta Kcal ──
export async function loadMetaKcal(): Promise<{ min: number; max: number }> {
  const { data, error } = await supabase.from("settings").select("value").eq("key", "meta_kcal").single();
  if (error || !data) return { min: 1600, max: 1800 };
  const val = data.value as { min: number; max: number };
  return { min: val.min || 1600, max: val.max || 1800 };
}

export async function saveMetaKcal(meta: { min: number; max: number }) {
  await supabase.from("settings").upsert({ key: "meta_kcal", value: meta });
}

// Helper: get cardápio as string options for selects
export function getCardapioStrings(cardapio: Record<string, CardapioOption[]>): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  MEALS.forEach((m) => {
    result[m.key] = (cardapio[m.key] || []).map((o) => `${o.desc} (~${o.kcal} kcal)`);
  });
  return result;
}
