import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-gray-500">Carregando...</span>
      </div>
    )
  }

  if (!currentUser) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute