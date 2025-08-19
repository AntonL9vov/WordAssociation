import { api } from "@/shared/api/api";

export const deleteUser = async (id: string) => {
  const response = await api.delete(`/users/${id}`);
  return response;
};
