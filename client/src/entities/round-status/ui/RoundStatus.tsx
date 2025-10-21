import { useTranslation } from "react-i18next";
import { Box, Typography, Zoom } from "@mui/material";
import { PlayArrow as PlayIcon } from "@mui/icons-material";
interface RoundStatusProps {
  roundNumber: number;
}

export const RoundStatus = ({ roundNumber }: RoundStatusProps) => {
  const { t } = useTranslation();
  return (
    <Zoom in timeout={{ enter: 400, exit: 200 }} unmountOnExit appear>
      <Box
        sx={{
          p: 2,
          backgroundColor: "var(--primary-50)",
          border: "2px dashed var(--primary-300)",
          borderRadius: "var(--radius-lg)",
          textAlign: "center",
          mt: 2,
        }}
      >
        <Typography
          variant="body2"
          fontWeight={500}
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap={1}
          color="var(--primary-700)"
        >
          <PlayIcon
            fontSize="small"
            sx={{ color: "var(--primary-600)", mr: 0.5 }}
            aria-hidden
          />{" "}
          {t("messenger.round")} {roundNumber} -{" "}
          {t("messenger.waitingForWords")}
        </Typography>
      </Box>
    </Zoom>
  );
};
