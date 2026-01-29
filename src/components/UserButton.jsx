import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { LogOut, User, ChevronDown } from 'lucide-react'

export default function UserButton() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  if (!user) return null

  const initials = user.user_metadata?.first_name?.[0] + user.user_metadata?.last_name?.[0] || 'U'
  const fullName = `${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}`.trim() || user.email

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white border-2 border-[var(--sand)] rounded-xl py-2 px-3 hover:border-[var(--caramel)] transition-all cursor-pointer"
      >
        <div className="w-8 h-8 rounded-full bg-[var(--caramel)] text-white flex items-center justify-center font-semibold text-sm">
          {initials}
        </div>
        <ChevronDown size={16} className={`text-[var(--espresso)] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border-2 border-[var(--sand)] overflow-hidden z-20">
            <div className="p-4 border-b border-[var(--cream)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--caramel)] text-white flex items-center justify-center font-semibold">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[var(--espresso)] truncate">{fullName}</div>
                  <div className="text-xs text-[var(--espresso-light)] truncate">{user.email}</div>
                </div>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 text-[var(--espresso)] hover:bg-[var(--cream)] transition-colors text-left border-none cursor-pointer bg-transparent"
            >
              <LogOut size={18} />
              <span className="font-medium">Se déconnecter</span>
            </button>
          </div>
        </>
      )}
    </div>
  )
}