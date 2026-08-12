import type { UserRole } from "../../src/shared/types/roles";

export type PersonaRole = UserRole;

export interface PersonaSeed {
  email: string;
  password: string;
  role: PersonaRole;
  name: string;
  status: "active" | "pending";
  sponsorId?: string;
}

export interface CreatedPersona {
  email: string;
  password: string;
  role: PersonaRole;
  authUserId: string;
  customerId: string;
}
