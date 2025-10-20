import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { AuthFormFields, AuthFormFeatures } from "@/entities";
import { Box } from "@mui/material";
import { User } from "@/shared/lib/types";

interface AuthFormProps {
  onSubmit: (playerName: string) => Promise<User>;
  onSuccess: (user: User) => void;
}

export const AuthFormBody: React.FC<AuthFormProps> = ({
  onSubmit,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const [playerName, setPlayerName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!playerName.trim()) {
      setError(t("auth.enterNameError"));
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const user = await onSubmit(playerName.trim());
      onSuccess(user);
    } catch (err) {
      setError(t("auth.connectionError"));
      setIsLoading(false);
    }
  };

  const features = [
    t("auth.features.realtime"),
    t("auth.features.wordFun"),
    t("auth.features.chat"),
    t("auth.features.endless"),
  ];

  return (
    <>
      <AuthFormFeatures features={features} />
      <Box sx={{ mt: 4 }}>
        <AuthFormFields
          playerName={playerName}
          isLoading={isLoading}
          error={error}
          onPlayerNameChange={setPlayerName}
          onSubmit={handleSubmit}
        />
      </Box>
    </>
  );
};
