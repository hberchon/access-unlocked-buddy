import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { MEALS, ALERT_MAP, fmtDate, calcAlerts } from "@/lib/data";
import { getCardapioStrings } from "@/lib/store";
import { toast } from "sonner";

export default function AdminPanel() {
  const { currentUser, users, setUsers, records, setRecords } = useApp();
  const cardStrings = getCardapioStrings(useApp().cardapio);

  const [showNewUser, setShowNewUser] = useState(false);
  const [nuNome, setNuNome] = useState("");
  const [nuRole, setNuRole] = useState<"cuidador" | "gestor">("cuidador");
  const [nuSenha, setNuSenha] = useState("");

  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [euNome, setEuNome] = useState("");
  const [euRole, setEuRole] = useState<"cuidador" | "gestor">("cuidador");
  const [euSenha, setEuSenha] = useState("");

  const [showPwChange, setShowPwChange] = useState(false);
  const [pwCur, setPwCur] = useState("");
  const [pwNew, setPwNew] = useState("");
  const [pwConf, setPwConf] = useState("");

  const [filCare, setFilCare] = useState("");
  const [editRecId, setEditRecId] = useState<number | null>(null);

  // Edit record state
  const [erDate, setErDate] = useState("");
  const [erCare, setErCare] = useState("");
  const [erMeals, setErMeals] = useState<Record<string, string>>({});
  const [erLiq, setErLiq] = useState(0);
  const [erAceit, setErAceit] = useState(0);
  const [erHumor, setErHumor] = useState("");
  const [erDeg, setErDeg] = useState("");
  const [erPeso, setErPeso] = useState("");
  const [erFezQ, setErFezQ] = useState("");
  const [erFezO, setErFezO] = useState("");
  const [erUriQ, setErUriQ] = useState(0);
  const [erUriO, setErUriO] = useState("");

  const cuidadores = [...new Set(records.map((r) => r.caregiver))].sort();
  const filteredRecs = [...records].sort((a, b) => b.date.localeCompare(a.date)).filter((r) => !filCare || r.caregiver === filCare);

  const createUser = () => {
    if (!nuNome.trim()) { toast.error("Informe o nome."); return; }
    if (nuSenha.length < 4) { toast.error("Senha deve ter ao menos 4 caracteres."); return; }
    if (users.find((u) => u.name.toLowerCase() === nuNome.trim().toLowerCase())) { toast.error("Já existe usuário com este nome."); return; }
    setUsers([...users, { name: nuNome.trim(), role: nuRole, password: nuSenha }]);
    setNuNome(""); setNuSenha(""); setShowNewUser(false);
    toast.success("👤 Usuário criado!");
  };

  const openEdit = (idx: number) => {
    const u = users[idx];
    setEditIdx(idx); setEuNome(u.name); setEuRole(u.role); setEuSenha("");
  };

  const saveEdit = () => {
    if (editIdx === null) return;
    if (!euNome.trim()) { toast.error("Informe o nome."); return; }
    const dup = users.findIndex((u) => u.name.toLowerCase() === euNome.trim().toLowerCase());
    if (dup >= 0 && dup !== editIdx) { toast.error("Já existe outro usuário com este nome."); return; }
    if (euSenha && euSenha.length < 4) { toast.error("Senha deve ter ao menos 4 caracteres."); return; }
    const updated = users.map((u, i) => i === editIdx ? { ...u, name: euNome.trim(), role: euRole, ...(euSenha ? { password: euSenha } : {}) } : u);
    setUsers(updated); setEditIdx(null);
    toast.success("✅ Usuário atualizado!");
  };

  const deleteUser = (idx: number) => {
    if (!confirm(`Excluir ${users[idx].name}?`)) return;
    setUsers(users.filter((_, i) => i !== idx));
    toast("🗑️ Usuário removido.");
  };

  const changePw = () => {
    if (!currentUser) return;
    if (pwCur !== users[currentUser.idx].password) { toast.error("Senha atual incorreta."); return; }
    if (pwNew.length < 4) { toast.error("Nova senha deve ter ao menos 4 caracteres."); return; }
    if (pwNew !== pwConf) { toast.error("As senhas não coincidem."); return; }
    const updated = users.map((u, i) => i === currentUser.idx ? { ...u, password: pwNew } : u);
    setUsers(updated);
    setShowPwChange(false); setPwCur(""); setPwNew(""); setPwConf("");
    toast.success("🔑 Senha alterada com sucesso!");
  };

  const openEditRec = (id: number) => {
    const r = records.find((rec) => rec.id === id);
    if (!r) return;
    setEditRecId(id); setErDate(r.date); setErCare(r.caregiver); setErMeals({ ...r.meals });
    setErLiq(r.liquidos); setErAceit(r.aceitacao); setErHumor(r.humor); setErDeg(r.degluticao);
    setErPeso(r.peso?.toString() || ""); setErFezQ(r.fezes?.quantidade || ""); setErFezO(r.fezes?.obs || "");
    setErUriQ(r.urina?.qtd || 0); setErUriO(r.urina?.obs || "");
  };

  const saveEditRec = () => {
    if (editRecId === null) return;
    const data = {
      id: editRecId, date: erDate, caregiver: erCare, meals: erMeals,
      liquidos: erLiq, aceitacao: erAceit, humor: erHumor, degluticao: erDeg,
      peso: erPeso ? Number(erPeso) : null,
      fezes: { quantidade: erFezQ, obs: erFezO },
      urina: { qtd: erUriQ, obs: erUriO },
      alertas: [] as string[],
    };
    data.alertas = calcAlerts(data);
    setRecords(records.map((r) => r.id === editRecId ? data : r));
    setEditRecId(null);
    toast.success("✅ Registro atualizado!");
  };

  const deleteRec = (id: number) => {
    const r = records.find((rec) => rec.id === id);
    if (!r || !confirm(`Excluir registro de ${fmtDate(r.date)}?`)) return;
    setRecords(records.filter((rec) => rec.id !== id));
    toast("🗑️ Registro excluído.");
  };

  const InputField = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">{label}</label>
      {children}
    </div>
  );

  const inputCls = "px-3.5 py-3 rounded-[10px] border-[1.5px] border-border text-sm bg-background outline-none focus:border-primary-light w-full";

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="text-xl font-black text-secondary">⚙️ Administração</div>
        <div className="text-[13px] text-muted-foreground mt-1">Gerencie usuários e registros clínicos</div>
      </div>

      {/* Minha Conta */}
      <div className="bg-card rounded-2xl p-4 border border-border">
        <div className="text-sm font-extrabold text-primary mb-3">👤 Minha Conta</div>
        <div className="bg-background rounded-[10px] p-3 border border-border mb-2.5">
          <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Nome</div>
          <div className="text-[15px] font-semibold">{currentUser?.name}</div>
        </div>
        <div className="bg-background rounded-[10px] p-3 border border-border mb-2.5">
          <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Perfil</div>
          <div className="text-[15px] font-semibold">{currentUser?.role === "gestor" ? "Gestor(a)" : "Cuidador(a)"}</div>
        </div>
        <button onClick={() => setShowPwChange(true)} className="w-full py-3.5 rounded-xl border-none cursor-pointer font-extrabold text-[15px] bg-primary text-primary-foreground active:opacity-80 mt-1">🔑 Alterar Minha Senha</button>
      </div>

      {/* Password change modal */}
      {showPwChange && (
        <Modal onClose={() => setShowPwChange(false)} title="🔑 Alterar Minha Senha">
          <InputField label="Senha Atual"><input type="password" value={pwCur} onChange={(e) => setPwCur(e.target.value)} className={inputCls} /></InputField>
          <InputField label="Nova Senha"><input type="password" value={pwNew} onChange={(e) => setPwNew(e.target.value)} placeholder="Mínimo 4 caracteres" className={inputCls} /></InputField>
          <InputField label="Confirmar Nova Senha"><input type="password" value={pwConf} onChange={(e) => setPwConf(e.target.value)} className={inputCls} /></InputField>
          <div className="flex gap-2.5 mt-4">
            <button onClick={() => setShowPwChange(false)} className="flex-1 py-3.5 rounded-xl border-none cursor-pointer font-extrabold text-[15px] bg-border active:opacity-80">Cancelar</button>
            <button onClick={changePw} className="flex-1 py-3.5 rounded-xl border-none cursor-pointer font-extrabold text-[15px] bg-primary text-primary-foreground active:opacity-80">Salvar</button>
          </div>
        </Modal>
      )}

      {/* Users */}
      <div className="bg-card rounded-2xl p-4 border border-border">
        <div className="flex justify-between items-center mb-3">
          <div className="text-sm font-extrabold text-primary">👥 Usuários Cadastrados</div>
          <button onClick={() => setShowNewUser(true)} className="px-3 py-1.5 text-xs rounded-lg border-none bg-primary text-primary-foreground font-bold cursor-pointer">+ Novo</button>
        </div>
        {users.map((u, i) => {
          const isSelf = currentUser?.name === u.name;
          return (
            <div key={i} className="bg-background rounded-xl p-3.5 px-4 border border-border flex items-center gap-3 mb-2.5">
              <div className={`w-[42px] h-[42px] rounded-full flex items-center justify-center text-xl font-black text-primary-foreground flex-shrink-0 ${u.role === "gestor" ? "bg-secondary" : "bg-primary"}`}>
                {u.name[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-extrabold text-sm text-secondary">
                  {u.name} {isSelf && <span className="text-[10px] text-muted-foreground">(você)</span>}
                </div>
                <div className="mt-0.5">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-bold ${u.role === "gestor" ? "bg-secondary/15 text-secondary" : "bg-primary/15 text-primary"}`}>
                    {u.role === "gestor" ? "Gestor(a)" : "Cuidador(a)"}
                  </span>
                </div>
              </div>
              <div className="flex gap-1.5">
                <button onClick={() => openEdit(i)} className="px-2.5 py-1.5 text-xs rounded-lg border-none bg-primary text-primary-foreground font-bold cursor-pointer">✏️</button>
                {!isSelf && <button onClick={() => deleteUser(i)} className="px-2.5 py-1.5 text-xs rounded-lg border-none bg-destructive text-destructive-foreground font-bold cursor-pointer">🗑️</button>}
              </div>
            </div>
          );
        })}
      </div>

      {/* New user modal */}
      {showNewUser && (
        <Modal onClose={() => setShowNewUser(false)} title="➕ Novo Usuário">
          <InputField label="Nome Completo"><input type="text" value={nuNome} onChange={(e) => setNuNome(e.target.value)} placeholder="Ex: Maria Silva" className={inputCls} /></InputField>
          <InputField label="Perfil">
            <select value={nuRole} onChange={(e) => setNuRole(e.target.value as any)} className={inputCls}><option value="cuidador">Cuidador(a)</option><option value="gestor">Gestor(a)</option></select>
          </InputField>
          <InputField label="Senha"><input type="password" value={nuSenha} onChange={(e) => setNuSenha(e.target.value)} placeholder="Mínimo 4 caracteres" className={inputCls} /></InputField>
          <div className="flex gap-2.5 mt-4">
            <button onClick={() => setShowNewUser(false)} className="flex-1 py-3.5 rounded-xl border-none cursor-pointer font-extrabold text-[15px] bg-border active:opacity-80">Cancelar</button>
            <button onClick={createUser} className="flex-1 py-3.5 rounded-xl border-none cursor-pointer font-extrabold text-[15px] bg-primary text-primary-foreground active:opacity-80">Criar</button>
          </div>
        </Modal>
      )}

      {/* Edit user modal */}
      {editIdx !== null && (
        <Modal onClose={() => setEditIdx(null)} title="✏️ Editar Usuário">
          <InputField label="Nome Completo"><input type="text" value={euNome} onChange={(e) => setEuNome(e.target.value)} className={inputCls} /></InputField>
          <InputField label="Perfil">
            <select value={euRole} onChange={(e) => setEuRole(e.target.value as any)} className={inputCls}><option value="cuidador">Cuidador(a)</option><option value="gestor">Gestor(a)</option></select>
          </InputField>
          <InputField label="Nova Senha (em branco = manter atual)"><input type="password" value={euSenha} onChange={(e) => setEuSenha(e.target.value)} placeholder="Opcional" className={inputCls} /></InputField>
          <div className="flex gap-2.5 mt-4">
            <button onClick={() => setEditIdx(null)} className="flex-1 py-3.5 rounded-xl border-none cursor-pointer font-extrabold text-[15px] bg-border active:opacity-80">Cancelar</button>
            <button onClick={saveEdit} className="flex-1 py-3.5 rounded-xl border-none cursor-pointer font-extrabold text-[15px] bg-primary text-primary-foreground active:opacity-80">Salvar</button>
          </div>
        </Modal>
      )}

      {/* Records */}
      <div className="bg-card rounded-2xl p-4 border border-border">
        <div className="flex justify-between items-center mb-3">
          <div className="text-sm font-extrabold text-primary">📋 Gerenciar Registros Clínicos</div>
          <span className="text-[11px] text-muted-foreground">{filteredRecs.length} registro(s)</span>
        </div>
        <div className="flex flex-col gap-1 mb-3">
          <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Filtrar por cuidador</label>
          <select value={filCare} onChange={(e) => setFilCare(e.target.value)} className={inputCls}>
            <option value="">Todos</option>
            {cuidadores.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        {filteredRecs.length === 0 ? (
          <p className="text-muted-foreground text-[13px] text-center py-4">Nenhum registro encontrado.</p>
        ) : (
          filteredRecs.map((r) => (
            <div key={r.id} className="bg-background rounded-xl p-3.5 px-4 border border-border mb-2.5">
              <div className="flex justify-between items-start flex-wrap gap-2">
                <div>
                  <span className="font-extrabold text-secondary text-sm">{fmtDate(r.date)}</span>
                  <span className="text-muted-foreground text-xs ml-2">👤 {r.caregiver}</span>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => openEditRec(r.id)} className="px-2.5 py-1.5 text-xs rounded-lg border-none bg-primary text-primary-foreground font-bold cursor-pointer">✏️ Editar</button>
                  <button onClick={() => deleteRec(r.id)} className="px-2.5 py-1.5 text-xs rounded-lg border-none bg-destructive text-destructive-foreground font-bold cursor-pointer">🗑️</button>
                </div>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                💧 {r.liquidos}ml · 🍴 {r.aceitacao}%{r.peso ? ` · ⚖️ ${r.peso}kg` : ""}{r.degluticao ? ` · 🗣️ ${r.degluticao}` : ""}
              </div>
              {r.humor && <div className="text-xs text-muted-foreground mt-1">🧠 {r.humor}</div>}
              <div className="mt-1.5 flex flex-wrap gap-0.5">
                {(r.alertas || []).map((a) => {
                  const info = ALERT_MAP[a];
                  return info ? (
                    <span key={a} className="inline-block rounded-full px-2 py-0.5 text-[11px] font-bold" style={{ background: `${info.color}22`, color: info.color, border: `1px solid ${info.color}44` }}>
                      ⚠ {info.label}
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit record modal */}
      {editRecId !== null && (
        <Modal onClose={() => setEditRecId(null)} title="✏️ Editar Registro">
          <InputField label="Data"><input type="date" value={erDate} onChange={(e) => setErDate(e.target.value)} className={inputCls} /></InputField>
          <InputField label="Cuidador"><input type="text" value={erCare} onChange={(e) => setErCare(e.target.value)} className={inputCls} /></InputField>
          {MEALS.map((m) => (
            <InputField key={m.key} label={`${m.label} (${m.hora})`}>
              <select value={erMeals[m.key] || ""} onChange={(e) => setErMeals({ ...erMeals, [m.key]: e.target.value })} className={inputCls}>
                <option value="">Selecione...</option>
                {(cardStrings[m.key] || []).map((op) => <option key={op} value={op}>{op}</option>)}
                <option value="Recusou">❌ Recusou</option>
                <option value="Aceitação parcial">⚠️ Aceitação parcial</option>
              </select>
            </InputField>
          ))}
          <div className="grid grid-cols-2 gap-3">
            <InputField label="Líquidos (ml)"><input type="number" value={erLiq || ""} onChange={(e) => setErLiq(Number(e.target.value))} className={inputCls} /></InputField>
            <InputField label="Aceitação (%)"><input type="number" value={erAceit || ""} onChange={(e) => setErAceit(Number(e.target.value))} className={inputCls} /></InputField>
          </div>
          <InputField label="Humor"><textarea value={erHumor} onChange={(e) => setErHumor(e.target.value)} rows={2} className={inputCls} /></InputField>
          <InputField label="Deglutição">
            <select value={erDeg} onChange={(e) => setErDeg(e.target.value)} className={inputCls}>
              <option value="">Selecione...</option><option>Normal</option><option>Lentidão</option><option>Tosse ocasional</option><option>Engasgos</option><option>Recusou comer</option>
            </select>
          </InputField>
          <InputField label="Peso (kg)"><input type="number" value={erPeso} onChange={(e) => setErPeso(e.target.value)} step={0.1} className={inputCls} /></InputField>
          <div className="flex gap-2.5 mt-4">
            <button onClick={() => setEditRecId(null)} className="flex-1 py-3.5 rounded-xl border-none cursor-pointer font-extrabold text-[15px] bg-border active:opacity-80">Cancelar</button>
            <button onClick={saveEditRec} className="flex-1 py-3.5 rounded-xl border-none cursor-pointer font-extrabold text-[15px] bg-primary text-primary-foreground active:opacity-80">Salvar</button>
          </div>
        </Modal>
      )}

      {/* Danger Zone */}
      <div className="bg-card rounded-2xl p-4 border border-border" style={{ borderLeft: "4px solid hsl(var(--destructive))" }}>
        <div className="text-sm font-extrabold text-destructive mb-3">🗑️ Zona de Perigo</div>
        <p className="text-[13px] text-muted-foreground mb-3.5">Apagar TODOS os registros clínicos do sistema. Esta ação não pode ser desfeita.</p>
        <button onClick={() => { if (confirm("⚠️ ATENÇÃO: Todos os registros serão apagados. Continuar?")) { setRecords([]); toast("🗑️ Todos os registros foram apagados."); } }}
          className="w-full py-3.5 rounded-xl border-none cursor-pointer font-extrabold text-[15px] bg-destructive text-destructive-foreground active:opacity-80">
          Apagar todos os registros
        </button>
      </div>
    </div>
  );
}

function Modal({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title: string }) {
  return (
    <div className="fixed inset-0 bg-black/55 z-[500] flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-card rounded-2xl p-6 w-full max-w-[480px] max-h-[92vh] overflow-y-auto" style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.22)" }}>
        <div className="text-[17px] font-black text-secondary mb-4">{title}</div>
        <div className="flex flex-col gap-3">{children}</div>
      </div>
    </div>
  );
}
