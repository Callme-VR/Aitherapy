"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface SessionContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkSession = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      console.log(
        "SessionContext: Token from localStorage:",
        token ? "exists" : "not found"
      );

      if (!token) {
        setUser(null);
        return;
      }

      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("SessionContext: Response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        const { password, ...safeUserData } = data.user;
        setUser(safeUserData);
        console.log("SessionContext: User state updated:", safeUserData);
      } else {
        setUser(null);
        localStorage.removeItem("token");
        console.log("SessionContext: Failed to get user data");
      }
    } catch (error) {
      console.error("SessionContext: Error checking session:", error);
      setUser(null);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      setUser(null);
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return (
//     <SessionContext.Provider
//       value={{
//         user,
//         loading,
//         isAuthenticated: !!user,
//         logout,
//         checkSession,
//       }}
//     >
//       {children}
//     </SessionContext.Provider>
// );
  );
}
export default function useSession(): SessionContextType {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
