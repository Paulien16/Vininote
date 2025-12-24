export type UserProfile = {
    id: string;
    name: string;
    email?: string;
    bio?: string;
    photoUrl?: string | null;
  };
  
  const KEY = "vininote:user";
  const EVENT = "vininote:user:changed";
  
  export function getUser(): UserProfile | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? (JSON.parse(raw) as UserProfile) : null;
    } catch {
      return null;
    }
  }
  
  export function setUser(user: UserProfile) {
    localStorage.setItem(KEY, JSON.stringify(user));
    window.dispatchEvent(new Event(EVENT));
  }
  
  export function clearUser() {
    localStorage.removeItem(KEY);
    window.dispatchEvent(new Event(EVENT));
  }
  
  export function onUserChanged(cb: () => void) {
    window.addEventListener(EVENT, cb);
    return () => window.removeEventListener(EVENT, cb);
  }
  