// Formulaire pour demander le reset
const handleResetRequest = async (email) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'https://doude.vercel.app',
  })
}

// Page /update-password pour définir le nouveau MDP
const handleUpdatePassword = async (newPassword) => {
  const { error } = await supabase.auth.updateUser({
    password: newPassword
  })
}