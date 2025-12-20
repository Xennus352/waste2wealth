"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
    window.location.href = "/auth/login";
  };

  return (
    <Button
      className=" border hover:text-eco-primaryLight p-2 sm:inline-flex rounded-full"
      onClick={logout}
    >
      Logout
    </Button>
  );
}
