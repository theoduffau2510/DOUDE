import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { DollarSign, TrendingUp, FileText, Users, CheckCircle, Calendar, CreditCard, Sparkles, XCircle, Edit2, Trash2 } from 'lucide-react'
import { useMemo } from 'react'

export default function Compta() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('factures')
  const [showModal, setShowModal] = useState(false)
  const [showClientModal, setShowClientModal] = useState(false)
  const [factures, setFactures] = useState([])
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  
  const [formData, setFormData] = useState({ client: '', montant: '', date: '', description: '', status: 'en_attente' })
  const [clientFormData, setClientFormData] = useState({ nom: '', prenom: '', adresse: '', pays_naissance: '', ville_naissance: '', email: '', tel: '', rib: '', titulaire_iban: '' })
  const [editingFacture, setEditingFacture] = useState(null)
  const [editingClient, setEditingClient] = useState(null)

  // Initialisation de Supabase
 const supabase = useMemo(() => {
  return createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
  )
}, [])  

  useEffect(() => {
    // Récupère l'utilisateur actuel
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })
    // Écoute les changements d'auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user])

  const fetchData = async () => {
    setLoading(true)
    await Promise.all([fetchClients(), fetchFactures()])
    setLoading(false)
  }

  const fetchClients = async () => {
    if (!supabase) return
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) console.error('Erreur clients:', error)
    else setClients(data || [])
  }

  const fetchFactures = async () => {
    if (!supabase) return
    const { data, error } = await supabase
      .from('factures')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) console.error('Erreur factures:', error)
    else setFactures(data || [])
  }

  const totalFacture = factures.reduce((acc, f) => acc + parseFloat(f.montant || 0), 0)
  const totalPaye = factures.filter(f => f.status === 'payee').reduce((acc, f) => acc + parseFloat(f.montant || 0), 0)
  const totalEnAttente = factures.filter(f => f.status === 'en_attente').reduce((acc, f) => acc + parseFloat(f.montant || 0), 0)

  const openAddModal = () => {
    setEditingFacture(null)
    setFormData({ client: '', montant: '', date: new Date().toISOString().split('T')[0], description: '', status: 'en_attente' })
    setShowModal(true)
  }

  const openEditModal = (facture) => {
    setEditingFacture(facture)
    setFormData({
      client: facture.client,
      montant: facture.montant,
      date: facture.date,
      description: facture.description || '',
      status: facture.status
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (editingFacture) {
      const { error } = await supabase
        .from('factures')
        .update({
          client: formData.client,
          montant: parseFloat(formData.montant),
          date: formData.date,
          description: formData.description,
          status: formData.status
        })
        .eq('id', editingFacture.id)

      if (error) {
        console.error('Erreur modification facture:', error)
        alert('Erreur lors de la modification')
        return
      }
    } else {
      const factureId = 'FAC-' + Date.now().toString().slice(-6)
      const { error } = await supabase
        .from('factures')
        .insert({
          user_id: user.id,
          facture_id: factureId,
          client: formData.client,
          montant: parseFloat(formData.montant),
          date: formData.date,
          description: formData.description,
          status: formData.status
        })

      if (error) {
        console.error('Erreur création facture:', error)
        alert('Erreur lors de la création')
        return
      }
    }

    setShowModal(false)
    fetchFactures()
  }

  const handleDelete = async (id) => {
    if (confirm('Supprimer cette facture ?')) {
      const { error } = await supabase
        .from('factures')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Erreur suppression facture:', error)
        alert('Erreur lors de la suppression')
        return
      }

      fetchFactures()
    }
  }

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'payee' ? 'en_attente' : 'payee'
    const { error } = await supabase
      .from('factures')
      .update({ status: newStatus })
      .eq('id', id)

    if (error) {
      console.error('Erreur changement statut:', error)
      return
    }

    fetchFactures()
  }

  const openAddClientModal = () => {
    setEditingClient(null)
    setClientFormData({
      nom: '',
      prenom: '',
      adresse: '',
      pays_naissance: '',
      ville_naissance: '',
      email: '',
      tel: '',
      rib: '',
      titulaire_iban: ''
    })
    setShowClientModal(true)
  }

  const openEditClientModal = (client) => {
    setEditingClient(client)
    setClientFormData({
      nom: client.nom || '',
      prenom: client.prenom || '',
      adresse: client.adresse || '',
      pays_naissance: client.pays_naissance || '',
      ville_naissance: client.ville_naissance || '',
      email: client.email || '',
      tel: client.tel || '',
      rib: client.rib || '',
      titulaire_iban: client.titulaire_iban || ''
    })
    setShowClientModal(true)
  }

  const handleClientSubmit = async (e) => {
    e.preventDefault()

    const clientData = {
      nom: clientFormData.nom,
      prenom: clientFormData.prenom,
      adresse: clientFormData.adresse,
      pays_naissance: clientFormData.pays_naissance,
      ville_naissance: clientFormData.ville_naissance,
      email: clientFormData.email,
      tel: clientFormData.tel,
      rib: clientFormData.rib,
      titulaire_iban: clientFormData.titulaire_iban
    }

    if (editingClient) {
      const { error } = await supabase
        .from('clients')
        .update(clientData)
        .eq('id', editingClient.id)

      if (error) {
        console.error('Erreur modification client:', error)
        alert('Erreur lors de la modification')
        return
      }
    } else {
      const { error } = await supabase
        .from('clients')
        .insert({
          user_id: user.id,
          ...clientData
        })

      if (error) {
        console.error('Erreur création client:', error)
        alert('Erreur lors de la création')
        return
      }
    }

    setShowClientModal(false)
    fetchClients()
  }

  const handleDeleteClient = async (id) => {
    if (confirm('Supprimer ce client ?')) {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Erreur suppression client:', error)
        alert('Erreur lors de la suppression')
        return
      }

      fetchClients()
    }
  }

  const getClientTotal = (client) => {
    const fullName = `${client.prenom} ${client.nom}`
    return factures
      .filter(f => f.client === fullName)
      .reduce((acc, f) => acc + parseFloat(f.montant || 0), 0)
  }

  const getClientFullName = (client) => {
    return `${client.prenom} ${client.nom}`.trim()
  }

  // Si pas d'utilisateur connecté
  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--cream)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[var(--espresso)]">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <main className="flex-1 py-8 px-5 md:px-10 bg-[var(--cream)] min-h-screen">
          <div className="max-w-[1400px] mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-[var(--espresso)]/10 rounded-full text-sm font-medium text-[var(--espresso)]">
                <Sparkles size={16} />
                Comptabilité
              </div>
              <div className="flex flex-wrap justify-between items-end gap-4">
                <div>
                  <h1 className="font-fraunces text-5xl text-[var(--espresso)] font-bold mb-3">
                    Gestion financière
                  </h1>
                  <p className="text-[var(--espresso-light)] text-lg">
                    Suivez vos factures, clients et revenus en temps réel
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={openAddClientModal}
                    className="py-3 px-6 bg-white text-[var(--espresso)] rounded-2xl font-semibold text-sm hover:shadow-xl transition-all cursor-pointer border-2 border-[var(--sand)] inline-flex items-center gap-2"
                  >
                    <Users size={18} />
                    Nouveau client
                  </button>
                  <button
                    onClick={openAddModal}
                    className="py-3 px-6 bg-[var(--espresso)] text-white rounded-2xl font-semibold text-sm hover:bg-[var(--espresso)]/90 hover:shadow-xl transition-all cursor-pointer border-none inline-flex items-center gap-2"
                  >
                    <FileText size={18} />
                    Nouvelle facture
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-3xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-3">
                  <DollarSign size={32} />
                  <TrendingUp size={24} className="opacity-75" />
                </div>
                <div className="font-fraunces text-4xl font-bold mb-1">{totalFacture.toFixed(2)}€</div>
                <div className="text-sm opacity-90">Total facturé</div>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <CheckCircle className="text-green-600" size={24} />
                  </div>
                </div>
                <div className="font-fraunces text-4xl text-[var(--espresso)] font-bold mb-1">{totalPaye.toFixed(2)}€</div>
                <div className="text-sm text-[var(--espresso-light)]">Payé</div>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Calendar className="text-orange-600" size={24} />
                  </div>
                </div>
                <div className="font-fraunces text-4xl text-[var(--espresso)] font-bold mb-1">{totalEnAttente.toFixed(2)}€</div>
                <div className="text-sm text-[var(--espresso-light)]">En attente</div>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-[var(--espresso)]/10 rounded-xl flex items-center justify-center">
                    <Users className="text-[var(--espresso)]" size={24} />
                  </div>
                </div>
                <div className="font-fraunces text-4xl text-[var(--espresso)] font-bold mb-1">{clients.length}</div>
                <div className="text-sm text-[var(--espresso-light)]">Clients</div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 bg-white p-2 rounded-full w-fit shadow-md">
              <button
                onClick={() => setActiveTab('factures')}
                className={`py-3 px-6 rounded-full font-semibold text-sm transition-all cursor-pointer border-none ${activeTab === 'factures' ? 'bg-[var(--espresso)] text-white shadow-lg' : 'bg-transparent text-[var(--espresso-light)]'}`}
              >
                Factures
              </button>
              <button
                onClick={() => setActiveTab('clients')}
                className={`py-3 px-6 rounded-full font-semibold text-sm transition-all cursor-pointer border-none ${activeTab === 'clients' ? 'bg-[var(--espresso)] text-white shadow-lg' : 'bg-transparent text-[var(--espresso-light)]'}`}
              >
                Clients
              </button>
              <button
                onClick={() => setActiveTab('stats')}
                className={`py-3 px-6 rounded-full font-semibold text-sm transition-all cursor-pointer border-none ${activeTab === 'stats' ? 'bg-[var(--espresso)] text-white shadow-lg' : 'bg-transparent text-[var(--espresso-light)]'}`}
              >
                Statistiques
              </button>
            </div>

            {/* Factures List */}
            {activeTab === 'factures' && (
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                {loading ? (
                  <div className="p-20 text-center">
                    <div className="inline-block w-12 h-12 border-4 border-[var(--espresso)] border-t-transparent rounded-full animate-spin mb-4"></div>
                    <div className="text-[var(--espresso-light)] font-medium">Chargement...</div>
                  </div>
                ) : factures.length === 0 ? (
                  <div className="p-16 text-center">
                    <div className="w-20 h-20 bg-[var(--cream)] rounded-full flex items-center justify-center mx-auto mb-6">
                      <FileText size={40} className="text-[var(--espresso-light)]" />
                    </div>
                    <h3 className="font-fraunces text-2xl text-[var(--espresso)] mb-3">Aucune facture</h3>
                    <p className="text-[var(--espresso-light)] mb-6">Commencez par créer votre première facture</p>
                    <button
                      onClick={openAddModal}
                      className="py-3 px-6 bg-[var(--espresso)] text-white rounded-2xl font-semibold text-sm hover:bg-[var(--espresso)]/90 transition-all cursor-pointer border-none inline-flex items-center gap-2"
                    >
                      <FileText size={18} />
                      Nouvelle facture
                    </button>
                  </div>
                ) : (
                  <div className="p-6">
                    <div className="space-y-3">
                      {factures.map((facture) => (
                        <div
                          key={facture.id}
                          className="flex items-center justify-between p-5 rounded-2xl bg-[var(--cream)] hover:bg-white hover:shadow-lg transition-all duration-300"
                        >
                          <div className="flex items-center gap-4 flex-1">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              facture.status === 'payee' 
                                ? 'bg-green-100 text-green-600' 
                                : 'bg-orange-100 text-orange-600'
                            }`}>
                              <CreditCard size={20} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1">
                                <h4 className="font-semibold text-[var(--espresso)]">{facture.client}</h4>
                                <span className="text-xs font-mono text-[var(--espresso-light)] bg-white px-2 py-1 rounded">
                                  {facture.facture_id}
                                </span>
                              </div>
                              <p className="text-sm text-[var(--espresso-light)]">
                                {facture.description || 'Sans description'} • {new Date(facture.date).toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="font-bold text-[var(--espresso)] text-xl">{parseFloat(facture.montant).toFixed(2)}€</div>
                              <button
                                onClick={() => toggleStatus(facture.id, facture.status)}
                                className={`text-xs px-3 py-1 rounded-full font-semibold cursor-pointer border-none ${
                                  facture.status === 'payee'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-orange-100 text-orange-700'
                                }`}
                              >
                                {facture.status === 'payee' ? 'Payé' : 'En attente'}
                              </button>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => openEditModal(facture)}
                                className="p-2 bg-white rounded-lg hover:bg-[var(--cream)] transition-all text-[var(--espresso)] border-none cursor-pointer"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(facture.id)}
                                className="p-2 bg-white rounded-lg hover:bg-red-50 transition-all text-red-600 border-none cursor-pointer"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Clients List */}
            {activeTab === 'clients' && (
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                {loading ? (
                  <div className="p-20 text-center">
                    <div className="inline-block w-12 h-12 border-4 border-[var(--espresso)] border-t-transparent rounded-full animate-spin mb-4"></div>
                    <div className="text-[var(--espresso-light)] font-medium">Chargement...</div>
                  </div>
                ) : clients.length === 0 ? (
                  <div className="p-16 text-center">
                    <div className="w-20 h-20 bg-[var(--cream)] rounded-full flex items-center justify-center mx-auto mb-6">
                      <Users size={40} className="text-[var(--espresso-light)]" />
                    </div>
                    <h3 className="font-fraunces text-2xl text-[var(--espresso)] mb-3">Aucun client</h3>
                    <p className="text-[var(--espresso-light)] mb-6">Commencez par ajouter votre premier client</p>
                    <button
                      onClick={openAddClientModal}
                      className="py-3 px-6 bg-[var(--espresso)] text-white rounded-2xl font-semibold text-sm hover:bg-[var(--espresso)]/90 transition-all cursor-pointer border-none inline-flex items-center gap-2"
                    >
                      <Users size={18} />
                      Nouveau client
                    </button>
                  </div>
                ) : (
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {clients.map((client) => (
                        <div
                          key={client.id}
                          className="p-6 rounded-2xl bg-[var(--cream)] hover:bg-white hover:shadow-lg transition-all duration-300"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--espresso)] to-[var(--caramel)] text-white flex items-center justify-center font-bold text-lg">
                                {(client.prenom?.[0] || '') + (client.nom?.[0] || '')}
                              </div>
                              <div>
                                <h4 className="font-bold text-[var(--espresso)] text-lg">
                                  {client.prenom} {client.nom}
                                </h4>
                                <p className="text-xs text-[var(--espresso-light)]">{client.email || 'Pas d\'email'}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => openEditClientModal(client)}
                                className="p-2 bg-white rounded-lg hover:bg-[var(--cream)] transition-all text-[var(--espresso)] border-none cursor-pointer"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                onClick={() => handleDeleteClient(client.id)}
                                className="p-2 bg-white rounded-lg hover:bg-red-50 transition-all text-red-600 border-none cursor-pointer"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                          
                          <div className="space-y-2 text-sm">
                            {client.tel && (
                              <div className="text-[var(--espresso-light)]">📞 {client.tel}</div>
                            )}
                            {client.adresse && (
                              <div className="text-[var(--espresso-light)]">📍 {client.adresse}</div>
                            )}
                            {(client.ville_naissance || client.pays_naissance) && (
                              <div className="text-[var(--espresso-light)]">
                                🌍 {client.ville_naissance}, {client.pays_naissance}
                              </div>
                            )}
                          </div>

                          <div className="mt-4 pt-4 border-t border-white">
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-[var(--espresso-light)]">Total facturé</span>
                              <span className="font-bold text-[var(--espresso)] text-lg">{getClientTotal(client).toFixed(2)}€</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Stats Tab */}
            {activeTab === 'stats' && (
              <div className="bg-white rounded-3xl p-8 shadow-2xl">
                <h3 className="font-fraunces text-2xl text-[var(--espresso)] mb-8 flex items-center gap-3">
                  <TrendingUp size={28} />
                  Résumé financier
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-4 border-b border-[var(--cream)]">
                    <span className="text-[var(--espresso-light)] font-medium">Nombre de factures</span>
                    <span className="font-bold text-[var(--espresso)] text-xl">{factures.length}</span>
                  </div>
                  <div className="flex justify-between items-center py-4 border-b border-[var(--cream)]">
                    <span className="text-[var(--espresso-light)] font-medium">Nombre de clients</span>
                    <span className="font-bold text-[var(--espresso)] text-xl">{clients.length}</span>
                  </div>
                  <div className="flex justify-between items-center py-4 border-b border-[var(--cream)]">
                    <span className="text-[var(--espresso-light)] font-medium">Total facturé</span>
                    <span className="font-bold text-[var(--espresso)] text-2xl">{totalFacture.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between items-center py-4 border-b border-[var(--cream)]">
                    <span className="text-[var(--espresso-light)] font-medium">Montant payé</span>
                    <span className="font-bold text-green-600 text-2xl">{totalPaye.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between items-center py-4 border-b border-[var(--cream)]">
                    <span className="text-[var(--espresso-light)] font-medium">En attente de paiement</span>
                    <span className="font-bold text-orange-600 text-2xl">{totalEnAttente.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between items-center py-4">
                    <span className="text-[var(--espresso-light)] font-medium">Taux de paiement</span>
                    <span className="font-bold text-[var(--espresso)] text-2xl">
                      {factures.length > 0 ? Math.round((factures.filter(f => f.status === 'payee').length / factures.length) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Modal Facture */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-5">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-fraunces text-2xl text-[var(--espresso)] font-bold">
                  {editingFacture ? 'Modifier la facture' : 'Nouvelle facture'}
                </h2>
                <button 
                  onClick={() => setShowModal(false)} 
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[var(--cream)] transition-all text-[var(--espresso-light)] hover:text-[var(--espresso)] cursor-pointer bg-transparent border-none text-2xl"
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[var(--espresso)] uppercase mb-2">Client *</label>
                  {clients.length > 0 ? (
                    <select
                      required
                      value={formData.client}
                      onChange={(e) => setFormData({...formData, client: e.target.value})}
                      className="w-full py-3 px-4 border-2 border-[var(--sand)] rounded-xl text-sm focus:border-[var(--espresso)] focus:outline-none bg-white"
                    >
                      <option value="">Sélectionner un client</option>
                      {clients.map(c => (
                        <option key={c.id} value={getClientFullName(c)}>{getClientFullName(c)}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      required
                      value={formData.client}
                      onChange={(e) => setFormData({...formData, client: e.target.value})}
                      className="w-full py-3 px-4 border-2 border-[var(--sand)] rounded-xl text-sm focus:border-[var(--espresso)] focus:outline-none"
                      placeholder="Nom du client"
                    />
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[var(--espresso)] uppercase mb-2">Montant (€) *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.montant}
                      onChange={(e) => setFormData({...formData, montant: e.target.value})}
                      className="w-full py-3 px-4 border-2 border-[var(--sand)] rounded-xl text-sm focus:border-[var(--espresso)] focus:outline-none"
                      placeholder="35.00"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[var(--espresso)] uppercase mb-2">Date *</label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="w-full py-3 px-4 border-2 border-[var(--sand)] rounded-xl text-sm focus:border-[var(--espresso)] focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--espresso)] uppercase mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full py-3 px-4 border-2 border-[var(--sand)] rounded-xl text-sm focus:border-[var(--espresso)] focus:outline-none resize-none"
                    rows={3}
                    placeholder="Cours particulier de maths..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--espresso)] uppercase mb-2">Statut</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full py-3 px-4 border-2 border-[var(--sand)] rounded-xl text-sm focus:border-[var(--espresso)] focus:outline-none bg-white"
                  >
                    <option value="en_attente">En attente</option>
                    <option value="payee">Payée</option>
                  </select>
                </div>
                <div className="flex gap-3 mt-6">
                  <button 
                    type="submit" 
                    className="flex-1 py-4 bg-[var(--espresso)] text-white rounded-2xl font-bold text-sm hover:bg-[var(--espresso)]/90 transition-all cursor-pointer border-none"
                  >
                    {editingFacture ? 'Enregistrer' : 'Créer la facture'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowModal(false)} 
                    className="flex-1 py-4 bg-[var(--cream)] text-[var(--espresso)] rounded-2xl font-semibold text-sm hover:bg-[var(--sand)] transition-all cursor-pointer border-none"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Client */}
        {showClientModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-5">
            <div className="bg-white rounded-3xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-fraunces text-2xl text-[var(--espresso)] font-bold">
                  {editingClient ? 'Modifier le client' : 'Nouveau client'}
                </h2>
                <button 
                  onClick={() => setShowClientModal(false)} 
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[var(--cream)] transition-all text-[var(--espresso-light)] hover:text-[var(--espresso)] cursor-pointer bg-transparent border-none text-2xl"
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleClientSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[var(--espresso)] uppercase mb-2">Nom *</label>
                    <input
                      type="text"
                      required
                      value={clientFormData.nom}
                      onChange={(e) => setClientFormData({...clientFormData, nom: e.target.value})}
                      className="w-full py-3 px-4 border-2 border-[var(--sand)] rounded-xl text-sm focus:border-[var(--espresso)] focus:outline-none"
                      placeholder="Dupont"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[var(--espresso)] uppercase mb-2">Prénom *</label>
                    <input
                      type="text"
                      required
                      value={clientFormData.prenom}
                      onChange={(e) => setClientFormData({...clientFormData, prenom: e.target.value})}
                      className="w-full py-3 px-4 border-2 border-[var(--sand)] rounded-xl text-sm focus:border-[var(--espresso)] focus:outline-none"
                      placeholder="Jean"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--espresso)] uppercase mb-2">Adresse</label>
                  <textarea
                    value={clientFormData.adresse}
                    onChange={(e) => setClientFormData({...clientFormData, adresse: e.target.value})}
                    className="w-full py-3 px-4 border-2 border-[var(--sand)] rounded-xl text-sm focus:border-[var(--espresso)] focus:outline-none resize-none"
                    rows={2}
                    placeholder="12 rue de la Paix, 75001 Paris"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[var(--espresso)] uppercase mb-2">Pays de naissance</label>
                    <input
                      type="text"
                      value={clientFormData.pays_naissance}
                      onChange={(e) => setClientFormData({...clientFormData, pays_naissance: e.target.value})}
                      className="w-full py-3 px-4 border-2 border-[var(--sand)] rounded-xl text-sm focus:border-[var(--espresso)] focus:outline-none"
                      placeholder="France"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[var(--espresso)] uppercase mb-2">Ville de naissance</label>
                    <input
                      type="text"
                      value={clientFormData.ville_naissance}
                      onChange={(e) => setClientFormData({...clientFormData, ville_naissance: e.target.value})}
                      className="w-full py-3 px-4 border-2 border-[var(--sand)] rounded-xl text-sm focus:border-[var(--espresso)] focus:outline-none"
                      placeholder="Paris"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[var(--espresso)] uppercase mb-2">Email</label>
                    <input
                      type="email"
                      value={clientFormData.email}
                      onChange={(e) => setClientFormData({...clientFormData, email: e.target.value})}
                      className="w-full py-3 px-4 border-2 border-[var(--sand)] rounded-xl text-sm focus:border-[var(--espresso)] focus:outline-none"
                      placeholder="email@exemple.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[var(--espresso)] uppercase mb-2">Téléphone</label>
                    <input
                      type="tel"
                      value={clientFormData.tel}
                      onChange={(e) => setClientFormData({...clientFormData, tel: e.target.value})}
                      className="w-full py-3 px-4 border-2 border-[var(--sand)] rounded-xl text-sm focus:border-[var(--espresso)] focus:outline-none"
                      placeholder="06 12 34 56 78"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--espresso)] uppercase mb-2">RIB / IBAN</label>
                  <input
                    type="text"
                    value={clientFormData.rib}
                    onChange={(e) => setClientFormData({...clientFormData, rib: e.target.value})}
                    className="w-full py-3 px-4 border-2 border-[var(--sand)] rounded-xl text-sm focus:border-[var(--espresso)] focus:outline-none font-mono"
                    placeholder="FR76 1234 5678 9012 3456 7890 123"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--espresso)] uppercase mb-2">Titulaire du compte IBAN</label>
                  <input
                    type="text"
                    value={clientFormData.titulaire_iban}
                    onChange={(e) => setClientFormData({...clientFormData, titulaire_iban: e.target.value})}
                    className="w-full py-3 px-4 border-2 border-[var(--sand)] rounded-xl text-sm focus:border-[var(--espresso)] focus:outline-none"
                    placeholder="Nom du titulaire du compte"
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  <button 
                    type="submit" 
                    className="flex-1 py-4 bg-[var(--espresso)] text-white rounded-2xl font-bold text-sm hover:bg-[var(--espresso)]/90 transition-all cursor-pointer border-none"
                  >
                    {editingClient ? 'Enregistrer' : 'Ajouter le client'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowClientModal(false)} 
                    className="flex-1 py-4 bg-[var(--cream)] text-[var(--espresso)] rounded-2xl font-semibold text-sm hover:bg-[var(--sand)] transition-all cursor-pointer border-none"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
    </>
  )
}