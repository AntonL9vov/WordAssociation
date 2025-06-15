import { TextField, Button } from "@mui/material";
import "./style.css";
import { useState, useEffect } from "react";

interface MessengerInputProps {
  onSend: (message: string) => void;
  isInputDisabled?: boolean;
}

export const MessengerInput = ({
  onSend,
  isInputDisabled,
}: MessengerInputProps) => {
  const [message, setMessage] = useState("");

  const [isSendDisabled, setIsSendDisabled] = useState(true);

  const handleSend = () => {
    onSend(message);
    setMessage("");
  };

  useEffect(() => {
    setIsSendDisabled(message.trim() === "");
  }, [message]);

  return (
    <div className="messenger-input">
      <TextField
        label="Message"
        variant="outlined"
        fullWidth
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={isInputDisabled}
      />
      <Button
        variant="contained"
        onClick={handleSend}
        disabled={isSendDisabled}
      >
        Send
      </Button>
    </div>
  );
};
