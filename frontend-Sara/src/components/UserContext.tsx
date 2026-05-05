import { createContext, useContext, useState } from "react";
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

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  return (
    <UserContext.Provider value={{ customer, setCustomer, loading, setLoading }}>
      {children}
    </UserContext.Provider>
  );
};