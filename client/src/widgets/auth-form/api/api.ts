import { api, User } from "@/shared";

export const playerConnect = async (name: string): Promise<User> => {
  try {
    const response = await api.post<{ user: User }>("/users", {
      name,
    });
    return response.user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};
