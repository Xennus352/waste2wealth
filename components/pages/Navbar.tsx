"use client";
import { Logo } from "@/components/pages/logo";
import { NavMenu } from "@/components/pages/nav-menu";
import { NavigationSheet } from "@/components/pages/navigation-sheet";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import ProfileAvatar from "./profile-avatar";
import { LogoutButton } from "../logout-button";

const Navbar = () => {
  const user = useAuth();

  return (
    <nav className=" inset-x-4 h-16 bg-background border max-w-(--breakpoint-xl) mx-auto rounded-full">
      <div className="h-full flex items-center justify-between mx-auto px-4">
        <Logo />

        {/* Desktop Menu */}
        <NavMenu className="hidden md:block" />

        <div className="flex items-center gap-3">
          {!user ? (
            <Link
              href={"/auth/login"}
              className="hidden border hover:text-eco-primaryLight p-2 sm:inline-flex rounded-full"
            >
              Sign In
            </Link>
          ) : (
            <div className=" md:flex items-center justify-center cursor-pointer  border hover:text-eco-primaryLight p-2 sm:inline-flex rounded-full gap-2">
              <div className="hidden  sm:inline-flex">
                <LogoutButton />
              </div>
              <Link href={"/profile"}>
                <ProfileAvatar />
              </Link>
            </div>
          )}

          {/* Mobile Menu */}
          <div className="md:hidden">
            <NavigationSheet />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
