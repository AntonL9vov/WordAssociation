import { SocketService } from "../api/socket";
import { create } from "zustand";

interface SocketStore {
  socket: SocketService | null;
  setSocket: (socket: SocketService | null) => void;
}

export const useSocketStore = create<SocketStore>((set) => ({
  socket: null,
  setSocket: (socket) => set({ socket }),
}));
