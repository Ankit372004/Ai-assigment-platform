"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  Activity,
  Plus,
  Building,
  Edit,
  Eye,
  BarChart3,
  Settings,
  Database,
  ClipboardList,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Shield,
  Upload,
} from "lucide-react"
import { FileText } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { MockAPI } from "@/lib/mock-data"
import type { IUser, IDepartment, ISection, IGroup, ISubject, IAssignment, ISubmission } from "@/lib/database/schemas"

interface AdminDashboardProps {
  user: {
    id: string
    name: string
    email: string
    role: string
  }
  activeTab: string
}

export function AdminDashboard({ user, activeTab }: AdminDashboardProps) {
  // State management
  const [users, setUsers] = useState<IUser[]>([])
  const [departments, setDepartments] = useState<IDepartment[]>([])
  const [sections, setSections] = useState<ISection[]>([])
  const [groups, setGroups] = useState<IGroup[]>([])
  const [subjects, setSubjects] = useState<ISubject[]>([])
  const [assignments, setAssignments] = useState<IAssignment[]>([])
  const [submissions, setSubmissions] = useState<ISubmission[]>([])
  const [loading, setLoading] = useState(false)

  // Form states
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "student",
    password: "",
    department: "",
    section: "",
    group: "",
    batch: "",
    semester: 1,
    rollNumber: "",
    employeeId: "",
    designation: "",
    phone: "",
  })

  // Load data on component mount
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [usersData, departmentsData, sectionsData, groupsData, subjectsData, assignmentsData, submissionsData] =
        await Promise.all([
          MockAPI.getUsers(),
          MockAPI.getDepartments(),
          MockAPI.getSections(),
          MockAPI.getGroups(),
          MockAPI.getSubjects(),
          MockAPI.getAssignments(),
          MockAPI.getSubmissions(),
        ])

      setUsers(usersData)
      setDepartments(departmentsData)
      setSections(sectionsData)
      setGroups(groupsData)
      setSubjects(subjectsData)
      setAssignments(assignmentsData)
      setSubmissions(submissionsData)
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Event handlers
  const handleCreateUser = async () => {
    try {
      const userData = {
        ...newUser,
        joiningDate: new Date(),
        status: "active" as const,
      }

      if (newUser.role === "student") {
        userData.studentId = `CU/${newUser.department}/${new Date().getFullYear()}/${String(users.filter((u) => u.role === "student").length + 1).padStart(3, "0")}`
      } else if (newUser.role === "teacher") {
        userData.employeeId = `CU/${newUser.department}/${String(users.filter((u) => u.role === "teacher").length + 1).padStart(3, "0")}`
      }

      await MockAPI.createUser(userData)
      await loadData()
      setNewUser({
        name: "",
        email: "",
        role: "student",
        password: "",
        department: "",
        section: "",
        group: "",
        batch: "",
        semester: 1,
        rollNumber: "",
        employeeId: "",
        designation: "",
        phone: "",
      })
    } catch (error) {
      console.error("Error creating user:", error)
    }
  }

  // Statistics calculations
  const systemStats = {
    totalUsers: users.length,
    activeStudents: users.filter((u) => u.role === "student" && u.status === "active").length,
    activeTeachers: users.filter((u) => u.role === "teacher" && u.status === "active").length,
    totalDepartments: departments.length,
    totalSections: sections.length,
    totalSubjects: subjects.length,
    totalAssignments: assignments.length,
    totalSubmissions: submissions.length,
    pendingReviews: submissions.filter((s) => s.status === "ai_evaluated").length,
    systemUptime: "99.9%",
    avgProcessingTime: "2.1s",
    storageUsed: "2.4 GB",
    averageScore:
      submissions.length > 0 ? submissions.reduce((sum, s) => sum + (s.finalScore || 0), 0) / submissions.length : 0,
  }

  // Helper functions
  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800"
      case "teacher":
        return "bg-blue-100 text-blue-800"
      case "student":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "graduated":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Render functions
  const renderMainDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-red-600 to-purple-600 text-white p-6 rounded-xl">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-red-100">System overview and management controls</p>
        <div className="mt-4 flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Administrator Access</span>
          </div>
          <div className="flex items-center space-x-2">
            <Activity className="h-4 w-4" />
            <span>System Status: Active</span>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-blue-50 to-blue-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.totalUsers}</div>
            <p className="text-xs text-blue-600">
              {systemStats.activeStudents} students, {systemStats.activeTeachers} teachers
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assignments</CardTitle>
            <FileText className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.totalAssignments}</div>
            <p className="text-xs text-green-600">{systemStats.totalSubmissions} submissions</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-yellow-50 to-yellow-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <ClipboardList className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.pendingReviews}</div>
            <p className="text-xs text-yellow-600">Need teacher attention</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-purple-50 to-purple-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Activity className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.systemUptime}</div>
            <p className="text-xs text-purple-600">Uptime this month</p>
          </CardContent>
        </Card>
      </div>

      {/* System Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Academic Structure
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Departments</span>
              <Badge variant="outline">{systemStats.totalDepartments}</Badge>
            </div>
            <div className="flex justify-between">
              <span>Sections</span>
              <Badge variant="outline">{systemStats.totalSections}</Badge>
            </div>
            <div className="flex justify-between">
              <span>Subjects</span>
              <Badge variant="outline">{systemStats.totalSubjects}</Badge>
            </div>
            <Button variant="outline" className="w-full bg-transparent">
              <Eye className="h-4 w-4 mr-2" />
              Manage Structure
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Average Score</span>
                <span>{Math.round(systemStats.averageScore)}%</span>
              </div>
              <Progress value={systemStats.averageScore} className="h-2" />
            </div>
            <div className="flex justify-between">
              <span>Processing Time</span>
              <Badge className="bg-green-100 text-green-800">{systemStats.avgProcessingTime}</Badge>
            </div>
            <div className="flex justify-between">
              <span>Storage Used</span>
              <Badge variant="outline">{systemStats.storageUsed}</Badge>
            </div>
            <Button variant="outline" className="w-full bg-transparent">
              <TrendingUp className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              System Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span className="text-sm">High submission volume</span>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-green-50 rounded">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">All systems operational</span>
              </div>
              <Badge className="bg-green-100 text-green-800">Good</Badge>
            </div>
            <Button variant="outline" className="w-full bg-transparent">
              <Settings className="h-4 w-4 mr-2" />
              System Settings
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent System Activity</CardTitle>
          <CardDescription>Latest user registrations and system events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.slice(0, 5).map((user) => (
              <div key={user._id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                  <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Management</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>Add a new user to the system</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="Enter password"
                />
              </div>
              {newUser.role === "student" && (
                <>
                  <div>
                    <Label htmlFor="rollNumber">Roll Number</Label>
                    <Input
                      id="rollNumber"
                      value={newUser.rollNumber}
                      onChange={(e) => setNewUser({ ...newUser, rollNumber: e.target.value })}
                      placeholder="Enter roll number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="semester">Semester</Label>
                    <Select
                      value={newUser.semester.toString()}
                      onValueChange={(value) => setNewUser({ ...newUser, semester: Number.parseInt(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                          <SelectItem key={sem} value={sem.toString()}>
                            Semester {sem}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
              {newUser.role === "teacher" && (
                <>
                  <div>
                    <Label htmlFor="employeeId">Employee ID</Label>
                    <Input
                      id="employeeId"
                      value={newUser.employeeId}
                      onChange={(e) => setNewUser({ ...newUser, employeeId: e.target.value })}
                      placeholder="Enter employee ID"
                    />
                  </div>
                  <div>
                    <Label htmlFor="designation">Designation</Label>
                    <Input
                      id="designation"
                      value={newUser.designation}
                      onChange={(e) => setNewUser({ ...newUser, designation: e.target.value })}
                      placeholder="Enter designation"
                    />
                  </div>
                </>
              )}
              <div>
                <Label htmlFor="department">Department</Label>
                <Select
                  value={newUser.department}
                  onValueChange={(value) => setNewUser({ ...newUser, department: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept._id} value={dept._id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline">Cancel</Button>
              <Button onClick={handleCreateUser}>Create User</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Users ({users.length})</TabsTrigger>
          <TabsTrigger value="students">Students ({users.filter((u) => u.role === "student").length})</TabsTrigger>
          <TabsTrigger value="teachers">Teachers ({users.filter((u) => u.role === "teacher").length})</TabsTrigger>
          <TabsTrigger value="admins">Admins ({users.filter((u) => u.role === "admin").length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4">
            {users.map((user) => (
              <UserCard key={user._id} user={user} departments={departments} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          <div className="grid gap-4">
            {users
              .filter((u) => u.role === "student")
              .map((user) => (
                <UserCard key={user._id} user={user} departments={departments} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="teachers" className="space-y-4">
          <div className="grid gap-4">
            {users
              .filter((u) => u.role === "teacher")
              .map((user) => (
                <UserCard key={user._id} user={user} departments={departments} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="admins" className="space-y-4">
          <div className="grid gap-4">
            {users
              .filter((u) => u.role === "admin")
              .map((user) => (
                <UserCard key={user._id} user={user} departments={departments} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )

  const renderDepartments = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Department Management</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Department
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {departments.map((department) => {
          const deptUsers = users.filter((u) => u.department === department._id)
          const deptStudents = deptUsers.filter((u) => u.role === "student")
          const deptTeachers = deptUsers.filter((u) => u.role === "teacher")

          return (
            <Card key={department._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Building className="h-8 w-8 text-blue-600" />
                  <Badge variant="outline">{department.code}</Badge>
                </div>
                <CardTitle className="text-lg">{department.name}</CardTitle>
                <CardDescription>{department.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center p-2 bg-green-50 rounded">
                      <div className="font-medium text-green-600">{deptStudents.length}</div>
                      <div className="text-green-600">Students</div>
                    </div>
                    <div className="text-center p-2 bg-blue-50 rounded">
                      <div className="font-medium text-blue-600">{deptTeachers.length}</div>
                      <div className="text-blue-600">Teachers</div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )

  const renderSubjects = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Subject Management</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Subject
        </Button>
      </div>

      <div className="grid gap-4">
        {subjects.map((subject) => {
          const subjectAssignments = assignments.filter((a) => a.subjectId === subject._id)
          const department = departments.find((d) => d._id === subject.departmentId)

          return (
            <Card key={subject._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{subject.name}</CardTitle>
                    <CardDescription>
                      {subject.code} • {subject.credits} Credits • {department?.name}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{subject.type}</Badge>
                    <Badge className="bg-blue-100 text-blue-800">{subject.semester}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">{subject.description}</p>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center p-2 bg-purple-50 rounded">
                      <div className="font-medium text-purple-600">{subjectAssignments.length}</div>
                      <div className="text-purple-600">Assignments</div>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded">
                      <div className="font-medium text-green-600">{subject.credits}</div>
                      <div className="text-green-600">Credits</div>
                    </div>
                    <div className="text-center p-2 bg-blue-50 rounded">
                      <div className="font-medium text-blue-600">Sem {subject.semester}</div>
                      <div className="text-blue-600">Semester</div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Subject
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">System Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <Activity className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.systemUptime}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing Time</CardTitle>
            <TrendingUp className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.avgProcessingTime}</div>
            <p className="text-xs text-muted-foreground">Average AI processing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <Database className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.storageUsed}</div>
            <p className="text-xs text-muted-foreground">Of 100 GB allocated</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Users className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">Currently online</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Students</span>
                  <span>{systemStats.activeStudents}</span>
                </div>
                <Progress value={(systemStats.activeStudents / systemStats.totalUsers) * 100} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Teachers</span>
                  <span>{systemStats.activeTeachers}</span>
                </div>
                <Progress value={(systemStats.activeTeachers / systemStats.totalUsers) * 100} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assignment Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center p-3 bg-blue-50 rounded">
                  <div className="text-2xl font-bold text-blue-600">{systemStats.totalAssignments}</div>
                  <div className="text-blue-600">Total Assignments</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded">
                  <div className="text-2xl font-bold text-green-600">{systemStats.totalSubmissions}</div>
                  <div className="text-green-600">Submissions</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Completion Rate</span>
                  <span>
                    {systemStats.totalAssignments > 0
                      ? Math.round((systemStats.totalSubmissions / systemStats.totalAssignments) * 100)
                      : 0}
                    %
                  </span>
                </div>
                <Progress
                  value={
                    systemStats.totalAssignments > 0
                      ? (systemStats.totalSubmissions / systemStats.totalAssignments) * 100
                      : 0
                  }
                  className="h-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">System Settings</h2>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>System Name</Label>
              <Input defaultValue="CU EvalPlatform" />
            </div>
            <div className="space-y-2">
              <Label>Institution Name</Label>
              <Input defaultValue="Chandigarh University" />
            </div>
            <div className="space-y-2">
              <Label>Academic Year</Label>
              <Select defaultValue="2024-25">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024-25">2024-25</SelectItem>
                  <SelectItem value="2025-26">2025-26</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              AI Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>AI Model</Label>
              <Select defaultValue="gemini-pro">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                  <SelectItem value="gpt-4">GPT-4</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>AI Weightage (%)</Label>
              <Input type="number" defaultValue="70" min="0" max="100" />
            </div>
            <div className="space-y-2">
              <Label>Processing Timeout (seconds)</Label>
              <Input type="number" defaultValue="30" min="10" max="300" />
            </div>
            <Button>Update AI Settings</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              File Upload Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Max File Size (MB)</Label>
              <Input type="number" defaultValue="10" min="1" max="100" />
            </div>
            <div className="space-y-2">
              <Label>Allowed File Types</Label>
              <Input defaultValue=".pdf,.doc,.docx,.jpg,.png,.py,.cpp,.java" />
            </div>
            <div className="space-y-2">
              <Label>Storage Path</Label>
              <Input defaultValue="/uploads/assignments/" />
            </div>
            <Button>Save Upload Settings</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Session Timeout (minutes)</Label>
              <Input type="number" defaultValue="30" min="5" max="480" />
            </div>
            <div className="space-y-2">
              <Label>Password Policy</Label>
              <Select defaultValue="medium">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Security</SelectItem>
                  <SelectItem value="medium">Medium Security</SelectItem>
                  <SelectItem value="high">High Security</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Two-Factor Authentication</Label>
              <Select defaultValue="optional">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="disabled">Disabled</SelectItem>
                  <SelectItem value="optional">Optional</SelectItem>
                  <SelectItem value="required">Required</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button>Update Security</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderMainDashboard()
      case "users":
        return renderUsers()
      case "departments":
        return renderDepartments()
      case "subjects":
        return renderSubjects()
      case "analytics":
        return renderAnalytics()
      case "settings":
        return renderSettings()
      default:
        return renderMainDashboard()
    }
  }

  return <div className="p-6">{renderContent()}</div>
}

// User Card Component
interface UserCardProps {
  user: IUser
  departments: IDepartment[]
}

function UserCard({ user, departments }: UserCardProps) {
  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800"
      case "teacher":
        return "bg-blue-100 text-blue-800"
      case "student":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "graduated":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const department = departments.find((d) => d._id === user.department)

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <CardTitle className="text-lg">{user.name}</CardTitle>
              <CardDescription>
                {user.email} • {department?.name}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
            <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {user.role === "student" && (
            <>
              <p className="text-sm text-gray-600">Roll Number: {user.rollNumber}</p>
              <p className="text-sm text-gray-600">Semester: {user.semester}</p>
              <p className="text-sm text-gray-600">Student ID: {user.studentId}</p>
            </>
          )}
          {user.role === "teacher" && (
            <>
              <p className="text-sm text-gray-600">Employee ID: {user.employeeId}</p>
              <p className="text-sm text-gray-600">Designation: {user.designation}</p>
            </>
          )}
          <p className="text-sm text-gray-600">Phone: {user.phone}</p>
          <p className="text-sm text-gray-600">
            Joined: {user.joiningDate ? new Date(user.joiningDate).toLocaleDateString() : "N/A"}
          </p>
        </div>
        <div className="flex space-x-2 mt-4">
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            View Profile
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit User
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
