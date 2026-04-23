import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from './Cadastro.module.css'

const Cadastro = () => {
  const { cadastrar } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ nome: '', email: '', senha: '', tipo: 'aluno' })
  const [erro, setErro] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setErro('')
    try {
      cadastrar(form)
      navigate('/dashboard')
    } catch (err) {
      setErro(err.message)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logoArea}>
          <div className={styles.logoIcon}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 4v16M18 4v16M4 8h2M18 8h2M4 16h2M18 16h2M8 12h8"/>
            </svg>
          </div>
          <span className={styles.logoName}>Fitness Gym</span>
        </div>

        <h1 className={styles.titulo}>Criar conta</h1>
        <p className={styles.subtitulo}>Preencha os dados para se cadastrar</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.campo}>
            <label className={styles.label}>Nome</label>
            <input
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              required
              className={styles.input}
              placeholder="Seu nome completo"
            />
          </div>

          <div className={styles.campo}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className={styles.input}
              placeholder="seu@email.com"
            />
          </div>

          <div className={styles.campo}>
            <label className={styles.label}>Senha</label>
            <input
              type="password"
              name="senha"
              value={form.senha}
              onChange={handleChange}
              required
              className={styles.input}
              placeholder="••••••••"
            />
          </div>

          <div className={styles.campo}>
            <label className={styles.label}>Tipo de conta</label>
            <select
              name="tipo"
              value={form.tipo}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="aluno">Aluno</option>
              <option value="personal">Personal</option>
            </select>
          </div>

          {erro && <p className={styles.erro}>{erro}</p>}

          <button type="submit" className={styles.botao}>
            Cadastrar
          </button>
        </form>

        <p className={styles.rodape}>
          Já tem conta?{' '}
          <Link to="/" className={styles.linkLogin}>
            Faça login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Cadastro