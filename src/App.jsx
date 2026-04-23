import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login/Login'
import Cadastro from './pages/Cadastro/Cadastro'
import Dashboard from './pages/Dashboard/Dashboard'
import Atividades from './pages/Atividades/Atividades'
import Metas from './pages/Metas/Metas'
import Perfil from './pages/Perfil/Perfil'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/atividades" element={<ProtectedRoute><Atividades /></ProtectedRoute>} />
      <Route path="/metas" element={<ProtectedRoute><Metas /></ProtectedRoute>} />
      <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
    </Routes>
  )
}

export default App