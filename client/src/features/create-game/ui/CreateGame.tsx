import { EnterGameForm } from "@/entities";

export type CreateGameProps = {
  onJoinGame: (name: string) => void;
};

export const CreateGame = ({ onJoinGame }: CreateGameProps) => {
  return (
    <div>
      <EnterGameForm
        withGameId={false}
        onJoinGame={onJoinGame}
        buttonLabel="Create game"
      />
    </div>
  );
};
