import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { User, RecordData, CardapioOption } from "@/lib/data";
import * as store from "@/lib/store";

interface AppState {
  currentUser: (User & { idx: number }) | null;
  users: User[];
  records: RecordData[];
  cardapio: Record<string, CardapioOption[]>;
  metaKcal: { min: number; max: number };
  loading: boolean;
  login: (name: string, password: string) => Promise<string | null>;
  logout: () => void;
  setUsers: (u: User[]) => void;
  setRecords: (r: RecordData[]) => void;
  setCardapio: (c: Record<string, CardapioOption[]>) => void;
  setMetaKcal: (m: { min: number; max: number }) => void;
  saveRecord: (r: RecordData) => Promise<RecordData>;
  deleteRecord: (id: number) => Promise<void>;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<(User & { idx: number }) | null>(null);
  const [users, setUsersState] = useState<User[]>([]);
  const [records, setRecordsState] = useState<RecordData[]>([]);
  const [cardapio, setCardapioState] = useState<Record<string, CardapioOption[]>>({});
  const [metaKcal, setMetaKcalState] = useState({ min: 1600, max: 1800 });
  const [loading, setLoading] = useState(true);

  const refreshData = useCallback(async () => {
    const [u, r, c, m] = await Promise.all([
      store.loadUsers(),
      store.loadRecords(),
      store.loadCardapio(),
      store.loadMetaKcal(),
    ]);
    setUsersState(u);
    setRecordsState(r);
    setCardapioState(c);
    setMetaKcalState(m);
  }, []);

  useEffect(() => {
    refreshData().finally(() => setLoading(false));
  }, [refreshData]);

  const login = useCallback(async (name: string, password: string): Promise<string | null> => {
    if (!name.trim()) return "Digite seu nome.";
    // Reload users from DB to get latest
    const freshUsers = await store.loadUsers();
    setUsersState(freshUsers);
    const idx = freshUsers.findIndex((u) => u.name.toLowerCase() === name.trim().toLowerCase());
    if (idx < 0) return "Nome não encontrado.";
    if (password !== freshUsers[idx].password) return "Senha incorreta.";
    setCurrentUser({ ...freshUsers[idx], idx });
    return null;
  }, []);

  const logout = useCallback(() => setCurrentUser(null), []);

  const setUsers = useCallback((u: User[]) => {
    setUsersState(u);
    store.saveUsers(u);
  }, []);

  const setRecords = useCallback((r: RecordData[]) => {
    setRecordsState(r);
  }, []);

  const saveRecord = useCallback(async (record: RecordData): Promise<RecordData> => {
    const saved = await store.saveRecord(record);
    // Refresh records from DB
    const fresh = await store.loadRecords();
    setRecordsState(fresh);
    return saved;
  }, []);

  const deleteRecordFn = useCallback(async (id: number) => {
    await store.deleteRecord(id);
    const fresh = await store.loadRecords();
    setRecordsState(fresh);
  }, []);

  const setCardapio = useCallback((c: Record<string, CardapioOption[]>) => {
    setCardapioState(c);
    store.saveCardapio(c);
  }, []);

  const setMetaKcalVal = useCallback((m: { min: number; max: number }) => {
    setMetaKcalState(m);
    store.saveMetaKcal(m);
  }, []);

  return (
    <AppContext.Provider value={{
      currentUser, users, records, cardapio, metaKcal, loading,
      login, logout, setUsers, setRecords, setCardapio,
      setMetaKcal: setMetaKcalVal, saveRecord, deleteRecord: deleteRecordFn, refreshData
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
}
