import React, { useState, useEffect, useRef } from "react";
import { Box } from "@mui/material";
import { MessengerTextField } from "./MessengerTextField";
import { MessengerButton } from "./MessengerButton";

interface MessengerInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export const MessengerInput: React.FC<MessengerInputProps> = ({
  onSend,
  disabled = false,
}) => {
  const [message, setMessage] = useState("");
  const [isSendDisabled, setIsSendDisabled] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (!message.trim() || disabled) return;

    onSend(message.trim());
    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    setIsSendDisabled(message.trim() === "" || disabled);
  }, [message, disabled]);

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        alignItems: "flex-end",
        width: "100%",
      }}
    >
      <MessengerTextField
        inputRef={inputRef}
        isInputDisabled={disabled}
        message={message}
        setMessage={setMessage}
        handleKeyPress={handleKeyPress}
      />

      <MessengerButton
        handleSend={handleSend}
        isSendDisabled={isSendDisabled}
      />
    </Box>
  );
};
