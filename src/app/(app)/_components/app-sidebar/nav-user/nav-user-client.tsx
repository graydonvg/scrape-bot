"use client";

import {
  BadgeCheckIcon,
  BellIcon,
  ChevronsUpDownIcon,
  CreditCardIcon,
  LogOutIcon,
} from "lucide-react";
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
import useUserStore from "@/lib/store/user-store";
import { useEffect } from "react";
import { UserDb } from "@/lib/types/user";
import UserMenuLabel from "./user-menu-label";
import { ThemeMenu } from "../../../../../components/theme-menu";

type Props = {
  user: UserDb;
};

export function NavUserClient({ user }: Props) {
  const log = useLogger();
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const { setUserCreditBalance } = useUserStore();
  const userFullName = getUserFullName();
  const userName = getUsername(userFullName);
  const avatarFallbackChars = getUserAvatarFallbackChars(userFullName);

  useEffect(() => {
    if (user) setUserCreditBalance(user.availableCredits);
  }, [user, setUserCreditBalance]);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <UserMenuLabel
                userName={userName}
                email={user.email}
                avatarUrl={user.avatarUrl}
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
                  userName={userName}
                  email={user.email}
                  avatarUrl={user.avatarUrl}
                  avatarFallbackChars={avatarFallbackChars}
                />
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheckIcon />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCardIcon />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BellIcon />
                Notifications
              </DropdownMenuItem>
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
  );

  function getUserFullName() {
    const userFullName = `${user.firstName ? user.firstName : ""} ${user.lastName ? user.lastName : ""}`;

    return userFullName.trim();
  }

  function getUsername(userFullName: string) {
    return userFullName.length ? userFullName : user.email.split("@")[0];
  }

  function getUserAvatarFallbackChars(userFullName: string) {
    return userFullName.length
      ? userFullName
          .split(" ")
          .slice(0, 2)
          .map((name) => name.charAt(0))
          .join("")
      : user.email.charAt(0);
  }

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
    } finally {
      log.flush();
    }
  }
}
