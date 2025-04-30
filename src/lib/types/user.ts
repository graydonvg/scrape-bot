import { Database } from "../supabase/database.types";

export interface UserDb
  extends Omit<
    Database["public"]["Tables"]["users"]["Row"],
    "updatedAt" | "userId"
  > {
  provider?: string;
}
