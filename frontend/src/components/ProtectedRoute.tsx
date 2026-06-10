import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

type Props = { children: ReactNode };

export default function ProtectedRoute({ children }: Props) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          color: "#3076d8",
        }}
      >
        Загрузка…
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/in" replace />;
  }

  return <>{children}</>;
}
