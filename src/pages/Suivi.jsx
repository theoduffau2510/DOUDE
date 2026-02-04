import { useEffect, useState, useMemo } from 'react'
import { supabase } from '../lib/supabase'
import { useTier } from '../hooks/useTier.jsx'
import { usePageVisibility } from '../hooks/usePageVisibility'
import { Target, BookOpen, TrendingUp, Award, Star, CheckCircle, Sparkles, ArrowRight, LineChart, Edit2, Trash2, Plus, X, Download, Copy, BarChart3, Upload, FileText, Loader2, MessageCircle, FileDown, Calendar, ChevronDown } from 'lucide-react'
import MessagingModal from '../components/MessagingModal'
import { jsPDF } from 'jspdf'

// Composant graphique pour la courbe de progression
function ProgressChart({ notes, objectif, hasAccess }) {
  if (!hasAccess) {
    return (
      <div className="bg-[var(--cream)] rounded-2xl p-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="text-center">
            <span className="bg-[var(--caramel)] text-white text-xs px-3 py-1 rounded-full font-semibold">PREMIUM</span>
            <p className="text-sm text-[var(--espresso)] mt-2">Débloquez la courbe de progression</p>
          </div>
        </div>
        <div className="h-40 flex items-end justify-around gap-2 opacity-30">
          {[40, 55, 45, 60, 70, 65, 75].map((h, i) => (
            <div key={i} className="w-8 bg-[var(--sage)] rounded-t" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
    )
  }

  if (!notes || !Array.isArray(notes) || notes.length === 0) {
    return (
      <div className="bg-[var(--cream)] rounded-2xl p-6 text-center">
        <p className="text-[var(--espresso-light)]">Ajoutez des notes pour voir la courbe de progression</p>
      </div>
    )
  }

  const sortedNotes = [...notes].sort((a, b) => new Date(a.date) - new Date(b.date))

  return (
    <div className="bg-[var(--cream)] rounded-2xl p-6">
      <svg viewBox="0 0 400 160" className="w-full h-40">
        {/* Grille horizontale */}
        {[0, 5, 10, 15, 20].map((val, idx) => (
          <g key={idx}>
            <line
              x1="40"
              y1={140 - (val / 20) * 120}
              x2="380"
              y2={140 - (val / 20) * 120}
              stroke="var(--sand)"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            <text
              x="25"
              y={144 - (val / 20) * 120}
              fill="var(--espresso-light)"
              fontSize="10"
              textAnchor="end"
            >
              {val}
            </text>
          </g>
        ))}
        
        {/* Courbe de progression */}
        {(() => {
          const points = sortedNotes.map((note, idx) => ({
            x: 60 + (idx * (300 / Math.max(sortedNotes.length - 1, 1))),
            y: 140 - (note.note / 20) * 120
          }))
          
          const pathD = points.reduce((path, point, idx) => {
            if (idx === 0) return `M ${point.x} ${point.y}`
            const prevPoint = points[idx - 1]
            const cpX1 = prevPoint.x + 20
            const cpX2 = point.x - 20
            return `${path} C ${cpX1} ${prevPoint.y}, ${cpX2} ${point.y}, ${point.x} ${point.y}`
          }, '')
          
          return (
            <>
              <path
                d={`${pathD} L ${points[points.length - 1].x} 140 L ${points[0].x} 140 Z`}
                fill="url(#gradient)"
                opacity="0.2"
              />
              
              <path
                d={pathD}
                stroke="var(--sage)"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              {points.map((point, idx) => (
                <g key={idx}>
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="5"
                    fill="white"
                    stroke="var(--sage)"
                    strokeWidth="3"
                  />
                  <text
                    x={point.x}
                    y={155}
                    fill="var(--espresso-light)"
                    fontSize="9"
                    textAnchor="middle"
                  >
                    S{idx + 1}
                  </text>
                </g>
              ))}
            </>
          )
        })()}
        
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--sage)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--sage)" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <div className="flex items-center gap-3 text-sm mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[var(--sage)] rounded-full"></div>
          <span className="text-[var(--espresso-light)]">Évolution des notes</span>
        </div>
      </div>
    </div>
  )
}

export default function Suivi() {
  const [user, setUser] = useState(null);
  const { tier, isPro, isPremium, canAddStudent, hasFeature, limits, canUploadPdf, getMaxPdfSizeLabel } = useTier()
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [linkCodeModal, setLinkCodeModal] = useState(null);
  const [showDashboardModal, setShowDashboardModal] = useState(false);
  const [dashboardPeriod, setDashboardPeriod] = useState('month'); // 'month' | 'year'
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [showMessagingModal, setShowMessagingModal] = useState(false);
  const [showBilanModal, setShowBilanModal] = useState(false);
  const [bilanTrimestre, setBilanTrimestre] = useState(1);
  const [showSeanceModal, setShowSeanceModal] = useState(false);
  const [seanceFormData, setSeanceFormData] = useState({ 
  date: new Date().toISOString().split('T')[0], 
  sujet: '', 
  appreciation: '' 
});
  const [activeTab, setActiveTab] = useState('overview'); // ← AJOUTE ÇA ICI
  const [formData, setFormData] = useState({ 
    name: '', niveau: '3ème', matiere: '', tel: '', objectif: 14, parent_email: '', appreciation: '', show_progress_chart: false 
  });
  
 const [noteFormData, setNoteFormData] = useState({ 
    note: '', date: new Date().toISOString().split('T')[0], description: '' 
  });

  usePageVisibility(() => {
  if (user) {
    fetchStudents()
  }
})

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
    fetchStudents()
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [user, supabase])

  const fetchStudents = async () => {
  if (!supabase || !user) return
  
  setLoading(true)
  
  try {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erreur chargement élèves:', error.message, error)
    } else {
      setStudents(data || [])
    }
  } catch (err) {
    console.error('Erreur inattendue:', err)
  } finally {
    setLoading(false)
  }
}

  const openAddModal = () => {
    setEditingStudent(null)
    setFormData({ name: '', niveau: '3ème', matiere: '', tel: '', objectif: 14, parent_email: '' })
    setShowModal(true)
  }

  const openEditModal = (student, e) => {
    e?.stopPropagation()
    setEditingStudent(student)
    setFormData({
      name: student.name,
      niveau: student.niveau,
      matiere: student.matiere,
      tel: student.tel || '',
      objectif: student.objectif || 14,
      appreciation: student.appreciation || '',
      parent_email: student.parent_email || '',
      show_progress_chart: student.show_progress_chart || false
    })
    setShowModal(true)
  }

  const openNoteModal = () => {
    setNoteFormData({ note: '', date: new Date().toISOString().split('T')[0], description: '' })
    setShowNoteModal(true)
  }

  const handleSubmit = async (e) => {
  e.preventDefault()
  if (!supabase) return

  if (editingStudent) {
    const { error } = await supabase
      .from('students')
      .update({
        name: formData.name,
        niveau: formData.niveau,
        matiere: formData.matiere,
        tel: formData.tel,
        objectif: parseInt(formData.objectif) || 14,
        appreciation: formData.appreciation,
        parent_email: formData.parent_email || null,
        show_progress_chart: formData.show_progress_chart
      })
      .eq('id', editingStudent.id)

    if (error) {
      console.error('Erreur modification:', error)
      alert('Erreur lors de la modification')
      return
    }
  } else {
    // ✅ Fonction de génération de code (à déplacer HORS de handleSubmit)
    const generateLinkCode = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      let code = ''
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      return code
    }

    const linkCode = generateLinkCode()
    
    console.log('🔑 Code généré:', linkCode) // ← AJOUTEZ CE LOG
    
    const { data, error } = await supabase
      .from('students')
      .insert({
        user_id: user.id,
        name: formData.name,
        niveau: formData.niveau,
        matiere: formData.matiere,
        tel: formData.tel,
        objectif: parseInt(formData.objectif) || 14,
        progression: 0,
        notes: [],
        appreciation: '',
        parent_email: formData.parent_email || null,
        link_code: linkCode,
        show_progress_chart: formData.show_progress_chart
      })
      .select()

    if (error) {
      console.error('Erreur ajout:', error)
      alert('Erreur lors de l\'ajout')
      return
    }
    
    if (data && data[0]) {
      console.log('✅ Élève créé avec code:', data[0].link_code) // ← AJOUTEZ CE LOG
      setLinkCodeModal(data[0].link_code)
    }
  }

  setShowModal(false)
  fetchStudents()
}

  const handleAddNote = async (e) => {
    e.preventDefault()
    if (!supabase) return

    const newNote = {
      id: Date.now(),
      note: parseFloat(noteFormData.note),
      date: noteFormData.date,
      description: noteFormData.description
    }

    const currentNotes = Array.isArray(selectedStudent.notes) ? selectedStudent.notes : []
    const updatedNotes = [...currentNotes, newNote]

    const moyenne = updatedNotes.reduce((acc, n) => acc + n.note, 0) / updatedNotes.length
    const objectif = selectedStudent.objectif || 14
    const progression = Math.min(100, Math.round((moyenne / objectif) * 100))

    const { error } = await supabase
      .from('students')
      .update({
        notes: updatedNotes,
        progression: progression
      })
      .eq('id', selectedStudent.id)

    if (error) {
      console.error('Erreur ajout note:', error)
      alert('Erreur lors de l\'ajout de la note')
      return
    }

    const updatedStudent = { ...selectedStudent, notes: updatedNotes, progression }
    setSelectedStudent(updatedStudent)
    setStudents(students.map(s => s.id === selectedStudent.id ? updatedStudent : s))
    setShowNoteModal(false)
  }

  const handleDeleteNote = async (noteToDelete) => {
    if (!supabase) return
    if (!confirm('Supprimer cette note ?')) return

    const currentNotes = Array.isArray(selectedStudent.notes) ? selectedStudent.notes : []

    // Trouver l'index de la note à supprimer en comparant plusieurs champs
    const indexToDelete = currentNotes.findIndex(n =>
      n.note === noteToDelete.note &&
      n.date === noteToDelete.date &&
      n.description === noteToDelete.description
    )

    if (indexToDelete === -1) {
      console.error('Note non trouvée')
      return
    }

    const updatedNotes = currentNotes.filter((_, index) => index !== indexToDelete)
    const objectif = selectedStudent.objectif || 14

    const progression = updatedNotes.length > 0
      ? Math.min(100, Math.round((updatedNotes.reduce((acc, n) => acc + n.note, 0) / updatedNotes.length / objectif) * 100))
      : 0

    const { error } = await supabase
      .from('students')
      .update({ notes: updatedNotes, progression })
      .eq('id', selectedStudent.id)

    if (error) {
      console.error('Erreur suppression note:', error)
      return
    }

    const updatedStudent = { ...selectedStudent, notes: updatedNotes, progression }
    setSelectedStudent(updatedStudent)
    setStudents(students.map(s => s.id === selectedStudent.id ? updatedStudent : s))
  }

  const handleUpdateAppreciation = async (appreciation) => {
    if (!supabase) return
    const { error } = await supabase
      .from('students')
      .update({ appreciation })
      .eq('id', selectedStudent.id)

    if (error) {
      console.error('Erreur mise à jour appréciation:', error)
      return
    }

    const updatedStudent = { ...selectedStudent, appreciation }
    setSelectedStudent(updatedStudent)
    setStudents(students.map(s => s.id === selectedStudent.id ? updatedStudent : s))
  }

  const handleUpdateObjectif = async (newObjectif) => {
    if (!supabase) return
    const objectif = parseInt(newObjectif) || 14
    const notes = Array.isArray(selectedStudent.notes) ? selectedStudent.notes : []

    const progression = notes.length > 0
      ? Math.min(100, Math.round((notes.reduce((acc, n) => acc + n.note, 0) / notes.length / objectif) * 100))
      : 0

    const { error } = await supabase
      .from('students')
      .update({ objectif, progression })
      .eq('id', selectedStudent.id)

    if (error) {
      console.error('Erreur mise à jour objectif:', error)
      return
    }

    const updatedStudent = { ...selectedStudent, objectif, progression }
    setSelectedStudent(updatedStudent)
    setStudents(students.map(s => s.id === selectedStudent.id ? updatedStudent : s))
  }

  const handleDelete = async (id, e) => {
    e?.stopPropagation()
    if (!supabase) return
    if (confirm('Supprimer cet élève ?')) {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Erreur suppression:', error.message, error)
        alert('Erreur lors de la suppression')
        return
      }

      fetchStudents()
      if (selectedStudent?.id === id) {
        setSelectedStudent(null)
      }
    }
  }

  const handleAddSeance = async (e) => {
  e.preventDefault()
  if (!supabase) return

  const newSeance = {
    id: Date.now(),
    date: seanceFormData.date,
    sujet: seanceFormData.sujet,
    appreciation: seanceFormData.appreciation
  }

  const currentSeances = Array.isArray(selectedStudent.seances) ? selectedStudent.seances : []
  const updatedSeances = [...currentSeances, newSeance]

  const { error } = await supabase
    .from('students')
    .update({ seances: updatedSeances })
    .eq('id', selectedStudent.id)

  if (error) {
    console.error('Erreur ajout séance:', error)
    alert('Erreur lors de l\'ajout de la séance')
    return
  }

  const updatedStudent = { ...selectedStudent, seances: updatedSeances }
  setSelectedStudent(updatedStudent)
  setStudents(students.map(s => s.id === selectedStudent.id ? updatedStudent : s))
  setShowSeanceModal(false)
  setSeanceFormData({ date: new Date().toISOString().split('T')[0], sujet: '', appreciation: '' })
}

