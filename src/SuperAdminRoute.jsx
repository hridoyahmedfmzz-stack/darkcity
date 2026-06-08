import { Navigate } from "react-router-dom";
import { useRole } from "./useRole";

export default function SuperAdminRoute({ children }) {
  const role = useRole();

  // wait until role loads
  if (role === undefined) {
    return (
      <div className="text-white bg-black min-h-screen flex items-center justify-center">
        Loading Admin Panel...
      </div>
    );
  }

  console.log("ROLE CHECK:", role);

  // allow only superadmin
  if (role !== "superadmin") {
    return <Navigate to="/" replace />;
  }

  return children;
}