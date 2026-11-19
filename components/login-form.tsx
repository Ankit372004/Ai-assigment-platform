"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, User, Shield, Eye, EyeOff } from "lucide-react"
import { authenticateUser } from "@/lib/mock-data"

interface LoginFormProps {
  onLogin: (user: { id: string; name: string; email: string; role: string }) => void
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const user = await authenticateUser(email, password)
      if (user) {
        onLogin({
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        })
      } else {
        setError("Invalid credentials. Please try again.")
      }
    } catch (error) {
      setError("Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const demoAccounts = [
    {
      email: "rahul.verma@cu.edu.in",
      password: "student123",
      role: "Student",
      name: "Rahul Verma",
      icon: GraduationCap,
      color: "bg-green-100 text-green-800",
    },
    {
      email: "priya.sharma@cu.edu.in",
      password: "teacher123",
      role: "Teacher",
      name: "Dr. Priya Sharma",
      icon: User,
      color: "bg-blue-100 text-blue-800",
    },
    {
      email: "admin@cu.edu.in",
      password: "admin123",
      role: "Admin",
      name: "Dr. Rajesh Kumar",
      icon: Shield,
      color: "bg-red-100 text-red-800",
    },
  ]

  const handleDemoLogin = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail)
    setPassword(demoPassword)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8">
        {/* Login Form */}
        <Card className="w-full max-w-md mx-auto shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">CU EvalPlatform</CardTitle>
            <CardDescription>AI-Powered Assignment Evaluation System</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Accounts */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl">Demo Accounts</CardTitle>
            <CardDescription>Click on any account to auto-fill login credentials</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {demoAccounts.map((account, index) => {
              const IconComponent = account.icon
              return (
                <div
                  key={index}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer hover:bg-gray-50"
                  onClick={() => handleDemoLogin(account.email, account.password)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <IconComponent className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium">{account.name}</p>
                        <Badge className={account.color}>{account.role}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{account.email}</p>
                      <p className="text-xs text-gray-500">Password: {account.password}</p>
                    </div>
                  </div>
                </div>
              )
            })}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Features Available:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• AI-powered assignment evaluation</li>
                <li>• Real-time progress tracking</li>
                <li>• Comprehensive analytics dashboard</li>
                <li>• Multi-role access (Student/Teacher/Admin)</li>
                <li>• Assignment submission & grading</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
