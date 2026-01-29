import { useState, useEffect } from 'react'
import { useAuth } from "../contexts/AuthContext";
import { 
  Users, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Mail
} from 'lucide-react'

export default function AdminDashboard() {
  const { supabase } = useAuth()
  
  const [stats, setStats] = useState({
    totalUsers: 0,
    newUsersThisWeek: 0,
    activeUsers: 0,
    unconfirmedEmails: 0,
    totalStudents: 0,
    linkedStudents: 0,
    inTrial: 0,
    activeSubscriptions: 0
  })

  const [alerts, setAlerts] = useState([])
  const [recentUsers, setRecentUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [weeklyData, setWeeklyData] = useState([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      await Promise.all([
        fetchUserStats(),
        fetchAlerts(),
        fetchRecentUsers(),
        fetchWeeklySignups()
      ])
    } catch (error) {
      console.error('Erreur chargement dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserStats = async () => {
    // Total utilisateurs (sans les admins)
    const { count: totalUsers } = await supabase
      .from('users_roles')
      .select('*', { count: 'exact', head: true })
      .eq('is_admin', false)

    // Nouveaux cette semaine (sans les admins)
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    const { count: newUsersThisWeek } = await supabase
      .from('users_roles')
      .select('*', { count: 'exact', head: true })
      .eq('is_admin', false)
      .gte('created_at', oneWeekAgo.toISOString())

    // Utilisateurs actifs (approximation : nouveaux cette semaine)
    const activeUsers = newUsersThisWeek || 0

    // Emails non confirmés (mis à 0 car on ne peut pas accéder à auth.admin côté client)
    const unconfirmedEmails = 0

    // Total élèves
    const { count: totalStudents } = await supabase
      .from('students')
      .select('*', { count: 'exact', head: true })

    // Élèves liés
    const { count: linkedStudents } = await supabase
      .from('students')
      .select('*', { count: 'exact', head: true })
      .not('student_user_id', 'is', null)

    // En essai
    const now = new Date()
    const { count: inTrial } = await supabase
      .from('users_roles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'prof')
      .gte('trial_end_date', now.toISOString())
      .is('subscription_status', null)

    // Abonnements actifs
    const { count: activeSubscriptions } = await supabase
      .from('users_roles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'prof')
      .eq('subscription_status', 'active')

    console.log('📊 Stats chargées:', {
      totalUsers,
      newUsersThisWeek,
      activeUsers,
      totalStudents,
      linkedStudents,
      inTrial,
      activeSubscriptions
    })

    setStats({
      totalUsers,
      newUsersThisWeek,
      activeUsers,
      unconfirmedEmails,
      totalStudents,
      linkedStudents,
      inTrial,
      activeSubscriptions
    })
  }

  const fetchAlerts = async () => {
    const alertsList = []

    // Essais qui expirent bientôt
    const threeDaysLater = new Date()
    threeDaysLater.setDate(threeDaysLater.getDate() + 3)
    const { data: expiringTrials } = await supabase
      .from('users_roles')
      .select('*')
      .eq('role', 'prof')
      .lte('trial_end_date', threeDaysLater.toISOString())
      .gte('trial_end_date', new Date().toISOString())
      .is('subscription_status', null)

    if (expiringTrials?.length > 0) {
      alertsList.push({
        type: 'info',
        icon: Clock,
        message: `${expiringTrials.length} essai(s) expirent dans les 3 prochains jours`,
        action: 'Voir la liste'
      })
    }

    setAlerts(alertsList)
  }

  const fetchRecentUsers = async () => {
    const { data } = await supabase
      .from('users_roles')
      .select('*')
      .eq('is_admin', false)
      .order('created_at', { ascending: false })
      .limit(5)

    console.log('👥 Derniers utilisateurs:', data)
    setRecentUsers(data || [])
  }

  const fetchWeeklySignups = async () => {
    const days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const startOfDay = new Date(date.setHours(0, 0, 0, 0))
      const endOfDay = new Date(date.setHours(23, 59, 59, 999))

      const { count } = await supabase
        .from('users_roles')
        .select('*', { count: 'exact', head: true })
        .eq('is_admin', false)
        .gte('created_at', startOfDay.toISOString())
        .lte('created_at', endOfDay.toISOString())

      days.push({
        day: startOfDay.toLocaleDateString('fr-FR', { weekday: 'short' }),
        count: count || 0
      })
    }
    setWeeklyData(days)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--cream)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[var(--caramel)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--espresso-light)]">Chargement...</p>
        </div>
      </div>
    )
  }

  const maxCount = Math.max(...weeklyData.map(d => d.count), 1)

  return (
    <div className="min-h-screen bg-[var(--cream)] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-fraunces text-4xl font-bold text-[var(--espresso)] mb-2">
              Dashboard Admin
            </h1>
            <p className="text-[var(--espresso-light)]">
              Vue d'ensemble de votre plateforme
            </p>
          </div>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-[var(--caramel)] text-white rounded-xl font-semibold hover:bg-[var(--caramel-dark)] transition-colors"
          >
            🔄 Actualiser
          </button>
        </div>

        {/* KPIs principaux */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Total utilisateurs */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-[var(--sand)]">
            <div className="flex items-center justify-between mb-4">
              <Users className="text-[var(--caramel)]" size={24} />
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                stats.newUsersThisWeek > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
              }`}>
                +{stats.newUsersThisWeek} cette semaine
              </span>
            </div>
            <h3 className="text-3xl font-bold text-[var(--espresso)] mb-1">{stats.totalUsers}</h3>
            <p className="text-sm text-[var(--espresso-light)]">Utilisateurs</p>
          </div>

          {/* Utilisateurs actifs */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-[var(--sand)]">
            <div className="flex items-center justify-between mb-4">
              <CheckCircle className="text-green-600" size={24} />
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-700">
                {stats.totalUsers > 0 ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0}%
              </span>
            </div>
            <h3 className="text-3xl font-bold text-[var(--espresso)] mb-1">{stats.activeUsers}</h3>
            <p className="text-sm text-[var(--espresso-light)]">Actifs (7j)</p>
          </div>

          {/* En essai */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-[var(--sand)]">
            <div className="flex items-center justify-between mb-4">
              <Clock className="text-blue-600" size={24} />
            </div>
            <h3 className="text-3xl font-bold text-[var(--espresso)] mb-1">{stats.inTrial}</h3>
            <p className="text-sm text-[var(--espresso-light)]">En essai gratuit</p>
          </div>

          {/* Abonnés */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-[var(--sand)]">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="text-[var(--caramel)]" size={24} />
            </div>
            <h3 className="text-3xl font-bold text-[var(--espresso)] mb-1">{stats.activeSubscriptions}</h3>
            <p className="text-sm text-[var(--espresso-light)]">Abonnements actifs</p>
          </div>
        </div>

        {/* Graphique + Alertes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Graphique inscriptions */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border-2 border-[var(--sand)]">
            <h2 className="text-xl font-bold text-[var(--espresso)] mb-6">
              Inscriptions des 7 derniers jours
            </h2>
            <div className="flex items-end justify-between h-48 gap-2">
              {weeklyData.map((day, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex items-end justify-center h-40 mb-2">
                    <div 
                      className="w-full bg-gradient-to-t from-[var(--caramel)] to-[var(--caramel)]/60 rounded-t-lg transition-all hover:opacity-80 relative group"
                      style={{ height: `${(day.count / maxCount) * 100}%`, minHeight: day.count > 0 ? '20px' : '4px' }}
                    >
                      {day.count > 0 && (
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-[var(--espresso)] opacity-0 group-hover:opacity-100 transition-opacity">
                          {day.count}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs font-medium text-[var(--espresso-light)]">
                    {day.day}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Alertes */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-[var(--sand)]">
            <h2 className="text-xl font-bold text-[var(--espresso)] mb-4">
              Alertes
            </h2>
            {alerts.length > 0 ? (
              <div className="space-y-3">
                {alerts.map((alert, index) => {
                  const Icon = alert.icon
                  return (
                    <div 
                      key={index} 
                      className={`p-4 rounded-xl border-2 ${
                        alert.type === 'warning' 
                          ? 'bg-orange-50 border-orange-200' 
                          : 'bg-blue-50 border-blue-200'
                      }`}
                    >
                      <div className="flex items-start gap-3 mb-2">
                        <Icon 
                          size={18} 
                          className={alert.type === 'warning' ? 'text-orange-600' : 'text-blue-600'} 
                        />
                        <p className={`text-sm font-medium flex-1 ${
                          alert.type === 'warning' ? 'text-orange-900' : 'text-blue-900'
                        }`}>
                          {alert.message}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle size={32} className="text-green-500 mx-auto mb-2" />
                <p className="text-sm text-[var(--espresso-light)]">Aucune alerte</p>
              </div>
            )}
          </div>
        </div>

        {/* Stats secondaires */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-[var(--sand)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[var(--espresso-light)] mb-1">
                  Élèves créés
                </p>
                <h3 className="text-2xl font-bold text-[var(--espresso)]">{stats.totalStudents}</h3>
              </div>
              <div className="text-right">
                <p className="text-xs text-[var(--espresso-light)] mb-1">Liés à un parent</p>
                <p className="text-lg font-bold text-green-600">
                  {stats.totalStudents > 0 
                    ? Math.round((stats.linkedStudents / stats.totalStudents) * 100) 
                    : 0}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-[var(--sand)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[var(--espresso-light)] mb-1">
                  Emails confirmés
                </p>
                <h3 className="text-2xl font-bold text-[var(--espresso)]">
                  {stats.totalUsers - stats.unconfirmedEmails}
                </h3>
              </div>
              <div className="text-right">
                <p className="text-xs text-[var(--espresso-light)] mb-1">Taux</p>
                <p className="text-lg font-bold text-[var(--caramel)]">
                  {stats.totalUsers > 0 
                    ? Math.round(((stats.totalUsers - stats.unconfirmedEmails) / stats.totalUsers) * 100) 
                    : 0}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-[var(--sand)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[var(--espresso-light)] mb-1">
                  Taux conversion
                </p>
                <h3 className="text-2xl font-bold text-[var(--espresso)]">
                  {(stats.inTrial + stats.activeSubscriptions) > 0
                    ? Math.round((stats.activeSubscriptions / (stats.inTrial + stats.activeSubscriptions)) * 100)
                    : 0}%
                </h3>
              </div>
              <div className="text-right">
                <p className="text-xs text-[var(--espresso-light)] mb-1">Essai → Abonnement</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dernières inscriptions */}
        {recentUsers.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border-2 border-[var(--sand)] overflow-hidden">
            <div className="p-6 border-b border-[var(--sand)]">
              <h2 className="text-xl font-bold text-[var(--espresso)]">
                Dernières inscriptions
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[var(--cream)]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--espresso)] uppercase">
                      Utilisateur
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--espresso)] uppercase">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--espresso)] uppercase">
                      Rôle
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--espresso)] uppercase">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--sand)]">
                  {recentUsers.map((user, index) => (
                    <tr key={index} className="hover:bg-[var(--cream)] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[var(--caramel)]/20 flex items-center justify-center">
                            <span className="text-sm font-semibold text-[var(--caramel)]">
                              {user.first_name?.[0]}{user.last_name?.[0]}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-[var(--espresso)]">
                            {user.first_name} {user.last_name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--espresso-light)]">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === 'prof' 
                            ? 'bg-[var(--caramel)]/20 text-[var(--caramel)]' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.role === 'prof' ? 'Professeur' : 'Parent'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--espresso-light)]">
                        {new Date(user.created_at).toLocaleDateString('fr-FR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}