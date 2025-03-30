import { Database } from "../supabase/database.types";

export type CredentialDb = Database["public"]["Tables"]["credentials"]["Row"];
