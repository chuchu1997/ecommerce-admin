import { useAuthContext } from "@/providers/auth";

export const useAuth = () => {
  const context = useAuthContext();
  return context;
};
