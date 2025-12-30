"use client";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentProps } from "react";

export const NavMenu = (props: ComponentProps<typeof NavigationMenu>) => {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home" },
    { href: "/market", label: "Market Place" },
    { href: "/exchange-points", label: "Exchange Points" },
  ];
  return (
    <NavigationMenu {...props}>
      <NavigationMenuList className="space-x-4 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-start data-[orientation=vertical]:justify-start">
        {links.map((link, index) => {
          const isActive = pathname === link.href;
          return (
            <NavigationMenuItem key={index}>
              <NavigationMenuLink
                asChild
                className={`${navigationMenuTriggerStyle()} relative overflow-hidden after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-green-500 after:transition-all after:duration-300 hover:after:w-full`}
              >
                <Link
                  className={`relative px-2 py-1 font-medium ${
                    isActive
                      ? "text-green-600 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-green-600"
                      : "text-gray-700 hover:text-green-600 hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:h-0.5 hover:after:w-full hover:after:bg-green-500"
                  }`}
                  href={link.href}
                >
                  {link.label}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
};
