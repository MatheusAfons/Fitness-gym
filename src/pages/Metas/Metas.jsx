import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getMetas, saveMetas, getActivities, getUsers } from '../../utils/storage'
import Navbar from '../../components/Navbar/Navbar'
import styles from './Metas.module.css'

const tiposDeMeta = [
  { valor: 'treinos', label: 'Treinos por semana' },
  { valor: 'calorias', label: 'Calorias por semana (kcal)' },
  { valor: 'minutos', label: 'Minutos de exercicio por semana' },
]

const getSemanaAtual = () => {
  const agora = new Date()
  const ano = agora.getFullYear()
  const inicio = new Date(agora.getFullYear(), 0, 1)
  const semana = Math.ceil(((agora - inicio) / 86400000 + inicio.getDay() + 1) / 7)
  return `${ano}-W${String(semana).padStart(2, '0')}`
}

const getInicioFimSemana = () => {
  const hoje = new Date()
  const inicio = new Date(hoje)
  inicio.setDate(hoje.getDate() - hoje.getDay())
  inicio.setHours(0, 0, 0, 0)
  const fim = new Date(inicio)
  fim.setDate(inicio.getDate() + 6)
  fim.setHours(23, 59, 59, 999)
  return { inicio, fim }
}

const calcularProgresso = (meta, atividades) => {
  const { inicio, fim } = getInicioFimSemana()
  const da_semana = atividades.filter((a) => {
    const data = new Date(a.data)
    return data >= inicio && data <= fim
  })
  if (meta.tipo === 'treinos') return da_semana.length
  if (meta.tipo === 'calorias') return da_semana.reduce((acc, a) => acc + Number(a.calorias), 0)
  if (meta.tipo === 'minutos') return da_semana.reduce((acc, a) => acc + Number(a.duracao), 0)
  return 0
}

const getStatus = (progresso, alvo, semanaAtual, metaSemana) => {
  if (progresso >= alvo) return 'atingida'
  if (semanaAtual === metaSemana) return 'andamento'
  return 'falhou'
}

const formVazio = { titulo: '', tipo: 'treinos', valorAlvo: '', alunoId: '' }

