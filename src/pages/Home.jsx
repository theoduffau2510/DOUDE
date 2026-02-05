import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, LineChart, Sparkles, Star, Check, ArrowRight, Target, BarChart3, Zap, Clock, Shield, TrendingUp, Users, FileText } from 'lucide-react'

import dashboardImg from '../assets/dashboard.png'
import planningImg from '../assets/planning.png'
import studentImg from '../assets/student-detail.png'
import SuiviprofImg from '../assets/Suiviprof.png'


export default function Home() {
  const navigate = useNavigate()
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0')
          entry.target.classList.remove('opacity-0', 'translate-y-8')
        }
      })
    }, observerOptions)

    const elements = document.querySelectorAll('.fade-in-up')
    elements.forEach(el => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <main className="flex-1 bg-white">
      <style>{`
        :root {
          --cream: #FAF7F0;
          --sand: #E8DCC4;
          --caramel: #C9A87C;
          --caramel-dark: #A67C52;
          --sage: #8B9D83;
          --sage-dark: #6B7D63;
          --espresso: #4A3428;
          --espresso-light: #6B5638;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        /* Smooth scroll pour iOS */
        * {
          -webkit-tap-highlight-color: transparent;
        }
      `}</style>

      {/* HERO SECTION - OPTIMISÉ MOBILE */}
      <section className="relative min-h-[85vh] md:min-h-screen flex items-center justify-center overflow-hidden" style={{background: 'linear-gradient(to bottom right, #4A3428, #6B5638, #4A3428)'}}>
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-60 md:w-80 h-60 md:h-80 rounded-full blur-3xl animate-pulse" style={{backgroundColor: 'rgba(201, 168, 124, 0.2)'}}></div>
          <div className="absolute top-1/2 -left-40 w-72 md:w-96 h-72 md:h-96 rounded-full blur-3xl animate-pulse" style={{backgroundColor: 'rgba(139, 157, 131, 0.2)', animationDelay: '1s'}}></div>
          <div className="absolute bottom-0 right-1/4 w-56 md:w-72 h-56 md:h-72 rounded-full blur-3xl animate-pulse" style={{backgroundColor: 'rgba(232, 220, 196, 0.2)', animationDelay: '2s'}}></div>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            
            {/* LEFT SIDE - TEXTE OPTIMISÉ MOBILE */}
            <div className="text-center md:text-left">
              
              {/* Badge - Plus petit sur mobile */}
              <div className="inline-flex items-center gap-2 mb-6 md:mb-8 px-4 md:px-6 py-2 md:py-3 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 text-white text-xs md:text-sm font-medium">
                <Sparkles size={14} style={{color: 'var(--caramel)'}} />
                <span className="whitespace-nowrap">Version Beta</span>
              </div>
              
              {/* Main heading - Responsive */}
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-4 md:mb-6 leading-tight text-white">
                Gérez 50 élèves aussi facilement que{' '}
                <span className="text-transparent bg-clip-text inline md:block md:mt-2" style={{backgroundImage: 'linear-gradient(to right, var(--caramel), var(--sage), var(--sand))'}}>
                  5 élèves
                </span>
              </h1>
              
              {/* Sous-titre - Plus court sur mobile */}
              <p className="text-base sm:text-lg md:text-xl mb-6 md:mb-8 leading-relaxed font-light" style={{color: 'var(--sand)'}}>
                <span className="block mb-2">
                  <strong className="font-semibold text-white">Planning automatisé</strong> · <strong className="font-semibold text-white">Suivi en temps réel</strong>
                </span>
                <span className="text-sm md:text-base">Gagnez 10h/semaine</span>
              </p>

              {/* CTA Button - Optimisé tactile (min 44px iOS) */}
              <div className="mb-6 md:mb-8">
                <button 
                  onClick={() => navigate('/sign-up')}
                  className="group relative w-full md:w-auto px-8 md:px-10 py-4 md:py-5 bg-white text-slate-900 rounded-2xl font-bold text-lg md:text-xl overflow-hidden transition-all active:scale-95 md:hover:scale-105 hover:shadow-2xl cursor-pointer touch-manipulation" 
                  style={{
                    color: 'var(--espresso)', 
                    boxShadow: '0 20px 60px rgba(201, 168, 124, 0.4)',
                    minHeight: '56px' // iOS tactile minimum
                  }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2 md:gap-3">
                    Commencer gratuitement
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
                
                {/* Rassurance - Stack vertical sur mobile */}
                <div className="mt-4 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3 sm:gap-6 text-xs md:text-sm" style={{color: 'var(--sand)'}}>
                  <span className="flex items-center gap-2">
                    <Check size={14} style={{color: 'var(--sage)'}} />
                    30 jours gratuits
                  </span>
                  <span className="flex items-center gap-2">
                    <Check size={14} style={{color: 'var(--sage)'}} />
                    Sans CB
                  </span>
                  <span className="flex items-center gap-2">
                    <Check size={14} style={{color: 'var(--sage)'}} />
                    Annulation 1 clic
                  </span>
                </div>
              </div>

              {/* Lien connexion - Plus visible sur mobile */}
              <div className="text-sm md:text-base" style={{color: 'var(--sand)'}}>
                Déjà inscrit ?{' '}
                <button 
                  onClick={() => navigate('/sign-in')}
                  className="underline hover:no-underline font-medium transition-all cursor-pointer touch-manipulation"
                  style={{color: 'var(--caramel)', minHeight: '44px', display: 'inline-flex', alignItems: 'center'}}
                >
                  Se connecter
                </button>
              </div>
            </div>

            {/* RIGHT SIDE - Screenshot mobile-friendly */}
            <div className="hidden md:block">
              <div className="relative">
                {/* Screenshot sans effet 3D sur mobile */}
                <div 
                  className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border-2 md:border-4 border-white/20 transition-transform hover:scale-105 duration-500"
                  style={{transform: 'perspective(1200px) rotateY(-8deg) rotateX(3deg)'}}
                >
                  <img 
                    src={SuiviprofImg}
                    alt="Interface Doude"
                    className="w-full h-auto"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/10"></div>
                </div>
                
                {/* Badges - Plus petits et positionnés différemment sur mobile */}
                <div 
                  className="absolute -top-3 md:-top-4 -right-3 md:-right-4 bg-white rounded-xl md:rounded-2xl px-4 md:px-6 py-2 md:py-4 shadow-2xl"
                  style={{animation: 'float 3s ease-in-out infinite'}}
                >
                  <div className="text-xl md:text-3xl font-black" style={{color: 'var(--espresso)'}}>
                    +15h
                  </div>
                  <div className="text-[10px] md:text-xs font-medium" style={{color: 'var(--espresso-light)'}}>
                    /mois
                  </div>
                </div>
              </div>
            </div>

            {/* Screenshot mobile - Visible que sur mobile, après le texte */}
            <div className="md:hidden mt-8">
              <div className="relative mx-auto max-w-sm">
                <div className="relative rounded-2xl overflow-hidden shadow-xl border-2 border-white/20">
                  <img 
                    src={SuiviprofImg}
                    alt="Interface Doude"
                    className="w-full h-auto"
                    loading="eager"
                  />
                </div>
                
                {/* Badge simple sur mobile */}
                <div 
                  className="absolute -top-2 -right-2 bg-white rounded-xl px-3 py-2 shadow-lg"
                >
                  <div className="text-lg font-black" style={{color: 'var(--espresso)'}}>
                    +15h
                  </div>
                  <div className="text-[9px] font-medium" style={{color: 'var(--espresso-light)'}}>
                    /mois
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Scroll indicator - Caché sur mobile */}
        <div className="hidden md:block absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF - Mobile optimisé */}
      <section className="py-8 md:py-12 px-4 md:px-6 border-b" style={{backgroundColor: 'var(--cream)', borderColor: 'var(--sand)'}}>
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-xs md:text-sm font-medium mb-4 md:mb-6" style={{color: 'var(--espresso-light)'}}>
            Rejoint par des professeurs de toute la France
          </p>
          <div className="flex items-center justify-center gap-4 md:gap-8 flex-wrap">
            <div className="flex items-center gap-2">
              <Users size={16} style={{color: 'var(--sage)'}} />
              <span className="font-bold text-xs md:text-base" style={{color: 'var(--espresso)'}}>Beta actifs</span>
            </div>
            <div className="flex items-center gap-2">
              <Star size={16} style={{color: 'var(--caramel)'}} fill="var(--caramel)" />
              <span className="font-bold text-xs md:text-base" style={{color: 'var(--espresso)'}}>Retours +</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp size={16} style={{color: 'var(--sage)'}} />
              <span className="font-bold text-xs md:text-base" style={{color: 'var(--espresso)'}}>Dev actif</span>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLÈME - Mobile optimisé */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4 md:mb-6" style={{color: 'var(--espresso)'}}>
              Vous perdez combien d'heures par semaine ?
            </h2>
            <p className="text-base md:text-xl" style={{color: 'var(--espresso-light)'}}>
              Les profs jonglent avec 5 outils différents
            </p>
          </div>

          {/* Grid responsive - 1 colonne mobile, 2 desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {[
              { emoji: "📧", title: "Emails interminables", desc: "Coordination, annulations, reports..." },
              { emoji: "📊", title: "Excel impossible", desc: "Tableaux complexes par élève" },
              { emoji: "🗓️", title: "Agenda saturé", desc: "Ratures, post-its, double-bookings" },
              { emoji: "📁", title: "Documents éparpillés", desc: "Drive, Dropbox, ordinateur, tel..." }
            ].map((problem, idx) => (
              <div 
                key={idx}
                className="p-5 md:p-6 rounded-xl md:rounded-2xl border-2 touch-manipulation"
                style={{backgroundColor: 'var(--cream)', borderColor: 'var(--sand)'}}
              >
                <div className="text-3xl md:text-4xl mb-2 md:mb-3">{problem.emoji}</div>
                <h3 className="text-base md:text-lg font-bold mb-1 md:mb-2" style={{color: 'var(--espresso)'}}>
                  {problem.title}
                </h3>
                <p className="text-xs md:text-sm leading-relaxed" style={{color: 'var(--espresso-light)'}}>
                  {problem.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 md:mt-12 text-center">
            <div className="inline-block px-5 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl" style={{backgroundColor: 'rgba(139, 157, 131, 0.1)'}}>
              <p className="text-xl md:text-2xl font-black mb-1" style={{color: 'var(--espresso)'}}>
                = 10h perdues/semaine
              </p>
              <p className="text-xs md:text-sm" style={{color: 'var(--espresso-light)'}}>
                40h/mois en administratif
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* APERÇU INTERFACE - Carousel sur mobile, Grid sur desktop */}
      <section className="py-16 md:py-24 px-4 md:px-6" style={{backgroundColor: 'var(--cream)'}}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-block px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-bold mb-4 md:mb-6" style={{backgroundColor: 'rgba(201, 168, 124, 0.15)', color: 'var(--caramel-dark)'}}>
              APERÇU
            </div>
            <h2 className="text-3xl md:text-5xl font-black mb-4 md:mb-6" style={{color: 'var(--espresso)'}}>
              Simple, claire, efficace
            </h2>
            <p className="text-base md:text-xl px-4" style={{color: 'var(--espresso-light)'}}>
              L'interface pensée pour les profs
            </p>
          </div>

          {/* Grid - 1 col mobile, 3 cols desktop */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-sm md:max-w-none mx-auto">
            {[
              {
                img: dashboardImg,
                title: 'Vue d\'ensemble',
                desc: 'Vos élèves et progressions en un coup d\'œil',
                color: 'var(--sage)',
                icon: Users
              },
              {
                img: planningImg,
                title: 'Planning',
                desc: 'Gérez vos créneaux facilement',
                color: 'var(--caramel)',
                icon: Calendar
              },
              {
                img: studentImg,
                title: 'Suivi détaillé',
                desc: 'Courbes et objectifs personnalisés',
                color: 'var(--espresso)',
                icon: LineChart
              }
            ].map((item, idx) => (
              <div 
                key={idx} 
                className="group cursor-pointer touch-manipulation"
              >
                <div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-4 shadow-lg hover:shadow-2xl transition-all duration-500 active:scale-95 md:hover:-translate-y-2">
                  <div className="rounded-lg md:rounded-xl overflow-hidden mb-3 md:mb-4 border-2 relative" style={{borderColor: 'var(--sand)'}}>
                    <img 
                      src={item.img} 
                      alt={item.title}
                      className="w-full h-auto group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
                  </div>
                  
                  <div className="flex items-start gap-2 md:gap-3">
                    <div 
                      className="w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{backgroundColor: `${item.color}20`}}
                    >
                      <item.icon size={18} style={{color: item.color}} />
                    </div>
                    <div>
                      <h3 className="text-base md:text-lg font-bold mb-1" style={{color: 'var(--espresso)'}}>
                        {item.title}
                      </h3>
                      <p className="text-xs md:text-sm leading-relaxed" style={{color: 'var(--espresso-light)'}}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES - Simplifié mobile */}
      <section className="py-16 md:py-32 px-4 md:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-20">
            <div className="inline-block px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-bold mb-4 md:mb-6" style={{backgroundColor: 'rgba(201, 168, 124, 0.15)', color: 'var(--caramel-dark)'}}>
              LA SOLUTION
            </div>
            <h2 className="text-3xl md:text-6xl font-black mb-4 md:mb-6 px-4" style={{color: 'var(--espresso)'}}>
              Un seul outil. Tout centralisé.
            </h2>
            <p className="text-base md:text-xl max-w-2xl mx-auto px-4" style={{color: 'var(--espresso-light)'}}>
              Plus besoin de jongler entre 5 apps
            </p>
          </div>

          {/* Cards - Stack sur mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: LineChart,
                title: "Suivi en temps réel",
                desc: "Graphiques de progression, objectifs personnalisés. Voyez qui progresse instantanément.",
                gradient: 'linear-gradient(to bottom right, var(--sage), var(--sage-dark))',
                link: '/suivi'
              },
              {
                icon: Calendar,
                title: "Planning intelligent",
                desc: "Créneaux auto, rappels email, gestion annulations. Sync Google Calendar.",
                gradient: 'linear-gradient(to bottom right, var(--caramel), var(--caramel-dark))',
                link: '/emploi'
              }
            ].map((feature, idx) => (
              <div
                key={idx}
                onClick={() => navigate(feature.link)}
                className="group cursor-pointer touch-manipulation"
              >
                <div className="relative h-full bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border active:scale-95 md:hover:-translate-y-2" style={{borderColor: 'var(--sand)'}}>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-5 rounded-2xl md:rounded-3xl transition-opacity duration-500" style={{background: feature.gradient}}></div>

                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center mb-5 md:mb-6 group-hover:scale-110 transition-transform duration-500" style={{background: feature.gradient}}>
                    <feature.icon size={28} className="text-white" />
                  </div>

                  <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4" style={{color: 'var(--espresso)'}}>
                    {feature.title}
                  </h3>

                  <p className="leading-relaxed mb-5 md:mb-6 text-sm md:text-base" style={{color: 'var(--espresso-light)'}}>
                    {feature.desc}
                  </p>

                  <div className="inline-flex items-center gap-2 font-bold text-sm md:text-base group-hover:gap-3 transition-all" style={{color: idx === 0 ? 'var(--sage)' : 'var(--caramel)'}}>
                    Découvrir
                    <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS - Grid responsive */}
      <section className="py-16 md:py-32 px-4 md:px-6" style={{backgroundColor: 'var(--cream)'}}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-20">
            <div className="inline-block px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-bold mb-4 md:mb-6" style={{backgroundColor: 'rgba(139, 157, 131, 0.15)', color: 'var(--sage-dark)'}}>
              AVANTAGES
            </div>
            <h2 className="text-3xl md:text-6xl font-black mb-4 md:mb-6" style={{color: 'var(--espresso)'}}>
              Pourquoi Doude ?
            </h2>
          </div>

          {/* 2 cols mobile, 3 cols desktop */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[
              { icon: Target, title: "Suivi perso", desc: "Objectifs sur mesure" },
              { icon: BarChart3, title: "Graphiques", desc: "Progression instantanée" },
              { icon: Clock, title: "Gain temps", desc: "10h/semaine minimum" },
              { icon: Calendar, title: "Planning", desc: "Créneaux simplifiés" },
              { icon: Shield, title: "Sécurisé", desc: "Protection maximale" },
              { icon: Zap, title: "Rapide", desc: "Fluidité totale" }
            ].map((benefit, idx) => (
              <div 
                key={idx}
                className="group"
              >
                <div className="h-full p-5 md:p-8 rounded-2xl md:rounded-3xl hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent" style={{backgroundColor: 'var(--cream)', borderColor: 'var(--sand)'}}>
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center mb-3 md:mb-5 group-hover:scale-110 transition-transform" style={{backgroundColor: 'rgba(139, 157, 131, 0.15)'}}>
                    <benefit.icon style={{color: 'var(--sage)'}} size={24} />
                  </div>
                  <h3 className="text-base md:text-xl font-bold mb-1 md:mb-2" style={{color: 'var(--espresso)'}}>
                    {benefit.title}
                  </h3>
                  <p className="text-xs md:text-sm leading-relaxed" style={{color: 'var(--espresso-light)'}}>
                    {benefit.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIAL - Mobile optimisé */}
      <section className="py-16 md:py-32 px-4 md:px-6 relative overflow-hidden" style={{background: 'linear-gradient(to bottom right, var(--espresso), var(--espresso-light), var(--espresso))'}}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-64 md:w-96 h-64 md:h-96 rounded-full blur-3xl" style={{backgroundColor: 'var(--caramel)'}}></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 md:w-96 h-64 md:h-96 rounded-full blur-3xl" style={{backgroundColor: 'var(--sage)'}}></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex justify-center gap-1 md:gap-2 mb-6 md:mb-8">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={20} fill="#C9A87C" style={{color: '#C9A87C'}} />
            ))}
          </div>
          
          <blockquote className="text-xl md:text-4xl text-white font-medium leading-relaxed mb-8 md:mb-10 text-center px-4">
            "Doude m'accompagne au quotidien. Je gagne en{' '}
            <span className="font-bold text-transparent bg-clip-text" style={{backgroundImage: 'linear-gradient(to right, var(--caramel), var(--sage))'}}>
              organisation et crédibilité
            </span>
            {' '}auprès des familles."
          </blockquote>
          
          <div className="flex items-center justify-center gap-3 md:gap-4">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-xl" style={{background: 'linear-gradient(to bottom right, var(--sage), var(--sage-dark))'}}>
              TD
            </div>
            <div className="text-left">
              <div className="font-bold text-white text-base md:text-lg">Théo D.</div>
              <div className="text-xs md:text-sm" style={{color: 'var(--sand)'}}>Prof Maths · Beta</div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING - Mobile optimisé */}
      <section className="py-16 md:py-32 px-4 md:px-6" style={{backgroundColor: 'var(--cream)'}}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-20">
            <div className="inline-block px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-bold mb-4 md:mb-6" style={{backgroundColor: 'rgba(139, 157, 131, 0.15)', color: 'var(--sage-dark)'}}>
              TARIFS
            </div>
            <h2 className="text-3xl md:text-6xl font-black mb-4 md:mb-6 px-4" style={{color: 'var(--espresso)'}}>
              Prix simples et transparents
            </h2>
            <p className="text-sm md:text-xl max-w-2xl mx-auto px-4" style={{color: 'var(--espresso-light)'}}>
              30 jours gratuits · Sans CB
            </p>
          </div>

          {/* Stack vertical sur mobile, grid sur desktop */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-sm md:max-w-6xl mx-auto">
            {[
              {
                name: "Découverte",
                tagline: "Pour tester",
                price: "0",
                annual: null,
                features: ["5 élèves max", "Planning basique", "Suivi progression", "Upload PDF"],
                cta: "Gratuit",
                featured: false,
                description: "Gratuit à vie"
              },
              {
                name: "Pro",
                tagline: "Populaire",
                price: "5,99",
                annual: "60€/an (2 mois off.)",
                features: ["10 élèves max", "Planning avancé", "Stats détaillées", "PDF illimité", "Support 48h"],
                cta: "Essai 30j",
                featured: true,
              },
              {
                name: "Premium",
                tagline: "Pour les pros",
                price: "8,99",
                annual: "90€/an (2 mois off.)",
                features: ["Illimité", "Stats avancées", "Export données", "Intégrations", "Support <24h"],
                cta: "Essai 30j",
                featured: false,
              }
            ].map((plan, idx) => (
              <div 
                key={idx}
                className={`${plan.featured ? 'md:scale-105 order-first md:order-none' : ''}`}
              >
                <div className={`relative h-full bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 transition-all duration-300 hover:shadow-2xl ${
                  plan.featured 
                    ? 'shadow-2xl border-2' 
                    : 'shadow-lg border'
                }`} style={{borderColor: plan.featured ? 'var(--caramel)' : 'var(--sand)'}}>
                  {plan.featured && (
                    <div className="absolute -top-3 md:-top-4 left-1/2 -translate-x-1/2 px-3 md:px-4 py-1 md:py-1.5 text-white rounded-full text-xs font-bold uppercase shadow-lg" style={{background: 'linear-gradient(to right, var(--caramel), var(--caramel-dark))'}}>
                      {plan.tagline}
                    </div>
                  )}
                  
                  <div className={plan.featured ? 'mt-2' : ''}>
                    <h3 className="text-xl md:text-2xl font-black mb-1 md:mb-2" style={{color: 'var(--espresso)'}}>
                      {plan.name}
                    </h3>
                    <p className="text-xs md:text-sm mb-3 md:mb-4" style={{color: 'var(--espresso-light)'}}>
                      {!plan.featured && plan.tagline}
                    </p>
                    
                    <div className="mb-5 md:mb-6">
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl md:text-5xl font-black" style={{color: 'var(--espresso)'}}>
                          {plan.price}€
                        </span>
                        <span className="text-sm" style={{color: 'var(--espresso-light)'}}>/ mois</span>
                      </div>
                      {plan.description && (
                        <p className="text-xs mt-2 font-medium" style={{color: 'var(--espresso-light)'}}>
                          {plan.description}
                        </p>
                      )}
                      {plan.annual && (
                        <p className="text-xs font-bold mt-2" style={{color: 'var(--sage)'}}>
                          {plan.annual}
                        </p>
                      )}
                    </div>

                    <ul className="space-y-2 md:space-y-3 mb-6 md:mb-8">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 md:gap-3 text-xs md:text-sm" style={{color: 'var(--espresso-light)'}}>
                          <Check size={16} className="flex-shrink-0 mt-0.5" style={{color: 'var(--sage)'}} />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button 
                      onClick={() => navigate('/sign-up')}
                      className={`w-full py-3.5 md:py-4 px-6 rounded-xl md:rounded-2xl font-bold text-sm md:text-base transition-all cursor-pointer touch-manipulation ${
                      plan.featured
                        ? 'text-white hover:shadow-xl'
                        : 'hover:opacity-90'
                    }`} style={{
                      background: plan.featured 
                        ? 'linear-gradient(to right, var(--caramel), var(--caramel-dark))' 
                        : 'var(--espresso)',
                      color: 'white',
                      boxShadow: plan.featured ? '0 20px 40px rgba(201, 168, 124, 0.3)' : 'none',
                      minHeight: '50px'
                    }}>
                      {plan.cta}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8 md:mt-12">
            <p className="inline-flex items-center gap-2 text-xs md:text-sm flex-wrap justify-center px-4" style={{color: 'var(--espresso-light)'}}>
              <Check size={14} style={{color: 'var(--sage)'}} />
              <span>30j gratuit</span>
              <span>•</span>
              <span>Sans engagement</span>
              <span>•</span>
              <span>Annulation 1 clic</span>
            </p>
          </div>
        </div>
      </section>

      {/* CTA FINAL - Mobile optimisé */}
      <section className="relative py-16 md:py-32 px-4 md:px-6 overflow-hidden" style={{background: 'linear-gradient(to bottom, var(--caramel), var(--caramel-dark), var(--espresso))'}}>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-64 md:w-96 h-64 md:h-96 rounded-full blur-3xl" style={{backgroundColor: 'rgba(139, 157, 131, 0.3)'}}></div>
          <div className="absolute bottom-0 right-1/4 w-64 md:w-96 h-64 md:h-96 rounded-full blur-3xl" style={{backgroundColor: 'rgba(232, 220, 196, 0.3)'}}></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-6xl font-black text-white mb-4 md:mb-6 leading-tight px-4">
            Prêt à gagner
            <br />
            10 heures par semaine ?
          </h2>
          <p className="text-base md:text-xl mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed px-4" style={{color: 'var(--sand)'}}>
            Rejoignez les profs qui ont choisi la simplicité
          </p>
          
          <button 
           onClick={() => navigate('/sign-up')}
          className="group px-8 md:px-10 py-4 md:py-5 bg-white rounded-xl md:rounded-2xl font-bold text-base md:text-lg active:scale-95 md:hover:scale-105 transition-all hover:shadow-2xl cursor-pointer touch-manipulation w-full max-w-md mx-auto" 
          style={{
            color: 'var(--espresso)', 
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            minHeight: '56px'
          }}>
            <span className="flex items-center justify-center gap-2 md:gap-3">
              Commencer - 30 jours gratuits
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
          
          <p className="mt-5 md:mt-6 text-xs md:text-sm inline-flex items-center gap-2 justify-center" style={{color: 'var(--sand)'}}>
            <Check size={14} style={{color: 'var(--sage)'}} />
            Sans carte bancaire
          </p>
        </div>
      </section>
    </main>
  )
}