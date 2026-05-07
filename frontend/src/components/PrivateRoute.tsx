import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "./UserContext";

interface Props {
  children: ReactNode;
  roles?: string[];
}

export default function PrivateRoute({ children, roles }: Props) {
  const { customer, loading } = useUser();

  if (loading) {
    return <div>Cargando sesión...</div>; 
  }

  if (!customer) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(customer.role)) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}