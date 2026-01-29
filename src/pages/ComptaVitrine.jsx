import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DollarSign, TrendingUp, FileText, Download, CheckCircle, ArrowRight, Sparkles, CreditCard, PieChart, Calendar } from 'lucide-react'

export default function ComptaVitrine() {

  const navigate = useNavigate();
  
  const [selectedMonth, setSelectedMonth] = useState(0)

  const moisDemo = ['Janvier', 'Février', 'Mars']
  
  const statsDemo = [
    { revenu: 2840, paiements: 18, enAttente: 2, factures: 20 },
    { revenu: 3120, paiements: 21, enAttente: 1, factures: 22 },
    { revenu: 2950, paiements: 19, enAttente: 3, factures: 22 }
  ]

  const transactionsDemo = [
    [
      { date: '15 Jan', eleve: 'Sophie M.', montant: 180, statut: 'payé', type: 'Cours Maths' },
      { date: '12 Jan', eleve: 'Lucas D.', montant: 200, statut: 'payé', type: 'Cours Physique' },
      { date: '10 Jan', eleve: 'Emma L.', montant: 90, statut: 'en attente', type: 'Cours Maths' },
      { date: '08 Jan', eleve: 'Thomas B.', montant: 150, statut: 'payé', type: 'Cours Chimie' },
      { date: '05 Jan', eleve: 'Marie P.', montant: 120, statut: 'payé', type: 'Cours SVT' }
    ],
    [
      { date: '20 Fév', eleve: 'Sophie M.', montant: 180, statut: 'payé', type: 'Cours Maths' },
      { date: '18 Fév', eleve: 'Lucas D.', montant: 200, statut: 'payé', type: 'Cours Physique' },
      { date: '15 Fév', eleve: 'Emma L.', montant: 90, statut: 'payé', type: 'Cours Maths' },
      { date: '12 Fév', eleve: 'Thomas B.', montant: 150, statut: 'en attente', type: 'Cours Chimie' },
      { date: '10 Fév', eleve: 'Marie P.', montant: 120, statut: 'payé', type: 'Cours SVT' }
    ],
    [
      { date: '18 Mar', eleve: 'Sophie M.', montant: 180, statut: 'payé', type: 'Cours Maths' },
      { date: '15 Mar', eleve: 'Lucas D.', montant: 200, statut: 'en attente', type: 'Cours Physique' },
      { date: '12 Mar', eleve: 'Emma L.', montant: 90, statut: 'payé', type: 'Cours Maths' },
      { date: '10 Mar', eleve: 'Thomas B.', montant: 150, statut: 'en attente', type: 'Cours Chimie' },
      { date: '08 Mar', eleve: 'Marie P.', montant: 120, statut: 'payé', type: 'Cours SVT' }
    ]
  ]

  const stats = statsDemo[selectedMonth]
  const transactions = transactionsDemo[selectedMonth]

  return (
    <div className="min-h-screen bg-[var(--cream)]">
      {/* HERO */}
      <section className="bg-gradient-to-br from-[var(--espresso)] to-[var(--espresso)]/80 text-white py-20 px-5 md:px-10">
        <div className="max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
            <Sparkles size={16} />
            Comptabilité
          </div>
          
          <h1 className="font-fraunces text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Gérez vos finances<br />en toute sérénité
          </h1>
          
          <p className="text-xl opacity-90 mb-8 max-w-2xl">
            Paiements, factures et revenus. Tout votre suivi comptable au même endroit pour rester zen et focus sur l'enseignement.
          </p>

          <button 
  onClick={() => navigate('/signup')} // Ou '/auth' selon votre route
  className="py-4 px-8 bg-white text-[var(--espresso)] rounded-full font-semibold text-base hover-scale cursor-pointer border-none shadow-xl inline-flex items-center gap-2"
>
  Essayer gratuitement
  <ArrowRight size={20} />
</button>

        </div>
      </section>

      {/* DÉMO INTERACTIVE */}
      <section className="py-20 px-5 md:px-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-fraunces text-4xl text-[var(--espresso)] font-bold mb-4">
              Tableau de bord comptable
            </h2>
            <p className="text-lg text-[var(--espresso-light)]">
              Cliquez sur un mois pour voir les détails
            </p>
          </div>

          {/* Sélecteur de mois */}
          <div className="flex gap-3 justify-center mb-8 flex-wrap">
            {moisDemo.map((mois, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedMonth(idx)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  selectedMonth === idx
                    ? 'bg-[var(--espresso)] text-white shadow-xl scale-105'
                    : 'bg-white text-[var(--espresso)] hover:shadow-lg'
                }`}
              >
                {mois} 2025
                <div className="text-xs mt-1 opacity-75">{statsDemo[idx].revenu}€</div>
              </button>
            ))}
          </div>

          {/* Stats du mois */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <DollarSign size={24} />
                <TrendingUp size={20} className="opacity-75" />
              </div>
              <div className="text-3xl font-bold mb-1">{stats.revenu}€</div>
              <div className="text-sm opacity-90">Revenus du mois</div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle size={24} className="text-green-500" />
              </div>
              <div className="text-3xl font-bold text-[var(--espresso)] mb-1">{stats.paiements}</div>
              <div className="text-sm text-[var(--espresso-light)]">Paiements reçus</div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <Calendar size={24} className="text-orange-500" />
              </div>
              <div className="text-3xl font-bold text-[var(--espresso)] mb-1">{stats.enAttente}</div>
              <div className="text-sm text-[var(--espresso-light)]">En attente</div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <FileText size={24} className="text-[var(--caramel)]" />
              </div>
              <div className="text-3xl font-bold text-[var(--espresso)] mb-1">{stats.factures}</div>
              <div className="text-sm text-[var(--espresso-light)]">Factures émises</div>
            </div>
          </div>

          {/* Transactions */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-fraunces text-2xl text-[var(--espresso)] font-bold">
                Transactions récentes
              </h3>
              <button className="px-4 py-2 bg-[var(--espresso)] text-white rounded-lg text-sm font-semibold hover:bg-[var(--espresso)]/90 transition-all flex items-center gap-2">
                <Download size={16} />
                Exporter
              </button>
            </div>

            <div className="space-y-3">
              {transactions.map((transaction, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 rounded-xl bg-[var(--cream)] hover:bg-white hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      transaction.statut === 'payé' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-orange-100 text-orange-600'
                    }`}>
                      <CreditCard size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[var(--espresso)]">{transaction.eleve}</h4>
                      <p className="text-sm text-[var(--espresso-light)]">{transaction.type} • {transaction.date}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-bold text-[var(--espresso)] text-lg">{transaction.montant}€</div>
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        transaction.statut === 'payé'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {transaction.statut === 'payé' ? 'Payé' : 'En attente'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* GRAPHIQUE */}
      <section className="py-20 px-5 md:px-10 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-fraunces text-4xl text-[var(--espresso)] font-bold mb-12 text-center">
            Évolution de vos revenus
          </h2>

          <div className="bg-[var(--cream)] rounded-3xl p-8 md:p-12">
            <div className="flex justify-between items-end h-64">
              {[2200, 2500, 2840, 3120, 2950, 3200].map((montant, idx) => (
                <div key={idx} className="flex flex-col items-center gap-3 flex-1">
                  <div className="text-sm font-semibold text-[var(--espresso)]">{montant}€</div>
                  <div 
                    className="w-full bg-gradient-to-t from-[var(--espresso)] to-[var(--caramel)] rounded-t-xl transition-all hover:scale-105 cursor-pointer"
                    style={{ height: `${(montant / 3500) * 100}%` }}
                  />
                  <span className="text-xs text-[var(--espresso-light)]">
                    {['Sep', 'Oct', 'Nov', 'Déc', 'Jan', 'Fév'][idx]}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="mt-8 flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[var(--espresso)] rounded-full"></div>
                <span className="text-[var(--espresso-light)]">Revenus mensuels</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-green-600" />
                <span className="text-green-600 font-semibold">+12% sur 6 mois</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FONCTIONNALITÉS */}
      <section className="py-20 px-5 md:px-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-fraunces text-4xl text-[var(--espresso)] font-bold mb-12 text-center">
            Fonctionnalités incluses
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: DollarSign, title: "Suivi des paiements", desc: "Enregistrez tous vos paiements et suivez les impayés" },
              { icon: FileText, title: "Factures automatiques", desc: "Générez et envoyez des factures professionnelles" },
              { icon: PieChart, title: "Rapports détaillés", desc: "Visualisez vos revenus avec des graphiques clairs" },
              { icon: Download, title: "Export comptable", desc: "Exportez vos données pour votre comptable" },
              { icon: CreditCard, title: "Multi-paiements", desc: "Gérez espèces, virements, chèques et cartes" },
              { icon: TrendingUp, title: "Prévisions", desc: "Anticipez vos revenus avec les cours planifiés" }
            ].map((feature, idx) => (
              <div key={idx} className="p-6 bg-white rounded-2xl hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-[var(--espresso)]/10 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="text-[var(--espresso)]" size={24} />
                </div>
                <h3 className="font-semibold text-[var(--espresso)] mb-2">{feature.title}</h3>
                <p className="text-[var(--espresso-light)] text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 px-5 md:px-10 bg-gradient-to-b from-[var(--caramel)] via-[var(--caramel-dark)] to-[var(--espresso)] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-fraunces text-4xl md:text-5xl font-bold mb-6">
            Prenez le contrôle de vos finances
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Simplifiez votre comptabilité et concentrez-vous sur l'essentiel
          </p>
          <button 
  onClick={() => navigate('/signup')}
  className="py-4 px-10 bg-white text-[var(--espresso)] rounded-full font-bold text-lg hover-scale cursor-pointer border-none shadow-2xl"
>
  Commencer gratuitement
</button>
          <p className="text-sm opacity-75 mt-4 inline-flex items-center gap-2 justify-center">
            <CheckCircle size={16} />
            Aucune carte bancaire requise • 14 jours d'essai gratuit
          </p>
        </div>
      </section>
    </div>
  )
}