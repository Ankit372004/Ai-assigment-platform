"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  FileText,
  Upload,
  Calendar,
  TrendingUp,
  BookOpen,
  Users,
  Settings,
  LogOut,
  GraduationCap,
  ClipboardList,
  BarChart3,
  Building,
  Shield,
  User,
} from "lucide-react"

interface SidebarProps {
  user: {
    id: string
    name: string
    email: string
    role: string
  }
  activeTab: string
  onTabChange: (tab: string) => void
  onLogout: () => void
}

export function Sidebar({ user, activeTab, onTabChange, onLogout }: SidebarProps) {
  const getMenuItems = () => {
    switch (user.role) {
      case "student":
        return [
          { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
          { id: "assignments", label: "Assignments", icon: FileText },
          { id: "calendar", label: "Calendar", icon: Calendar },
          { id: "courses", label: "My Courses", icon: BookOpen },
          { id: "submissions", label: "My Submissions", icon: Upload },
          { id: "progress", label: "Progress", icon: TrendingUp },
        ]
      case "teacher":
        return [
          { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
          { id: "assignments", label: "Assignments", icon: FileText },
          { id: "submissions", label: "Submissions", icon: ClipboardList },
          { id: "students", label: "Students", icon: Users },
          { id: "grading", label: "Grading", icon: TrendingUp },
          { id: "analytics", label: "Analytics", icon: BarChart3 },
        ]
      case "admin":
        return [
          { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
          { id: "users", label: "Users", icon: Users },
          { id: "departments", label: "Departments", icon: Building },
          { id: "subjects", label: "Subjects", icon: BookOpen },
          { id: "analytics", label: "Analytics", icon: BarChart3 },
          { id: "settings", label: "Settings", icon: Settings },
        ]
      default:
        return []
    }
  }

  const getRoleIcon = () => {
    switch (user.role) {
      case "student":
        return <GraduationCap className="h-5 w-5" />
      case "teacher":
        return <User className="h-5 w-5" />
      case "admin":
        return <Shield className="h-5 w-5" />
      default:
        return <User className="h-5 w-5" />
    }
  }

  const getRoleColor = () => {
    switch (user.role) {
      case "student":
        return "bg-green-100 text-green-800"
      case "teacher":
        return "bg-blue-100 text-blue-800"
      case "admin":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const menuItems = getMenuItems()

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg">CU EvalPlatform</h2>
            <p className="text-sm text-gray-600">AI Assignment System</p>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{user.name}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
            <Badge className={`${getRoleColor()} text-xs mt-1`}>
              <div className="flex items-center space-x-1">
                {getRoleIcon()}
                <span className="capitalize">{user.role}</span>
              </div>
            </Badge>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const IconComponent = item.icon
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                className={`w-full justify-start ${
                  activeTab === item.id
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => onTabChange(item.id)}
              >
                <IconComponent className="h-4 w-4 mr-3" />
                {item.label}
              </Button>
            )
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  )
}
