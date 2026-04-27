import {
  CircleHelpIcon,
  CircleUserRoundIcon,
  LayoutDashboardIcon,
  Monitor,
  MoonIcon,
  SearchIcon,
  Settings2Icon,
  Sun,
  UsersIcon,
} from "lucide-react";

export const navMain = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: <LayoutDashboardIcon />,
  },
  {
    title: "Team",
    url: "/dashboard/team",
    icon: <UsersIcon />,
  },
];

export const navSecondary = [
  {
    title: "Settings",
    url: "#",
    icon: <Settings2Icon />,
  },
  {
    title: "Get Help",
    url: "#",
    icon: <CircleHelpIcon />,
  },
  {
    title: "Search",
    url: "#",
    icon: <SearchIcon />,
  },
];

export const user = {
  name: "shadcn",
  email: "m@example.com",
  avatar: "/avatars/shadcn.jpg",
  items: [
    {
      title: "Profile",
      url: "/dashboard/profile",
      icon: <CircleUserRoundIcon className="size-4 text-muted-foreground" />,
    },
  ],
};

export const themes = [
  { value: "system", icon: <Monitor className="size-3.5" /> },
  { value: "light", icon: <Sun className="size-3.5" /> },
  { value: "dark", icon: <MoonIcon className="size-3.5" /> },
];
