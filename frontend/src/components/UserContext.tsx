import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { Customer } from "../types";

interface UserContextType {
  customer: Customer | null;
  setCustomer: (c: Customer | null) => void;
  loading: boolean;
  setLoading: (v: boolean) => void;
}

export const UserContext = createContext<UserContextType>({
  customer: null,
  setCustomer: () => {},
  loading: true,
  setLoading: () => {},
});

export const useUser = () => useContext(UserContext);

import { authAPI } from "../services/apiService";

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    authAPI.me()
      .then((data) => setCustomer(data.customer))
      .catch(() => setCustomer(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <UserContext.Provider value={{ customer, setCustomer, loading, setLoading }}>
      {children}
    </UserContext.Provider>
  );
};