"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  FileText,
  Clock,
  TrendingUp,
  Plus,
  Eye,
  Edit,
  CheckCircle,
  AlertCircle,
  BarChart3,
  ClipboardList,
  GraduationCap,
  BookOpen,
  Star,
} from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MockAPI } from "@/lib/mock-data"
import type { IAssignment, ISubmission, IUser, ISubject } from "@/lib/database/schemas"

interface TeacherDashboardProps {
  user: {
    id: string
    name: string
    email: string
    role: string
  }
  activeTab: string
}

export function TeacherDashboard({ user, activeTab }: TeacherDashboardProps) {
  const [assignments, setAssignments] = useState<IAssignment[]>([])
  const [submissions, setSubmissions] = useState<ISubmission[]>([])
  const [students, setStudents] = useState<IUser[]>([])
  const [subjects, setSubjects] = useState<ISubject[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  // Form state for creating assignments
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    description: "",
    instructions: "",
    subjectId: "",
    dueDate: "",
    maxScore: 100,
    submissionType: "file" as "file" | "text" | "both",
    targetType: "section" as "section" | "group" | "individual",
    targetIds: [] as string[],
  })

  useEffect(() => {
    loadData()
  }, [user.id])

  const loadData = async () => {
    setLoading(true)
    try {
      const [assignmentsData, submissionsData, studentsData, subjectsData] = await Promise.all([
        MockAPI.getAssignments({ teacherId: user.id }),
        MockAPI.getSubmissions(),
        MockAPI.getUsers({ role: "student" }),
        MockAPI.getSubjects(),
      ])

      setAssignments(assignmentsData)
      setSubmissions(submissionsData.filter((s) => assignmentsData.some((a) => a._id === s.assignmentId)))
      setStudents(studentsData)
      setSubjects(subjectsData)
    } catch (error) {
      console.error("Error loading teacher data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAssignment = async () => {
    try {
      await MockAPI.createAssignment({
        ...newAssignment,
        teacherId: user.id,
        dueDate: new Date(newAssignment.dueDate),
        allowedFileTypes: [".pdf", ".doc", ".docx", ".jpg", ".png"],
        maxFileSize: 10485760,
        aiEvaluation: {
          enabled: true,
          model: "gemini-pro",
          weightage: 70,
        },
        status: "published",
        publishedAt: new Date(),
      })

      await loadData()
      setShowCreateDialog(false)
      setNewAssignment({
        title: "",
        description: "",
        instructions: "",
        subjectId: "",
        dueDate: "",
        maxScore: 100,
        submissionType: "file",
        targetType: "section",
        targetIds: [],
      })
    } catch (error) {
      console.error("Error creating assignment:", error)
    }
  }

  const handleGradeSubmission = async (submissionId: string, score: number, feedback: string) => {
    try {
      // In a real app, this would update the submission
      console.log("Grading submission:", submissionId, score, feedback)
      await loadData()
    } catch (error) {
      console.error("Error grading submission:", error)
    }
  }

  // Statistics
  const totalAssignments = assignments.length
  const publishedAssignments = assignments.filter((a) => a.status === "published").length
  const totalSubmissions = submissions.length
  const pendingReviews = submissions.filter((s) => s.status === "ai_evaluated").length
  const gradedSubmissions = submissions.filter((s) => s.status === "graded").length
  const averageScore =
    gradedSubmissions.length > 0
      ? gradedSubmissions.reduce((sum, s) => sum + (s.finalScore || 0), 0) / gradedSubmissions.length
      : 0

  const renderMainDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-xl">
        <h1 className="text-3xl font-bold mb-2">Welcome, Prof. {user.name.split(" ")[0]}!</h1>
        <p className="text-green-100">Manage your assignments and track student progress</p>
        <div className="mt-4 flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-4 w-4" />
            <span>Faculty ID: {user.id}</span>
          </div>
          <div className="flex items-center space-x-2">
            <BookOpen className="h-4 w-4" />
            <span>Computer Science Department</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Assignments"
          icon={FileText}
          value={totalAssignments.toString()}
          subtitle="Created by you"
          color="blue"
        />
        <StatCard
          title="Pending Reviews"
          icon={Clock}
          value={pendingReviews.toString()}
          subtitle="Need your attention"
          color="yellow"
        />
        <StatCard
          title="Students"
          icon={Users}
          value={students.length.toString()}
          subtitle="Under your guidance"
          color="green"
        />
        <StatCard
          title="Average Score"
          icon={TrendingUp}
          value={`${Math.round(averageScore)}%`}
          subtitle="Class performance"
          color="purple"
        />
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create New Assignment
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <Eye className="h-4 w-4 mr-2" />
              Review Submissions ({pendingReviews})
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <BarChart3 className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <Users className="h-4 w-4 mr-2" />
              Manage Students
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {submissions.slice(0, 4).map((submission) => {
                const assignment = assignments.find((a) => a._id === submission.assignmentId)
                const student = students.find((s) => s._id === submission.studentId)
                return (
                  <div key={submission._id} className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{student?.name}</p>
                      <p className="text-xs text-gray-500">{assignment?.title}</p>
                      <p className="text-xs text-gray-400">{new Date(submission.submittedAt).toLocaleDateString()}</p>
                    </div>
                    <Badge className={getStatusColor(submission.status)}>{submission.status}</Badge>
                  </div>
                )
              })}
              {submissions.length === 0 && <p className="text-sm text-gray-500">No recent submissions</p>}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Assignments */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Assignments</CardTitle>
          <CardDescription>Your latest assignment activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assignments.slice(0, 5).map((assignment) => {
              const assignmentSubmissions = submissions.filter((s) => s.assignmentId === assignment._id)
              const subject = subjects.find((s) => s._id === assignment.subjectId)

              return (
                <div key={assignment._id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div>
                    <p className="font-medium">{assignment.title}</p>
                    <p className="text-sm text-gray-600">
                      {subject?.name} • Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500">{assignmentSubmissions.length} submissions</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      className={
                        assignment.status === "published" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }
                    >
                      {assignment.status}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderAssignments = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Assignments</h2>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Assignment
        </Button>
      </div>

      <div className="grid gap-4">
        {assignments.map((assignment) => {
          const assignmentSubmissions = submissions.filter((s) => s.assignmentId === assignment._id)
          const subject = subjects.find((s) => s._id === assignment.subjectId)

          return (
            <Card key={assignment._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{assignment.title}</CardTitle>
                    <CardDescription>
                      {subject?.name} • Due: {new Date(assignment.dueDate).toLocaleDateString()} • Max Score:{" "}
                      {assignment.maxScore}
                    </CardDescription>
                  </div>
                  <Badge
                    className={
                      assignment.status === "published" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    }
                  >
                    {assignment.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">{assignment.description}</p>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center p-2 bg-blue-50 rounded">
                      <div className="font-medium text-blue-600">{assignmentSubmissions.length}</div>
                      <div className="text-blue-600">Submissions</div>
                    </div>
                    <div className="text-center p-2 bg-yellow-50 rounded">
                      <div className="font-medium text-yellow-600">
                        {assignmentSubmissions.filter((s) => s.status === "ai_evaluated").length}
                      </div>
                      <div className="text-yellow-600">Pending Review</div>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded">
                      <div className="font-medium text-green-600">
                        {assignmentSubmissions.filter((s) => s.status === "graded").length}
                      </div>
                      <div className="text-green-600">Graded</div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <ClipboardList className="h-4 w-4 mr-2" />
                      View Submissions
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

  const renderSubmissions = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Student Submissions</h2>
        <div className="flex gap-2">
          <Badge variant="outline">{submissions.length} total</Badge>
          <Badge className="bg-yellow-100 text-yellow-800">{pendingReviews} pending review</Badge>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Submissions</TabsTrigger>
          <TabsTrigger value="pending">Pending Review ({pendingReviews})</TabsTrigger>
          <TabsTrigger value="graded">Graded ({gradedSubmissions.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {submissions.map((submission) => (
            <SubmissionCard
              key={submission._id}
              submission={submission}
              assignment={assignments.find((a) => a._id === submission.assignmentId)}
              student={students.find((s) => s._id === submission.studentId)}
              onGrade={handleGradeSubmission}
            />
          ))}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {submissions
            .filter((s) => s.status === "ai_evaluated")
            .map((submission) => (
              <SubmissionCard
                key={submission._id}
                submission={submission}
                assignment={assignments.find((a) => a._id === submission.assignmentId)}
                student={students.find((s) => s._id === submission.studentId)}
                onGrade={handleGradeSubmission}
              />
            ))}
        </TabsContent>

        <TabsContent value="graded" className="space-y-4">
          {submissions
            .filter((s) => s.status === "graded")
            .map((submission) => (
              <SubmissionCard
                key={submission._id}
                submission={submission}
                assignment={assignments.find((a) => a._id === submission.assignmentId)}
                student={students.find((s) => s._id === submission.studentId)}
                onGrade={handleGradeSubmission}
              />
            ))}
        </TabsContent>
      </Tabs>
    </div>
  )

  const renderStudents = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Students</h2>
        <Badge variant="outline">{students.length} students</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {students.map((student) => {
          const studentSubmissions = submissions.filter((s) => s.studentId === student._id)
          const studentAverage =
            studentSubmissions.length > 0
              ? studentSubmissions.reduce((sum, s) => sum + (s.finalScore || 0), 0) / studentSubmissions.length
              : 0

          return (
            <Card key={student._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {student.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{student.name}</CardTitle>
                    <CardDescription>
                      {student.rollNumber} • {student.email}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center p-2 bg-blue-50 rounded">
                      <div className="font-medium text-blue-600">{studentSubmissions.length}</div>
                      <div className="text-blue-600">Submissions</div>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded">
                      <div className="font-medium text-green-600">{Math.round(studentAverage)}%</div>
                      <div className="text-green-600">Average</div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Eye className="h-4 w-4 mr-2" />
                    View Progress
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )

  const renderGrading = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Grading Center</h2>

      <Card>
        <CardHeader>
          <CardTitle>Submissions Requiring Review</CardTitle>
          <CardDescription>AI has evaluated these submissions - your review is needed</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {submissions
              .filter((s) => s.status === "ai_evaluated")
              .map((submission) => {
                const assignment = assignments.find((a) => a._id === submission.assignmentId)
                const student = students.find((s) => s._id === submission.studentId)

                return (
                  <div key={submission._id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{assignment?.title}</h4>
                        <p className="text-sm text-gray-600">
                          {student?.name} • {student?.rollNumber}
                        </p>
                      </div>
                      <Badge className="bg-purple-100 text-purple-800">AI Evaluated</Badge>
                    </div>

                    {submission.aiEvaluation.score && (
                      <div className="bg-purple-50 p-3 rounded mb-3">
                        <p className="font-medium text-purple-800">AI Evaluation</p>
                        <p className="text-sm text-purple-600">Score: {submission.aiEvaluation.score}/100</p>
                        {submission.aiEvaluation.feedback && (
                          <p className="text-sm text-purple-600 mt-1">"{submission.aiEvaluation.feedback}"</p>
                        )}
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <Button size="sm">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve AI Grade
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Manual Review
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Submission
                      </Button>
                    </div>
                  </div>
                )
              })}
            {submissions.filter((s) => s.status === "ai_evaluated").length === 0 && (
              <p className="text-gray-500 text-center py-8">No submissions pending review</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Analytics Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Class Average</CardTitle>
            <TrendingUp className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(averageScore)}%</div>
            <p className="text-xs text-muted-foreground">Across all assignments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <CheckCircle className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalSubmissions > 0 ? Math.round((gradedSubmissions.length / totalSubmissions) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Assignments graded</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Performers</CardTitle>
            <Star className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{submissions.filter((s) => (s.finalScore || 0) >= 90).length}</div>
            <p className="text-xs text-muted-foreground">Students with A grades</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Accuracy</CardTitle>
            <BarChart3 className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">AI evaluation accuracy</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Assignment Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assignments.slice(0, 5).map((assignment) => {
                const assignmentSubmissions = submissions.filter(
                  (s) => s.assignmentId === assignment._id && s.finalScore,
                )
                const avgScore =
                  assignmentSubmissions.length > 0
                    ? assignmentSubmissions.reduce((sum, s) => sum + (s.finalScore || 0), 0) /
                      assignmentSubmissions.length
                    : 0

                return (
                  <div key={assignment._id} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{assignment.title}</span>
                      <span className="text-sm text-gray-600">{Math.round(avgScore)}%</span>
                    </div>
                    <Progress value={avgScore} className="h-2" />
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Student Performance Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {["A (90-100%)", "B (80-89%)", "C (70-79%)", "D (60-69%)", "F (<60%)"].map((grade, index) => {
                const ranges = [
                  [90, 100],
                  [80, 89],
                  [70, 79],
                  [60, 69],
                  [0, 59],
                ]
                const [min, max] = ranges[index]
                const count = submissions.filter((s) => {
                  const score = s.finalScore || 0
                  return score >= min && score <= max
                }).length
                const percentage = submissions.length > 0 ? (count / submissions.length) * 100 : 0

                return (
                  <div key={grade} className="flex items-center justify-between">
                    <span className="font-medium">{grade}</span>
                    <div className="flex items-center gap-2 flex-1 ml-4">
                      <Progress value={percentage} className="flex-1 h-2" />
                      <span className="text-sm text-gray-600 w-8">{count}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-blue-100 text-blue-800"
      case "ai_evaluated":
        return "bg-purple-100 text-purple-800"
      case "graded":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading teacher dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderMainDashboard()
      case "assignments":
        return renderAssignments()
      case "submissions":
        return renderSubmissions()
      case "students":
        return renderStudents()
      case "grading":
        return renderGrading()
      case "analytics":
        return renderAnalytics()
      default:
        return renderMainDashboard()
    }
  }

  return (
    <>
      <div className="p-6">{renderContent()}</div>

      {/* Create Assignment Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Assignment</DialogTitle>
            <DialogDescription>Create a new assignment for your students</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="title">Assignment Title</Label>
              <Input
                id="title"
                value={newAssignment.title}
                onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                placeholder="Enter assignment title"
              />
            </div>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Select
                value={newAssignment.subjectId}
                onValueChange={(value) => setNewAssignment({ ...newAssignment, subjectId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject._id} value={subject._id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="datetime-local"
                value={newAssignment.dueDate}
                onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="maxScore">Maximum Score</Label>
              <Input
                id="maxScore"
                type="number"
                value={newAssignment.maxScore}
                onChange={(e) => setNewAssignment({ ...newAssignment, maxScore: Number.parseInt(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="submissionType">Submission Type</Label>
              <Select
                value={newAssignment.submissionType}
                onValueChange={(value: "file" | "text" | "both") =>
                  setNewAssignment({ ...newAssignment, submissionType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="file">File Upload</SelectItem>
                  <SelectItem value="text">Text Entry</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newAssignment.description}
                onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                placeholder="Enter assignment description"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="instructions">Instructions</Label>
              <Textarea
                id="instructions"
                value={newAssignment.instructions}
                onChange={(e) => setNewAssignment({ ...newAssignment, instructions: e.target.value })}
                placeholder="Enter detailed instructions for students"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateAssignment}>Create Assignment</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Submission Card Component
interface SubmissionCardProps {
  submission: ISubmission
  assignment?: IAssignment
  student?: IUser
  onGrade: (submissionId: string, score: number, feedback: string) => void
}

function SubmissionCard({ submission, assignment, student, onGrade }: SubmissionCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-blue-100 text-blue-800"
      case "ai_evaluated":
        return "bg-purple-100 text-purple-800"
      case "graded":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{assignment?.title}</CardTitle>
            <CardDescription>
              {student?.name} ({student?.rollNumber}) • Submitted:{" "}
              {new Date(submission.submittedAt).toLocaleDateString()}
            </CardDescription>
          </div>
          <Badge className={getStatusColor(submission.status)}>{submission.status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {submission.aiEvaluation.score && (
            <div className="p-3 bg-purple-50 rounded-lg">
              <p className="font-medium text-purple-800">AI Evaluation</p>
              <p className="text-sm text-purple-600">Score: {submission.aiEvaluation.score}/100</p>
              {submission.aiEvaluation.feedback && (
                <p className="text-sm text-purple-600 mt-1">"{submission.aiEvaluation.feedback}"</p>
              )}
            </div>
          )}

          {submission.finalScore && (
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="font-medium text-green-800">Final Grade</p>
              <p className="text-sm text-green-600">
                Score: {submission.finalScore}/{assignment?.maxScore} ({submission.grade})
              </p>
              {submission.teacherReview.feedback && (
                <p className="text-sm text-green-600 mt-1">"{submission.teacherReview.feedback}"</p>
              )}
            </div>
          )}

          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Files: {submission.files.length} •{submission.isLate ? " Late Submission" : " On Time"}
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View
              </Button>
              {submission.status === "ai_evaluated" && (
                <Button size="sm">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Grade
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Stat Card Component
interface StatCardProps {
  title: string
  icon: any
  value: string
  subtitle: string
  color: "blue" | "green" | "yellow" | "purple"
}

function StatCard({ title, icon: Icon, value, subtitle, color }: StatCardProps) {
  const colorClasses = {
    blue: "from-blue-50 to-blue-100 border-blue-200 text-blue-800",
    green: "from-green-50 to-green-100 border-green-200 text-green-800",
    yellow: "from-yellow-50 to-yellow-100 border-yellow-200 text-yellow-800",
    purple: "from-purple-50 to-purple-100 border-purple-200 text-purple-800",
  }

  return (
    <Card className={`hover:shadow-lg transition-shadow bg-gradient-to-br ${colorClasses[color]}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs">{subtitle}</p>
      </CardContent>
    </Card>
  )
}
