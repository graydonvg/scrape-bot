import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Logo from "./logo";

export default function SidebarLogo() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild size="lg" className="hover:bg-sidebar">
          <Logo isLink />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
