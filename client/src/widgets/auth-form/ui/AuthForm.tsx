import React from "react";
import { playerConnect } from "../api/api";
import { User } from "@/shared";
import { AuthFormCard } from "@/entities/auth-form";
import { AuthHeader, AuthFormBody } from "@/features";

interface AuthFormWidgetProps {
  onAuthSuccess: (user: User) => void;
}

export const AuthForm: React.FC<AuthFormWidgetProps> = ({ onAuthSuccess }) => {
  return (
    <AuthFormCard>
      <AuthHeader />
      <AuthFormBody
        onSubmit={playerConnect}
        onSuccess={onAuthSuccess}
      />
    </AuthFormCard>
  );
};
