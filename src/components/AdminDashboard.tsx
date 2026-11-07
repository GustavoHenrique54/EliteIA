import { useState, useEffect, useMemo } from 'react'
import {
  ArrowLeft,
  Users,
  CheckCircle2,
  Sparkles,
  Bot,
  Search,
  Download,
  Trash2,
  Cloud,
  Database,
  RefreshCw,
  Lock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import {
  loadAllSessions,
  calculateAggregatedStats,
  resetAllSessions,
} from '../services/storage'
import {
  getStoredFirebaseConfig,
  saveFirebaseConfig,
  clearFirebaseConfig,
  FirebaseConfig,
} from '../services/firebase'

interface AdminDashboardProps {
  onBack: () => void
}

export function AdminDashboard({ onBack }: AdminDashboardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState(false)

  const [loading, setLoading] = useState(true)
  const [isCloud, setIsCloud] = useState(false)
  const [sessions, setSessions] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedAuthor, setSelectedAuthor] = useState<string>('all')
  const [sortField, setSortField] = useState<'id' | 'votes' | 'accuracy' | 'fooled'>('id')
  const [sortAsc, setSortAsc] = useState<boolean>(true)

  // Modal de Configuração do Firebase
  const [showConfigModal, setShowConfigModal] = useState(false)
  const [firebaseInput, setFirebaseInput] = useState<FirebaseConfig>({
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
  })

  // Carregar dados
  const fetchData = async () => {
    setLoading(true)
    const result = await loadAllSessions()
    setSessions(result.sessions)
    setIsCloud(result.isCloud)
    setLoading(false)
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchData()
      const currentConfig = getStoredFirebaseConfig()
      if (currentConfig) {
        setFirebaseInput(currentConfig)
      }
    }
  }, [isAuthenticated])

  // Login de Admin (senha padrão admin123 ou VITE_ADMIN_PASSWORD)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const correctPassword =
      import.meta.env.VITE_ADMIN_PASSWORD || 'admin123'
    if (password === correctPassword) {
      setIsAuthenticated(true)
      setPasswordError(false)
    } else {
      setPasswordError(true)
    }
  }

  // Estatísticas calculadas
  const stats = useMemo(() => {
    return calculateAggregatedStats(sessions)
  }, [sessions])

  // Limpar dados da turma
  const handleReset = async () => {
    if (
      window.confirm(
        'Tem certeza que deseja apagar todas as respostas coletadas? Isso resetará o painel para uma nova turma.'
      )
    ) {
      await resetAllSessions()
      await fetchData()
    }
  }

  // Exportar dados para CSV
  const handleExportCSV = () => {
    if (stats.textStats.length === 0) return

    const headers = [
      'Linha Planilha (ID)',
      'Sentimento',
      'Classificação Real',
      'Texto',
      'Total Respostas',
      'Acertos',
      'Erros',
      'Taxa de Acerto (%)',
      'Taxa que Enganou (%)',
    ]

    const rows = stats.textStats.map((item) => [
      item.rowId,
      `"${item.sentiment.replace(/"/g, '""')}"`,
      `"${item.author}"`,
      `"${item.text.replace(/"/g, '""')}"`,
      item.totalVotes,
      item.correctVotes,
      item.wrongVotes,
      `${item.accuracyRate}%`,
      item.author !== 'Humano' ? `${item.fooledRate}%` : '-',
    ])

    const csvContent =
      '\uFEFF' +
      [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\r\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `dados_dinamica_sentimentos_${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
  }

  // Salvar Firebase Config
  const handleSaveFirebase = (e: React.FormEvent) => {
    e.preventDefault()
    saveFirebaseConfig(firebaseInput)
    setShowConfigModal(false)
    window.location.reload()
  }

  const handleClearFirebase = () => {
    clearFirebaseConfig()
    setFirebaseInput({
      apiKey: '',
      authDomain: '',
      projectId: '',
      storageBucket: '',
      messagingSenderId: '',
      appId: '',
    })
    setShowConfigModal(false)
    window.location.reload()
  }

  // Filtragem e ordenação da tabela de textos
  const filteredTexts = useMemo(() => {
    let list = stats.textStats.filter((item) => {
      // Busca
      const q = searchQuery.toLowerCase()
      const matchesSearch =
        item.rowId.toString().includes(q) ||
        item.sentiment.toLowerCase().includes(q) ||
        item.text.toLowerCase().includes(q)

      // Categoria
      const matchesCat =
        selectedCategory === 'all' || item.sentiment === selectedCategory

      // Tipo de autor
      const matchesAuthor =
        selectedAuthor === 'all' || item.author === selectedAuthor

      return matchesSearch && matchesCat && matchesAuthor
    })

    // Ordenação
    list.sort((a, b) => {
      let valA = 0
      let valB = 0
      if (sortField === 'id') {
        valA = a.rowId
        valB = b.rowId
      } else if (sortField === 'votes') {
        valA = a.totalVotes
        valB = b.totalVotes
      } else if (sortField === 'accuracy') {
        valA = a.accuracyRate
        valB = b.accuracyRate
      } else if (sortField === 'fooled') {
        valA = a.fooledRate || 0
        valB = b.fooledRate || 0
      }
      return sortAsc ? valA - valB : valB - valA
    })

    return list
  }, [stats.textStats, searchQuery, selectedCategory, selectedAuthor, sortField, sortAsc])

  // Se não logou ainda, exibe tela de login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white rounded-3xl p-8 border border-zinc-200/80 shadow-sm text-center">
          <div className="w-12 h-12 bg-zinc-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-zinc-900 mb-1">
            Painel do Administrador
          </h2>
          <p className="text-xs text-zinc-500 mb-6">
            Acesso exclusivo para o facilitador / professor da dinâmica.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Senha de acesso"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 text-zinc-900"
                autoFocus
              />
              {passwordError && (
                <p className="text-xs text-red-500 mt-1 text-left">
                  Senha incorreta. (Padrão: <code>admin123</code>)
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-zinc-900 text-white rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-all"
            >
              Entrar no Painel
            </button>

            <button
              type="button"
              onClick={onBack}
              className="w-full py-2.5 text-zinc-500 hover:text-zinc-900 text-xs font-medium transition-colors"
            >
              Voltar ao Jogo
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-zinc-900 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Superior */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2.5 hover:bg-zinc-100 rounded-2xl text-zinc-600 hover:text-zinc-900 transition-colors"
              title="Voltar ao Jogo"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-zinc-900">
                  Painel de Controle • Dados da Turma
                </h1>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                    isCloud
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-zinc-100 text-zinc-700'
                  }`}
                >
                  {isCloud ? (
                    <>
                      <Cloud className="w-3 h-3" /> Nuvem Ativa
                    </>
                  ) : (
                    <>
                      <Database className="w-3 h-3" /> Local / Dispositivo
                    </>
                  )}
                </span>
              </div>
              <p className="text-xs text-zinc-500">
                Acompanhe o desempenho da turma, taxas de acerto e o comportamento da IA.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={fetchData}
              disabled={loading}
              className="px-3.5 py-2 text-xs font-medium bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl transition-all flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Atualizar
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              Exportar CSV / Excel
            </button>

            <button
              onClick={() => setShowConfigModal(true)}
              className="px-3.5 py-2 text-xs font-medium border border-zinc-200 hover:bg-zinc-50 text-zinc-700 rounded-xl transition-all flex items-center gap-1.5"
            >
              <Cloud className="w-3.5 h-3.5" />
              Configurar Nuvem
            </button>

            <button
              onClick={handleReset}
              className="px-3.5 py-2 text-xs font-medium text-red-600 hover:bg-red-50 border border-red-200/80 rounded-xl transition-all flex items-center gap-1.5"
              title="Apagar dados e reiniciar para nova turma"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Zerar Dados
            </button>
          </div>
        </div>

        {/* Cards de Métricas Gerais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card Participantes */}
          <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 block mb-1">
                Participantes
              </span>
              <span className="text-3xl font-extrabold text-zinc-900">
                {stats.totalParticipants}
              </span>
              <span className="text-xs text-zinc-400 block mt-0.5">
                {stats.totalVotes} votos registrados
              </span>
            </div>
            <div className="w-12 h-12 bg-zinc-100 rounded-2xl flex items-center justify-center text-zinc-800">
              <Users className="w-6 h-6" />
            </div>
          </div>

          {/* Card Precisão Geral */}
          <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 block mb-1">
                Precisão Global
              </span>
              <span className="text-3xl font-extrabold text-zinc-900">
                {stats.overallAccuracy}%
              </span>
              <span className="text-xs text-zinc-400 block mt-0.5">
                {stats.totalCorrect} acertos / {stats.totalWrong} erros
              </span>
            </div>
            <div className="w-12 h-12 bg-zinc-100 rounded-2xl flex items-center justify-center text-zinc-800">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          {/* Card IA Normal */}
          <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 block mb-1">
                IA Normal (Padrão)
              </span>
              <span className="text-3xl font-extrabold text-zinc-900">
                {stats.authorTypeStats.IA.accuracy}%
              </span>
              <span className="text-xs text-zinc-400 block mt-0.5">
                reconhecida como IA
              </span>
            </div>
            <div className="w-12 h-12 bg-zinc-100 rounded-2xl flex items-center justify-center text-zinc-800">
              <Bot className="w-6 h-6" />
            </div>
          </div>

          {/* Card IA Fingindo ser Humano */}
          <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-600 block mb-1">
                Eficácia da IA Fingir
              </span>
              <span className="text-3xl font-extrabold text-zinc-900">
                {stats.authorTypeStats['IA fingindo ser humano'].fooledRate || 0}%
              </span>
              <span className="text-xs text-zinc-400 block mt-0.5">
                acharam que era humano!
              </span>
            </div>
            <div className="w-12 h-12 bg-amber-50 text-amber-700 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Resumo por Categoria / Sentimento */}
        <div className="bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-zinc-900">
              Taxa de Acerto por Sentimento / Categoria
            </h2>
            <span className="text-xs text-zinc-400">
              {stats.categories.length} sentimentos avaliados
            </span>
          </div>

          {stats.categories.length === 0 ? (
            <p className="text-xs text-zinc-400 py-4 text-center">
              Nenhuma resposta registrada ainda. Peça para os participantes jogarem!
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {stats.categories.map((cat) => (
                <div
                  key={cat.sentiment}
                  className="bg-zinc-50 border border-zinc-200/70 p-3 rounded-2xl"
                >
                  <div className="text-xs font-semibold text-zinc-800 truncate mb-1">
                    {cat.sentiment}
                  </div>
                  <div className="flex items-baseline justify-between mb-1.5">
                    <span className="text-lg font-bold text-zinc-900">
                      {cat.accuracyRate}%
                    </span>
                    <span className="text-[10px] text-zinc-400">
                      {cat.totalVotes} votos
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-zinc-900 rounded-full"
                      style={{ width: `${cat.accuracyRate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tabela Detalhada Item a Item (Usando Linha da Planilha como ID) */}
        <div className="bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-zinc-900">
                Tabela de Textos da Planilha (Linha a Linha)
              </h2>
              <p className="text-xs text-zinc-500">
                O ID corresponde exatamente ao número da linha do arquivo Excel original.
              </p>
            </div>

            {/* Controles de Busca e Filtro */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Buscar texto ou linha..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 w-44 sm:w-56"
                />
              </div>

              {/* Filtro Tipo */}
              <select
                value={selectedAuthor}
                onChange={(e) => setSelectedAuthor(e.target.value)}
                className="py-1.5 px-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-800 focus:outline-none"
              >
                <option value="all">Todos os tipos</option>
                <option value="Humano">Humano</option>
                <option value="IA">IA Padrão</option>
                <option value="IA fingindo ser humano">IA Fingindo</option>
              </select>

              {/* Filtro Categoria */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="py-1.5 px-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-800 focus:outline-none"
              >
                <option value="all">Todos sentimentos</option>
                {Array.from(new Set(stats.textStats.map((t) => t.sentiment))).map(
                  (s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>

          {/* Tabela */}
          <div className="overflow-x-auto border border-zinc-200 rounded-2xl">
            <table className="w-full text-left text-xs text-zinc-600">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase tracking-wider font-semibold text-[10px]">
                <tr>
                  <th
                    className="p-3 cursor-pointer hover:text-zinc-900"
                    onClick={() => {
                      if (sortField === 'id') setSortAsc(!sortAsc)
                      else {
                        setSortField('id')
                        setSortAsc(true)
                      }
                    }}
                  >
                    <div className="flex items-center gap-1">
                      Linha (ID)
                      {sortField === 'id' && (sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                    </div>
                  </th>
                  <th className="p-3">Sentimento</th>
                  <th className="p-3">Classificação Real</th>
                  <th className="p-3 min-w-[280px]">Texto da Planilha</th>
                  <th
                    className="p-3 cursor-pointer hover:text-zinc-900 text-center"
                    onClick={() => {
                      if (sortField === 'votes') setSortAsc(!sortAsc)
                      else {
                        setSortField('votes')
                        setSortAsc(false)
                      }
                    }}
                  >
                    <div className="flex items-center justify-center gap-1">
                      Votos
                      {sortField === 'votes' && (sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                    </div>
                  </th>
                  <th
                    className="p-3 cursor-pointer hover:text-zinc-900 text-center"
                    onClick={() => {
                      if (sortField === 'accuracy') setSortAsc(!sortAsc)
                      else {
                        setSortField('accuracy')
                        setSortAsc(false)
                      }
                    }}
                  >
                    <div className="flex items-center justify-center gap-1">
                      Taxa Acerto
                      {sortField === 'accuracy' && (sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                    </div>
                  </th>
                  <th
                    className="p-3 cursor-pointer hover:text-zinc-900 text-center"
                    onClick={() => {
                      if (sortField === 'fooled') setSortAsc(!sortAsc)
                      else {
                        setSortField('fooled')
                        setSortAsc(false)
                      }
                    }}
                  >
                    <div className="flex items-center justify-center gap-1">
                      Enganou (%)
                      {sortField === 'fooled' && (sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredTexts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-zinc-400">
                      Nenhum texto corresponde aos filtros.
                    </td>
                  </tr>
                ) : (
                  filteredTexts.map((item) => (
                    <tr key={item.rowId} className="hover:bg-zinc-50/70 transition-colors">
                      <td className="p-3 font-mono font-bold text-zinc-900 whitespace-nowrap">
                        #{item.rowId}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 font-medium">
                          {item.sentiment}
                        </span>
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded-md font-semibold text-[11px] ${
                            item.author === 'Humano'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : item.author === 'IA fingindo ser humano'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-zinc-100 text-zinc-700 border border-zinc-200'
                          }`}
                        >
                          {item.author}
                        </span>
                      </td>
                      <td className="p-3 text-zinc-700 leading-relaxed font-serif-text italic text-xs">
                        &ldquo;{item.text}&rdquo;
                      </td>
                      <td className="p-3 text-center font-semibold text-zinc-900">
                        {item.totalVotes}
                      </td>
                      <td className="p-3 text-center">
                        {item.totalVotes > 0 ? (
                          <span
                            className={`font-bold ${
                              item.accuracyRate >= 60
                                ? 'text-emerald-700'
                                : item.accuracyRate >= 40
                                ? 'text-zinc-700'
                                : 'text-red-600'
                            }`}
                          >
                            {item.accuracyRate}%
                          </span>
                        ) : (
                          <span className="text-zinc-300">-</span>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        {item.author !== 'Humano' && item.totalVotes > 0 ? (
                          <span
                            className={`font-bold ${
                              (item.fooledRate || 0) >= 50
                                ? 'text-amber-600'
                                : 'text-zinc-500'
                            }`}
                          >
                            {item.fooledRate}%
                          </span>
                        ) : (
                          <span className="text-zinc-300">-</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal de Configuração do Firebase */}
        {showConfigModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-lg w-full border border-zinc-200 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <div className="flex items-center gap-2">
                  <Cloud className="w-5 h-5 text-zinc-800" />
                  <h3 className="font-bold text-zinc-900">
                    Conectar Banco em Nuvem (Firebase)
                  </h3>
                </div>
                <button
                  onClick={() => setShowConfigModal(false)}
                  className="text-zinc-400 hover:text-zinc-700"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-zinc-500 leading-relaxed">
                Para que os votos dos celulares de todos os alunos cheguem em tempo real ao seu computador, conecte um projeto gratuito do <strong>Firebase Firestore</strong>. Se você não configurar, os dados são salvos no armazenamento do navegador de cada dispositivo.
              </p>

              <form onSubmit={handleSaveFirebase} className="space-y-3">
                <div>
                  <label className="text-[11px] font-semibold text-zinc-600 uppercase">
                    API Key
                  </label>
                  <input
                    type="text"
                    value={firebaseInput.apiKey}
                    onChange={(e) =>
                      setFirebaseInput({ ...firebaseInput, apiKey: e.target.value })
                    }
                    placeholder="AIzaSy..."
                    className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-zinc-600 uppercase">
                      Project ID
                    </label>
                    <input
                      type="text"
                      value={firebaseInput.projectId}
                      onChange={(e) =>
                        setFirebaseInput({ ...firebaseInput, projectId: e.target.value })
                      }
                      placeholder="meu-projeto"
                      className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-zinc-600 uppercase">
                      Auth Domain
                    </label>
                    <input
                      type="text"
                      value={firebaseInput.authDomain}
                      onChange={(e) =>
                        setFirebaseInput({ ...firebaseInput, authDomain: e.target.value })
                      }
                      placeholder="meu-projeto.firebaseapp.com"
                      className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-zinc-600 uppercase">
                      Storage Bucket
                    </label>
                    <input
                      type="text"
                      value={firebaseInput.storageBucket}
                      onChange={(e) =>
                        setFirebaseInput({
                          ...firebaseInput,
                          storageBucket: e.target.value,
                        })
                      }
                      placeholder="meu-projeto.appspot.com"
                      className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-zinc-600 uppercase">
                      App ID
                    </label>
                    <input
                      type="text"
                      value={firebaseInput.appId}
                      onChange={(e) =>
                        setFirebaseInput({ ...firebaseInput, appId: e.target.value })
                      }
                      placeholder="1:123456:web:abcd..."
                      className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={handleClearFirebase}
                    className="px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-xl border border-red-200"
                  >
                    Desconectar Nuvem
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowConfigModal(false)}
                      className="px-4 py-2 text-xs text-zinc-600 hover:bg-zinc-100 rounded-xl"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-semibold bg-zinc-900 text-white rounded-xl hover:bg-zinc-800"
                    >
                      Salvar e Conectar
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
