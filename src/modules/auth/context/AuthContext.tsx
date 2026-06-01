import { createContext } from "react";
import { AuthContextType } from "./auth.types";

/**
 * Authentication Context
 * Provides authentication state and methods throughout the application
 */
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
