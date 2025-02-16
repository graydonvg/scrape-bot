import createSupabaseServerClient from "@/lib/supabase/supabase-server";

export default async function getWorkflows() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("workflows")
    .select("*")
    .eq("userId", user?.id ?? "")
    .order("createdAt", { ascending: true });

  if (error) {
    return null;
  }

  return data;
}
