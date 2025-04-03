import { Button } from "@/components/ui/button";
import createSupabaseServerClient from "@/lib/supabase/supabase-server";
import Link from "next/link";

export default async function NavbarButtons() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user)
    return (
      <Link href="/dashboard">
        <Button size="sm">Dashboard</Button>
      </Link>
    );

  return (
    <Link href="/signin">
      <Button size="sm">Sign in</Button>
    </Link>
  );
}
