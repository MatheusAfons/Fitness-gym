import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from './Login.module.css'

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', senha: '' })
  const [erro, setErro] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setErro('')
    try {
      login(form.email, form.senha)
      navigate('/dashboard')
    } catch (err) {
      setErro(err.message)
    }
  }

  return (
    <div className={styles.container}>
      {/* Lado esquerdo — visível apenas em telas maiores */}
      <div className={styles.left}>
        <div className={styles.leftCircle} />
        <div className={styles.leftCircle2} />
        <div className={styles.brand}>
          <div className={styles.brandIcon}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 4v16M18 4v16M4 8h2M18 8h2M4 16h2M18 16h2M8 12h8"/>
            </svg>
          </div>
          <span className={styles.brandName}>Fitness Gym</span>
        </div>
        <div className={styles.leftContent}>
          <h2 className={styles.leftTitle}>Supere seus limites</h2>
          <p className={styles.leftSub}>
            Acompanhe seus treinos, defina metas e evolua a cada semana com a plataforma da Fitness Gym.
          </p>
        </div>
      </div>

      {/* Lado direito — formulário */}
      <div className={styles.right}>
        <div className={styles.card}>
          <div className={styles.logoMobile}>
            <div className={styles.logoMobileIcon}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 4v16M18 4v16M4 8h2M18 8h2M4 16h2M18 16h2M8 12h8"/>
              </svg>
            </div>
            <span className={styles.logoMobileName}>Fitness Gym</span>
          </div>

          <h1 className={styles.titulo}>Bem-vindo</h1>
          <p className={styles.subtitulo}>Faça login para continuar</p>

          <form onSubmit={handleSubmit} className={styles.form}>
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

            {erro && <p className={styles.erro}>{erro}</p>}

            <button type="submit" className={styles.botao}>
              Entrar
            </button>
          </form>

          <p className={styles.rodape}>
            Não tem conta?{' '}
            <Link to="/cadastro" className={styles.linkCadastro}>
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login