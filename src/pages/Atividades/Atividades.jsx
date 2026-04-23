import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getActivities, saveActivities } from '../../utils/storage'
import Navbar from '../../components/Navbar/Navbar'
import styles from './Atividades.module.css'

const tiposDeExercicio = [
  'Musculacao',
  'Corrida',
  'Ciclismo',
  'Natacao',
  'Futebol',
  'Basquete',
  'Yoga',
  'Pilates',
  'Caminhada',
  'Outro',
]

const formVazio = {
  data: '',
  tipo: 'Musculacao',
  duracao: '',
  calorias: '',
  observacao: '',
}

const Atividades = () => {
  const { currentUser } = useAuth()
  const [atividades, setAtividades] = useState([])
  const [form, setForm] = useState(formVazio)
  const [editandoId, setEditandoId] = useState(null)
  const [modalAberto, setModalAberto] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    setAtividades(getActivities(currentUser.id))
  }, [currentUser.id])

  const salvar = (novas) => {
    saveActivities(currentUser.id, novas)
    setAtividades(novas)
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const abrirModalNovo = () => {
    setForm(formVazio)
    setEditandoId(null)
    setErro('')
    setModalAberto(true)
  }

  const abrirModalEdicao = (atividade) => {
    setForm({
      data: atividade.data,
      tipo: atividade.tipo,
      duracao: atividade.duracao,
      calorias: atividade.calorias,
      observacao: atividade.observacao || '',
    })
    setEditandoId(atividade.id)
    setErro('')
    setModalAberto(true)
  }

  const fecharModal = () => {
    setModalAberto(false)
    setEditandoId(null)
    setForm(formVazio)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setErro('')

    if (!form.data || !form.duracao || !form.calorias) {
      setErro('Preencha todos os campos obrigatorios.')
      return
    }

    if (editandoId) {
      const atualizadas = atividades.map((a) =>
        a.id === editandoId ? { ...a, ...form } : a
      )
      salvar(atualizadas)
    } else {
      const nova = { id: crypto.randomUUID(), ...form }
      salvar([...atividades, nova])
    }

    fecharModal()
  }

  const excluir = (id) => {
    salvar(atividades.filter((a) => a.id !== id))
  }

  const ordenadas = [...atividades].sort(
    (a, b) => new Date(b.data) - new Date(a.data)
  )

  return (
    <div className={styles.container}>
      <Navbar />

      <main className={styles.main}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.titulo}>Atividades</h1>
            <p className={styles.subtitulo}>Histórico completo dos seus treinos</p>
          </div>
          <button onClick={abrirModalNovo} className={styles.botaoNovo}>
            + Nova atividade
          </button>
        </div>

        <table className={styles.tabela}>
          <thead className={styles.tabelaHead}>
            <tr>
              <th>Data</th>
              <th>Tipo</th>
              <th>Duração</th>
              <th>Calorias</th>
              <th>Observação</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody className={styles.tabelaBody}>
            {ordenadas.length === 0 ? (
              <tr>
                <td colSpan={6} className={styles.vazio}>
                  Nenhuma atividade registrada ainda.
                </td>
              </tr>
            ) : (
              ordenadas.map((a) => (
                <tr key={a.id}>
                  <td>{new Date(a.data).toLocaleDateString('pt-BR')}</td>
                  <td>{a.tipo}</td>
                  <td>{a.duracao} min</td>
                  <td>{a.calorias} kcal</td>
                  <td>{a.observacao || '—'}</td>
                  <td>
                    <div className={styles.acoes}>
                      <button
                        onClick={() => abrirModalEdicao(a)}
                        className={styles.botaoEditar}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => excluir(a.id)}
                        className={styles.botaoExcluir}
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </main>

      {modalAberto && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitulo}>
              {editandoId ? 'Editar atividade' : 'Nova atividade'}
            </h2>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.campo}>
                <label className={styles.label}>Data</label>
                <input
                  type="date"
                  name="data"
                  value={form.data}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>

              <div className={styles.campo}>
                <label className={styles.label}>Tipo de exercício</label>
                <select
                  name="tipo"
                  value={form.tipo}
                  onChange={handleChange}
                  className={styles.select}
                >
                  {tiposDeExercicio.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className={styles.fileira}>
                <div className={styles.campo}>
                  <label className={styles.label}>Duração (min)</label>
                  <input
                    type="number"
                    name="duracao"
                    value={form.duracao}
                    onChange={handleChange}
                    min="1"
                    className={styles.input}
                    placeholder="ex: 60"
                  />
                </div>
                <div className={styles.campo}>
                  <label className={styles.label}>Calorias (kcal)</label>
                  <input
                    type="number"
                    name="calorias"
                    value={form.calorias}
                    onChange={handleChange}
                    min="1"
                    className={styles.input}
                    placeholder="ex: 300"
                  />
                </div>
              </div>

              <div className={styles.campo}>
                <label className={styles.label}>
                  Observação{' '}
                  <span className={styles.labelOpcional}>(opcional)</span>
                </label>
                <textarea
                  name="observacao"
                  value={form.observacao}
                  onChange={handleChange}
                  rows={3}
                  className={styles.textarea}
                  placeholder="Alguma anotacao sobre o treino..."
                />
              </div>

              {erro && <p className={styles.erro}>{erro}</p>}

              <div className={styles.botoesModal}>
                <button
                  type="button"
                  onClick={fecharModal}
                  className={styles.botaoCancelar}
                >
                  Cancelar
                </button>
                <button type="submit" className={styles.botaoSalvar}>
                  {editandoId ? 'Salvar alteracoes' : 'Adicionar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Atividades