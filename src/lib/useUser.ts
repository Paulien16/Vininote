"use client";

import { useEffect, useState } from "react";
import { getUser, type UserProfile } from "./user";

export function useUser() {
  const [user, setUserState] = useState<UserProfile | null>(null);

  useEffect(() => {
    setUserState(getUser());

    const onStorage = () => setUserState(getUser());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return { user, refresh: () => setUserState(getUser()) };
}
