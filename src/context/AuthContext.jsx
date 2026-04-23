import { createContext, useContext, useState, useEffect } from 'react'
import {
  getCurrentUser,
  saveCurrentUser,
  clearCurrentUser,
  getUsers,
  saveUsers,
  findUserByEmail,
} from '../utils/storage'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const user = getCurrentUser()
    setCurrentUser(user)
    setLoading(false)
  }, [])

  const login = (email, senha) => {
    const user = findUserByEmail(email)
    if (!user || user.senha !== senha) {
      throw new Error('Email ou senha incorretos')
    }
    saveCurrentUser(user)
    setCurrentUser(user)
  }

  const cadastrar = ({ nome, email, senha, tipo }) => {
    const users = getUsers()
    if (users.find((u) => u.email === email)) {
      throw new Error('Email já cadastrado')
    }
    const novoUsuario = {
      id: crypto.randomUUID(),
      nome,
      email,
      senha,
      tipo, // 'aluno' | 'personal'
    }
    saveUsers([...users, novoUsuario])
    saveCurrentUser(novoUsuario)
    setCurrentUser(novoUsuario)
  }

  const logout = () => {
    clearCurrentUser()
    setCurrentUser(null)
  }

  return (
    <AuthContext.Provider value={{ currentUser, login, cadastrar, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)