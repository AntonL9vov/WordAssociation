import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";
import { Box, Paper, Stack, Typography, Button } from "@mui/material";

export const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 3,
        background:
          "radial-gradient(1000px 400px at 50% -20%, rgba(59,130,246,0.08), transparent), linear-gradient(to bottom right, rgba(0,0,0,0.02), rgba(0,0,0,0.04))",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 560,
          textAlign: "center",
          p: { xs: 2.5, sm: 4 },
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          backdropFilter: "blur(6px)",
          backgroundColor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(17,24,39,0.6)"
              : "rgba(255,255,255,0.7)",
          boxShadow: (theme) => theme.shadows[3],
        }}
      >
        <Stack spacing={{ xs: 1.5, sm: 2.5 }} alignItems="center">
          <Typography
            component="div"
            sx={{
              fontSize: { xs: 56, sm: 80 },
              fontWeight: 800,
              letterSpacing: 2,
              color: "text.primary",
              lineHeight: 1,
            }}
          >
            404
          </Typography>

          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: "text.primary" }}
          >
            {t("pages.pageNotFound")}
          </Typography>

          <Typography variant="body1" color="text.secondary">
            {t("pages.pageNotFoundDescription")}
          </Typography>

          <Button
            variant="contained"
            color="primary"
            component={RouterLink}
            to="/"
            sx={{
              mt: 0.5,
              px: 2,
              py: 1,
              borderRadius: 1.25,
              boxShadow: (theme) => theme.shadows[4],
            }}
          >
            {t("actions.goHome")}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};
