"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Users, Shield, Lock, Globe, Share2 } from "lucide-react";

const navigation = [
  {
    name: "사이트 관리",
    href: "/admin/sites",
    icon: Globe,
  },
  {
    name: "사용자 관리",
    href: "/admin/users",
    icon: Users,
  },
  {
    name: "역할 관리",
    href: "/admin/roles",
    icon: Shield,
  },
  {
    name: "권한 관리",
    href: "/admin/permissions",
    icon: Lock,
  },
  {
    name: "소셜 인증 관리",
    href: "/admin/social-providers",
    icon: Share2,
  },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="hidden border-r bg-gray-100/40 lg:block lg:w-60">
      <div className="flex h-full flex-col">
        <div className="flex-1">
          <nav className="flex flex-1 flex-col py-4">
            <ul role="list" className="flex flex-1 flex-col gap-y-4">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      pathname === item.href
                        ? "bg-gray-200 text-gray-900"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                      "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 mx-2"
                    )}
                  >
                    <item.icon
                      className={cn(
                        pathname === item.href
                          ? "text-gray-900"
                          : "text-gray-400 group-hover:text-gray-900",
                        "h-5 w-5 shrink-0"
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export { Sidebar }; 