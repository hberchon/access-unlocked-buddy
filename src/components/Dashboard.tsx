import { useApp } from "@/contexts/AppContext";
import { MEALS, ALERT_MAP, fmtDate, today } from "@/lib/data";

export default function Dashboard() {
  const { records } = useApp();
  const sorted = [...records].sort((a, b) => b.date.localeCompare(a.date));
  const totAl = records.reduce((s, r) => s + (r.alertas?.length || 0), 0);
  const avgAc = records.length ? Math.round(records.reduce((s, r) => s + r.aceitacao, 0) / records.length) : 0;
  const avgLq = records.length ? Math.round(records.reduce((s, r) => s + r.liquidos, 0) / records.length) : 0;
  const hoje = records.filter((r) => r.date === today()).length;

  const pesos = records.filter((r) => r.peso).map((r) => ({ date: r.date, peso: r.peso! })).sort((a, b) => a.date.localeCompare(b.date));
  const last7 = sorted.slice(0, 7).reverse();

  const alU: Record<string, number> = {};
  records.forEach((r) => (r.alertas || []).forEach((a) => (alU[a] = (alU[a] || 0) + 1)));

  const acC = avgAc >= 80 ? "text-primary-light" : avgAc >= 60 ? "text-warning" : "text-destructive";
  const lqC = avgLq >= 1500 ? "text-primary-light" : "text-warning";
  const alC = totAl > 0 ? "text-destructive" : "text-primary-light";

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="text-xl font-black text-secondary">📊 Dashboard</div>
        <div className="text-[13px] text-muted-foreground mt-1">Visão geral do cuidado — Isolda</div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2.5">
        <StatCard icon="📅" value={String(records.length)} label="Registros" sub={hoje > 0 ? "✅ Hoje registrado" : "⚠ Hoje sem registro"} />
        <StatCard icon="🍴" value={`${avgAc}%`} label="Aceitação Média" sub="Meta: ≥80%" valueClass={acC} />
        <StatCard icon="💧" value={`${avgLq}ml`} label="Hidratação Média" sub="Meta: 1500–2000ml" valueClass={lqC} />
        <StatCard icon="🚨" value={String(totAl)} label="Alertas Ativos" sub="Nos registros" valueClass={alC} />
      </div>

      {/* Alerts */}
      {Object.keys(alU).length > 0 && (
        <div className="bg-card rounded-2xl p-4 border border-border" style={{ borderLeft: "4px solid hsl(var(--destructive))" }}>
          <div className="text-sm font-extrabold text-destructive mb-3">🚨 Alertas Detectados</div>
          <div className="flex flex-wrap gap-1">
            {Object.entries(alU).map(([t, c]) => (
              <span key={t}>
                <AlertTag type={t} /> <span className="text-[11px] text-muted-foreground">({c}x)</span>
              </span>
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground mt-2.5">Perda &gt;1kg/sem · &gt;3 dias sem evacuar · Urina escura/sangue · &lt;3 micções/dia → Comunicar médico</p>
        </div>
      )}

      {/* Bar Chart */}
      <div className="bg-card rounded-2xl p-4 border border-border">
        <div className="text-sm font-extrabold text-primary mb-3">🍴 Aceitação Alimentar — Últimos registros</div>
        <div className="flex items-end gap-2 h-[100px]">
          {last7.map((r) => {
            const h = Math.max(8, (r.aceitacao / 100) * 90);
            const c = r.aceitacao >= 80 ? "bg-primary-light" : r.aceitacao >= 60 ? "bg-warning" : "bg-destructive";
            return (
              <div key={r.id} className="flex-1 flex flex-col items-center gap-1">
                <span className={`text-[10px] font-bold ${r.aceitacao >= 80 ? "text-primary-light" : r.aceitacao >= 60 ? "text-warning" : "text-destructive"}`}>{r.aceitacao}%</span>
                <div className={`w-full rounded-t-md rounded-b-sm ${c} opacity-85`} style={{ height: `${h}px` }} />
                <span className="text-[9px] text-muted-foreground">{fmtDate(r.date).slice(0, 5)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Peso */}
      {pesos.length > 0 && (
        <div className="bg-card rounded-2xl p-4 border border-border">
          <div className="text-sm font-extrabold text-primary mb-3">⚖️ Evolução do Peso</div>
          <div className="flex gap-2.5 flex-wrap">
            {pesos.map((p, i) => {
              const prev = pesos[i - 1];
              const diff = prev ? (p.peso - prev.peso).toFixed(1) : null;
              return (
                <div key={p.date} className="bg-background rounded-[10px] p-2.5 px-3.5 text-center min-w-[90px] border border-border">
                  <div className="text-xl font-black text-secondary">{p.peso}kg</div>
                  <div className="text-[10px] text-muted-foreground">{fmtDate(p.date)}</div>
                  {diff && (
                    <div className={`text-xs font-bold mt-0.5 ${Number(diff) < -1 ? "text-destructive" : Number(diff) > 0 ? "text-primary-light" : "text-muted-foreground"}`}>
                      {Number(diff) > 0 ? "+" : ""}{diff}kg
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* History */}
      <div className="bg-card rounded-2xl p-4 border border-border">
        <div className="text-sm font-extrabold text-primary mb-3">📋 Histórico de Registros</div>
        {sorted.map((r) => (
          <div key={r.id} className="p-3 px-3.5 rounded-xl bg-background border border-border mb-2">
            <div className="flex justify-between items-start flex-wrap gap-1">
              <div>
                <span className="font-extrabold text-secondary text-sm">{fmtDate(r.date)}</span>
                <span className="text-muted-foreground text-xs ml-2">👤 {r.caregiver}</span>
              </div>
              <div className="flex flex-wrap gap-0.5">{(r.alertas || []).map((a) => <AlertTag key={a} type={a} />)}</div>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              💧 {r.liquidos}ml · 🍴 {r.aceitacao}%{r.peso ? ` · ⚖️ ${r.peso}kg` : ""}
            </div>
            {r.humor && <div className="text-xs text-muted-foreground mt-1">🧠 {r.humor} · {r.degluticao}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ icon, value, label, sub, valueClass = "" }: { icon: string; value: string; label: string; sub: string; valueClass?: string }) {
  return (
    <div className="bg-card rounded-[14px] p-3.5 text-center border border-border">
      <div className="text-[26px]">{icon}</div>
      <div className={`text-2xl font-black mt-1 ${valueClass}`}>{value}</div>
      <div className="text-xs font-bold mt-0.5">{label}</div>
      <div className="text-[10px] text-muted-foreground mt-0.5">{sub}</div>
    </div>
  );
}

function AlertTag({ type }: { type: string }) {
  const a = ALERT_MAP[type];
  if (!a) return null;
  return (
    <span className="inline-block rounded-full px-2 py-0.5 text-[11px] font-bold m-0.5" style={{ background: `${a.color}22`, color: a.color, border: `1px solid ${a.color}44` }}>
      ⚠ {a.label}
    </span>
  );
}
