import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, LineChart, Sparkles, Star, Check, ArrowRight, Target, BarChart3, Zap, Clock, Shield } from 'lucide-react'

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
      `}</style>

      {/* HERO SECTION - Ultra moderne avec couleurs originales */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{background: 'linear-gradient(to bottom right, #4A3428, #6B5638, #4A3428)'}}>
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl animate-pulse" style={{backgroundColor: 'rgba(201, 168, 124, 0.2)'}}></div>
          <div className="absolute top-1/2 -left-40 w-96 h-96 rounded-full blur-3xl animate-pulse" style={{backgroundColor: 'rgba(139, 157, 131, 0.2)', animationDelay: '1s'}}></div>
          <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full blur-3xl animate-pulse" style={{backgroundColor: 'rgba(232, 220, 196, 0.2)', animationDelay: '2s'}}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-20 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-8 px-6 py-3 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 text-white text-sm font-medium">
            <Sparkles size={16} style={{color: 'var(--caramel)'}} />
            DOUDE, par un prof, pour les profs
          </div>
          
          {/* Main heading */}
          <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight text-white">
            Enseignez avec
            <br />
            <span className="text-transparent bg-clip-text" style={{backgroundImage: 'linear-gradient(to right, var(--caramel), var(--sage), var(--sand))'}}>
              simplicité
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed font-light" style={{color: 'var(--sand)'}}>
            Une plateforme tout-en-un pour gérer vos élèves, votre planning et faciliter votre travail de prof. 
            <br className="hidden md:block" />
          </p>

          {/* CTA Buttons */}
          <div className="flex gap-4 flex-wrap justify-center mb-20">
            <button 
              onClick={() => navigate('/sign-up')}
              className="group relative px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-2xl cursor-pointer" 
              style={{color: 'var(--espresso)', boxShadow: '0 20px 60px rgba(201, 168, 124, 0.3)'}}
            >
              <span className="relative z-10 flex items-center gap-2">
                Essai gratuit 14 jours
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <button 
              onClick={() => navigate('/sign-in')}
              className="px-8 py-4 bg-white/10 backdrop-blur-xl text-white rounded-2xl font-bold text-lg border border-white/20 hover:bg-white/20 transition-all cursor-pointer"
            >
              Se connecter
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center group cursor-default">
              <div className="text-5xl font-black mb-2 text-transparent bg-clip-text group-hover:scale-110 transition-transform" style={{backgroundImage: 'linear-gradient(to right, var(--caramel), var(--sand))'}}>
                50+
              </div>
              <div className="text-sm font-medium" style={{color: 'var(--sand)'}}>Professeurs actifs</div>
            </div>
            <div className="text-center group cursor-default">
              <div className="text-5xl font-black mb-2 text-transparent bg-clip-text group-hover:scale-110 transition-transform" style={{backgroundImage: 'linear-gradient(to right, var(--sage), var(--sand))'}}>
                150+
              </div>
              <div className="text-sm font-medium" style={{color: 'var(--sand)'}}>Élèves suivis</div>
            </div>
            <div className="text-center group cursor-default">
              <div className="text-5xl font-black mb-2 text-transparent bg-clip-text group-hover:scale-110 transition-transform" style={{backgroundImage: 'linear-gradient(to right, var(--caramel), var(--sage))'}}>
                4.9/5
              </div>
              <div className="text-sm font-medium" style={{color: 'var(--sand)'}}>Satisfaction</div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION - Cards modernes */}
      <section className="py-32 px-6 md:px-12" style={{backgroundColor: 'var(--cream)'}}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 fade-in-up opacity-0 translate-y-8 transition-all duration-700">
            <div className="inline-block px-4 py-2 rounded-full text-sm font-bold mb-6" style={{backgroundColor: 'rgba(201, 168, 124, 0.15)', color: 'var(--caramel-dark)'}}>
              FONCTIONNALITÉS
            </div>
            <h2 className="text-5xl md:text-6xl font-black mb-6" style={{color: 'var(--espresso)'}}>
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-xl max-w-2xl mx-auto" style={{color: 'var(--espresso-light)'}}>
              Des outils puissants et intuitifs pour simplifier votre quotidien de professeur
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: LineChart,
                title: "Suivi des élèves",
                desc: "Suivez la progression de chaque élève avec des graphiques clairs et des objectifs personnalisés.",
                gradient: 'linear-gradient(to bottom right, var(--sage), var(--sage-dark))',
                link: '/suivi'
              },
              {
                icon: Calendar,
                title: "Emploi du temps",
                desc: "Planifiez vos cours facilement avec un calendrier intelligent et des rappels automatiques.",
                gradient: 'linear-gradient(to bottom right, var(--caramel), var(--caramel-dark))',
                link: '/emploi'
              }
            ].map((feature, idx) => (
              <div
                key={idx}
                onClick={() => navigate(feature.link)}
                className="fade-in-up opacity-0 translate-y-8 transition-all duration-700 group cursor-pointer"
                style={{transitionDelay: `${idx * 100}ms`}}
              >
                <div className="relative h-full bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border hover:border-transparent hover:-translate-y-2" style={{borderColor: 'var(--sand)'}}>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-500" style={{background: feature.gradient}}></div>

                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500" style={{background: feature.gradient}}>
                    <feature.icon size={32} className="text-white" />
                  </div>

                  <h3 className="text-2xl font-bold mb-4" style={{color: 'var(--espresso)'}}>
                    {feature.title}
                  </h3>

                  <p className="leading-relaxed mb-6" style={{color: 'var(--espresso-light)'}}>
                    {feature.desc}
                  </p>

                  <div className="inline-flex items-center gap-2 font-bold group-hover:gap-3 transition-all" style={{color: idx === 0 ? 'var(--sage)' : 'var(--caramel)'}}>
                    Découvrir
                    <ArrowRight size={18} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS - Grid moderne */}
      <section className="py-32 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 fade-in-up opacity-0 translate-y-8 transition-all duration-700">
            <div className="inline-block px-4 py-2 rounded-full text-sm font-bold mb-6" style={{backgroundColor: 'rgba(139, 157, 131, 0.15)', color: 'var(--sage-dark)'}}>
              AVANTAGES
            </div>
            <h2 className="text-5xl md:text-6xl font-black mb-6" style={{color: 'var(--espresso)'}}>
              Pourquoi Doude ?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Target, title: "Suivi personnalisé", desc: "Objectifs sur mesure pour chaque élève" },
              { icon: BarChart3, title: "Graphiques clairs", desc: "Visualisez la progression instantanément" },
              { icon: Clock, title: "Gain de temps", desc: "Automatisez vos tâches répétitives" },
              { icon: Calendar, title: "Planning intelligent", desc: "Gérez vos créneaux en toute simplicité" },
              { icon: Shield, title: "Données sécurisées", desc: "Protection maximale de vos informations" },
              { icon: Zap, title: "Interface rapide", desc: "Réactivité et fluidité au quotidien" }
            ].map((benefit, idx) => (
              <div 
                key={idx}
                className="fade-in-up opacity-0 translate-y-8 transition-all duration-700 group"
                style={{transitionDelay: `${idx * 50}ms`}}
              >
                <div className="h-full p-8 rounded-3xl hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-opacity-100" style={{backgroundColor: 'var(--cream)', borderColor: 'var(--sand)'}}>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform" style={{backgroundColor: 'rgba(139, 157, 131, 0.15)'}}>
                    <benefit.icon style={{color: 'var(--sage)'}} size={28} />
                  </div>
                  <h3 className="text-xl font-bold mb-2" style={{color: 'var(--espresso)'}}>
                    {benefit.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{color: 'var(--espresso-light)'}}>
                    {benefit.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIAL - Design épuré */}
      <section className="py-32 px-6 md:px-12 relative overflow-hidden" style={{background: 'linear-gradient(to bottom right, var(--espresso), var(--espresso-light), var(--espresso))'}}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl" style={{backgroundColor: 'var(--caramel)'}}></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl" style={{backgroundColor: 'var(--sage)'}}></div>
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="fade-in-up opacity-0 translate-y-8 transition-all duration-700">
            <div className="flex justify-center gap-2 mb-8">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={28} fill="#C9A87C" style={{color: '#C9A87C'}} />
              ))}
            </div>
            
            <blockquote className="text-3xl md:text-4xl text-white font-medium leading-relaxed mb-10 text-center">
              "Doude m'accompagne au quotidien dans mon enseignement. Je gagne en 
              <span className="font-bold text-transparent bg-clip-text" style={{backgroundImage: 'linear-gradient(to right, var(--caramel), var(--sage))'}}> organisation et en crédibilité </span>
              auprès des élèves et des familles."
            </blockquote>
            
            <div className="flex items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-xl" style={{background: 'linear-gradient(to bottom right, var(--sage), var(--sage-dark))'}}>
                MC
              </div>
              <div className="text-left">
                <div className="font-bold text-white text-lg">Théo D.</div>
                <div style={{color: 'var(--sand)'}}>Professeur de Mathématiques</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING - Cartes modernes */}
      <section className="py-32 px-6 md:px-12" style={{backgroundColor: 'var(--cream)'}}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 fade-in-up opacity-0 translate-y-8 transition-all duration-700">
            <div className="inline-block px-4 py-2 rounded-full text-sm font-bold mb-6" style={{backgroundColor: 'rgba(139, 157, 131, 0.15)', color: 'var(--sage-dark)'}}>
              TARIFS
            </div>
            <h2 className="text-5xl md:text-6xl font-black mb-6" style={{color: 'var(--espresso)'}}>
              Des prix simples et transparents
            </h2>
            <p className="text-xl max-w-2xl mx-auto" style={{color: 'var(--espresso-light)'}}>
              Commencez gratuitement, évoluez à votre rythme
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Basique",
                tagline: "Pour découvrir",
                price: "0",
                annual: "0€/an ",
                features: ["Jusqu'à 3 élèves", "Emploi du temps basique","suivi des élèves basique","Upload des PDF"],
                cta: "En savoir plus",
                featured: false
              },
              {
                name: "Pro",
                tagline: "Le plus populaire",
                price: "5,99",
                annual: "60€/an (2 mois offerts)",
                features: ["Jusqu'à 6 élèves", "Upload des PDF", "Emploi du temps avancé", "Support email 48h"],
                cta: "Essayer 14 jours gratuit",
                featured: true
              },
              {
                name: "Premium",
                tagline: "Pour les professionnels",
                price: "8,99",
                annual: "90€/an (2 mois offerts)",
                features: ["Élèves illimités", "Upload de PDF", "Statistiques avancées", "Support prioritaire <24h"],
                cta: "En savoir plus",
                featured: false
              }
            ].map((plan, idx) => (
              <div 
                key={idx}
                className={`fade-in-up opacity-0 translate-y-8 transition-all duration-700 ${
                  plan.featured ? 'md:scale-105' : ''
                }`}
                style={{transitionDelay: `${idx * 100}ms`}}
              >
                <div className={`relative h-full bg-white rounded-3xl p-8 transition-all duration-300 hover:shadow-2xl ${
                  plan.featured 
                    ? 'shadow-2xl border-2' 
                    : 'shadow-lg border hover:border-opacity-50'
                }`} style={{borderColor: plan.featured ? 'var(--caramel)' : 'var(--sand)'}}>
                  {plan.featured && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 text-white rounded-full text-xs font-bold uppercase shadow-lg" style={{background: 'linear-gradient(to right, var(--caramel), var(--caramel-dark))'}}>
                      Le plus populaire
                    </div>
                  )}
                  
                  <div className={plan.featured ? 'mt-2' : ''}>
                    <h3 className="text-2xl font-black mb-2" style={{color: 'var(--espresso)'}}>
                      {plan.name}
                    </h3>
                    <p className="text-sm mb-6" style={{color: 'var(--espresso-light)'}}>
                      {plan.tagline}
                    </p>
                    
                    <div className="mb-6">
                      <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-black" style={{color: 'var(--espresso)'}}>
                          {plan.price}€
                        </span>
                        <span style={{color: 'var(--espresso-light)'}}>/ mois</span>
                      </div>
                      {plan.annual && (
                        <p className="text-xs font-bold mt-2" style={{color: 'var(--sage)'}}>
                          {plan.annual}
                        </p>
                      )}
                    </div>

                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm" style={{color: 'var(--espresso-light)'}}>
                          <Check size={18} className="flex-shrink-0 mt-0.5" style={{color: 'var(--sage)'}} />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button 
                      onClick={() => navigate('/Sign-Up ')}
                      className={`w-full py-4 px-6 rounded-2xl font-bold transition-all cursor-pointer ${
                      plan.featured
                        ? 'text-white hover:shadow-xl'
                        : 'hover:opacity-90'
                    }`} style={{
                      background: plan.featured 
                        ? 'linear-gradient(to right, var(--caramel), var(--caramel-dark))' 
                        : 'var(--espresso)',
                      color: plan.featured ? 'white' : 'white',
                      boxShadow: plan.featured ? '0 20px 40px rgba(201, 168, 124, 0.3)' : 'none'
                    }}>
                      {plan.cta}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12 fade-in-up opacity-0 translate-y-8 transition-all duration-700" style={{transitionDelay: '300ms'}}>
            <p className="inline-flex items-center gap-2 text-sm" style={{color: 'var(--espresso-light)'}}>
              <Check size={16} style={{color: 'var(--sage)'}} />
              14 jours d'essai gratuit • Sans engagement • Satisfait ou remboursé
            </p>
          </div>
        </div>
      </section>

      {/* CTA FINAL - Impact maximal */}
      <section className="relative py-32 px-6 md:px-12 overflow-hidden" style={{background: 'linear-gradient(to bottom, var(--caramel), var(--caramel-dark), var(--espresso))'}}>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl" style={{backgroundColor: 'rgba(139, 157, 131, 0.3)'}}></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl" style={{backgroundColor: 'rgba(232, 220, 196, 0.3)'}}></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
            Prêt à transformer
            <br />
            votre enseignement ?
          </h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto leading-relaxed" style={{color: 'var(--sand)'}}>
            Rejoignez des centaines de professeurs qui ont déjà fait le choix de la simplicité
          </p>
          
          <button 
           onClick={() => navigate('/Sign-Up ')}
          className="group px-10 py-5 bg-white rounded-2xl font-bold text-lg hover:scale-105 transition-all hover:shadow-2xl" style={{color: 'var(--espresso)', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'}}>
            <span className="flex items-center gap-3">
              Commencer gratuitement
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
          
          <p className="mt-6 text-sm inline-flex items-center gap-2 justify-center" style={{color: 'var(--sand)'}}>
            <Check size={16} style={{color: 'var(--sage)'}} />
            Aucune carte bancaire requise
          </p>
        </div>
      </section>
    </main>
  )
}