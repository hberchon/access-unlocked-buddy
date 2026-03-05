import { useApp } from "@/contexts/AppContext";
import LoginScreen from "@/components/LoginScreen";
import AppShell from "@/components/AppShell";

const Index = () => {
  const { currentUser, loading } = useApp();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-4xl mb-3">🍽️</div>
          <div className="text-lg font-bold text-primary">Carregando...</div>
        </div>
      </div>
    );
  }

  return currentUser ? <AppShell /> : <LoginScreen />;
};

export default Index;
