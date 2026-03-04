import React, { createContext, useContext, useState, useCallback } from "react";
import { User, RecordData, CardapioOption } from "@/lib/data";
import { loadUsers, saveUsers, loadRecords, saveRecords, loadCardapio, saveCardapio, loadMetaKcal, saveMetaKcal } from "@/lib/store";

interface AppState {
  currentUser: (User & { idx: number }) | null;
  users: User[];
  records: RecordData[];
  cardapio: Record<string, CardapioOption[]>;
  metaKcal: { min: number; max: number };
  login: (name: string, password: string) => string | null;
  logout: () => void;
  setUsers: (u: User[]) => void;
  setRecords: (r: RecordData[]) => void;
  setCardapio: (c: Record<string, CardapioOption[]>) => void;
  setMetaKcal: (m: { min: number; max: number }) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<(User & { idx: number }) | null>(null);
  const [users, setUsersState] = useState<User[]>(() => loadUsers());
  const [records, setRecordsState] = useState<RecordData[]>(() => loadRecords());
  const [cardapio, setCardapioState] = useState(() => loadCardapio());
  const [metaKcal, setMetaKcalState] = useState(() => loadMetaKcal());

  const login = useCallback((name: string, password: string): string | null => {
    if (!name.trim()) return "Digite seu nome.";
    const idx = users.findIndex((u) => u.name.toLowerCase() === name.trim().toLowerCase());
    if (idx < 0) return "Nome não encontrado.";
    if (password !== users[idx].password) return "Senha incorreta.";
    setCurrentUser({ ...users[idx], idx });
    return null;
  }, [users]);

  const logout = useCallback(() => setCurrentUser(null), []);

  const setUsers = useCallback((u: User[]) => { setUsersState(u); saveUsers(u); }, []);
  const setRecords = useCallback((r: RecordData[]) => { setRecordsState(r); saveRecords(r); }, []);
  const setCardapio = useCallback((c: Record<string, CardapioOption[]>) => { setCardapioState(c); saveCardapio(c); }, []);
  const setMetaKcalVal = useCallback((m: { min: number; max: number }) => { setMetaKcalState(m); saveMetaKcal(m); }, []);

  return (
    <AppContext.Provider value={{ currentUser, users, records, cardapio, metaKcal, login, logout, setUsers, setRecords, setCardapio, setMetaKcal: setMetaKcalVal }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
}
