import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { usePluralization } from "@/shared/hooks";
import { useBreakpoints } from "@/shared/hooks/useBreakpoints";
import {
  Box,
  Paper,
  Stack,
  Typography,
  Button,
  Switch,
  FormControlLabel,
  IconButton,
  Tooltip,
  Alert,
  Divider,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import RefreshIcon from "@mui/icons-material/Refresh";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useGameStore } from "@/shared/stores/game-store";
import { getRandomWord, startGame as startGameApi } from "../api/api";
import { Input } from "@/shared";

// Separated style objects for clean mobile optimization
const desktopStyles = {
  container: { p: 2 },
  paper: { p: 3, borderRadius: 3 },
  spacing: 2,
  buttonSpacing: 1,
  gameId: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 2,
  },
  buttonContainer: {
    display: "flex",
    gap: 1,
    justifyContent: "flex-start",
  },
};

const mobileStyles = {
  container: { p: 1 },
  paper: { p: 2, borderRadius: 2 },
  spacing: 1.5,
  buttonSpacing: 0.5,
  gameId: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 1,
    flexWrap: "nowrap" as const,
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 1,
  },
};

export const StartGame = () => {
  const { t } = useTranslation();
  const { players, formatCount } = usePluralization();
  const { isMobile } = useBreakpoints();
  const game = useGameStore((s) => s.game);
  const setGame = useGameStore((s) => s.setGame);

  const [startWord, setStartWord] = useState("");
  const [isRandom, setIsRandom] = useState(false);
  const [randomWord, setRandomWord] = useState("");
  const [isCopying, setIsCopying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const styles = isMobile ? mobileStyles : desktopStyles;

  const playersCount = useMemo(
    () => game?.players?.length ?? 0,
    [game?.players]
  );
  const canStartByPlayers = playersCount >= 2;

  const effectiveWord = isRandom ? randomWord : startWord.trim();
  const canStart = canStartByPlayers && effectiveWord.length > 0 && !loading;

  useEffect(() => {
    if (isRandom) {
      regenerateRandomWord();
    }
  }, [isRandom]);

  if (!game) return null;

  const regenerateRandomWord = async () => {
    try {
      const w = await getRandomWord();
      setRandomWord(w);
    } catch (e: any) {
      setError(e?.message || t("game.randomWordError"));
    }
  };

  const handleCopyId = async () => {
    try {
      setIsCopying(true);
      await navigator.clipboard.writeText(game.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    } finally {
      setIsCopying(false);
    }
  };

  const handleStartGame = async () => {
    if (!canStart || !game) return;
    setError(null);
    setLoading(true);
    try {
      const updated = await startGameApi(game.id, effectiveWord);
      setGame(updated);
    } catch (e: any) {
      setError(e?.message || t("game.startGameError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={styles.container}>
      <Paper elevation={2} sx={styles.paper}>
        <Stack spacing={styles.spacing}>
          <Typography variant="h5" fontWeight={700}>
            {t("game.gameSetup")}
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={styles.spacing}
            alignItems={{ sm: "center" }}
            justifyContent="space-between"
            sx={styles.gameId}
          >
            <Box sx={{ 
              minWidth: 0, // Allow text to shrink
              flex: 1,
              maxWidth: isMobile ? '70%' : 'none',
            }}>
              <Typography variant="body2" color="text.secondary">
                {t("game.gameId")}
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  wordBreak: "break-all",
                  fontSize: isMobile ? '1rem' : '1.25rem',
                  lineHeight: 1.2,
                }}
              >
                {game.id}
              </Typography>
            </Box>

            <Box sx={{ flexShrink: 0 }}>
              <Tooltip title={copied ? t("game.copied") : t("game.copyGameId")}>
                <span>
                  <IconButton 
                    onClick={handleCopyId} 
                    disabled={isCopying}
                    size={isMobile ? "small" : "medium"}
                    sx={{
                      minWidth: 40,
                      minHeight: 40,
                    }}
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
          </Stack>

          <Divider />

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={styles.spacing}
            alignItems={{ sm: "center" }}
            justifyContent="space-between"
          >
            <Typography color="text.secondary">
              {t("game.playersLabel")}:{" "}
              <b>{formatCount(playersCount, players)}</b>
            </Typography>
            {!canStartByPlayers && (
              <Typography variant="body2" color="warning.main">
                {t("game.atLeastTwoPlayers")}
              </Typography>
            )}
          </Stack>

          <Stack spacing={1.5}>
            <FormControlLabel
              control={
                <Switch
                  checked={isRandom}
                  onChange={(e) => setIsRandom(e.target.checked)}
                />
              }
              label={t("game.startGame.randomStartWord")}
            />

            {!isRandom ? (
              <Input
                label={t("game.startGame.startWord")}
                placeholder={t("game.startGame.startWordPlaceholder")}
                value={startWord}
                onChange={(e) => setStartWord(e.target.value)}
                fullWidth
              />
            ) : (
              <Stack direction="row" spacing={styles.buttonSpacing} alignItems="center">
                <Input
                  label={t("game.startGame.randomWord")}
                  value={randomWord}
                  InputProps={{ readOnly: true }}
                  fullWidth
                />
                <Tooltip title={t("game.startGame.regenerate")}>
                  <span>
                    <IconButton onClick={regenerateRandomWord}>
                      <RefreshIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              </Stack>
            )}
          </Stack>

          {error && <Alert severity="error">{error}</Alert>}

          <Box sx={styles.buttonContainer}>
            <Button
              variant="contained"
              startIcon={<PlayArrowIcon />}
              onClick={handleStartGame}
              disabled={!canStart}
              sx={{
                maxWidth: isMobile ? '100%' : 200,
                minWidth: isMobile ? '100%' : 150,
              }}
            >
              {t("game.startGameButton")}
            </Button>
            {!canStartByPlayers && (
              <Button 
                variant="outlined" 
                disabled
                sx={{
                  maxWidth: isMobile ? '100%' : 200,
                  minWidth: isMobile ? '100%' : 150,
                }}
              >
                {t("game.waitForPlayers")}
              </Button>
            )}
          </Box>

          <Typography variant="body2" color="text.secondary">
            {t("game.shareGameId")}
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
};
