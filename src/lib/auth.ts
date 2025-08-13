"use client";

import { useState, useEffect } from "react";

type User = {
  email: string;
  role: "admin" | "user";
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = (email: string) => {
    const role: "admin" | "user" = email.includes("admin") ? "admin" : "user";
    const newUser: User = { email, role };
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
    return newUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser) as User);
    }
    setLoading(false);
  }, []);

  return { user, loading, login, logout };
};
