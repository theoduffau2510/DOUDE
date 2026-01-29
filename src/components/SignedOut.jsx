import { useAuth } from '../contexts/AuthContext'

export default function SignedOut({ children }) {
  const { user } = useAuth()
  return !user ? children : null
}