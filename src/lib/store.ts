import { User, RecordData, CardapioOption, DEF_USERS, DEMO_RECORDS, DEF_CARDAPIO, MEALS } from "./data";

const DEF_USERS_VERSION = "v5";

// ── Users ──
export function loadUsers(): User[] {
  try {
    const storedVer = localStorage.getItem("cb_users_ver");
    const stored = localStorage.getItem("cb_users");
    let storedUsers: User[] = stored ? JSON.parse(stored) : [];
    if (storedVer !== DEF_USERS_VERSION) {
      DEF_USERS.forEach((du) => {
        const idx = storedUsers.findIndex((u) => u.name.toLowerCase() === du.name.toLowerCase());
        if (idx >= 0) storedUsers[idx] = { ...storedUsers[idx], ...du };
        else storedUsers.push(du);
      });
      localStorage.setItem("cb_users_ver", DEF_USERS_VERSION);
      localStorage.setItem("cb_users", JSON.stringify(storedUsers));
    }
    return storedUsers.length > 0 ? storedUsers : JSON.parse(JSON.stringify(DEF_USERS));
  } catch {
    return JSON.parse(JSON.stringify(DEF_USERS));
  }
}

export function saveUsers(users: User[]) {
  localStorage.setItem("cb_users", JSON.stringify(users));
}

// ── Records ──
export function loadRecords(): RecordData[] {
  try {
    const r = localStorage.getItem("cb_records");
    return r ? JSON.parse(r) : JSON.parse(JSON.stringify(DEMO_RECORDS));
  } catch {
    return JSON.parse(JSON.stringify(DEMO_RECORDS));
  }
}

export function saveRecords(records: RecordData[]) {
  localStorage.setItem("cb_records", JSON.stringify(records));
}

// ── Cardápio ──
export function loadCardapio(): Record<string, CardapioOption[]> {
  try {
    const c = localStorage.getItem("cb_cardapio");
    if (c) return JSON.parse(c);
    const seed: Record<string, CardapioOption[]> = {};
    MEALS.forEach((m) => {
      seed[m.key] = DEF_CARDAPIO[m.key] ? [...DEF_CARDAPIO[m.key]] : [];
    });
    return seed;
  } catch {
    return JSON.parse(JSON.stringify(DEF_CARDAPIO));
  }
}

export function saveCardapio(cardapio: Record<string, CardapioOption[]>) {
  localStorage.setItem("cb_cardapio", JSON.stringify(cardapio));
}

export function loadMetaKcal(): { min: number; max: number } {
  try {
    const m = localStorage.getItem("cb_meta_kcal");
    return m ? JSON.parse(m) : { min: 1600, max: 1800 };
  } catch {
    return { min: 1600, max: 1800 };
  }
}

export function saveMetaKcal(meta: { min: number; max: number }) {
  localStorage.setItem("cb_meta_kcal", JSON.stringify(meta));
}

// Helper: get cardápio as string options for selects
export function getCardapioStrings(cardapio: Record<string, CardapioOption[]>): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  MEALS.forEach((m) => {
    result[m.key] = (cardapio[m.key] || []).map((o) => `${o.desc} (~${o.kcal} kcal)`);
  });
  return result;
}
