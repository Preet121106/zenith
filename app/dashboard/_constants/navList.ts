import { IconType } from "react-icons/lib";
import {
  LuLayoutDashboard,
  LuAtom,
  LuBot,
  LuAtSign,
} from "react-icons/lu";

type NavListType = {
  id: number;
  name: string;
  icon: IconType;
  route: string;
};

export const navList: NavListType[] = [
  {
    id: 1,
    name: "Dashboard",
    icon: LuLayoutDashboard,
    route: "/dashboard",
  },
  {
    id: 2,
    name: "Explore",
    icon: LuAtom,
    route: "/dashboard/explore",
  },
  {
    id: 3,
    name: "AI",
    icon: LuBot,
    route: "https://zenith-ai-pi.vercel.app/",
  },
  {
    id: 4,
    name: "Discussions",
    icon: LuAtSign,
    route: "https://zenith-forum.vercel.app/",
  },
];
