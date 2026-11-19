"use client"

import { useState } from "react"
import { LoginForm } from "@/components/login-form"
import { Dashboard } from "@/components/dashboard"

export default function Home() {
  const [user, setUser] = useState<{
    id: string
    name: string
    email: string
    role: string
  } | null>(null)

  const handleLogin = (userData: { id: string; name: string; email: string; role: string }) => {
    setUser(userData)
  }

  const handleLogout = () => {
    setUser(null)
  }

  if (!user) {
    return <LoginForm onLogin={handleLogin} />
  }

  return <Dashboard user={user} onLogout={handleLogout} />
}
