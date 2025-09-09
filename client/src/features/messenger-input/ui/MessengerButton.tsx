import { Box, Button } from "@mui/material";
import { Send as SendIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

interface MessengerButtonProps {
  handleSend: () => void;
  isSendDisabled: boolean;
}

export const MessengerButton = ({
  handleSend,
  isSendDisabled,
}: MessengerButtonProps) => {
  const { t } = useTranslation();
  return (
    <Button
      variant="contained"
      onClick={handleSend}
      disabled={isSendDisabled}
      startIcon={<SendIcon />}
      sx={{
        minWidth: "auto",
        px: 2,
        py: 1.5,
        height: "100%",
        background:
          "linear-gradient(135deg, var(--primary-500), var(--primary-600))",
        "&:hover": {
          background:
            "linear-gradient(135deg, var(--primary-600), var(--primary-700))",
          transform: "translateY(-1px)",
        },
        "&:disabled": {
          background: "var(--neutral-300)",
          color: "var(--text-muted)",
          transform: "none",
        },
        "@media (max-width: 600px)": {
          minWidth: "48px",
          px: 1,
          "& .MuiButton-startIcon": {
            margin: 0,
          },
          "& .MuiButton-startIcon + *": {
            display: "none",
          },
        },
      }}
    >
      <Box sx={{ display: { xs: "none", sm: "block" } }}>
        {t("messenger.send")}
      </Box>
    </Button>
  );
};
