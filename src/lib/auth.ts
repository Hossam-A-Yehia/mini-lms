"use client";

import { useState } from "react";

type User = {
  email: string;
  role: "admin" | "user";
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string) => {
    // Mock login - in a real app, this would verify credentials
    const role: "admin" | "user" = email.includes("admin") ? "admin" : "user";
    const user = { email, role };
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
    return user;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // Initialize from localStorage if available
  if (typeof window !== "undefined") {
    const storedUser = localStorage.getItem("user");
    if (storedUser && !user) {
      setUser(JSON.parse(storedUser));
    }
  }

  return { user, login, logout };
};
