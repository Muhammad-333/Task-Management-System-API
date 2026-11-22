import { createContext, useContext, useMemo, useState } from "react";
import api, { getData } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("taskflow_token"));
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("taskflow_user") || "null"); }
    catch { return null; }
  });

  const login = async (credentials) => {
    const result = getData(await api.post("/auth/login", credentials));
    localStorage.setItem("taskflow_token", result.token);
    localStorage.setItem("taskflow_user", JSON.stringify(result.user));
    setToken(result.token);
    setUser(result.user);
    return result;
  };

  const logout = () => {
    localStorage.removeItem("taskflow_token");
    localStorage.removeItem("taskflow_user");
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({ token, user, login, logout }), [token, user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);