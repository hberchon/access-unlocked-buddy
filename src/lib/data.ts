export interface User {
  name: string;
  role: "gestor" | "cuidador";
  password: string;
}

export interface MealDef {
  key: string;
  label: string;
  hora: string;
}

export interface RecordData {
  id: number;
  date: string;
  caregiver: string;
  meals: Record<string, string>;
  liquidos: number;
  aceitacao: number;
  humor: string;
  degluticao: string;
  peso: number | null;
  fezes: { quantidade: string; obs: string };
  urina: { qtd: number; obs: string };
  alertas: string[];
}

export interface CardapioOption {
  desc: string;
  kcal: number;
}

export const DEF_USERS: User[] = [
  { name: "Hueslei", role: "gestor", password: "4321" },
  { name: "Suelen", role: "gestor", password: "4321" },
  { name: "Ana Costa", role: "gestor", password: "gestor123" },
  { name: "Fátima", role: "cuidador", password: "1234" },
];

export const MEALS: MealDef[] = [
  { key: "cafe", label: "Café da Manhã", hora: "7h" },
  { key: "lanche_manha", label: "Lanche Manhã", hora: "9h" },
  { key: "almoco", label: "Almoço", hora: "12h" },
  { key: "lanche_tarde", label: "Lanche Tarde", hora: "15h" },
  { key: "jantar", label: "Jantar", hora: "19h" },
  { key: "ceia", label: "Ceia", hora: "21h" },
];

export const DEF_CARDAPIO: Record<string, CardapioOption[]> = {
  cafe: [
    { desc: "Mingau de aveia com leite + banana amassada", kcal: 280 },
    { desc: "Papa de leite com farinha de arroz + mel + canela", kcal: 260 },
    { desc: "Iogurte natural batido com mamão + aveia fina", kcal: 220 },
    { desc: "Nutren Senior conforme prescrição", kcal: 200 },
  ],
  lanche_manha: [
    { desc: "Gelatina cremosa com iogurte natural", kcal: 80 },
    { desc: "½ copo suco de fruta natural coado", kcal: 60 },
    { desc: "Iogurte natural desnatado 80g", kcal: 65 },
  ],
  almoco: [
    { desc: "Purê de batata + frango desfiado em molho + cenoura", kcal: 450 },
    { desc: "Arroz papa + carne moída processada + abobrinha", kcal: 420 },
    { desc: "Sopa creme de feijão + legumes + frango desfiado", kcal: 400 },
    { desc: "Purê de mandioca + frango + espinafre com azeite", kcal: 430 },
  ],
  lanche_tarde: [
    { desc: "Gelatina de fruta mole", kcal: 70 },
    { desc: "½ copo vitamina de fruta com leite", kcal: 90 },
    { desc: "Caldo de legumes coado morno", kcal: 50 },
  ],
  jantar: [
    { desc: "Sopa creme + macarrão cabelo-de-anjo + frango", kcal: 380 },
    { desc: "Purê de legumes + omelete mole processada", kcal: 350 },
    { desc: "Caldo grosso de frango com batata e cenoura", kcal: 330 },
  ],
  ceia: [
    { desc: "Nutren Senior diluído conforme prescrição", kcal: 200 },
    { desc: "Iogurte natural morno com mel", kcal: 120 },
    { desc: "Caldo de frango coado morno", kcal: 80 },
  ],
};

