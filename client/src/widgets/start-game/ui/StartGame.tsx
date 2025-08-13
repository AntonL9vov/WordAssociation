import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Paper,
  Stack,
  Typography,
  TextField,
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

export const StartGame = () => {
  const game = useGameStore((s) => s.game);
  const setGame = useGameStore((s) => s.setGame);

  const [startWord, setStartWord] = useState("");
  const [isRandom, setIsRandom] = useState(false);
  const [randomWord, setRandomWord] = useState("");
  const [isCopying, setIsCopying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setError(e?.message || "Не удалось получить случайное слово");
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
      setError(e?.message || "Не удалось начать игру");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={2}>
      <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
        <Stack spacing={2}>
          <Typography variant="h5" fontWeight={700}>
            Game setup
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems={{ sm: "center" }}
            justifyContent="space-between"
          >
            <Stack spacing={0.5}>
              <Typography variant="body2" color="text.secondary">
                Game ID
              </Typography>
              <Typography variant="h6" sx={{ wordBreak: "break-all" }}>
                {game.id}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <Tooltip title={copied ? "Скопировано!" : "Скопировать ID"}>
                <span>
                  <IconButton onClick={handleCopyId} disabled={isCopying}>
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
            </Stack>
          </Stack>

          <Divider />

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems={{ sm: "center" }}
            justifyContent="space-between"
          >
            <Typography color="text.secondary">
              Players: <b>{playersCount}</b>
            </Typography>
            {!canStartByPlayers && (
              <Typography variant="body2" color="warning.main">
                At least two players needed
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
              label="Random start word"
            />

            {!isRandom ? (
              <TextField
                label="Start word"
                placeholder="Enter start word"
                value={startWord}
                onChange={(e) => setStartWord(e.target.value)}
                fullWidth
              />
            ) : (
              <Stack direction="row" spacing={1} alignItems="center">
                <TextField
                  label="Random word"
                  value={randomWord}
                  InputProps={{ readOnly: true }}
                  fullWidth
                />
                <Tooltip title="Regenerate">
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

          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              startIcon={<PlayArrowIcon />}
              onClick={handleStartGame}
              disabled={!canStart}
            >
              Start game
            </Button>
            {!canStartByPlayers && (
              <Button variant="outlined" disabled>
                Wait for other players
              </Button>
            )}
          </Stack>

          <Typography variant="body2" color="text.secondary">
            Share game ID with your friend
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
};
