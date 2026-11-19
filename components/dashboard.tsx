"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { StudentDashboard } from "@/components/student/student-dashboard"
import { TeacherDashboard } from "@/components/teacher/teacher-dashboard"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

interface DashboardProps {
  user: {
    id: string
    name: string
    email: string
    role: string
  }
  onLogout: () => void
}

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState("dashboard")

  const renderDashboard = () => {
    switch (user.role) {
      case "student":
        return <StudentDashboard user={user} activeTab={activeTab} />
      case "teacher":
        return <TeacherDashboard user={user} activeTab={activeTab} />
      case "admin":
        return <AdminDashboard user={user} activeTab={activeTab} />
      default:
        return <div>Invalid user role</div>
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar user={user} activeTab={activeTab} onTabChange={setActiveTab} onLogout={onLogout} />
      <main className="flex-1 overflow-auto">{renderDashboard()}</main>
    </div>
  )
}
