"use server";

import createSupabaseServerClient from "@/lib/supabase/supabase-server";

export default async function getWorkflowsAction() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthenticated");
  }

  const { data, error } = await supabase
    .from("workflows")
    .select("*")
    .eq("userId", user?.id ?? "")
    .order("createdAt", { ascending: true });

  if (error) {
    throw new Error("Failed to get workflows");
  }

  // revalidatePath("/workflows", "page");
  return data;
}
