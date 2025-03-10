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
import getUserDataClient from "@/data-access/get-user-data-client";
import { UserDb } from "@/lib/types/user";
import { ThemeMenuItems } from "../../theme/theme-menu-items";

type Props = {
  user?: UserDb | null;
};

export function NavUserClient({ user }: Props) {
  const log = useLogger();
  const router = useRouter();
  const { isMobile } = useSidebar();
  const supabase = createSupabaseBrowserClient();
  const { user: userStore, setUser } = useUserStore();
  const userFullName = getUserFullName();
  const userName = getUsername(userFullName);
  const avatarFallbackChars = getUserAvatarFallbackChars(userFullName);

  useEffect(() => {
    if (user) setUser(user);

    // User data is persisted in local storage to reduce number of requests
    // If local storage is cleared, refetch the user data and add it back to store
    if (!user) {
      async function fetchUserData() {
        const userData = await getUserDataClient();

        if (userData) {
          setUser(userData);
        } else {
          router.push("/signin");
        }
      }

      fetchUserData();
    }
  }, [user, setUser, router]);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-md">
                {userStore.avatarUrl ? (
                  <AvatarImage
                    src={userStore.avatarUrl}
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
                <span className="truncate text-xs">{userStore.email}</span>
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
                  {userStore.avatarUrl ? (
                    <AvatarImage
                      src={userStore.avatarUrl}
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
                  <span className="truncate text-xs">{userStore.email}</span>
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
    const userFullName = `${userStore.firstName ? userStore.firstName : ""} ${userStore.lastName ? userStore.lastName : ""}`;

    return userFullName.trim();
  }

  function getUsername(userFullName: string) {
    return userFullName.length ? userFullName : userStore.email.split("@")[0];
  }

  function getUserAvatarFallbackChars(userFullName: string) {
    return userFullName.length
      ? userFullName
          .split(" ")
          .slice(0, 2)
          .map((name) => name.charAt(0))
          .join("")
      : userStore.email.charAt(0);
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
