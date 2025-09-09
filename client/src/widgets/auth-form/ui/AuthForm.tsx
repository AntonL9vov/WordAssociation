import React from "react";
import { playerConnect } from "../api/api";
import { User } from "@/shared/lib/types";
import { AuthFormCard } from "@/entities/auth-form";
import { AuthHeader, AuthForm as AuthFormFeature } from "@/features/auth";

interface AuthFormWidgetProps {
  onAuthSuccess: (user: User) => void;
}

export const AuthForm: React.FC<AuthFormWidgetProps> = ({ onAuthSuccess }) => {
  return (
    <AuthFormCard>
      <AuthHeader />
      <AuthFormFeature
        onSubmit={playerConnect}
        onSuccess={onAuthSuccess}
      />
    </AuthFormCard>
  );
};
