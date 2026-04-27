"use client";

import { themes } from "@/data/nav-items";
import { authClient } from "@/lib/auth-client";
import { useAuthStore } from "@/store/auth-store";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@workspace/ui/components/sidebar";
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { EllipsisVerticalIcon, LogOutIcon } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
    items: {
      title: string;
      url: string;
      icon?: React.ReactNode;
    }[];
  };
}) {
  const { isMobile } = useSidebar();
  const { theme, setTheme } = useTheme();
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  const triggerClassName =
    "cursor-pointer rounded-full size-6 data-[state=active]:bg-transparent data-[state=active]:text-black data-[state=active]:border-zinc-300 dark:data-[state=active]:border-zinc-700 dark:data-[state=active]:text-white dark:data-[state=active]:bg-black";

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          logout();
          router.push("/login");
        },
      },
    });
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {user.email}
                </span>
              </div>
              <EllipsisVerticalIcon className="ml-auto size-4" />
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
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {user.items.map((item) => (
                <Link href={item.url} key={item.title}>
                  <DropdownMenuItem
                    key={item.title}
                    className="px-2 py-2 flex justify-between cursor-pointer"
                  >
                    {item.title}
                    {item.icon}
                  </DropdownMenuItem>
                </Link>
              ))}
            </DropdownMenuGroup>
            <div className="flex justify-between items-center px-2 py-1.5 text-sm hover:bg-accent rounded-md outline-hidden select-none">
              Theme
              <Tabs value={theme} onValueChange={setTheme}>
                <TabsList className="rounded-xl bg-transparent border border-zinc-300 dark:border-zinc-700 p-0">
                  {themes.map(({ value, icon }) => (
                    <TabsTrigger
                      key={value}
                      value={value}
                      className={triggerClassName}
                    >
                      {icon}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
            <DropdownMenuItem
              className="px-2 py-2 flex justify-between cursor-pointer"
              onClick={handleLogout}
            >
              Log out
              <LogOutIcon className="size-4 text-muted-foreground" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
