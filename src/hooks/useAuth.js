import { useEffect, useState } from "react";
import { subscribeToAuth } from "../firebase/auth";
import { useAppStore } from "../store/useAppStore";

export const useAuth = () => {
  const [loading, setLoading] = useState(true);
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);

  useEffect(() => {
    const unsubscribe = subscribeToAuth((u) => {
      if (u) {
        setUser({
          email: u.email,
          uid: u.uid,
          isAdmin: u.email === "w@gmail.com",
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser]);

  return { user, loading };
};