const Metas = () => {
  const { currentUser } = useAuth()
  const [metas, setMetas] = useState([])
  const [atividades, setAtividades] = useState([])
  const [alunos, setAlunos] = useState([])
  const [form, setForm] = useState(formVazio)
  const [modalAberto, setModalAberto] = useState(false)
  const [erro, setErro] = useState('')

  const semanaAtual = getSemanaAtual()
  const isPersonal = currentUser.tipo === 'personal'

  useEffect(() => {
    if (isPersonal) {
      const todosUsuarios = getUsers()
      const alunosCadastrados = todosUsuarios.filter((u) => u.tipo === 'aluno')
      setAlunos(alunosCadastrados)
      const todasMetas = alunosCadastrados.flatMap((aluno) =>
        getMetas(aluno.id).filter((m) => m.personalId === currentUser.id)
      )
      setMetas(todasMetas)
    } else {
      setMetas(getMetas(currentUser.id))
      setAtividades(getActivities(currentUser.id))
    }
  }, [currentUser.id, isPersonal])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const abrirModal = () => {
    setForm(formVazio)
    setErro('')
    setModalAberto(true)
  }

  const fecharModal = () => {
    setModalAberto(false)
    setForm(formVazio)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setErro('')

    if (!form.titulo || !form.valorAlvo) {
      setErro('Preencha todos os campos obrigatorios.')
      return
    }
    if (isPersonal && !form.alunoId) {
      setErro('Selecione um aluno.')
      return
    }

    const userId = isPersonal ? form.alunoId : currentUser.id
    const metasDoUsuario = getMetas(userId)
    const novaMeta = {
      id: crypto.randomUUID(),
      titulo: form.titulo,
      tipo: form.tipo,
      valorAlvo: Number(form.valorAlvo),
      semana: semanaAtual,
      criadaPor: currentUser.tipo,
      personalId: isPersonal ? currentUser.id : null,
      userId,
    }

    saveMetas(userId, [...metasDoUsuario, novaMeta])
    setMetas((prev) => [...prev, novaMeta])
    fecharModal()
  }

  const excluir = (meta) => {
    const userId = meta.userId || currentUser.id
    const filtradas = getMetas(userId).filter((m) => m.id !== meta.id)
    saveMetas(userId, filtradas)
    setMetas((prev) => prev.filter((m) => m.id !== meta.id))
  }

  const renderCard = (meta) => {
    const alunoAtividades = isPersonal ? getActivities(meta.userId) : atividades
    const progresso = calcularProgresso(meta, alunoAtividades)
    const status = getStatus(progresso, meta.valorAlvo, semanaAtual, meta.semana)
    const aluno = alunos.find((a) => a.id === meta.userId)

    const cardClass = {
      atingida: styles.cardAtingida,
      andamento: styles.cardAndamento,
      falhou: styles.cardFalhou,
    }[status]

    const badgeClass = {
      atingida: styles.badgeAtingida,
      andamento: styles.badgeAndamento,
      falhou: styles.badgeFalhou,
    }[status]

    const barraClass = {
      atingida: styles.barraAtingida,
      andamento: styles.barraAndamento,
      falhou: styles.barraFalhou,
    }[status]

    const labelStatus = {
      atingida: 'Atingida',
      andamento: 'Em andamento',
      falhou: 'Nao atingida',
    }[status]

    return (
      <div key={meta.id} className={`${styles.card} ${cardClass}`}>
        <div className={styles.cardTopo}>
          <div>
            <p className={styles.cardNome}>{meta.titulo}</p>
            {isPersonal && aluno && (
              <p className={styles.cardAluno}>Aluno: {aluno.nome}</p>
            )}
            <p className={styles.cardTipo}>
              {tiposDeMeta.find((t) => t.valor === meta.tipo)?.label}
            </p>
          </div>
          <span className={`${styles.badge} ${badgeClass}`}>{labelStatus}</span>
        </div>

        <div className={styles.barra}>
          <div
            className={`${styles.barraProgresso} ${barraClass}`}
            style={{ width: `${Math.min((progresso / meta.valorAlvo) * 100, 100)}%` }}
          />
        </div>

        <div className={styles.cardRodape}>
          <span>
            Progresso: <strong>{progresso}</strong> / {meta.valorAlvo}
          </span>
          <button onClick={() => excluir(meta)} className={styles.botaoRemover}>
            Remover
          </button>
        </div>
      </div>
    )
  }

  const metasDaSemana = metas.filter((m) => m.semana === semanaAtual)
  const metasAnteriores = metas.filter((m) => m.semana !== semanaAtual)

  return (
    <div className={styles.container}>
      <Navbar />

      <main className={styles.main}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.titulo}>Metas</h1>
            <p className={styles.subtitulo}>
              {isPersonal
                ? 'Gerencie as metas dos seus alunos'
                : 'Acompanhe suas metas semanais'}
            </p>
          </div>
          <button onClick={abrirModal} className={styles.botaoNovo}>
            + Nova meta
          </button>
        </div>

        <div className={styles.secao}>
          <h2 className={styles.secaoTitulo}>Esta semana</h2>
          {metasDaSemana.length === 0 ? (
            <p className={styles.vazio}>Nenhuma meta para esta semana.</p>
          ) : (
            <div className={styles.grid}>{metasDaSemana.map(renderCard)}</div>
          )}
        </div>

        {metasAnteriores.length > 0 && (
          <div className={styles.secao}>
            <h2 className={styles.secaoTitulo}>Semanas anteriores</h2>
            <div className={styles.grid}>{metasAnteriores.map(renderCard)}</div>
          </div>
        )}
      </main>

      {modalAberto && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitulo}>Nova meta</h2>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.campo}>
                <label className={styles.label}>Titulo da meta</label>
                <input
                  type="text"
                  name="titulo"
                  value={form.titulo}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="ex: Treinar 4x essa semana"
                />
              </div>

              <div className={styles.campo}>
                <label className={styles.label}>Tipo de meta</label>
                <select
                  name="tipo"
                  value={form.tipo}
                  onChange={handleChange}
                  className={styles.select}
                >
                  {tiposDeMeta.map((t) => (
                    <option key={t.valor} value={t.valor}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div className={styles.campo}>
                <label className={styles.label}>Valor alvo</label>
                <input
                  type="number"
                  name="valorAlvo"
                  value={form.valorAlvo}
                  onChange={handleChange}
                  min="1"
                  className={styles.input}
                  placeholder="ex: 4"
                />
              </div>

              {isPersonal && (
                <div className={styles.campo}>
                  <label className={styles.label}>Aluno</label>
                  <select
                    name="alunoId"
                    value={form.alunoId}
                    onChange={handleChange}
                    className={styles.select}
                  >
                    <option value="">Selecione um aluno</option>
                    {alunos.map((a) => (
                      <option key={a.id} value={a.id}>{a.nome}</option>
                    ))}
                  </select>
                </div>
              )}

              {erro && <p className={styles.erro}>{erro}</p>}

              <div className={styles.botoesModal}>
                <button type="button" onClick={fecharModal} className={styles.botaoCancelar}>
                  Cancelar
                </button>
                <button type="submit" className={styles.botaoSalvar}>
                  Criar meta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Metas