const handleDeleteSeance = async (seanceToDelete) => {
  if (!supabase) return
  if (!confirm('Supprimer cette séance ?')) return

  const currentSeances = Array.isArray(selectedStudent.seances) ? selectedStudent.seances : []
  const updatedSeances = currentSeances.filter(s => s.id !== seanceToDelete.id)

  const { error } = await supabase
    .from('students')
    .update({ seances: updatedSeances })
    .eq('id', selectedStudent.id)

  if (error) {
    console.error('Erreur suppression séance:', error)
    return
  }

  const updatedStudent = { ...selectedStudent, seances: updatedSeances }
  setSelectedStudent(updatedStudent)
  setStudents(students.map(s => s.id === selectedStudent.id ? updatedStudent : s))
}

  const exportToPDF = (student) => {
    if (!hasFeature('pdfExport')) {
      alert('L\'export PDF est réservé aux utilisateurs Premium et Pro.')
      return
    }

    const notes = student.notes || []
    const moyenne = notes.length > 0
      ? (notes.reduce((acc, n) => acc + n.note, 0) / notes.length).toFixed(2)
      : 'N/A'

    const content = `
FICHE ÉLÈVE - ${student.name}
==============================

Informations générales:
- Niveau: ${student.niveau}
- Matière: ${student.matiere || 'Non spécifiée'}
- Téléphone: ${student.tel || 'Non renseigné'}
- Objectif: ${student.objectif || 14}/20

Notes (${notes.length}):
${notes.map(n => `  - ${new Date(n.date).toLocaleDateString('fr-FR')}: ${n.note}/20 - ${n.description || 'Pas de description'}`).join('\n')}

Moyenne: ${moyenne}/20
Objectif atteint: ${moyenne !== 'N/A' && parseFloat(moyenne) >= (student.objectif || 14) ? 'Oui ✓' : 'Non'}
Progression vers l'objectif: ${student.progression || 0}%

Appréciation:
${student.appreciation || 'Aucune appréciation'}

---
Généré par Doude le ${new Date().toLocaleDateString('fr-FR')}
    `

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `fiche_${student.name.replace(/\s+/g, '_')}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Générateur de bilan trimestriel PDF
  const generateBilanPDF = (student, trimestre) => {
  if (!hasFeature('pdfExport')) {
    alert('Le bilan trimestriel est réservé aux utilisateurs Pro et Premium.')
    return
  }

  if (!student) {
    alert('Erreur: aucun élève sélectionné')
    return
  }

  const allNotes = student.notes || []
const year = new Date().getFullYear()
const currentMonth = new Date().getMonth() // 0 = janvier, 8 = septembre

// Déterminer l'année scolaire
const anneeScolaire = currentMonth >= 8 
  ? `${year}-${year + 1}`      // Si on est après septembre : 2026-2027
  : `${year - 1}-${year}`      // Si on est avant septembre : 2025-2026

// Année de début de l'année scolaire
const anneeDebut = currentMonth >= 8 ? year : year - 1

const trimestreDates = {
  1: { start: new Date(anneeDebut, 8, 1), end: new Date(anneeDebut, 11, 31), label: '1er Trimestre' },    // Sept-Déc
  2: { start: new Date(anneeDebut + 1, 0, 1), end: new Date(anneeDebut + 1, 2, 31), label: '2ème Trimestre' },  // Jan-Mars
  3: { start: new Date(anneeDebut + 1, 3, 1), end: new Date(anneeDebut + 1, 5, 30), label: '3ème Trimestre' }   // Avril-Juin
}

  const { start, end, label } = trimestreDates[trimestre]

  let notesTrimestre = allNotes.filter(n => {
    const noteDate = new Date(n.date)
    return noteDate >= start && noteDate <= end
  }).sort((a, b) => new Date(a.date) - new Date(b.date))

  const useAllNotes = notesTrimestre.length === 0 && allNotes.length > 0
  if (useAllNotes) {
    notesTrimestre = [...allNotes].sort((a, b) => new Date(a.date) - new Date(b.date))
  }

  const moyenne = notesTrimestre.length > 0
    ? (notesTrimestre.reduce((acc, n) => acc + n.note, 0) / notesTrimestre.length).toFixed(2)
    : null

  const noteMin = notesTrimestre.length > 0 ? Math.min(...notesTrimestre.map(n => n.note)) : null
  const noteMax = notesTrimestre.length > 0 ? Math.max(...notesTrimestre.map(n => n.note)) : null

  let tendance = 'Stable'
if (notesTrimestre.length >= 3) {
  const firstHalf = notesTrimestre.slice(0, Math.floor(notesTrimestre.length / 2))
  const secondHalf = notesTrimestre.slice(Math.floor(notesTrimestre.length / 2))
  const avgFirst = firstHalf.reduce((a, n) => a + n.note, 0) / firstHalf.length
  const avgSecond = secondHalf.reduce((a, n) => a + n.note, 0) / secondHalf.length

  if (avgSecond - avgFirst > 0.5) tendance = 'Progression'  // ← Corrigé
  else if (avgFirst - avgSecond > 0.5) tendance = 'En baisse'  // ← Corrigé
}

  const objectif = student.objectif || 14
  const objectifAtteint = moyenne !== null && parseFloat(moyenne) >= objectif

  const colors = {
    sage: [139, 169, 131],
    caramel: [196, 154, 108],
    espresso: [74, 60, 49],
    cream: [250, 247, 242],
    coral: [229, 115, 115]
  }

  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  let y = 20

  // ===== EN-TÊTE MODERNE =====
  doc.setFillColor(...colors.sage)
  doc.rect(0, 0, pageWidth, 35, 'F')

  // Logo + Titre sur la même ligne
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('doude', 15, 15)
  
  doc.setFontSize(16)
  doc.text('BILAN TRIMESTRIEL', 15, 27)

  // Info droite
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(useAllNotes ? 'Toutes les notes' : label, pageWidth - 15, 15, { align: 'right' })
  doc.text(anneeScolaire, pageWidth - 15, 23, { align: 'right' })

  y = 45

  // ===== CARTE ÉLÈVE =====
  doc.setFillColor(255, 255, 255)
  doc.roundedRect(15, y, pageWidth - 30, 28, 3, 3, 'F')
  doc.setDrawColor(220, 220, 220)
  doc.setLineWidth(0.5)
  doc.roundedRect(15, y, pageWidth - 30, 28, 3, 3, 'S')

  // Nom et infos
  doc.setTextColor(...colors.espresso)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text(student.name || 'Eleve', 20, y + 10)

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 100, 100)
  doc.text(`${student.niveau || 'N/A'} • ${student.matiere || 'N/A'}`, 20, y + 17)
  doc.text(`Objectif: ${objectif}/20`, 20, y + 23)

  y += 35

  // ===== STATS EN LIGNE =====
  const statWidth = (pageWidth - 40) / 4
  const stats = [
    { label: 'Notes', value: notesTrimestre.length.toString(), color: colors.sage },
    { label: 'Moyenne', value: moyenne ? `${moyenne}/20` : 'N/A', color: objectifAtteint ? colors.sage : colors.caramel },
    { label: 'Min - Max', value: noteMin !== null ? `${noteMin} - ${noteMax}` : 'N/A', color: colors.espresso },
    { label: 'Tendance', value: tendance, color: colors.espresso }
  ]

  stats.forEach((stat, idx) => {
    const x = 20 + idx * statWidth
    
    doc.setFillColor(250, 250, 250)
    doc.roundedRect(x, y, statWidth - 3, 18, 2, 2, 'F')
    
    doc.setFontSize(7)
    doc.setTextColor(120, 120, 120)
    doc.setFont('helvetica', 'normal')
    doc.text(stat.label, x + (statWidth - 3) / 2, y + 6, { align: 'center' })
    
    doc.setFontSize(11)
    doc.setTextColor(...stat.color)
    doc.setFont('helvetica', 'bold')
    doc.text(stat.value, x + (statWidth - 3) / 2, y + 14, { align: 'center' })
  })

  y += 25

  // ===== GRAPHIQUE COMPACT =====
  if (notesTrimestre.length > 0) {
    doc.setFillColor(255, 255, 255)
    doc.roundedRect(15, y, pageWidth - 30, 50, 3, 3, 'F')
    doc.setDrawColor(220, 220, 220)
    doc.setLineWidth(0.5)
    doc.roundedRect(15, y, pageWidth - 30, 50, 3, 3, 'S')

    doc.setFontSize(9)
    doc.setTextColor(...colors.espresso)
    doc.setFont('helvetica', 'bold')
    doc.text('Evolution des notes', 20, y + 7)

    const graphX = 25
    const graphY = y + 12
    const graphWidth = pageWidth - 50
    const graphHeight = 32
    const maxNote = 20

    // Lignes de référence
    doc.setDrawColor(240, 240, 240)
    doc.setLineWidth(0.3)
    for (let i = 0; i <= 4; i++) {
      const lineY = graphY + graphHeight - (i * graphHeight / 4)
      doc.line(graphX, lineY, graphX + graphWidth, lineY)
      
      if (i > 0) {
        doc.setFontSize(7)
        doc.setTextColor(180, 180, 180)
        doc.text((i * 5).toString(), graphX - 5, lineY + 2, { align: 'right' })
      }
    }

    // Ligne objectif
    const objectifY = graphY + graphHeight - (objectif / maxNote * graphHeight)
    doc.setDrawColor(...colors.caramel)
    doc.setLineWidth(0.4)
    doc.setLineDashPattern([2, 2], 0)
    doc.line(graphX, objectifY, graphX + graphWidth, objectifY)
    doc.setLineDashPattern([], 0)

    // Barres
    const barWidth = Math.min(graphWidth / notesTrimestre.length, 30)
    const spacing = graphWidth / notesTrimestre.length

    notesTrimestre.forEach((note, idx) => {
      const barX = graphX + idx * spacing + (spacing - barWidth) / 2
      const barH = (note.note / maxNote) * graphHeight
      const barY = graphY + graphHeight - barH

      if (note.note >= objectif) {
        doc.setFillColor(...colors.sage)
      } else if (note.note >= 10) {
        doc.setFillColor(...colors.caramel)
      } else {
        doc.setFillColor(...colors.coral)
      }

      doc.roundedRect(barX, barY, barWidth, barH, 1, 1, 'F')

      // Valeur
    })

    y += 55
  }

  // ===== LISTE DES NOTES =====
  doc.setFillColor(255, 255, 255)
  doc.roundedRect(15, y, pageWidth - 30, 10, 3, 3, 'FD')
  
  doc.setFontSize(9)
  doc.setTextColor(...colors.espresso)
  doc.setFont('helvetica', 'bold')
  doc.text('Detail des notes', 20, y + 7)

  y += 12

  if (notesTrimestre.length > 0) {
    notesTrimestre.slice(0, 8).forEach((note, idx) => {
      if (y > 250) return

      const bgColor = idx % 2 === 0 ? 255 : 250
      doc.setFillColor(bgColor, bgColor, bgColor)
      doc.rect(15, y, pageWidth - 30, 7, 'F')

      doc.setFontSize(8)
      doc.setTextColor(100, 100, 100)
      doc.setFont('helvetica', 'normal')
      doc.text(new Date(note.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }), 20, y + 5)

      if (note.note >= objectif) {
        doc.setTextColor(...colors.sage)
      } else if (note.note >= 10) {
        doc.setTextColor(...colors.caramel)
      } else {
        doc.setTextColor(...colors.coral)
      }
      doc.setFont('helvetica', 'bold')
      doc.text(`${note.note}/20`, 50, y + 5)

      doc.setTextColor(...colors.espresso)
      doc.setFont('helvetica', 'normal')
      const desc = note.description || 'Sans description'
      doc.text(desc.length > 50 ? desc.substring(0, 50) + '...' : desc, 70, y + 5)

      y += 7
    })

    if (notesTrimestre.length > 8) {
      doc.setFontSize(7)
      doc.setTextColor(150, 150, 150)
      doc.text(`+ ${notesTrimestre.length - 8} autres notes`, 20, y + 5)
      y += 7
    }
  } else {
    doc.setFillColor(250, 250, 250)
    doc.rect(15, y, pageWidth - 30, 10, 'F')
    doc.setTextColor(150, 150, 150)
    doc.setFontSize(8)
    doc.text('Aucune note ce trimestre', pageWidth / 2, y + 6, { align: 'center' })
    y += 12
  }

  // ===== APPRÉCIATION =====
  if (student.appreciation) {
    y += 3
    doc.setFillColor(255, 255, 255)
    doc.roundedRect(15, y, pageWidth - 30, 10, 3, 3, 'FD')
    
    doc.setFontSize(9)
    doc.setTextColor(...colors.espresso)
    doc.setFont('helvetica', 'bold')
    doc.text('Appreciation', 20, y + 7)

    y += 12

    doc.setFillColor(250, 247, 242)
    doc.roundedRect(15, y, pageWidth - 30, 18, 2, 2, 'F')

    doc.setFontSize(8)
    doc.setFont('helvetica', 'italic')
    doc.setTextColor(100, 100, 100)
    const appreciation = student.appreciation
    const splitAppreciation = doc.splitTextToSize(appreciation, pageWidth - 40)
    doc.text(splitAppreciation.slice(0, 3), 20, y + 5)

    y += 20
  }

  // ===== FÉLICITATIONS =====
  if (objectifAtteint) {
    y += 2
    doc.setFillColor(...colors.sage)
    doc.roundedRect(15, y, pageWidth - 30, 12, 2, 2, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('FELICITATIONS ! Objectif atteint !', pageWidth / 2, y + 8, { align: 'center' })
  }

  // ===== FOOTER =====
  const footerY = doc.internal.pageSize.getHeight() - 10
  doc.setDrawColor(220, 220, 220)
  doc.setLineWidth(0.3)
  doc.line(15, footerY - 5, pageWidth - 15, footerY - 5)

  doc.setTextColor(...colors.sage)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('doude', 20, footerY)

  doc.setTextColor(150, 150, 150)
  doc.setFontSize(7)
  doc.setFont('helvetica', 'normal')
  doc.text(`Genere le ${new Date().toLocaleDateString('fr-FR')}`, pageWidth - 20, footerY, { align: 'right' })

  const fileName = `bilan_T${trimestre}_${(student.name || 'eleve').replace(/\s+/g, '_')}_${year}.pdf`
  doc.save(fileName)

  setShowBilanModal(false)
}

  // Upload PDF pour l'élève
  const handlePdfUpload = async (e, studentId) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Réinitialiser l'input pour permettre de re-sélectionner le même fichier
    e.target.value = ''

    if (file.type !== 'application/pdf') {
      alert('Seuls les fichiers PDF sont acceptés.')
      return
    }

    // Vérifier la taille du fichier individuel
    if (!canUploadPdf(file.size)) {
      alert(`Le fichier est trop volumineux. Taille maximum : ${getMaxPdfSizeLabel()}.`)
      return
    }

    // Calculer l'espace total utilisé à partir des PDFs existants de tous les élèves
    const totalUsed = students.reduce((total, s) => {
      const pdfs = s.pdfs || []
      return total + pdfs.reduce((sum, pdf) => sum + (pdf.size || 0), 0)
    }, 0)

    // Vérifier si l'espace total après upload dépasse la limite
    if (limits.maxPdfSize !== Infinity && (totalUsed + file.size) > limits.maxPdfSize) {
      const usedMB = (totalUsed / (1024 * 1024)).toFixed(2)
      const fileMB = (file.size / (1024 * 1024)).toFixed(2)
      alert(`Limite de stockage atteinte !\n\nEspace utilisé : ${usedMB} Mo\nFichier : ${fileMB} Mo\nLimite : ${getMaxPdfSizeLabel()}`)
      return
    }

    setUploadingPdf(true)

    try {
      const fileName = `${user.id}/${studentId}/${Date.now()}_${file.name}`

      const { error: uploadError } = await supabase.storage
        .from('student-documents')
        .upload(fileName, file)

      if (uploadError) {
        console.error('Erreur upload:', uploadError)
        alert('Erreur lors de l\'upload du fichier: ' + uploadError.message)
        return
      }

      const { data: signedData, error: signError } = await supabase.storage
        .from('student-documents')
        .createSignedUrl(fileName, 31536000) // URL valide 1 an

      if (signError) {
        console.error('Erreur génération URL:', signError)
        alert('Erreur lors de la génération du lien de téléchargement')
        return
      }

      const currentPdfs = selectedStudent.pdfs || []
      const newPdf = {
        id: Date.now(),
        name: file.name,
        size: file.size, // Stocker la taille pour le calcul d'espace
        url: signedData.signedUrl,
        path: fileName,
        uploadedAt: new Date().toISOString()
      }

      const { error: updateError } = await supabase
        .from('students')
        .update({ pdfs: [...currentPdfs, newPdf] })
        .eq('id', studentId)

      if (updateError) {
        console.error('Erreur mise à jour:', updateError)
        alert('Erreur lors de l\'enregistrement: ' + updateError.message)
        return
      }

      const updatedStudent = { ...selectedStudent, pdfs: [...currentPdfs, newPdf] }
      setSelectedStudent(updatedStudent)
      setStudents(students.map(s => s.id === studentId ? updatedStudent : s))

      alert('PDF uploadé avec succès !')
    } catch (err) {
      console.error('Erreur:', err)
      alert('Une erreur est survenue: ' + err.message)
    } finally {
      setUploadingPdf(false)
    }
  }

  // Supprimer un PDF
  const handleDeletePdf = async (pdf) => {
    if (!confirm('Supprimer ce document ?')) return

    try {
      // 1. Supprimer du Storage
      const { error: storageError } = await supabase.storage
        .from('student-documents')
        .remove([pdf.path])

      if (storageError) {
        console.error('Erreur suppression storage:', storageError)
        // Continuer quand même pour nettoyer la référence dans la BDD
      }

      // 2. Mettre à jour la liste des PDFs dans students
      const updatedPdfs = (selectedStudent.pdfs || []).filter(p => p.id !== pdf.id)

      const { error: updateError } = await supabase
        .from('students')
        .update({ pdfs: updatedPdfs })
        .eq('id', selectedStudent.id)

      if (updateError) {
        console.error('Erreur mise à jour:', updateError)
        alert('Erreur lors de la suppression: ' + updateError.message)
        return
      }

      // 3. Mettre à jour l'UI
      const updatedStudent = { ...selectedStudent, pdfs: updatedPdfs }
      setSelectedStudent(updatedStudent)
      setStudents(students.map(s => s.id === selectedStudent.id ? updatedStudent : s))

      alert('Document supprimé !')
    } catch (err) {
      console.error('Erreur suppression:', err)
      alert('Erreur lors de la suppression: ' + err.message)
    }
  }

  const calculateAverage = (notes) => {
    if (!notes || !Array.isArray(notes) || notes.length === 0) return null
    return (notes.reduce((acc, n) => acc + n.note, 0) / notes.length).toFixed(1)
  }

  return (
    <>
     {!user ? (
  <div className="min-h-screen bg-[var(--cream)] flex items-center justify-center">
    <div className="text-center">
      <p className="text-[var(--espresso)]">Chargement...</p>
    </div>
  </div>
) : (
  <div className="min-h-screen bg-[var(--cream)]">
        <div className="min-h-screen bg-[var(--cream)]">
        
          {/* HERO SECTION */}
          <section className="bg-gradient-to-br from-[var(--sage)] to-[var(--sage)]/70 text-white py-16 px-5 md:px-10">
            <div className="max-w-6xl mx-auto">
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                <Sparkles size={16} />
                Suivi des élèves
              </div>
              
              <h1 className="font-fraunces text-4xl md:text-5xl font-bold mb-4 leading-tight">
                Gérez vos élèves simplement
              </h1>
              
              <p className="text-lg opacity-90 mb-6 max-w-2xl">
                Notes, objectifs, appréciations. Tout ce qu'il vous faut pour suivre la progression de vos élèves.
              </p>

              <div className="flex items-center gap-4">
                <button
                  onClick={openAddModal}
                  disabled={!canAddStudent(students.length)}
                  className="py-4 px-8 bg-white text-[var(--sage)] rounded-full font-semibold text-base hover:shadow-2xl transition-all cursor-pointer border-none inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Ajouter un élève
                  <ArrowRight size={20} />
                </button>
                {!canAddStudent(students.length) && (
                  <span className="text-white/80 text-sm">
                    Limite atteinte ({limits.maxStudents} élèves max)
                  </span>
                )}
              </div>
            </div>
          </section>

          {/* STATS CARDS */}
          <section className="py-12 px-5 md:px-10">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="w-12 h-12 bg-[var(--sage)]/10 rounded-xl flex items-center justify-center mb-4">
                    <Star className="text-[var(--sage)]" size={24} />
                  </div>
                  <div className="text-sm text-[var(--espresso-light)] mb-1">Total élèves</div>
                  <div className="font-fraunces text-3xl text-[var(--espresso)] font-bold">{students.length}</div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="w-12 h-12 bg-[var(--caramel)]/10 rounded-xl flex items-center justify-center mb-4">
                    <BookOpen className="text-[var(--caramel)]" size={24} />
                  </div>
                  <div className="text-sm text-[var(--espresso-light)] mb-1">Notes enregistrées</div>
                  <div className="font-fraunces text-3xl text-[var(--espresso)] font-bold">
                    {students.reduce((acc, s) => acc + (Array.isArray(s.notes) ? s.notes.length : 0), 0)}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="w-12 h-12 bg-[var(--sage)]/10 rounded-xl flex items-center justify-center mb-4">
                    <Target className="text-[var(--sage)]" size={24} />
                  </div>
                  <div className="text-sm text-[var(--espresso-light)] mb-1">Objectifs atteints</div>
                  <div className="font-fraunces text-3xl text-[var(--sage)] font-bold">
                    {students.filter(s => {
                      const avg = calculateAverage(s.notes)
                      return avg && parseFloat(avg) >= (s.objectif || 14)
                    }).length}/{students.length}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="w-12 h-12 bg-[var(--caramel)]/10 rounded-xl flex items-center justify-center mb-4">
                    <TrendingUp className="text-[var(--caramel)]" size={24} />
                  </div>
                  <div className="text-sm text-[var(--espresso-light)] mb-1">Moyenne générale</div>
                  <div className="font-fraunces text-3xl text-[var(--espresso)] font-bold">
                    {students.length > 0 && students.some(s => Array.isArray(s.notes) && s.notes.length > 0)
                      ? (students.filter(s => Array.isArray(s.notes) && s.notes.length > 0).reduce((acc, s) => {
                          const avg = s.notes.reduce((a, n) => a + n.note, 0) / s.notes.length
                          return acc + avg
                        }, 0) / students.filter(s => Array.isArray(s.notes) && s.notes.length > 0).length).toFixed(1)
                      : '-'
                    }/20
                  </div>
                </div>
              </div>

              {/* Bouton Dashboard Global (Pro only) */}
              <div className="mb-8 flex justify-center">
                {hasFeature('globalDashboard') ? (
                  <button
                    onClick={() => setShowDashboardModal(true)}
                    className="py-4 px-8 bg-gradient-to-r from-[var(--sage)] to-[var(--caramel)] text-white rounded-full font-semibold text-base hover:shadow-2xl transition-all cursor-pointer border-none inline-flex items-center gap-3"
                  >
                    <BarChart3 size={24} />
                    Voir le tableau de bord global
                  </button>
                ) : (
                  <div className="py-4 px-8 bg-gray-100 text-gray-400 rounded-full font-semibold text-base inline-flex items-center gap-3 relative">
                    <BarChart3 size={24} />
                    Tableau de bord global
                    <span className="absolute -top-2 -right-2 bg-[var(--caramel)] text-white text-xs px-2 py-1 rounded-full">PREMIUM</span>
                  </div>
                )}
              </div>

              {/* LISTE DES ÉLÈVES */}
              {loading ? (
                <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
                  <div className="text-[var(--espresso-light)]">Chargement...</div>
                </div>
              ) : students.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
                  <div className="text-6xl mb-4">👨‍🎓</div>
                  <h3 className="font-fraunces text-2xl text-[var(--espresso)] mb-3">Aucun élève pour le moment</h3>
                  <p className="text-[var(--espresso-light)] mb-6">Commencez par ajouter votre premier élève</p>
                  <button
                    onClick={openAddModal}
                    className="py-3 px-8 bg-[var(--sage)] text-white rounded-full font-semibold hover:shadow-xl transition-all cursor-pointer border-none inline-flex items-center gap-2"
                  >
                    <Plus size={20} />
                    Ajouter un élève
                  </button>
                </div>
              ) : (
                <div>
                  <div className="text-center mb-8">
                    <h2 className="font-fraunces text-3xl text-[var(--espresso)] font-bold mb-2">
                      Mes élèves
                    </h2>
                    <p className="text-[var(--espresso-light)]">
                      Cliquez sur un élève pour voir sa fiche détaillée
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {students.map((student) => {
                      const avg = calculateAverage(student.notes)
                      const objectifAtteint = avg && parseFloat(avg) >= (student.objectif || 14)

                      return (
                        <div
                          key={student.id}
                          onClick={() => setSelectedStudent(student)}
                          className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group"
                        >
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-[var(--sage)]/10 text-[var(--sage)] flex items-center justify-center font-bold text-lg group-hover:bg-[var(--sage)] group-hover:text-white transition-colors">
                              {student.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg text-[var(--espresso)]">{student.name}</h3>
                              <p className="text-sm text-[var(--espresso-light)]">{student.niveau}</p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-[var(--espresso-light)]">{student.matiere || 'Matière non définie'}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <TrendingUp size={18} className="text-[var(--sage)]" />
                              <span className="font-semibold text-[var(--espresso)]">
                                {avg ? `${avg}/20` : 'Pas de notes'}
                              </span>
                              {objectifAtteint && (
                                <CheckCircle size={16} className="text-[var(--sage)]" />
                              )}
                            </div>

                            <div className="w-full h-2 bg-[var(--cream)] rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  (student.progression || 0) >= 100 ? 'bg-[var(--sage)]' : 'bg-[var(--caramel)]'
                                }`}
                                style={{ width: `${Math.min(100, student.progression || 0)}%` }}
                              />
                            </div>

                            <div className="flex items-center justify-between text-xs text-[var(--espresso-light)]">
                              <span>{student.notes?.length || 0} notes</span>
                              <span>{student.progression || 0}% objectif</span>
                            </div>
                          </div>

                          <div className="flex gap-2 mt-4 pt-4 border-t border-[var(--cream)]">
                            <button
                              onClick={(e) => openEditModal(student, e)}
                              className="flex-1 py-2 px-3 text-xs font-semibold text-[var(--caramel)] bg-[var(--cream)] rounded-lg hover:bg-[var(--sand)] transition-colors flex items-center justify-center gap-1"
                            >
                              <Edit2 size={14} />
                              Modifier
                            </button>
                            <button
                              onClick={(e) => handleDelete(student.id, e)}
                              className="flex-1 py-2 px-3 text-xs font-semibold text-[var(--coral)] bg-[var(--cream)] rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-1"
                            >
                              <Trash2 size={14} />
                              Supprimer
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Modal Ajouter/Modifier élève */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-5">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-fraunces text-2xl text-[var(--espresso)] font-bold">
                  {editingStudent ? 'Modifier l\'élève' : 'Ajouter un élève'}
                </h2>
                <button onClick={() => setShowModal(false)} className="text-[var(--espresso-light)] hover:text-[var(--espresso)] cursor-pointer bg-transparent border-none">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-[var(--espresso)] mb-2">Nom complet *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full py-3 px-4 border-2 border-[var(--sand)] rounded-xl text-sm focus:border-[var(--sage)] focus:outline-none"
                      placeholder="Prénom Nom"
                    />
                  </div>

                  {(isPro || isPremium) && (
  <div className="bg-gradient-to-br from-[var(--sage)]/10 to-[var(--caramel)]/10 rounded-2xl p-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <LineChart className="text-[var(--sage)]" size={20} />
        <div>
          <div className="font-semibold text-[var(--espresso)] text-sm">
            Courbe de progression
          </div>
          <div className="text-xs text-[var(--espresso-light)]">
            Afficher le graphique dans la fiche élève
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={() => setFormData({...formData, show_progress_chart: !formData.show_progress_chart})}
        className={`relative w-14 h-7 rounded-full transition-colors ${
          formData.show_progress_chart ? 'bg-[var(--sage)]' : 'bg-gray-300'
        }`}
      >
        <div className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
          formData.show_progress_chart ? 'translate-x-7' : 'translate-x-0'
        }`} />
      </button>
    </div>
  </div>
)}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-[var(--espresso)] mb-2">Niveau</label>
                      <select
                        value={formData.niveau}
                        onChange={(e) => setFormData({...formData, niveau: e.target.value})}
                        className="w-full py-3 px-4 border-2 border-[var(--sand)] rounded-xl text-sm focus:border-[var(--sage)] focus:outline-none bg-white"
                      >
                        <option>6ème</option>
                        <option>5ème</option>
                        <option>4ème</option>
                        <option>3ème</option>
                        <option>2nde</option>
                        <option>1ère</option>
                        <option>Terminale</option>
                        <option>Supérieur</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--espresso)] mb-2">Matière</label>
                      <input
                        type="text"
                        value={formData.matiere}
                        onChange={(e) => setFormData({...formData, matiere: e.target.value})}
                        className="w-full py-3 px-4 border-2 border-[var(--sand)] rounded-xl text-sm focus:border-[var(--sage)] focus:outline-none"
                        placeholder="Ex: Maths"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-[var(--espresso)] mb-2">Téléphone</label>
                      <input
                        type="tel"
                        value={formData.tel}
                        onChange={(e) => setFormData({...formData, tel: e.target.value})}
                        className="w-full py-3 px-4 border-2 border-[var(--sand)] rounded-xl text-sm focus:border-[var(--sage)] focus:outline-none"
                        placeholder="06 12 34 56 78"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--espresso)] mb-2">Objectif /20</label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={formData.objectif}
                        onChange={(e) => setFormData({...formData, objectif: e.target.value})}
                        className="w-full py-3 px-4 border-2 border-[var(--sand)] rounded-xl text-sm focus:border-[var(--sage)] focus:outline-none"
                        placeholder="14"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[var(--espresso)] mb-2">
                      Email du parent/élève
                      <span className="ml-2 text-xs text-[var(--espresso-light)] font-normal">(accès espace parent)</span>
                    </label>
                    <input
                      type="email"
                      value={formData.parent_email}
                      onChange={(e) => setFormData({...formData, parent_email: e.target.value})}
                      className="w-full py-3 px-4 border-2 border-[var(--sand)] rounded-xl text-sm focus:border-[var(--sage)] focus:outline-none"
                      placeholder="parent@email.com"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button type="submit" className="flex-1 py-3 bg-[var(--sage)] text-white rounded-full font-semibold hover:shadow-xl transition-all cursor-pointer border-none">
                    {editingStudent ? 'Enregistrer' : 'Ajouter'}
                  </button>
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 bg-[var(--cream)] text-[var(--espresso)] rounded-full font-semibold hover:bg-[var(--sand)] transition-colors cursor-pointer border-none">
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Fiche élève détaillée */}
        {selectedStudent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-5">
            <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              {/* Header */}
              <div className="p-8 border-b border-[var(--cream)] flex justify-between items-start sticky top-0 bg-white rounded-t-3xl">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-[var(--sage)] text-white flex items-center justify-center font-semibold text-xl shadow-lg">
                    {selectedStudent.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                  <div>
                    <h2 className="font-fraunces text-3xl text-[var(--espresso)] font-bold">{selectedStudent.name}</h2>
                    <p className="text-[var(--espresso-light)]">{selectedStudent.niveau} • {selectedStudent.matiere || 'Matière non spécifiée'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* Bouton Messagerie */}
                  {hasFeature('messaging') ? (
                    <button
                      onClick={() => setShowMessagingModal(true)}
                      className="p-2 text-[var(--sage)] hover:bg-[var(--sage)]/10 rounded-xl transition-colors"
                      title="Envoyer un message"
                    >
                      <MessageCircle size={24} />
                    </button>
                  ) : (
                    <div className="p-2 text-gray-400 relative" title="Messagerie (Premium)">
                      <MessageCircle size={24} />
                      <span className="absolute -top-1 -right-1 bg-[var(--caramel)] text-white text-[10px] px-1 rounded-full">
                        PREMIUM
                      </span>
                    </div>
                  )}
                  <button onClick={() => setSelectedStudent(null)} className="text-[var(--espresso-light)] hover:text-[var(--espresso)] cursor-pointer bg-transparent border-none">
                    <X size={28} />
                  </button>
                </div>
              </div>

                {hasFeature('progressChart') && (
          <div className="bg-gradient-to-br from-[var(--sage)]/10 to-[var(--caramel)]/10 rounded-2xl p-5 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <LineChart className="text-[var(--sage)]" size={24} />
                <div>
                  <h3 className="font-semibold text-[var(--espresso)]">Courbe de progression</h3>
                  <p className="text-sm text-[var(--espresso-light)]">
                    {selectedStudent.show_progress_chart 
                      ? 'Activée - Le graphique est visible ci-dessous' 
                      : 'Désactivée - Activez pour voir le graphique'}
                  </p>
                </div>
              </div>
              <button
                onClick={async () => {
                  const newValue = !selectedStudent.show_progress_chart
                  const { error } = await supabase
                    .from('students')
                    .update({ show_progress_chart: newValue })
                    .eq('id', selectedStudent.id)
                  
                  if (!error) {
                    const updatedStudent = { ...selectedStudent, show_progress_chart: newValue }
                    setSelectedStudent(updatedStudent)
                    setStudents(students.map(s => s.id === selectedStudent.id ? updatedStudent : s))
                  }
                }}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  selectedStudent.show_progress_chart ? 'bg-[var(--sage)]' : 'bg-gray-300'
                }`}
              >
                <div className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
                  selectedStudent.show_progress_chart ? 'translate-x-7' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>
        )}

        {/* Courbe de progression (affichée seulement si activée) */}
        {hasFeature('progressChart') && selectedStudent.show_progress_chart && (
          <div className="mb-8">
            <ProgressChart
              notes={selectedStudent.notes}
              objectif={selectedStudent.objectif || 14}
              hasAccess={true}
            />
          </div>
        )}

             <div className="p-8">
  {/* Stats en grille */}
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
    <div className="bg-[var(--cream)] rounded-2xl p-5 text-center">
      <div className="flex items-center justify-center gap-2 mb-2">
        <Award className="text-[var(--sage)]" size={20} />
      </div>
      <div className="text-2xl font-fraunces font-bold text-[var(--espresso)]">
        {calculateAverage(selectedStudent.notes) || '-'}
      </div>
      <div className="text-xs text-[var(--espresso-light)]">Moyenne /20</div>
    </div>

    <div className="bg-[var(--cream)] rounded-2xl p-5 text-center">
      <div className="flex items-center justify-center gap-2 mb-2">
        <Target className="text-[var(--caramel)]" size={20} />
      </div>
      <div className="text-2xl font-fraunces font-bold text-[var(--caramel)]">
        {selectedStudent.objectif || 14}
      </div>
      <div className="text-xs text-[var(--espresso-light)]">Objectif /20</div>
    </div>

    <div className="bg-[var(--cream)] rounded-2xl p-5 text-center">
      <div className="flex items-center justify-center gap-2 mb-2">
        <BookOpen className="text-[var(--sage)]" size={20} />
      </div>
      <div className="text-2xl font-fraunces font-bold text-[var(--espresso)]">
        {selectedStudent.notes?.length || 0}
      </div>
      <div className="text-xs text-[var(--espresso-light)]">Notes</div>
    </div>

    <div className="bg-[var(--cream)] rounded-2xl p-5 text-center">
      <div className="flex items-center justify-center gap-2 mb-2">
        <TrendingUp className="text-[var(--sage)]" size={20} />
      </div>
      <div className={`text-2xl font-fraunces font-bold ${(selectedStudent.progression || 0) >= 100 ? 'text-[var(--sage)]' : 'text-[var(--caramel)]'}`}>
        {selectedStudent.progression || 0}%
      </div>
      <div className="text-xs text-[var(--espresso-light)]">Progression</div>
    </div>
  </div>

  {/* ONGLETS */}
  <div className="flex gap-2 mb-6 border-b-2 border-[var(--cream)] overflow-x-auto">
    <button
      onClick={() => setActiveTab('overview')}
      className={`py-3 px-6 font-semibold text-sm transition-all whitespace-nowrap ${
        activeTab === 'overview'
          ? 'text-[var(--sage)] border-b-2 border-[var(--sage)] -mb-0.5'
          : 'text-[var(--espresso-light)] hover:text-[var(--espresso)]'
      }`}
    >
      Vue d'ensemble
    </button>
    <button
      onClick={() => setActiveTab('seances')}
      className={`py-3 px-6 font-semibold text-sm transition-all whitespace-nowrap ${
        activeTab === 'seances'
          ? 'text-[var(--sage)] border-b-2 border-[var(--sage)] -mb-0.5'
          : 'text-[var(--espresso-light)] hover:text-[var(--espresso)]'
      }`}
    >
      Séances ({selectedStudent.seances?.length || 0})
    </button>
    <button
      onClick={() => setActiveTab('notes')}
      className={`py-3 px-6 font-semibold text-sm transition-all whitespace-nowrap ${
        activeTab === 'notes'
          ? 'text-[var(--sage)] border-b-2 border-[var(--sage)] -mb-0.5'
          : 'text-[var(--espresso-light)] hover:text-[var(--espresso)]'
      }`}
    >
      Notes scolaires ({selectedStudent.notes?.length || 0})
    </button>
    <button
      onClick={() => setActiveTab('documents')}
      className={`py-3 px-6 font-semibold text-sm transition-all whitespace-nowrap ${
        activeTab === 'documents'
          ? 'text-[var(--sage)] border-b-2 border-[var(--sage)] -mb-0.5'
          : 'text-[var(--espresso-light)] hover:text-[var(--espresso)]'
      }`}
    >
      Documents
    </button>
  </div>

  {/* CONTENU SELON L'ONGLET */}
  
  {/* Onglet Vue d'ensemble */}
  {activeTab === 'overview' && (
    <>
      {/* Objectif */}
      <div className="bg-[var(--cream)] rounded-2xl p-6 mb-8">
        <div className="flex items-start gap-3 mb-4">
          <Target className="text-[var(--caramel)] mt-1" size={24} />
          <div className="flex-1">
            <h3 className="font-semibold text-[var(--espresso)] mb-1">Objectif de note</h3>
            <p className="text-sm text-[var(--espresso-light)]">
              {(selectedStudent.progression || 0) >= 100
                ? 'Objectif atteint ! 🎉'
                : `Encore ${((selectedStudent.objectif || 14) - parseFloat(calculateAverage(selectedStudent.notes) || 0)).toFixed(1)} points`
              }
            </p>
          </div>
          <select
            value={selectedStudent.objectif || 14}
            onChange={(e) => handleUpdateObjectif(e.target.value)}
            className="py-2 px-4 border-2 border-[var(--sand)] rounded-xl text-sm focus:border-[var(--sage)] focus:outline-none bg-white font-semibold"
          >
            {[...Array(20)].map((_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}/20</option>
            ))}
          </select>
        </div>
      </div>

      {/* Courbe de progression */}
      {hasFeature('progressChart') && selectedStudent.show_progress_chart && (
        <div className="mb-8">
          <ProgressChart
            notes={selectedStudent.notes}
            objectif={selectedStudent.objectif || 14}
            hasAccess={true}
          />
        </div>
      )}

      {/* Appréciation générale */}
      <div className="mb-8">
        <h3 className="font-fraunces text-xl text-[var(--espresso)] font-bold mb-4">Appréciation générale</h3>
        <textarea
          value={selectedStudent.appreciation || ''}
          onChange={(e) => handleUpdateAppreciation(e.target.value)}
          className="w-full py-4 px-5 border-2 border-[var(--sand)] rounded-2xl text-sm focus:border-[var(--sage)] focus:outline-none resize-none bg-[var(--cream)]"
          rows={4}
          placeholder="Écrivez votre appréciation sur l'élève..."
        />
      </div>
    </>
  )}

  {/* Onglet Séances */}
  {activeTab === 'seances' && (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-fraunces text-xl text-[var(--espresso)] font-bold">Séances de cours</h3>
        <button
          onClick={() => setShowSeanceModal(true)}
          className="py-2 px-5 bg-[var(--caramel)] text-white rounded-full font-semibold text-sm hover:shadow-lg transition-all cursor-pointer border-none inline-flex items-center gap-2"
        >
          <Plus size={16} />
          Ajouter
        </button>
      </div>

      {(!Array.isArray(selectedStudent.seances) || selectedStudent.seances.length === 0) ? (
        <div className="bg-[var(--cream)] rounded-2xl p-8 text-center">
          <BookOpen className="mx-auto text-[var(--espresso-light)] mb-3" size={40} />
          <p className="text-[var(--espresso-light)]">Aucune séance enregistrée</p>
        </div>
      ) : (
        <div className="space-y-3">
          {[...selectedStudent.seances].sort((a, b) => new Date(b.date) - new Date(a.date)).map((seance, index) => (
            <div key={seance.id || index} className="bg-[var(--cream)] rounded-2xl p-5 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="text-sm font-semibold text-[var(--espresso)] mb-1">{seance.sujet || 'Sans sujet'}</div>
                  <div className="text-xs text-[var(--espresso-light)]">
                    {new Date(seance.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteSeance(seance)}
                  className="text-[var(--coral)] hover:text-red-600 cursor-pointer bg-transparent border-none p-2"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              
              {seance.appreciation && (
                <div className="bg-white rounded-lg p-3 text-sm text-[var(--espresso)] border-l-4 border-[var(--caramel)]">
                  💭 {seance.appreciation}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )}

  {/* Onglet Notes */}
  {activeTab === 'notes' && (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-fraunces text-xl text-[var(--espresso)] font-bold">Notes scolaires</h3>
        <button
          onClick={openNoteModal}
          className="py-2 px-5 bg-[var(--sage)] text-white rounded-full font-semibold text-sm hover:shadow-lg transition-all cursor-pointer border-none inline-flex items-center gap-2"
        >
          <Plus size={16} />
          Ajouter
        </button>
      </div>

      {(!Array.isArray(selectedStudent.notes) || selectedStudent.notes.length === 0) ? (
        <div className="bg-[var(--cream)] rounded-2xl p-8 text-center">
          <BookOpen className="mx-auto text-[var(--espresso-light)] mb-3" size={40} />
          <p className="text-[var(--espresso-light)]">Aucune note enregistrée</p>
        </div>
      ) : (
        <div className="space-y-3">
          {[...selectedStudent.notes].sort((a, b) => new Date(b.date) - new Date(a.date)).map((note, index) => (
            <div key={note.id || `${note.date}-${note.note}-${index}`} className="bg-[var(--cream)] rounded-2xl p-5 flex justify-between items-center hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold ${
                  note.note >= (selectedStudent.objectif || 14) ? 'bg-[var(--sage)]/20 text-[var(--sage)]' :
                  note.note >= 10 ? 'bg-[var(--caramel)]/20 text-[var(--caramel)]' : 'bg-[var(--coral)]/20 text-[var(--coral)]'
                }`}>
                  {note.note}
                </div>
                <div>
                  <div className="text-sm font-semibold text-[var(--espresso)]">{note.description || 'Sans description'}</div>
                  <div className="text-xs text-[var(--espresso-light)]">
                    {new Date(note.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleDeleteNote(note)}
                className="text-[var(--coral)] hover:text-red-600 cursor-pointer bg-transparent border-none p-2"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )}

  {/* Onglet Documents */}
  {activeTab === 'documents' && (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-fraunces text-xl text-[var(--espresso)] font-bold flex items-center gap-2">
          <FileText className="text-[var(--caramel)]" size={24} />
          Documents PDF
          <span className="text-xs font-normal text-[var(--espresso-light)]">(max {getMaxPdfSizeLabel()})</span>
        </h3>
        <label className="py-2 px-5 bg-[var(--caramel)] text-white rounded-full font-semibold text-sm hover:shadow-lg transition-all cursor-pointer inline-flex items-center gap-2">
          {uploadingPdf ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Upload...
            </>
          ) : (
            <>
              <Upload size={16} />
              Ajouter PDF
            </>
          )}
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => handlePdfUpload(e, selectedStudent.id)}
            className="hidden"
            disabled={uploadingPdf}
          />
        </label>
      </div>

      {(!selectedStudent.pdfs || selectedStudent.pdfs.length === 0) ? (
        <div className="bg-[var(--cream)] rounded-2xl p-8 text-center">
          <FileText className="mx-auto text-[var(--espresso-light)] mb-3" size={40} />
          <p className="text-[var(--espresso-light)]">Aucun document PDF</p>
          <p className="text-xs text-[var(--espresso-light)] mt-2">
            Ajoutez des fiches, exercices ou cours pour votre élève
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {selectedStudent.pdfs.map((pdf) => (
            <div key={pdf.id} className="bg-[var(--cream)] rounded-2xl p-4 flex justify-between items-center hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--caramel)]/20 flex items-center justify-center">
                  <FileText className="text-[var(--caramel)]" size={24} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-[var(--espresso)]">{pdf.name}</div>
                  <div className="text-xs text-[var(--espresso-light)]">
                    Ajouté le {new Date(pdf.uploadedAt).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={pdf.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-[var(--sage)] hover:bg-[var(--sage)]/10 rounded-lg transition-colors"
                >
                  <Download size={18} />
                </a>
                <button
                  onClick={() => handleDeletePdf(pdf)}
                  className="p-2 text-[var(--coral)] hover:bg-[var(--coral)]/10 rounded-lg transition-colors bg-transparent border-none cursor-pointer"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )}
                {/* Actions */}
                <div className="flex flex-col gap-3 pt-6 border-t border-[var(--cream)]">
                  <div className="flex gap-3">
                    {hasFeature('pdfExport') ? (
                      <button
                        onClick={() => exportToPDF(selectedStudent)}
                        className="flex-1 py-3 bg-[var(--sage)] text-white rounded-full font-semibold hover:shadow-xl transition-all cursor-pointer border-none inline-flex items-center justify-center gap-2"
                      >
                        <Download size={18} />
                        Exporter fiche
                      </button>
                    ) : (
                      <div className="flex-1 py-3 bg-gray-100 text-gray-400 rounded-full font-semibold inline-flex items-center justify-center gap-2 relative">
                        <Download size={18} />
                        Exporter fiche
                        <span className="absolute -top-2 -right-2 bg-[var(--caramel)] text-white text-xs px-2 py-1 rounded-full">PRO</span>
                      </div>
                    )}
                    <button
                      onClick={() => {
                        setSelectedStudent(null)
                        openEditModal(selectedStudent)
                      }}
                      className="flex-1 py-3 bg-[var(--cream)] text-[var(--espresso)] rounded-full font-semibold hover:bg-[var(--sand)] transition-colors cursor-pointer border-none inline-flex items-center justify-center gap-2"
                    >
                      <Edit2 size={18} />
                      Modifier
                    </button>
                  </div>
                  {/* Bouton Bilan Trimestriel */}
                  {hasFeature('pdfExport') ? (
                    <button
                      onClick={() => setShowBilanModal(true)}
                      className="w-full py-3 bg-gradient-to-r from-[var(--caramel)] to-[var(--sage)] text-white rounded-full font-semibold hover:shadow-xl transition-all cursor-pointer border-none inline-flex items-center justify-center gap-2"
                    >
                      <FileDown size={18} />
                      Générer bilan trimestriel
                    </button>
                  ) : (
                    <div className="w-full py-3 bg-gray-100 text-gray-400 rounded-full font-semibold inline-flex items-center justify-center gap-2 relative">
                      <FileDown size={18} />
                      Générer bilan trimestriel
                      <span className="absolute -top-2 -right-2 bg-[var(--caramel)] text-white text-xs px-2 py-1 rounded-full">PRO</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Ajouter une note */}
        {showNoteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-5">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-fraunces text-2xl text-[var(--espresso)] font-bold">Ajouter une note</h2>
                <button onClick={() => setShowNoteModal(false)} className="text-[var(--espresso-light)] hover:text-[var(--espresso)] cursor-pointer bg-transparent border-none">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleAddNote}>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-[var(--espresso)] mb-2">Note /20 *</label>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        step="0.5"
                        required
                        value={noteFormData.note}
                        onChange={(e) => setNoteFormData({...noteFormData, note: e.target.value})}
                        className="w-full py-3 px-4 border-2 border-[var(--sand)] rounded-xl text-sm focus:border-[var(--sage)] focus:outline-none"
                        placeholder="15"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--espresso)] mb-2">Date *</label>
                      <input
                        type="date"
                        required
                        value={noteFormData.date}
                        onChange={(e) => setNoteFormData({...noteFormData, date: e.target.value})}
                        className="w-full py-3 px-4 border-2 border-[var(--sand)] rounded-xl text-sm focus:border-[var(--sage)] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[var(--espresso)] mb-2">Description</label>
                    <input
                      type="text"
                      value={noteFormData.description}
                      onChange={(e) => setNoteFormData({...noteFormData, description: e.target.value})}
                      className="w-full py-3 px-4 border-2 border-[var(--sand)] rounded-xl text-sm focus:border-[var(--sage)] focus:outline-none"
                      placeholder="Ex: Contrôle chapitre 3"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button type="submit" className="flex-1 py-3 bg-[var(--sage)] text-white rounded-full font-semibold hover:shadow-xl transition-all cursor-pointer border-none">
                    Ajouter
                  </button>
                  <button type="button" onClick={() => setShowNoteModal(false)} className="flex-1 py-3 bg-[var(--cream)] text-[var(--espresso)] rounded-full font-semibold hover:bg-[var(--sand)] transition-colors cursor-pointer border-none">
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

{/* Modal Ajouter une séance */}
{showSeanceModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-5">
    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-fraunces text-2xl text-[var(--espresso)] font-bold">Ajouter une séance</h2>
        <button onClick={() => setShowSeanceModal(false)} className="text-[var(--espresso-light)] hover:text-[var(--espresso)] cursor-pointer bg-transparent border-none">
          <X size={24} />
        </button>
      </div>
      <form onSubmit={handleAddSeance}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[var(--espresso)] mb-2">Date *</label>
            <input
              type="date"
              required
              value={seanceFormData.date}
              onChange={(e) => setSeanceFormData({...seanceFormData, date: e.target.value})}
              className="w-full py-3 px-4 border-2 border-[var(--sand)] rounded-xl text-sm focus:border-[var(--sage)] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[var(--espresso)] mb-2">Sujet du cours *</label>
            <input
              type="text"
              required
              value={seanceFormData.sujet}
              onChange={(e) => setSeanceFormData({...seanceFormData, sujet: e.target.value})}
              className="w-full py-3 px-4 border-2 border-[var(--sand)] rounded-xl text-sm focus:border-[var(--sage)] focus:outline-none"
              placeholder="Ex: Equations du second degré"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[var(--espresso)] mb-2">Appréciation</label>
            <textarea
              value={seanceFormData.appreciation}
              onChange={(e) => setSeanceFormData({...seanceFormData, appreciation: e.target.value})}
              className="w-full py-3 px-4 border-2 border-[var(--sand)] rounded-xl text-sm focus:border-[var(--sage)] focus:outline-none resize-none"
              rows={4}
              placeholder="Comportement, difficultés rencontrées..."
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button type="submit" className="flex-1 py-3 bg-[var(--caramel)] text-white rounded-full font-semibold hover:shadow-xl transition-all cursor-pointer border-none">
            Ajouter
          </button>
          <button type="button" onClick={() => setShowSeanceModal(false)} className="flex-1 py-3 bg-[var(--cream)] text-[var(--espresso)] rounded-full font-semibold hover:bg-[var(--sand)] transition-colors cursor-pointer border-none">
            Annuler
          </button>
        </div>
      </form>
    </div>
  </div>
)}

        {/* Modal Code de liaison */}
        {linkCodeModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-5">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="font-fraunces text-3xl text-[var(--espresso)] font-bold mb-3">
                Élève créé !
              </h2>
              <p className="text-[var(--espresso-light)] mb-6">
                Partagez ce code avec votre élève pour qu'il accède à son espace
              </p>
              
              <div className="bg-gradient-to-br from-[var(--sage)]/10 to-[var(--caramel)]/10 rounded-2xl p-6 mb-6">
                <div className="text-xs text-[var(--espresso-light)] uppercase mb-2 font-semibold">Code de liaison</div>
                <div className="font-mono text-5xl font-bold text-[var(--sage)] tracking-wider">
                  {linkCodeModal}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(linkCodeModal)
                    alert('Code copié !')
                  }}
                  className="flex-1 py-3 bg-[var(--sage)] text-white rounded-full font-semibold hover:shadow-xl transition-all cursor-pointer border-none inline-flex items-center justify-center gap-2"
                >
                  <Copy size={18} />
                  Copier
                </button>
                <button
                  onClick={() => setLinkCodeModal(null)}
                  className="flex-1 py-3 bg-[var(--cream)] text-[var(--espresso)] rounded-full font-semibold hover:bg-[var(--sand)] transition-colors cursor-pointer border-none"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Dashboard Global (Pro) */}
        {showDashboardModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-5">
            <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-8 border-b border-[var(--cream)] flex justify-between items-center sticky top-0 bg-white rounded-t-3xl">
                <div>
                  <h2 className="font-fraunces text-3xl text-[var(--espresso)] font-bold">Tableau de bord global</h2>
                  <p className="text-[var(--espresso-light)]">Vue d'ensemble de tous vos élèves</p>
                </div>
                <button onClick={() => setShowDashboardModal(false)} className="text-[var(--espresso-light)] hover:text-[var(--espresso)] cursor-pointer bg-transparent border-none">
                  <X size={28} />
                </button>
              </div>

              <div className="p-8">
                {/* Période selector */}
                <div className="flex gap-3 mb-8 justify-center">
                  <button
                    onClick={() => setDashboardPeriod('month')}
                    className={`py-2 px-6 rounded-full font-semibold text-sm transition-all ${
                      dashboardPeriod === 'month'
                        ? 'bg-[var(--sage)] text-white'
                        : 'bg-[var(--cream)] text-[var(--espresso)]'
                    }`}
                  >
                    Ce mois
                  </button>
                  <button
                    onClick={() => setDashboardPeriod('year')}
                    className={`py-2 px-6 rounded-full font-semibold text-sm transition-all ${
                      dashboardPeriod === 'year'
                        ? 'bg-[var(--sage)] text-white'
                        : 'bg-[var(--cream)] text-[var(--espresso)]'
                    }`}
                  >
                    Cette année
                  </button>
                </div>

                {/* Stats globales */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-gradient-to-br from-[var(--sage)] to-[var(--sage)]/70 rounded-2xl p-5 text-white text-center">
                    <div className="text-3xl font-fraunces font-bold">{students.length}</div>
                    <div className="text-sm opacity-90">Élèves actifs</div>
                  </div>
                  <div className="bg-gradient-to-br from-[var(--caramel)] to-[var(--caramel)]/70 rounded-2xl p-5 text-white text-center">
                    <div className="text-3xl font-fraunces font-bold">
                      {students.reduce((acc, s) => acc + (Array.isArray(s.notes) ? s.notes.length : 0), 0)}
                    </div>
                    <div className="text-sm opacity-90">Notes totales</div>
                  </div>
                  <div className="bg-[var(--cream)] rounded-2xl p-5 text-center">
                    <div className="text-3xl font-fraunces font-bold text-[var(--espresso)]">
                      {students.length > 0 && students.some(s => Array.isArray(s.notes) && s.notes.length > 0)
                        ? (students.filter(s => Array.isArray(s.notes) && s.notes.length > 0).reduce((acc, s) => {
                            const avg = s.notes.reduce((a, n) => a + n.note, 0) / s.notes.length
                            return acc + avg
                          }, 0) / students.filter(s => Array.isArray(s.notes) && s.notes.length > 0).length).toFixed(1)
                        : '-'
                      }
                    </div>
                    <div className="text-sm text-[var(--espresso-light)]">Moyenne /20</div>
                  </div>
                  <div className="bg-[var(--cream)] rounded-2xl p-5 text-center">
                    <div className="text-3xl font-fraunces font-bold text-[var(--sage)]">
                      {students.filter(s => {
                        const notes = s.notes || []
                        if (notes.length === 0) return false
                        const avg = notes.reduce((a, n) => a + n.note, 0) / notes.length
                        return avg >= (s.objectif || 14)
                      }).length}
                    </div>
                    <div className="text-sm text-[var(--espresso-light)]">Objectifs atteints</div>
                  </div>
                </div>

                {/* Répartition par niveau */}
                <div className="bg-[var(--cream)] rounded-2xl p-6 mb-8">
                  <h3 className="font-fraunces text-xl text-[var(--espresso)] font-bold mb-4">Répartition par niveau</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['Collège', 'Lycée', 'Supérieur'].map(category => {
                      const niveaux = {
                        'Collège': ['6ème', '5ème', '4ème', '3ème'],
                        'Lycée': ['2nde', '1ère', 'Terminale'],
                        'Supérieur': ['Supérieur']
                      }
                      const count = students.filter(s => niveaux[category].includes(s.niveau)).length
                      const percent = students.length > 0 ? Math.round((count / students.length) * 100) : 0
                      return (
                        <div key={category} className="bg-white rounded-xl p-4 text-center">
                          <div className="font-fraunces text-2xl font-bold text-[var(--espresso)]">{count}</div>
                          <div className="text-xs text-[var(--espresso-light)]">{category}</div>
                          <div className="w-full h-2 bg-[var(--sand)] rounded-full mt-2 overflow-hidden">
                            <div
                              className="h-full bg-[var(--sage)] rounded-full transition-all"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          <div className="text-xs text-[var(--sage)] mt-1">{percent}%</div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Liste des élèves avec leurs stats */}
                <div className="bg-[var(--cream)] rounded-2xl p-6">
                  <h3 className="font-fraunces text-xl text-[var(--espresso)] font-bold mb-4">Performance par élève</h3>
                  <div className="space-y-3">
                    {students.map(student => {
                      const notes = student.notes || []
                      const avg = notes.length > 0
                        ? (notes.reduce((a, n) => a + n.note, 0) / notes.length).toFixed(1)
                        : '-'
                      const objectifAtteint = avg !== '-' && parseFloat(avg) >= (student.objectif || 14)

                      return (
                        <div key={student.id} className="bg-white rounded-xl p-4 flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-[var(--sage)]/10 text-[var(--sage)] flex items-center justify-center font-bold text-sm">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-[var(--espresso)]">{student.name}</div>
                            <div className="text-xs text-[var(--espresso-light)]">{student.niveau} • {student.matiere || 'N/A'}</div>
                          </div>
                          <div className="text-right">
                            <div className={`font-fraunces text-xl font-bold ${objectifAtteint ? 'text-[var(--sage)]' : 'text-[var(--espresso)]'}`}>
                              {avg}/20
                            </div>
                            <div className="text-xs text-[var(--espresso-light)]">{notes.length} notes</div>
                          </div>
                          {objectifAtteint && <CheckCircle size={20} className="text-[var(--sage)]" />}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Messagerie */}
        {showMessagingModal && selectedStudent && (
          <MessagingModal
            student={selectedStudent}
            user={user}
            userRole="professeur"
            onClose={() => setShowMessagingModal(false)}
          />
        )}

        {/* Modal Bilan Trimestriel */}
        {showBilanModal && selectedStudent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-5">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="font-fraunces text-2xl text-[var(--espresso)] font-bold">Bilan trimestriel</h2>
                  <p className="text-sm text-[var(--espresso-light)]">{selectedStudent.name}</p>
                </div>
                <button
                  onClick={() => setShowBilanModal(false)}
                  className="text-[var(--espresso-light)] hover:text-[var(--espresso)] cursor-pointer bg-transparent border-none"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="bg-gradient-to-br from-[var(--sage)]/10 to-[var(--caramel)]/10 rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="text-[var(--sage)]" size={24} />
                  <span className="font-semibold text-[var(--espresso)]">Sélectionnez un trimestre</span>
                </div>

                <div className="space-y-3">
                  {[
                    { value: 1, label: '1er Trimestre', period: 'Septembre - Décembre' },
                    { value: 2, label: '2ème Trimestre', period: 'Janvier - Mars' },
                    { value: 3, label: '3ème Trimestre', period: 'Avril - Juin' }
                  ].map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setBilanTrimestre(t.value)}
                      className={`w-full p-4 rounded-xl text-left transition-all ${
                        bilanTrimestre === t.value
                          ? 'bg-[var(--sage)] text-white'
                          : 'bg-white text-[var(--espresso)] hover:bg-[var(--cream)]'
                      }`}
                    >
                      <div className="font-semibold">{t.label}</div>
                      <div className={`text-xs ${bilanTrimestre === t.value ? 'text-white/80' : 'text-[var(--espresso-light)]'}`}>
                        {t.period}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-[var(--cream)] rounded-xl p-4 mb-6">
                <p className="text-sm text-[var(--espresso-light)]">
                  <span className="font-semibold text-[var(--espresso)]">Le bilan comprend :</span>
                </p>
                <ul className="text-sm text-[var(--espresso-light)] mt-2 space-y-1">
                  <li>• Moyenne et notes du trimestre</li>
                  <li>• Graphique de progression</li>
                  <li>• Analyse de la tendance</li>
                  <li>• Appréciation générale</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => generateBilanPDF(selectedStudent, bilanTrimestre)}
                  className="flex-1 py-3 bg-gradient-to-r from-[var(--caramel)] to-[var(--sage)] text-white rounded-full font-semibold hover:shadow-xl transition-all cursor-pointer border-none inline-flex items-center justify-center gap-2"
                >
                  <FileDown size={18} />
                  Générer le bilan
                </button>
                <button
                  onClick={() => setShowBilanModal(false)}
                  className="flex-1 py-3 bg-[var(--cream)] text-[var(--espresso)] rounded-full font-semibold hover:bg-[var(--sand)] transition-colors cursor-pointer border-none"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}

     </div>
)}
    </>
  )
}