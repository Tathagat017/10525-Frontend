import { UserRole } from "./user";

export interface LoginPayload {
  email: string;
  password: string;
  role: UserRole;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  profilePictureUrl: string;
  role: UserRole;
  bio?: string;
  startup_name?: string;
  industries_interested_in?: string[];
}
