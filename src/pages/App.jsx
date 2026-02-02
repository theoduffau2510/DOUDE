import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '../contexts/AuthContext'
import { useEffect } from 'react'
import { supabase } from './lib/supabase'

import Navbar from '../components/Navbar'
import NavbarParent from '../components/NavbarParent'
import ProtectedRoute from '../components/ProtectedRoute'
import ProtectedStudentRoute from '../components/ProtectedStudentRoute'
import Footer from '../components/Footer'

import Home from './Home.jsx'
import Tarifs from './Tarifs.jsx'
import Contact from './Contact.jsx'
import Suivi from './Suivi.jsx'
import Compta from './Compta.jsx'
import Emploi from './Emploi.jsx'
import MentionsLegales from './MentionsLegales.jsx'
import Confidentialite from './Confidentialite.jsx'
import CGV from './CGV.jsx'
import CGU from './CGU'
import FAQ from './FAQ.jsx'
import Aide from './Aide.jsx'

import DashboardParent from './DashboardParent.jsx'
import DashboardProf from './DashboardProf.jsx'
import EmploiParent from './EmploiParent.jsx'
import SuiviParent from './SuiviParent.jsx'
import MonAbonnement from './MonAbonnement.jsx'
import SignUp from './Auth/SignUp.jsx'
import SignIn from './Auth/SignIn.jsx'
import ResetPassword from './Auth/ResetPassword.jsx'  // ⬅️ CORRIGÉ
import UpdatePassword from './Auth/UpdatePassword.jsx'  // ⬅️ CORRIGÉ
import Success from './Success.jsx'

import SuiviVitrine from './SuiviVitrine.jsx'
import EmploiVitrine from './EmploiVitrine.jsx'
import ComptaVitrine from './ComptaVitrine.jsx'

import ProtectedAdminRoute from "../components/ProtectedAdminRoute";
import AdminDashboard from "../Admin/AdminDashboard.jsx";

// Composant pour rediriger les élèves automatiquement
function StudentRedirect({ children }) {
  const { user } = useAuth()
  const location = useLocation()
  
  const isStudent = user?.user_metadata?.role === 'eleve'
  
  // Si c'est un élève et qu'il est sur une page prof, rediriger vers /parent
  const isProfPage = ['/', '/suivi', '/compta', '/emploi', '/tarifs'].includes(location.pathname)
  
  if (isStudent && isProfPage) {
    return <Navigate to="/parent" replace />
  }
  
  return children
}

function AppLayout() {
  const location = useLocation()
  const { user, loading } = useAuth()

  // Afficher un loader pendant le chargement
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--cream)]">
        <div className="w-12 h-12 border-4 border-[var(--caramel)] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Détecter si on est sur une page d'authentification
  const isAuthPage = location.pathname.includes('sign-in') || 
                     location.pathname.includes('sign-up') ||
                     location.pathname.includes('reset-password') ||  // ⬅️ AJOUTÉ
                     location.pathname.includes('update-password')    // ⬅️ AJOUTÉ

  // Vérifier si l'utilisateur est un élève
  const isStudent = user?.user_metadata?.role === 'eleve'

  // Si l'utilisateur est un élève, afficher NavbarParent PARTOUT (sauf pages auth)
  // Sinon afficher la Navbar normale (prof)
  const shouldShowParentNavbar = isStudent && !isAuthPage
  const shouldShowProfNavbar = !isStudent && !isAuthPage

  return (
    <div className="min-h-screen flex flex-col">
      {shouldShowParentNavbar && <NavbarParent />}
      {shouldShowProfNavbar && <Navbar />}
      
      <Routes>
        {/* ROUTES PROF / PUBLIC - avec redirection élèves */}
        
        <Route path="/" element={
          <StudentRedirect>
            {user ? <DashboardProf /> : <Home />}
          </StudentRedirect>
        } />
        <Route path="/tarifs" element={
          <StudentRedirect>
            <Tarifs />
          </StudentRedirect>
        } />
        <Route path="/contact" element={<Contact />} />
        
        {/* Pages vitrine si NON connecté, pages fonctionnelles si connecté */}
        <Route path="/suivi" element={
          <StudentRedirect>
            {user ? <ProtectedRoute><Suivi /></ProtectedRoute> : <SuiviVitrine />}
          </StudentRedirect>
        } />
        <Route path="/compta" element={
          <StudentRedirect>
            {user ? <ProtectedRoute><Compta /></ProtectedRoute> : <ComptaVitrine />}
          </StudentRedirect>
        } />
        <Route path="/emploi" element={
          <StudentRedirect>
            {user ? <ProtectedRoute><Emploi /></ProtectedRoute> : <EmploiVitrine />}
          </StudentRedirect>
        } />
        <Route path="/abonnement" element={
          <StudentRedirect>
            <ProtectedRoute><MonAbonnement /></ProtectedRoute>
          </StudentRedirect>
        } />

        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          } 
        />

        {/* ROUTES AUTH */}
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/reset-password" element={<ResetPassword />} />  {/* ⬅️ AJOUTÉ */}
        <Route path="/update-password" element={<UpdatePassword />} />  {/* ⬅️ AJOUTÉ */}
        <Route path="/success" element={<Success />} />
        
        {/* ROUTES PARENT - PROTÉGÉES */}
        <Route path="/parent" element={
          <ProtectedStudentRoute>
            <DashboardParent />
          </ProtectedStudentRoute>
        } />
        <Route path="/parent/emploi" element={
          <ProtectedStudentRoute>
            <EmploiParent />
          </ProtectedStudentRoute>
        } />
        <Route path="/parent/suivi" element={
          <ProtectedStudentRoute>
            <SuiviParent />
          </ProtectedStudentRoute>
        } />

        {/* ROUTES LÉGALES */}
        <Route path="/mentions-legales" element={<MentionsLegales />} />
        <Route path="/confidentialite" element={<Confidentialite />} />
        <Route path="/cgv" element={<CGV />} />
        <Route path="/cgu" element={<CGU />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/aide" element={<Aide />} />
      </Routes>
      
      
      {/* Footer (sauf pages auth) */}
      {!isAuthPage && <Footer />}
    </div>
  )
}

function App() {
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible') {
        console.log('🔄 Page visible - refresh session Supabase')
        await supabase.auth.getSession()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App