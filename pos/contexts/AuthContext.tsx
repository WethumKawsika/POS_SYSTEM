"use client";

import { createContext, useContext, useMemo } from "react";

const AuthContext = createContext({ user: { id: "u1", name: "Admin" } });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const value = useMemo(() => ({ user: { id: "u1", name: "Admin" } }), []);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
