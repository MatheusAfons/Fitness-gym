import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getActivities } from '../../utils/storage'
import Navbar from '../../components/Navbar/Navbar'
import styles from './Dashboard.module.css'

const Dashboard = () => {
  const { currentUser } = useAuth()
  const [atividades, setAtividades] = useState([])

  useEffect(() => {
    const dados = getActivities(currentUser.id)
    setAtividades(dados)
  }, [currentUser.id])

  const hoje = new Date()
  const inicioDaSemana = new Date(hoje)
  inicioDaSemana.setDate(hoje.getDate() - hoje.getDay())

  const atividadesDaSemana = atividades.filter((a) => {
    const data = new Date(a.data)
    return data >= inicioDaSemana
  })

  const totalCalorias = atividadesDaSemana.reduce((acc, a) => acc + Number(a.calorias), 0)
  const totalMinutos = atividadesDaSemana.reduce((acc, a) => acc + Number(a.duracao), 0)

  const ultimasAtividades = [...atividades]
    .sort((a, b) => new Date(b.data) - new Date(a.data))
    .slice(0, 5)

  return (
    <div className={styles.container}>
      <Navbar />

      <main className={styles.main}>
        <h1 className={styles.titulo}>Ola, {currentUser.nome}</h1>
        <p className={styles.subtitulo}>Aqui esta o resumo da sua semana</p>

        <div className={styles.cards}>
          <div className={styles.card}>
            <p className={styles.cardLabel}>Treinos essa semana</p>
            <p className={styles.cardValor}>{atividadesDaSemana.length}</p>
          </div>
          <div className={styles.card}>
            <p className={styles.cardLabel}>Calorias gastas</p>
            <p className={styles.cardValor}>{totalCalorias} kcal</p>
          </div>
          <div className={styles.card}>
            <p className={styles.cardLabel}>Minutos de exercicio</p>
            <p className={styles.cardValor}>{totalMinutos} min</p>
          </div>
        </div>

        <div className={styles.secao}>
          <div className={styles.secaoHeader}>
            <h2 className={styles.secaoTitulo}>Ultimas atividades</h2>
            <Link to="/atividades" className={styles.secaoLink}>Ver todas</Link>
          </div>

          {ultimasAtividades.length === 0 ? (
            <p className={styles.vazio}>Nenhuma atividade registrada ainda.</p>
          ) : (
            <ul className={styles.lista}>
              {ultimasAtividades.map((a) => (
                <li key={a.id} className={styles.item}>
                  <div>
                    <p className={styles.itemNome}>{a.tipo}</p>
                    <p className={styles.itemInfo}>
                      {new Date(a.data).toLocaleDateString('pt-BR')} — {a.duracao} min
                    </p>
                  </div>
                  <span className={styles.itemCalorias}>{a.calorias} kcal</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  )
}

export default Dashboard