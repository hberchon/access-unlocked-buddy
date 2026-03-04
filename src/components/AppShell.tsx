import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import Dashboard from "@/components/Dashboard";
import RegistroDiario from "@/components/RegistroDiario";
import CardapioView from "@/components/CardapioView";
import CardapioGestor from "@/components/CardapioGestor";
import AdminPanel from "@/components/AdminPanel";
import { toast } from "sonner";

type Tab = "dashboard" | "registro" | "cardapio" | "cardapio-gestor" | "admin";

export default function AppShell() {
  const { currentUser, logout } = useApp();
  const isGestor = currentUser?.role === "gestor";
  const [tab, setTab] = useState<Tab>(isGestor ? "dashboard" : "registro");

  const navItems: { id: Tab; icon: string; label: string; show: boolean }[] = [
    { id: "dashboard", icon: "📊", label: "Dashboard", show: true },
    { id: "registro", icon: "📋", label: "Registro", show: !isGestor },
    { id: "cardapio", icon: "🍽️", label: "Cardápio", show: !isGestor },
    { id: "cardapio-gestor", icon: "📝", label: "Cardápio", show: isGestor },
    { id: "admin", icon: "⚙️", label: "Admin", show: isGestor },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* TopBar */}
      <div className="bg-secondary px-3.5 flex items-center sticky top-0 z-50 topbar-shadow min-h-[56px] gap-2">
        <div className="flex items-center gap-2 flex-1">
          <span className="text-[22px]">🌿</span>
          <strong className="text-secondary-foreground text-base font-black">CuidarBem</strong>
          <small className="text-secondary-foreground/40 text-[11px] ml-1">Isolda</small>
        </div>
        <span className="text-secondary-foreground/70 text-xs whitespace-nowrap overflow-hidden text-ellipsis max-w-[100px]">
          👤 {currentUser?.name}
        </span>
        <button
          onClick={logout}
          className="bg-secondary-foreground/10 border-none text-secondary-foreground/70 px-3 py-1.5 rounded-lg cursor-pointer text-xs font-medium"
        >
          Sair
        </button>
      </div>

      {/* Content */}
      <div className="px-4 pb-24 pt-4 max-w-[700px] mx-auto">
        {tab === "dashboard" && <Dashboard />}
        {tab === "registro" && <RegistroDiario />}
        {tab === "cardapio" && <CardapioView />}
        {tab === "cardapio-gestor" && <CardapioGestor />}
        {tab === "admin" && <AdminPanel />}
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-secondary flex z-50 topbar-shadow" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
        {navItems.filter((n) => n.show).map((n) => (
          <button
            key={n.id}
            onClick={() => setTab(n.id)}
            className={`flex-1 py-2.5 px-0.5 pb-2 border-none bg-transparent text-[10px] font-bold cursor-pointer flex flex-col items-center gap-1 transition-all ${
              tab === n.id ? "text-primary-light" : "text-secondary-foreground/45"
            }`}
          >
            <span className={`text-xl ${tab === n.id ? "scale-110" : ""} transition-transform`}>{n.icon}</span>
            {n.label}
          </button>
        ))}
      </div>
    </div>
  );
}
