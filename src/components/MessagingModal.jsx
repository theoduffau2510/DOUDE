import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { X, Send, MessageCircle, Loader2 } from 'lucide-react'

export default function MessagingModal({ student, user, userRole, onClose }) {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef(null)

  // Fetch messages on mount
  useEffect(() => {
    fetchMessages()
    markMessagesAsRead()

    // Polling every 10 seconds
    const interval = setInterval(fetchMessages, 10000)
    return () => clearInterval(interval)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [student.id])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('student_id', student.id)
      .order('created_at', { ascending: true })

    if (!error && data) {
      setMessages(data)
    }
    setLoading(false)
  }

  const markMessagesAsRead = async () => {
    const otherRole = userRole === 'professeur' ? 'eleve' : 'professeur'

    await supabase
      .from('messages')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('student_id', student.id)
      .eq('sender_role', otherRole)
      .eq('is_read', false)
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || sending) return

    setSending(true)

    const { data, error } = await supabase
      .from('messages')
      .insert({
        student_id: student.id,
        sender_id: user.id,
        sender_role: userRole,
        content: newMessage.trim()
      })
      .select()
      .single()

    if (!error && data) {
      setMessages([...messages, data])
      setNewMessage('')
    } else {
      console.error('Erreur envoi message:', error)
    }

    setSending(false)
  }

  const formatTime = (dateStr) => {
    const date = new Date(dateStr)
    const today = new Date()
    const isToday = date.toDateString() === today.toDateString()

    if (isToday) {
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    }
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const isMyMessage = (msg) => msg.sender_id === user.id

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-5">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[80vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-[var(--cream)] flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--sage)] text-white flex items-center justify-center font-semibold">
              <MessageCircle size={20} />
            </div>
            <div>
              <h2 className="font-fraunces text-xl text-[var(--espresso)] font-bold">
                {userRole === 'professeur' ? `Message - ${student.name}` : 'Message au professeur'}
              </h2>
              <p className="text-xs text-[var(--espresso-light)]">
                {student.matiere} - {student.niveau}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--espresso-light)] hover:text-[var(--espresso)] cursor-pointer bg-transparent border-none"
          >
            <X size={24} />
          </button>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[var(--cream)]/30 min-h-[300px]">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="animate-spin text-[var(--sage)]" size={32} />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="mx-auto text-[var(--espresso-light)] mb-3" size={40} />
              <p className="text-[var(--espresso-light)]">Aucun message pour le moment</p>
              <p className="text-xs text-[var(--espresso-light)] mt-1">
                Commencez la conversation !
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${isMyMessage(msg) ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    isMyMessage(msg)
                      ? 'bg-[var(--sage)] text-white rounded-br-md'
                      : 'bg-white text-[var(--espresso)] rounded-bl-md shadow-sm'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  <p className={`text-[10px] mt-1 ${
                    isMyMessage(msg) ? 'text-white/70' : 'text-[var(--espresso-light)]'
                  }`}>
                    {formatTime(msg.created_at)}
                    {isMyMessage(msg) && msg.is_read && ' - Lu'}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <form onSubmit={sendMessage} className="p-4 border-t border-[var(--cream)] bg-white rounded-b-3xl">
          <div className="flex gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Votre message..."
              className="flex-1 py-3 px-4 border-2 border-[var(--sand)] rounded-xl text-sm focus:border-[var(--sage)] focus:outline-none"
              disabled={sending}
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || sending}
              className="py-3 px-5 bg-[var(--sage)] text-white rounded-xl font-semibold hover:shadow-lg transition-all cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {sending ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
