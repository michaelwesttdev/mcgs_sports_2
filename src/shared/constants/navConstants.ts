import {
  type LucideIcon,
  Settings,
  HelpCircle,
  LayoutDashboard,
  Shell,
  TicketPlus,
  Megaphone,
  Users,
} from "lucide-react";
export type NavLink = {
  title: string;
  path: string;
  Icon: LucideIcon;
  subLinks?: NavLink[];
};
export const nav_links: NavLink[] = [
  {
    title: "Dashboard",
    path: "/",
    Icon: LayoutDashboard,
  },
  {
    title: "Sessions",
    path: "/sessions",
    Icon: Shell,
  },
  {
    title: "Events",
    path: "/events",
    Icon: Megaphone,
  },
  {
    title: "Students",
    path: "/students",
    Icon: Users,
  },
];

export const utility_links: NavLink[] = [
  {
    title: "Settings",
    path: "/settings",
    Icon: Settings,
  },
  {
    title: "Help", 
    path: "/help",
    Icon: HelpCircle,
  },
];
