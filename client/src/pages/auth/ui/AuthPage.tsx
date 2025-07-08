import { useNavigate } from "react-router-dom";
import { AuthForm } from "@/widgets/auth-form";
import { useAuth } from "@/shared/context/AuthContext";
import { User } from "@/shared/lib/types";

export const AuthPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleAuthSuccess = (user: User) => {
    login(user);

    navigate("/");
  };

  return <AuthForm onAuthSuccess={handleAuthSuccess} />;
};
