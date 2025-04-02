import { Database } from "../supabase/database.types";

export type UserDb = Omit<
  Database["public"]["Tables"]["users"]["Row"],
  "updatedAt" | "userId" | "reservedCredits"
>;
