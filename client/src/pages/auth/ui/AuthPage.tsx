import { AuthForm } from "@/widgets";
import { useAuth } from "@/shared";
import { User } from "@/shared";

export const AuthPage = () => {
  const { login } = useAuth();

  const handleAuthSuccess = (user: User) => {
    login(user);
  };

  return <AuthForm onAuthSuccess={handleAuthSuccess} />;
};
