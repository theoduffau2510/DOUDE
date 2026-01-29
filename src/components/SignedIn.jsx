import { useAuth } from '../contexts/AuthContext'

export default function SignedIn({ children }) {
  const { user } = useAuth()
  return user ? children : null
}