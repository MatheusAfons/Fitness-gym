import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getUsers, saveUsers, saveCurrentUser } from '../../utils/storage'
import Navbar from '../../components/Navbar/Navbar'
import styles from './Perfil.module.css'

const Perfil = () => {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    nome: currentUser.nome,
    email: currentUser.email,
    senha: '',
  })
  const [sucesso, setSucesso] = useState('')
  const [erro, setErro] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setErro('')
    setSucesso('')

    const users = getUsers()
    const emailJaUsado = users.find(
      (u) => u.email === form.email && u.id !== currentUser.id
    )

    if (emailJaUsado) {
      setErro('Este email ja esta em uso por outra conta.')
      return
    }

    const usuarioAtualizado = {
      ...currentUser,
      nome: form.nome,
      email: form.email,
      senha: form.senha || currentUser.senha,
    }

    const usuariosAtualizados = users.map((u) =>
      u.id === currentUser.id ? usuarioAtualizado : u
    )

    saveUsers(usuariosAtualizados)
    saveCurrentUser(usuarioAtualizado)
    setSucesso('Perfil atualizado com sucesso.')
  }

  const handleExcluirConta = () => {
    const confirmado = window.confirm(
      'Tem certeza que deseja excluir sua conta? Esta acao nao pode ser desfeita.'
    )
    if (!confirmado) return

    const users = getUsers()
    saveUsers(users.filter((u) => u.id !== currentUser.id))
    logout()
    navigate('/')
  }

  return (
    <div className={styles.container}>
      <Navbar />

      <main className={styles.main}>
        <h1 className={styles.titulo}>Perfil</h1>
        <p className={styles.subtitulo}>Gerencie suas informacoes pessoais</p>

        <div className={styles.card}>
          <div className={styles.avatarInfo}>
            <div className={styles.avatar}>
              <span className={styles.avatarLetra}>
                {currentUser.nome.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className={styles.avatarNome}>{currentUser.nome}</p>
              <p className={styles.avatarTipo}>{currentUser.tipo}</p>
            </div>
          </div>

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
              />
            </div>

            <div className={styles.campo}>
              <label className={styles.label}>
                Nova senha{' '}
                <span className={styles.labelOpcional}>(deixe em branco para manter)</span>
              </label>
              <input
                type="password"
                name="senha"
                value={form.senha}
                onChange={handleChange}
                className={styles.input}
                placeholder="••••••••"
              />
            </div>

            {erro && <p className={styles.erro}>{erro}</p>}
            {sucesso && <p className={styles.sucesso}>{sucesso}</p>}

            <button type="submit" className={styles.botaoSalvar}>
              Salvar alteracoes
            </button>
          </form>
        </div>

        <div className={styles.cardPerigo}>
          <h2 className={styles.tituloPerigo}>Zona de perigo</h2>
          <p className={styles.descricaoPerigo}>
            Ao excluir sua conta, todos os seus dados serao removidos permanentemente.
          </p>
          <button onClick={handleExcluirConta} className={styles.botaoExcluir}>
            Excluir minha conta
          </button>
        </div>
      </main>
    </div>
  )
}

export default Perfil