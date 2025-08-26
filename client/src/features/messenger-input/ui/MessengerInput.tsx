import React, { useState, useEffect, useRef } from "react";
import { Button, Box } from "@mui/material";
import { Send as SendIcon } from "@mui/icons-material";
import { MessengerTextField } from "./MessengerTextField";
import { MessengerButton } from "./MessengerButton";

interface MessengerInputProps {
  onSend: (message: string) => void;
  isInputDisabled?: boolean;
}

export const MessengerInput: React.FC<MessengerInputProps> = ({
  onSend,
  isInputDisabled = false,
}) => {
  const [message, setMessage] = useState("");
  const [isSendDisabled, setIsSendDisabled] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (!message.trim() || isInputDisabled) return;

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
    setIsSendDisabled(message.trim() === "" || isInputDisabled);
  }, [message, isInputDisabled]);

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
        isInputDisabled={isInputDisabled}
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
