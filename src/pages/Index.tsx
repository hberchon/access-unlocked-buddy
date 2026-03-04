import { useApp } from "@/contexts/AppContext";
import LoginScreen from "@/components/LoginScreen";
import AppShell from "@/components/AppShell";

const Index = () => {
  const { currentUser } = useApp();
  return currentUser ? <AppShell /> : <LoginScreen />;
};

export default Index;
