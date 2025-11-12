import { Navigate } from "react-router-dom"
import { useSelector } from "react-redux"

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, token } = useSelector((s) => s.auth)

  if (!token || !user) {
    return <Navigate to="/login" />
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/dashboard" />
  }

  return children
}
