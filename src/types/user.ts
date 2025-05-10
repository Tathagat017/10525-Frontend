import { Founder } from "./founder";
import { Investor } from "./investor";

export type User = Founder | Investor;
export type UserRole = "founder" | "investor";
