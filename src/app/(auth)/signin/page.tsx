import { SignInForm } from "@/app/(auth)/signin/_components/sign-in-form";
import Logo from "@/components/logo";

export default function SignInPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Logo />
        </div>
        <div className="flex-center flex-1">
          <div className="w-full max-w-xs">
            <SignInForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        {/* <img
          src="/placeholder.svg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        /> */}
      </div>
    </div>
  );
}
