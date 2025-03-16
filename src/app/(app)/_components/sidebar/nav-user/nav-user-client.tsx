"use client";

import {
  BadgeCheckIcon,
  BellIcon,
  ChevronsUpDownIcon,
  CreditCardIcon,
  LogOutIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  useSidebar,
} from "@/components/ui/sidebar";
import { createSupabaseBrowserClient } from "@/lib/supabase/supabase-browser";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useLogger } from "next-axiom";
import useUserStore from "@/lib/store/user-store";
import { useEffect } from "react";
import { UserDb } from "@/lib/types/user";
import { ThemeMenuItems } from "./theme-menu-items";
import useSidebarOpensOnHover from "@/hooks/use-sidebar-opens-on-hover";

type Props = {
  user: UserDb;
};

export function NavUserClient({ user }: Props) {
  const log = useLogger();
  const router = useRouter();
  const { isMobile, setOpen, setIsUserMenuOpen } = useSidebar();
  const supabase = createSupabaseBrowserClient();
  const { setUserCreditBalance } = useUserStore();
  const userFullName = getUserFullName();
  const userName = getUsername(userFullName);
  const avatarFallbackChars = getUserAvatarFallbackChars(userFullName);
  const sidebarOpensOnHover = useSidebarOpensOnHover();

  useEffect(() => {
    if (user) setUserCreditBalance(user.credits);
  }, [user, setUserCreditBalance]);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu
          onOpenChange={(open) => {
            if (!sidebarOpensOnHover) return;
            setOpen(open);
            setIsUserMenuOpen(open);
          }}
        >
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-md">
                {user.avatarUrl ? (
                  <AvatarImage
                    src={user.avatarUrl}
                    alt={`${userName} avatar`}
                  />
                ) : (
                  <AvatarFallback className="rounded-md uppercase">
                    {avatarFallbackChars}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{userName}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDownIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-md">
                  {user.avatarUrl ? (
                    <AvatarImage
                      src={user.avatarUrl}
                      alt={`${userName} avatar`}
                    />
                  ) : (
                    <AvatarFallback className="rounded-md uppercase">
                      {avatarFallbackChars}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{userName}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
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
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-normal">
                Theme
              </DropdownMenuLabel>
              <ThemeMenuItems />
            </DropdownMenuGroup>
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
