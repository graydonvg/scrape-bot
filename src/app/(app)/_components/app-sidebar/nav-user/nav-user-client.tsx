"use client";

import { ChevronsUpDownIcon, LogOutIcon, UserCircle2Icon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { createSupabaseBrowserClient } from "@/lib/supabase/supabase-browser";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useLogger } from "next-axiom";
import { UserDb } from "@/lib/types/user";
import UserMenuLabel from "./user-menu-label";
import { ThemeMenu } from "@/components/theme-menu";
import { getUserAvatarFallbackChars, getUsername } from "@/lib/utils";
import Link from "next/link";

type Props = {
  user: UserDb;
};

export function NavUserClient({ user }: Props) {
  const log = useLogger();
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const userName = getUsername(user);
  const avatarFallbackChars = getUserAvatarFallbackChars(user);

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <UserMenuLabel
                  user={user}
                  userName={userName}
                  avatarFallbackChars={avatarFallbackChars}
                />
                <ChevronsUpDownIcon className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              side="top"
              sideOffset={4}
              className="ml-2 min-w-[calc(16rem-(--spacing(4)))]"
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <UserMenuLabel
                    user={user}
                    userName={userName}
                    avatarFallbackChars={avatarFallbackChars}
                  />
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <Link href="/account">
                  <DropdownMenuItem>
                    <UserCircle2Icon />
                    Account settings
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <ThemeMenu />
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOutIcon />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  );

  async function handleSignOut() {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        log.error("Signout error", { error });
        toast.error("Failed to sign out. An unexpected error occured.");
      } else {
        router.refresh();
      }
    } catch (error) {
      log.error("Signout error", { error });
      toast.error("Failed to sign out. An unexpected error occured.");
    }
  }
}
