import { useState, useEffect } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  LineChart,
  Trophy,
  BookOpen,
  Clock,
  FileText, 
  Download,
  MessageCircle, // ← AJOUTÉ
} from 'lucide-react';
import { useStudentAuth } from '../hooks/useStudentAuth';
import { supabase } from '../lib/supabase';
import MessagingModal from '../components/MessagingModal'


export default function DashboardParent() {
  const { isStudent, studentData: student, loading: authLoading, user } = useStudentAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [nextSlots, setNextSlots] = useState([]);
  const [showMessagingModal, setShowMessagingModal] = useState(false); // ← AJOUTÉ
  const [unreadCount, setUnreadCount] = useState(0); // ← AJOUTÉ

  useEffect(() => {
    if (student) {
      fetchSchedule();
      fetchUnreadCount(); // ← AJOUTÉ
    } else if (!authLoading && !student) {
      setLoading(false);
    }
  }, [student, authLoading]);

  // ← AJOUTÉ : Polling pour les messages non lus
  useEffect(() => {
    if (student) {
      const interval = setInterval(fetchUnreadCount, 30000); // Toutes les 30 secondes
      return () => clearInterval(interval);
    }
  }, [student]);

  useEffect(() => {
    if (!authLoading && user && !student) {
      const timer = setTimeout(() => {
        navigate('/link-account');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [authLoading, user, student, navigate]);

  const fetchSchedule = async () => {
    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data: slotsData } = await supabase
        .from('schedules')
        .select('*')
        .eq('student_name', student.name)
        .gte('slot_date', today)
        .order('slot_date', { ascending: true })
        .limit(3);
      
      if (slotsData) setNextSlots(slotsData);
    } catch (err) {
      console.error("Erreur planning:", err);
    } finally {
      setLoading(false);
    }
  };

  // ← AJOUTÉ : Fonction pour récupérer le nombre de messages non lus
  const fetchUnreadCount = async () => {
    if (!student) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('id')
        .eq('student_id', student.id)
        .eq('sender_role', 'professeur')
        .eq('is_read', false);

      if (!error && data) {
        setUnreadCount(data.length);
      }
    } catch (err) {
      console.error('Erreur récupération messages:', err);
    }
  };

  const calculateAverage = (notes) => {
    if (!notes || notes.length === 0) return null;
    return (notes.reduce((acc, n) => acc + n.note, 0) / notes.length).toFixed(1);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[var(--cream)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[var(--caramel)] border-t-transparent rounded-full animate-spin" />
          <p className="text-[var(--espresso-light)] text-sm">Chargement de votre profil...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  return (
    <main className="flex-1 py-10 px-5 md:px-10 bg-[var(--cream)]">
      <div className="max-w-[1200px] mx-auto">
        
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="w-8 h-8 border-4 border-[var(--caramel)] border-t-transparent rounded-full animate-spin" />
              <p className="text-[var(--espresso-light)] text-sm">Chargement des données...</p>
            </div>
          </div>
        ) : !student ? (
          <div className="text-center p-10 bg-white rounded-3xl">
            <div className="mb-6">
              <div className="w-16 h-16 bg-[var(--caramel)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="text-[var(--caramel)]" size={32} />
              </div>
              <h2 className="font-fraunces text-2xl text-[var(--espresso)] font-bold mb-2">
                Profil non trouvé
              </h2>
              <p className="text-[var(--espresso-light)] mb-6">
                Votre compte n'est pas encore lié à un profil élève.
              </p>
              <button
                onClick={() => navigate('/link-account')}
                className="px-6 py-3 bg-[var(--sage)] text-white rounded-full font-semibold hover:shadow-lg transition-all"
              >
                Lier mon compte maintenant
              </button>
            </div>
            <p className="text-sm text-[var(--espresso-light)] mt-8">
              💡 Vous devez avoir reçu un code de liaison de votre professeur
            </p>
          </div>
        ) : (
          <>
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-10 flex justify-between items-end">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-1 w-10 bg-[var(--caramel)] rounded-full" />
                  <span className="text-[var(--caramel)] font-bold text-xs uppercase tracking-widest">Aperçu</span>
                </div>
                <h1 className="font-fraunces text-4xl text-[var(--espresso)] font-bold">
                  Ravi de vous revoir, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--espresso)] to-[var(--caramel)]">{user?.user_metadata?.first_name || 'Élève'}</span>
                </h1>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-black/5">
                <Trophy className="text-[var(--caramel)] mb-4" size={28} />
                <div className="text-4xl font-fraunces font-bold text-[var(--espresso)]">
                  {calculateAverage(student.notes) || '--'}<span className="text-xl opacity-30">/20</span>
                </div>
                <p className="text-xs font-bold uppercase opacity-50 mt-1">Moyenne Générale</p>
              </div>

              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-black/5">
                <BookOpen className="text-blue-500 mb-4" size={28} />
                <div className="text-2xl font-fraunces font-bold text-[var(--espresso)]">{student.matiere || 'Multiples'}</div>
                <p className="text-[var(--caramel)] font-medium text-sm">{student.niveau}</p>
              </div>

              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-black/5">
                <div className="flex items-center gap-2 mb-4 text-[var(--sage)]">
                  <Clock size={24} />
                  <span className="text-xs font-bold uppercase tracking-widest">Planning</span>
                </div>
                <div className="space-y-2">
                  {nextSlots.length > 0 ? nextSlots.map(s => (
                    <div key={s.id} className="text-sm font-medium text-[var(--espresso)] border-l-2 border-[var(--cream)] pl-3">
                      {formatDate(s.slot_date)} • {s.slot_hour}h
                    </div>
                  )) : <p className="text-xs italic opacity-50 text-[var(--espresso)]">Aucun cours</p>}
                </div>
              </div>
            </div>

            {/* ← AJOUTÉ : Section Messagerie */}
<div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-black/5 mb-6">
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-4">
      <div className="w-14 h-14 bg-[var(--sage)]/10 rounded-2xl flex items-center justify-center">
        <MessageCircle className="text-[var(--sage)]" size={28} />
      </div>
      <div>
        <h3 className="font-fraunces text-xl text-[var(--espresso)] font-bold">Messagerie</h3>
        <p className="text-[var(--espresso-light)] text-sm">Communiquez avec votre professeur</p>
      </div>
    </div>
    <button
      onClick={() => setShowMessagingModal(true)}
      className="p-2 text-[var(--sage)] hover:bg-[var(--sage)]/10 rounded-xl transition-colors relative"
      title="Ouvrir la messagerie"
    >
      <MessageCircle size={24} />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-[var(--coral)] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
          {unreadCount}
        </span>
      )}
    </button>
  </div>
</div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 text-white">
              <button onClick={() => navigate('/parent/emploi')} className="flex items-center gap-6 bg-[#8ba183] p-8 rounded-[2.5rem] shadow-lg hover:translate-y-[-4px] transition-all group text-left">
                <Calendar size={40} className="opacity-80" />
                <div>
                  <h3 className="font-fraunces text-2xl font-bold">Emploi du temps</h3>
                  <p className="opacity-70 text-sm">Gérer les rendez-vous</p>
                </div>
              </button>
              <button onClick={() => navigate('/parent/suivi')} className="flex items-center gap-6 bg-[#c29672] p-8 rounded-[2.5rem] shadow-lg hover:translate-y-[-4px] transition-all group text-left">
                <LineChart size={40} className="opacity-80" />
                <div>
                  <h3 className="font-fraunces text-2xl font-bold">Suivi des notes</h3>
                  <p className="opacity-70 text-sm">Analyse des résultats</p>
                </div>
              </button>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-black/5">
              <div className="flex justify-between items-center mb-8">
                <h2 className="font-fraunces text-2xl text-[var(--espresso)] font-bold">Dernières notes</h2>
                <Link to="/parent/suivi" className="text-[var(--caramel)] text-sm font-bold">Historique complet →</Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {student.notes && student.notes.length > 0 ? (
                  student.notes.slice(0, 4).map((n, i) => (
                    <div key={i} className="flex items-center gap-6 p-4 bg-[var(--cream)] rounded-2xl">
                      <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center font-bold text-[var(--espresso)] shadow-sm">
                        {n.note}
                      </div>
                      <div className="font-bold text-[var(--espresso)]">{n.description || 'Évaluation'}</div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-8 text-[var(--espresso-light)]">
                    <p>Aucune note enregistrée pour le moment</p>
                  </div>
                )}
              </div>
            </div>

            {student.pdfs && student.pdfs.length > 0 && (
              <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-black/5 mt-6">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-3">
                    <FileText className="text-[var(--coral)]" size={28} />
                    <h2 className="font-fraunces text-2xl text-[var(--espresso)] font-bold">Documents</h2>
                  </div>
                  <span className="text-sm text-[var(--espresso-light)] font-medium">
                    {student.pdfs.length} document{student.pdfs.length > 1 ? 's' : ''}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {student.pdfs.map((pdf) => (
                    <div key={pdf.id} className="flex items-center gap-4 p-5 bg-[var(--cream)] rounded-2xl hover:shadow-md transition-shadow group">
                      <div className="w-14 h-14 rounded-xl bg-[var(--coral)]/10 flex items-center justify-center flex-shrink-0">
                        <FileText className="text-[var(--coral)]" size={28} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[var(--espresso)] truncate">{pdf.name}</p>
                        <p className="text-xs text-[var(--espresso-light)] mt-1">
                          Ajouté le {new Date(pdf.uploadedAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <a href={pdf.url} download={pdf.name} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 w-10 h-10 bg-[var(--sage)] text-white rounded-xl flex items-center justify-center hover:bg-[var(--sage)]/90 transition-all group-hover:scale-110">
                        <Download size={18} />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ← AJOUTÉ : Modal Messagerie */}
      {showMessagingModal && student && user && (
        <MessagingModal
          student={student}
          user={user}
          userRole="eleve"
          onClose={() => {
            setShowMessagingModal(false);
            fetchUnreadCount(); // Recharge le compteur après fermeture
          }}
        />
      )}
    </main>
  );
}