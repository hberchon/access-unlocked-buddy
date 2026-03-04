import { useState } from "react";
import { useApp } from "@/contexts/AppContext";

export default function LoginScreen() {
  const { login } = useApp();
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    const err = login(name, pass);
    if (err) setError(err);
    else setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center login-gradient p-5">
      <div className="w-full max-w-[360px]">
        <div className="text-center mb-7">
          <div className="text-6xl">🌿</div>
          <h1 className="text-[28px] font-black tracking-tight mt-2 text-primary-foreground">CuidarBem</h1>
          <p className="text-sm mt-1.5 text-primary-foreground/65">Sistema de Monitoramento — Isolda</p>
        </div>
        <div className="bg-card rounded-2xl p-7 card-shadow border border-border">
          <div className="flex flex-col gap-1.5 mb-3.5">
            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Profissional</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && document.getElementById("lpass")?.focus()}
              placeholder="Digite seu nome"
              className="px-3.5 py-3 rounded-[10px] border-[1.5px] border-border text-sm bg-background outline-none focus:border-primary-light w-full"
            />
          </div>
          <div className="flex flex-col gap-1.5 mb-3.5">
            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Senha</label>
            <input
              id="lpass"
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="Digite sua senha"
              className="px-3.5 py-3 rounded-[10px] border-[1.5px] border-border text-sm bg-background outline-none focus:border-primary-light w-full"
            />
          </div>
          {error && (
            <div className="text-destructive text-[13px] mb-2.5 p-2 px-3 bg-destructive/10 rounded-lg">{error}</div>
          )}
          <button onClick={handleLogin} className="w-full py-3.5 rounded-xl border-none cursor-pointer font-extrabold text-[15px] bg-primary text-primary-foreground active:opacity-80 transition-opacity">
            Entrar →
          </button>
        </div>
      </div>
    </div>
  );
}
