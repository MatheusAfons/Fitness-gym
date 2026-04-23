import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from "../../context/AuthContext";
import styles from './Navbar.module.css'

const Navbar = () => {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const linkClass = (path) =>
    `${styles.link} ${location.pathname === path ? styles.linkAtivo : ''}`

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <span className={styles.logo}>Fitness Gym</span>

        <div className={styles.links}>
          <Link to="/dashboard" className={linkClass('/dashboard')}>Dashboard</Link>
          <Link to="/atividades" className={linkClass('/atividades')}>Atividades</Link>
          <Link to="/metas" className={linkClass('/metas')}>Metas</Link>
          <Link to="/perfil" className={linkClass('/perfil')}>Perfil</Link>
        </div>

        <div className={styles.usuario}>
          <span className={styles.nomeUsuario}>
            {currentUser?.nome} —{' '}
            <span className={styles.tipo}>{currentUser?.tipo}</span>
          </span>
          <button onClick={handleLogout} className={styles.botaoSair}>
            Sair
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar