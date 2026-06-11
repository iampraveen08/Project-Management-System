import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/client";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => JSON.parse(localStorage.getItem("pms_auth") || "null"));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (auth) localStorage.setItem("pms_auth", JSON.stringify(auth));
    else localStorage.removeItem("pms_auth");
  }, [auth]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      setAuth(data);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (payload) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/signup", payload);
      setAuth(data);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (user) => setAuth((current) => ({ ...current, user }));
  const logout = () => setAuth(null);

  const value = useMemo(
    () => ({ ...auth, isAdmin: auth?.user?.role === "admin", loading, login, logout, signup, updateUser }),
    [auth, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