export const DEMO_RECORDS: RecordData[] = [
  { id: 1, date: "2026-03-01", caregiver: "Maria Silva", meals: { cafe: "Mingau de aveia com leite + banana amassada (~280 kcal)", lanche_manha: "Gelatina cremosa com iogurte natural (~80 kcal)", almoco: "Purê de batata + frango desfiado em molho + cenoura (~450 kcal)", lanche_tarde: "Gelatina de fruta mole (~70 kcal)", jantar: "Sopa creme + macarrão cabelo-de-anjo + frango (~380 kcal)", ceia: "Nutren Senior diluído conforme prescrição (~200 kcal)" }, liquidos: 1800, aceitacao: 90, humor: "Tranquila, boa aceitação", degluticao: "Normal", peso: null, fezes: { quantidade: "M", obs: "Normal" }, urina: { qtd: 5, obs: "Clara, normal" }, alertas: [] },
  { id: 2, date: "2026-03-02", caregiver: "João Pereira", meals: { cafe: "Papa de leite com farinha de arroz + mel + canela (~260 kcal)", lanche_manha: "½ copo suco de fruta natural coado (~60 kcal)", almoco: "Sopa creme de feijão + legumes + frango desfiado (~400 kcal)", lanche_tarde: "½ copo vitamina de fruta com leite (~90 kcal)", jantar: "Purê de legumes + omelete mole processada (~350 kcal)", ceia: "Iogurte natural morno com mel (~120 kcal)" }, liquidos: 1400, aceitacao: 65, humor: "Agitada na hora do almoço", degluticao: "Lentidão", peso: 58.5, fezes: { quantidade: "P", obs: "" }, urina: { qtd: 3, obs: "Cor escura, odor forte" }, alertas: ["liquidos_baixo", "aceitacao_baixa", "urina_escura"] },
  { id: 3, date: "2026-03-03", caregiver: "Maria Silva", meals: { cafe: "Iogurte natural batido com mamão + aveia fina (~220 kcal)", lanche_manha: "Iogurte natural desnatado 80g (~65 kcal)", almoco: "Purê de mandioca + frango + espinafre com azeite (~430 kcal)", lanche_tarde: "Caldo de legumes coado morno (~50 kcal)", jantar: "Caldo grosso de frango com batata e cenoura (~330 kcal)", ceia: "Nutren Senior diluído conforme prescrição (~200 kcal)" }, liquidos: 1950, aceitacao: 85, humor: "Bem disposta, sorridente", degluticao: "Normal", peso: null, fezes: { quantidade: "", obs: "Não evacuou" }, urina: { qtd: 4, obs: "Normal" }, alertas: ["sem_fezes"] },
  { id: 4, date: "2026-03-04", caregiver: "Ana Costa", meals: { cafe: "Mingau de aveia com leite + banana amassada (~280 kcal)", lanche_manha: "Gelatina cremosa com iogurte natural (~80 kcal)", almoco: "Arroz papa + carne moída processada + abobrinha (~420 kcal)", lanche_tarde: "Gelatina de fruta mole (~70 kcal)", jantar: "Sopa creme + macarrão cabelo-de-anjo + frango (~380 kcal)", ceia: "Nutren Senior diluído conforme prescrição (~200 kcal)" }, liquidos: 2000, aceitacao: 95, humor: "Excelente, colaborativa", degluticao: "Normal", peso: 58.2, fezes: { quantidade: "M", obs: "Normal" }, urina: { qtd: 6, obs: "Clara, normal" }, alertas: [] },
];

export const ALERT_MAP: Record<string, { label: string; color: string }> = {
  liquidos_baixo: { label: "Hidratação baixa", color: "#F4A261" },
  aceitacao_baixa: { label: "Baixa aceitação", color: "#E63946" },
  urina_poucas: { label: "Poucas micções (<3)", color: "#E63946" },
  urina_escura: { label: "Urina escura", color: "#F4A261" },
  urina_sangue: { label: "Sangue na urina", color: "#E63946" },
  sem_fezes: { label: "Sem evacuação", color: "#F4A261" },
};

export function today() {
  return new Date().toISOString().split("T")[0];
}

export function fmtDate(d: string) {
  if (!d) return "-";
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
}

export function calcAlerts(data: Partial<RecordData>): string[] {
  const a: string[] = [];
  if ((data.liquidos || 0) < 1500) a.push("liquidos_baixo");
  if ((data.aceitacao || 0) < 70) a.push("aceitacao_baixa");
  if ((data.urina?.qtd || 0) < 3) a.push("urina_poucas");
  if ((data.urina?.obs || "").toLowerCase().includes("escur")) a.push("urina_escura");
  if ((data.urina?.obs || "").toLowerCase().includes("sangue")) a.push("urina_sangue");
  if (!data.fezes?.quantidade || data.fezes.quantidade === "Não evacuou") a.push("sem_fezes");
  return a;
}

export function extractKcal(str: string): number {
  const m = String(str).match(/~?\s*(\d+)\s*kcal/i);
  return m ? parseInt(m[1]) : 0;
}
