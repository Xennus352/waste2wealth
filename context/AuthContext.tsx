"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { Triangle } from "react-loader-spinner";

// Extend User to include amount
type AuthUser = User & { points?: number };

// Create the context
export const AuthContext = createContext<AuthUser | null>(null);

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);

      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        // Fetch user points from profiles
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("points")
          .eq("id", session.user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error.message);
        }

        setUser({ ...session.user, points: profile?.points });
      } else {
        setUser(null);
      }

      setLoading(false);
    };

    fetchUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        supabase
          .from("profiles")
          .select("points")
          .eq("id", session.user.id)
          .single()
          .then(({ data: profile }) => {
            setUser({ ...session.user, points: profile?.points });
          });
      } else {
        setUser(null);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={user}>
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <Triangle
            visible={true}
            height="90"
            width="90"
            color="#4fa94d"
            ariaLabel="triangle-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

// Hook to use context
export const useAuth = (): AuthUser | null => useContext(AuthContext);
