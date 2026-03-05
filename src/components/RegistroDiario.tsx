import { useState, useEffect } from "react";
import { useApp } from "@/contexts/AppContext";
import { MEALS, today, fmtDate, calcAlerts } from "@/lib/data";
import { getCardapioStrings } from "@/lib/store";
import { toast } from "sonner";

export default function RegistroDiario() {
  const { currentUser, records, cardapio, saveRecord } = useApp();
  const cardStrings = getCardapioStrings(cardapio);

  const existing = records.find((r) => r.date === today() && r.caregiver === currentUser?.name);

  const [meals, setMeals] = useState<Record<string, string>>(() => existing?.meals || {});
  const [liquidos, setLiquidos] = useState(existing?.liquidos || 0);
  const [aceitacao, setAceitacao] = useState(existing?.aceitacao || 0);
  const [humor, setHumor] = useState(existing?.humor || "");
  const [degluticao, setDegluticao] = useState(existing?.degluticao || "");
  const [peso, setPeso] = useState<string>(existing?.peso?.toString() || "");
  const [fezQ, setFezQ] = useState(existing?.fezes?.quantidade || "");
  const [fezO, setFezO] = useState(existing?.fezes?.obs || "");
  const [uriQ, setUriQ] = useState(existing?.urina?.qtd || 0);
  const [uriO, setUriO] = useState(existing?.urina?.obs || "");

  const save = async () => {
    const data = {
      id: existing?.id || 0,
      date: today(),
      caregiver: currentUser!.name,
      meals,
      liquidos,
      aceitacao,
      humor,
      degluticao,
      peso: peso ? Number(peso) : null,
      fezes: { quantidade: fezQ, obs: fezO },
      urina: { qtd: uriQ, obs: uriO },
      alertas: [] as string[],
    };
    data.alertas = calcAlerts(data);
    try {
      await saveRecord(data);
      toast.success("✅ Registro salvo com sucesso!");
    } catch (e) {
      toast.error("Erro ao salvar registro.");
    }
  };

  const liqColor = liquidos >= 1500 ? "text-primary-light" : "text-destructive";
  const acColor = aceitacao >= 80 ? "text-primary-light" : aceitacao >= 60 ? "text-warning" : "text-destructive";

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="text-xl font-black text-secondary">📋 Registro Diário</div>
        <div className="text-[13px] text-muted-foreground mt-1">{fmtDate(today())} · Cuidador: {currentUser?.name}</div>
      </div>

      {/* Meals */}
      <div className="bg-card rounded-2xl p-4 border border-border">
        <div className="text-sm font-extrabold text-primary mb-3">🍽️ Refeições do Dia</div>
        <div className="flex flex-col gap-3">
          {MEALS.map((m) => (
            <div key={m.key} className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">{m.label} ({m.hora})</label>
              <select
                value={meals[m.key] || ""}
                onChange={(e) => setMeals({ ...meals, [m.key]: e.target.value })}
                className="px-3.5 py-3 rounded-[10px] border-[1.5px] border-border text-sm bg-background outline-none focus:border-primary-light w-full"
              >
                <option value="">Selecione...</option>
                {(cardStrings[m.key] || []).map((op) => <option key={op} value={op}>{op}</option>)}
                <option value="Recusou">❌ Recusou</option>
                <option value="Aceitação parcial">⚠️ Aceitação parcial</option>
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Hydration + Acceptance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-card rounded-2xl p-4 border border-border">
          <div className="text-sm font-extrabold text-primary mb-3">💧 Hidratação</div>
          <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Total de Líquidos (ml)</label>
          <input type="number" value={liquidos || ""} onChange={(e) => setLiquidos(Number(e.target.value))} min={0} max={3000} placeholder="ex: 1800"
            className="mt-1 px-3.5 py-3 rounded-[10px] border-[1.5px] border-border text-sm bg-background outline-none focus:border-primary-light w-full" />
          {liquidos > 0 && (
            <div className={`mt-2 p-2 px-3 rounded-lg text-xs font-bold ${liquidos >= 1500 ? "bg-primary-light/10 text-primary-light" : "bg-destructive/10 text-destructive"}`}>
              {liquidos >= 1500 ? "✅ Meta atingida!" : `⚠ Faltam ${1500 - liquidos}ml`}
            </div>
          )}
        </div>
        <div className="bg-card rounded-2xl p-4 border border-border">
          <div className="text-sm font-extrabold text-primary mb-3">🍴 Aceitação (%)</div>
          <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Porcentagem geral</label>
          <input type="number" value={aceitacao || ""} onChange={(e) => setAceitacao(Number(e.target.value))} min={0} max={100} placeholder="ex: 80"
            className="mt-1 px-3.5 py-3 rounded-[10px] border-[1.5px] border-border text-sm bg-background outline-none focus:border-primary-light w-full" />
          <div className="h-2.5 rounded-full bg-border overflow-hidden mt-2">
            <div className={`h-full rounded-full transition-all ${aceitacao >= 80 ? "bg-primary-light" : aceitacao >= 60 ? "bg-warning" : "bg-destructive"}`} style={{ width: `${Math.min(aceitacao, 100)}%` }} />
          </div>
          {aceitacao > 0 && <div className={`text-xs font-bold mt-1.5 ${acColor}`}>{aceitacao >= 80 ? "✅ Boa aceitação" : aceitacao >= 60 ? "⚠️ Moderada" : "🚨 Baixa aceitação"}</div>}
        </div>
      </div>

      {/* Behavior */}
      <div className="bg-card rounded-2xl p-4 border border-border">
        <div className="text-sm font-extrabold text-primary mb-3">🧠 Comportamento e Deglutição</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Humor / Comportamento</label>
            <textarea value={humor} onChange={(e) => setHumor(e.target.value)} rows={3} placeholder="Ex: Tranquila, boa aceitação..."
              className="px-3.5 py-3 rounded-[10px] border-[1.5px] border-border text-sm bg-background outline-none focus:border-primary-light w-full resize-y" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Deglutição</label>
            <select value={degluticao} onChange={(e) => setDegluticao(e.target.value)}
              className="px-3.5 py-3 rounded-[10px] border-[1.5px] border-border text-sm bg-background outline-none focus:border-primary-light w-full">
              <option value="">Selecione...</option>
              <option>Normal</option><option>Lentidão</option><option>Tosse ocasional</option><option>Engasgos</option><option>Recusou comer</option>
            </select>
          </div>
        </div>
      </div>

      {/* Weight */}
      <div className="bg-card rounded-2xl p-4 border border-border">
        <div className="text-sm font-extrabold text-primary mb-3">⚖️ Peso Semanal (se for dia de pesagem)</div>
        <div className="max-w-[200px] flex flex-col gap-1">
          <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Peso (kg)</label>
          <input type="number" value={peso} onChange={(e) => setPeso(e.target.value)} min={30} max={150} step={0.1} placeholder="ex: 58.5"
            className="px-3.5 py-3 rounded-[10px] border-[1.5px] border-border text-sm bg-background outline-none focus:border-primary-light w-full" />
        </div>
      </div>

      {/* Fezes + Urina */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-card rounded-2xl p-4 border border-border">
          <div className="text-sm font-extrabold text-primary mb-3">🚽 Fezes</div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Quantidade</label>
              <select value={fezQ} onChange={(e) => setFezQ(e.target.value)} className="px-3.5 py-3 rounded-[10px] border-[1.5px] border-border text-sm bg-background outline-none focus:border-primary-light w-full">
                <option value="">Selecione...</option><option value="P">Pequena</option><option value="M">Média</option><option value="G">Grande</option><option value="Não evacuou">Não evacuou</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Observações</label>
              <textarea value={fezO} onChange={(e) => setFezO(e.target.value)} rows={2} placeholder="cor, odor, sangue..."
                className="px-3.5 py-3 rounded-[10px] border-[1.5px] border-border text-sm bg-background outline-none focus:border-primary-light w-full resize-y" />
            </div>
          </div>
        </div>
        <div className="bg-card rounded-2xl p-4 border border-border">
          <div className="text-sm font-extrabold text-primary mb-3">💧 Urina</div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Nº de micções</label>
              <input type="number" value={uriQ || ""} onChange={(e) => setUriQ(Number(e.target.value))} min={0} max={20} placeholder="ex: 5"
                className="px-3.5 py-3 rounded-[10px] border-[1.5px] border-border text-sm bg-background outline-none focus:border-primary-light w-full" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Observações</label>
              <textarea value={uriO} onChange={(e) => setUriO(e.target.value)} rows={2} placeholder="cor, odor, sangue..."
                className="px-3.5 py-3 rounded-[10px] border-[1.5px] border-border text-sm bg-background outline-none focus:border-primary-light w-full resize-y" />
            </div>
          </div>
        </div>
      </div>

      {/* FAB */}
      <button onClick={save} className="fixed bottom-20 right-5 z-40 bg-primary text-primary-foreground border-none rounded-full px-5 py-3.5 text-sm font-extrabold cursor-pointer fab-shadow flex items-center gap-2 active:opacity-85">
        💾 Salvar Registro
      </button>
    </div>
  );
}
