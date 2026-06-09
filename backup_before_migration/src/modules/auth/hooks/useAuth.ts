import { useContext } from "react";
import { AuthContextType } from "../context/auth.types";
import { AuthContext } from "../context/AuthContext";

/**
 * Hook to access authentication context
 * Returns safe defaults if AuthProvider is not found
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("AuthProvider not found");
  }
  return context;
};
