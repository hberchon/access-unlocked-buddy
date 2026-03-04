import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { MEALS, today, extractKcal } from "@/lib/data";
import { toast } from "sonner";

export default function CardapioGestor() {
  const { cardapio, setCardapio, metaKcal, setMetaKcal, records } = useApp();
  const [novaRef, setNovaRef] = useState("cafe");
  const [novaDesc, setNovaDesc] = useState("");
  const [novaKcal, setNovaKcal] = useState("");

  const todayRec = records.filter((r) => r.date === today());
  const lastRec = todayRec[todayRec.length - 1];
  const totalKcal = lastRec ? Object.values(lastRec.meals).reduce((s, v) => s + extractKcal(v), 0) : 0;
  const pct = Math.min(100, Math.round((totalKcal / metaKcal.max) * 100));
  const statusColor = totalKcal >= metaKcal.min ? "text-primary-light" : totalKcal >= metaKcal.min * 0.8 ? "text-warning" : "text-destructive";

  const addOption = () => {
    if (!novaDesc.trim()) { toast.error("Informe a descrição da receita."); return; }
    const updated = { ...cardapio };
    if (!updated[novaRef]) updated[novaRef] = [];
    updated[novaRef] = [...updated[novaRef], { desc: novaDesc.trim(), kcal: parseInt(novaKcal) || 0 }];
    setCardapio(updated);
    setNovaDesc(""); setNovaKcal("");
    toast.success("✅ Receita adicionada ao cardápio!");
  };

  const removeOption = (mealKey: string, idx: number) => {
    const updated = { ...cardapio };
    updated[mealKey] = updated[mealKey].filter((_, i) => i !== idx);
    setCardapio(updated);
    toast("🗑️ Opção removida.");
  };

  const editOption = (mealKey: string, idx: number, field: "desc" | "kcal", val: string) => {
    const updated = { ...cardapio };
    updated[mealKey] = updated[mealKey].map((o, i) => i === idx ? { ...o, [field]: field === "kcal" ? parseInt(val) || 0 : val } : o);
    setCardapio(updated);
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="text-xl font-black text-secondary">🍽️ Editar Cardápio</div>
        <div className="text-[13px] text-muted-foreground mt-1">Gerencie receitas, opções e metas calóricas</div>
      </div>

      {/* Meta */}
      <div className="bg-card rounded-2xl p-4 border border-border">
        <div className="text-sm font-extrabold text-primary mb-3">🎯 Meta Calórica Diária</div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Mínimo (kcal)</label>
            <input type="number" value={metaKcal.min} onChange={(e) => setMetaKcal({ ...metaKcal, min: Number(e.target.value) || 1600 })} className="px-3.5 py-3 rounded-[10px] border-[1.5px] border-border text-sm bg-background outline-none focus:border-primary-light w-full" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Máximo (kcal)</label>
            <input type="number" value={metaKcal.max} onChange={(e) => setMetaKcal({ ...metaKcal, max: Number(e.target.value) || 1800 })} className="px-3.5 py-3 rounded-[10px] border-[1.5px] border-border text-sm bg-background outline-none focus:border-primary-light w-full" />
          </div>
        </div>
      </div>

      {/* Kcal hoje */}
      <div className="bg-card rounded-2xl p-4 border border-border">
        <div className="text-sm font-extrabold text-primary mb-3">📊 Consumo Calórico — Hoje</div>
        {!lastRec ? (
          <p className="text-muted-foreground text-[13px]">Nenhum registro de hoje encontrado.</p>
        ) : (
          <div>
            {MEALS.map((m) => {
              const v = lastRec.meals?.[m.key];
              if (!v || v === "Recusou") return null;
              const k = extractKcal(v);
              return (
                <div key={m.key} className="flex justify-between text-xs py-1 border-b border-border">
                  <span className="text-muted-foreground">{m.label}</span>
                  <span className="font-bold text-primary">{k > 0 ? `${k} kcal` : "—"}</span>
                </div>
              );
            })}
            <div className="mt-3 pt-2 border-t-2 border-border flex justify-between items-center">
              <span className="font-extrabold">Total</span>
              <span className={`font-black text-lg ${statusColor}`}>{totalKcal} kcal</span>
            </div>
            <div className="h-3 rounded-full bg-border overflow-hidden mt-2">
              <div className={`h-full rounded-full transition-all ${totalKcal >= metaKcal.min ? "bg-primary-light" : "bg-warning"}`} style={{ width: `${pct}%` }} />
            </div>
            <div className={`text-[13px] font-bold mt-2 ${statusColor}`}>
              {totalKcal >= metaKcal.min ? "✅ Dentro da meta" : `⚠ Faltam ${metaKcal.min - totalKcal} kcal`}
            </div>
          </div>
        )}
      </div>

      {/* Editor */}
      {MEALS.map((m) => (
        <div key={m.key} className="bg-card rounded-2xl p-4 border border-border">
          <div className="text-sm font-extrabold text-primary mb-3">{m.label} ({m.hora})</div>
          {(cardapio[m.key] || []).map((op, i) => (
            <div key={i} className="flex items-center gap-2 mb-2 bg-background rounded-[10px] p-2.5 px-3 border border-border">
              <div className="flex-1 min-w-0">
                <input type="text" value={op.desc} onChange={(e) => editOption(m.key, i, "desc", e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border-[1.5px] border-border text-[13px] bg-card mb-1 outline-none focus:border-primary-light" />
                <div className="flex items-center gap-1.5">
                  <input type="number" value={op.kcal} onChange={(e) => editOption(m.key, i, "kcal", e.target.value)} min={0} max={2000}
                    className="w-[90px] px-2.5 py-1.5 rounded-lg border-[1.5px] border-border text-[13px] bg-card outline-none focus:border-primary-light" />
                  <span className="text-xs text-muted-foreground">kcal</span>
                </div>
              </div>
              <button onClick={() => removeOption(m.key, i)} className="px-2 py-1.5 text-xs rounded-lg border-none bg-destructive text-destructive-foreground font-bold cursor-pointer flex-shrink-0">🗑️</button>
            </div>
          ))}
        </div>
      ))}

      {/* Add new */}
      <div className="bg-card rounded-2xl p-4 border-2 border-dashed border-border">
        <div className="text-sm font-extrabold text-primary mb-3">➕ Adicionar Nova Opção</div>
        <div className="flex flex-col gap-2.5">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Refeição</label>
            <select value={novaRef} onChange={(e) => setNovaRef(e.target.value)} className="px-3.5 py-3 rounded-[10px] border-[1.5px] border-border text-sm bg-background outline-none focus:border-primary-light w-full">
              {MEALS.map((m) => <option key={m.key} value={m.key}>{m.label} ({m.hora})</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Descrição da Receita</label>
            <textarea value={novaDesc} onChange={(e) => setNovaDesc(e.target.value)} rows={2} placeholder="Ex: Purê de mandioca com frango desfiado"
              className="px-3.5 py-3 rounded-[10px] border-[1.5px] border-border text-sm bg-background outline-none focus:border-primary-light w-full resize-y" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Calorias (kcal)</label>
            <input type="number" value={novaKcal} onChange={(e) => setNovaKcal(e.target.value)} min={0} max={2000} placeholder="ex: 380"
              className="px-3.5 py-3 rounded-[10px] border-[1.5px] border-border text-sm bg-background outline-none focus:border-primary-light w-full" />
          </div>
          <button onClick={addOption} className="w-full py-3.5 rounded-xl border-none cursor-pointer font-extrabold text-[15px] bg-primary text-primary-foreground active:opacity-80 transition-opacity">+ Adicionar ao Cardápio</button>
        </div>
      </div>
    </div>
  );
}
