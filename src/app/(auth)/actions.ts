"use server";

import { createSupabaseServerClient } from "@/lib/supabase/supabase-server";
import { signinSchema } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type FormState = {
  message?: string;
  fields?: Record<string, string>;
  issues?: string[];
};

export async function signinAction(prevState: FormState, data: FormData) {
  const supabase = createSupabaseServerClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs

  const formData = Object.fromEntries(data);
  const parsed = signinSchema.safeParse(formData);
  console.log(formData);

  if (!parsed.success) {
    const fields: Record<string, string> = {};

    for (const key of Object.keys(formData)) {
      fields[key] = formData[key].toString();
    }

    return {
      message: "Invalid form data",
      fields,
      issues: parsed.error.issues.map((issue) => issue.message),
    };
  }

  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return {
      message: "Signin failed",
      fields: parsed.data,
    };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

// export async function signupAction(formData: FormData) {
//   const supabase = createSupabaseServerClient();

//   // type-casting here for convenience
//   // in practice, you should validate your inputs
//   const data = {
//     email: formData.get("email") as string,
//     password: formData.get("password") as string,
//   };

//   const { error } = await supabase.auth.signUp(data);

//   if (error) {
//     console.log(error);
//     redirect("/error");
//   }

//   revalidatePath("/", "layout");
//   redirect("/");
// }
