"use client";

import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/supabase-browser";
import { Button } from "./ui/button";

export default function SignOutButton() {
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      // redirect("/error");
    } else {
      router.refresh();
    }
  }

  return (
    <Button onClick={handleSignOut} className="capitalize">
      sign out
    </Button>
  );
}
