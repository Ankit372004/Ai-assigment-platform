"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import {
  Upload,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  CalendarIcon,
  Star,
  Award,
  Target,
  Eye,
  Download,
  BookOpen,
  GraduationCap,
  Users,
} from "lucide-react"
import { AssignmentUpload } from "@/components/assignment-upload"
import { MockAPI, getStudentAssignments } from "@/lib/mock-data"
import type { IAssignment, ISubmission, ISubject, INotification } from "@/lib/database/schemas"

interface StudentDashboardProps {
  user: {
    id: string
    name: string
    email: string
    role: string
  }
  activeTab: string
}

export function StudentDashboard({ user, activeTab }: StudentDashboardProps) {
  // State management
  const [assignments, setAssignments] = useState<{ assignment: IAssignment; submission?: ISubmission }[]>([])
  const [subjects, setSubjects] = useState<ISubject[]>([])
  const [notifications, setNotifications] = useState<INotification[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [loading, setLoading] = useState(true)

  // Load data on component mount
  useEffect(() => {
    loadData()
  }, [user.id])

  const loadData = async () => {
    setLoading(true)
    try {
      const [assignmentsData, subjectsData, notificationsData] = await Promise.all([
        getStudentAssignments(user.id),
        MockAPI.getSubjects(),
        MockAPI.getNotifications(user.id),
      ])

      setAssignments(assignmentsData)
      setSubjects(subjectsData)
      setNotifications(notificationsData)
    } catch (error) {
      console.error("Error loading student data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Event handlers
  const handleUpload = async (assignmentId: string, file: File) => {
    try {
      await MockAPI.createSubmission({
        assignmentId,
        studentId: user.id,
        submissionType: "file",
        files: [
          {
            filename: `${Date.now()}_${file.name}`,
            originalName: file.name,
            path: `/uploads/submissions/${Date.now()}_${file.name}`,
            size: file.size,
            mimeType: file.type,
          },
        ],
      })

      await loadData()
    } catch (error) {
      console.error("Error uploading assignment:", error)
    }
  }

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "submitted":
      case "ai_evaluated":
        return <AlertCircle className="h-4 w-4" />
      case "graded":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Statistics calculations
  const completedAssignments = assignments.filter((a) => a.submission?.status === "graded")
  const pendingAssignments = assignments.filter((a) => !a.submission)
  const submittedAssignments = assignments.filter((a) => a.submission && a.submission.status !== "graded")
  const overdueAssignments = assignments.filter((a) => !a.submission && new Date(a.assignment.dueDate) < new Date())

  const averageScore =
    completedAssignments.length > 0
      ? completedAssignments.reduce((sum, a) => sum + (a.submission?.finalScore || 0), 0) / completedAssignments.length
      : 0

  const completionRate = assignments.length > 0 ? (completedAssignments.length / assignments.length) * 100 : 0

  // Render functions
  const renderMainDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-xl">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name.split(" ")[0]}!</h1>
        <p className="text-blue-100">Here's your academic progress overview</p>
        <div className="mt-4 flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-4 w-4" />
            <span>Student ID: {user.id}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>CSE - Section A</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Assignments"
          icon={FileText}
          value={assignments.length.toString()}
          subtitle="This semester"
          color="blue"
        />
        <StatCard
          title="Pending"
          icon={Clock}
          value={pendingAssignments.length.toString()}
          subtitle="Need to submit"
          color="yellow"
        />
        <StatCard
          title="Completed"
          icon={CheckCircle}
          value={completedAssignments.length.toString()}
          subtitle="Graded assignments"
          color="green"
        />
        <StatCard
          title="Average Score"
          icon={TrendingUp}
          value={averageScore ? `${Math.round(averageScore)}%` : "N/A"}
          subtitle="Overall performance"
          color="purple"
        />
      </div>

      {/* Quick Actions & Notifications */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" disabled={pendingAssignments.length === 0}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Assignment ({pendingAssignments.length} pending)
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <Eye className="h-4 w-4 mr-2" />
              View Grades
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Download Reports
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Recent Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notifications.slice(0, 4).map((notification) => (
                <div key={notification._id} className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{notification.title}</p>
                    <p className="text-xs text-gray-500">{notification.message}</p>
                    <p className="text-xs text-gray-400">{new Date(notification.createdAt).toLocaleDateString()}</p>
                  </div>
                  <Badge className={getPriorityColor(notification.priority)}>{notification.priority}</Badge>
                </div>
              ))}
              {notifications.length === 0 && <p className="text-sm text-gray-500">No new notifications</p>}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Academic Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Overall Completion</span>
                <span>{Math.round(completionRate)}%</span>
              </div>
              <Progress value={completionRate} className="h-2" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{completedAssignments.length}</div>
                <div className="text-sm text-green-600">Completed</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{submittedAssignments.length}</div>
                <div className="text-sm text-blue-600">Under Review</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{pendingAssignments.length}</div>
                <div className="text-sm text-yellow-600">Pending</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{overdueAssignments.length}</div>
                <div className="text-sm text-red-600">Overdue</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Assignments */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Assignments</CardTitle>
          <CardDescription>Your latest assignment activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assignments.slice(0, 5).map(({ assignment, submission }) => (
              <div key={assignment._id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                <div>
                  <p className="font-medium">{assignment.title}</p>
                  <p className="text-sm text-gray-600">
                    Due: {new Date(assignment.dueDate).toLocaleDateString()} •{" "}
                    {subjects.find((s) => s._id === assignment.subjectId)?.name}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(submission?.status || "pending")}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(submission?.status || "pending")}
                      {submission?.status || "pending"}
                    </div>
                  </Badge>
                  {submission?.finalScore && (
                    <span className="text-sm font-medium text-green-600">
                      {submission.finalScore}/{assignment.maxScore}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderAssignments = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Assignments</h2>
        <div className="flex gap-2">
          <Badge variant="outline">{assignments.length} total</Badge>
          <Badge className="bg-yellow-100 text-yellow-800">{pendingAssignments.length} pending</Badge>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Assignments</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingAssignments.length})</TabsTrigger>
          <TabsTrigger value="submitted">Submitted ({submittedAssignments.length})</TabsTrigger>
          <TabsTrigger value="graded">Graded ({completedAssignments.length})</TabsTrigger>
          <TabsTrigger value="upload">Upload Assignment</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {assignments.map(({ assignment, submission }) => (
            <AssignmentCard key={assignment._id} assignment={assignment} submission={submission} subjects={subjects} />
          ))}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {pendingAssignments.map(({ assignment }) => (
            <AssignmentCard key={assignment._id} assignment={assignment} subjects={subjects} />
          ))}
        </TabsContent>

        <TabsContent value="submitted" className="space-y-4">
          {submittedAssignments.map(({ assignment, submission }) => (
            <AssignmentCard key={assignment._id} assignment={assignment} submission={submission} subjects={subjects} />
          ))}
        </TabsContent>

        <TabsContent value="graded" className="space-y-4">
          {completedAssignments.map(({ assignment, submission }) => (
            <AssignmentCard key={assignment._id} assignment={assignment} submission={submission} subjects={subjects} />
          ))}
        </TabsContent>

        <TabsContent value="upload">
          <AssignmentUpload
            assignments={pendingAssignments.map((a) => ({
              id: a.assignment._id,
              title: a.assignment.title,
              subject: subjects.find((s) => s._id === a.assignment.subjectId)?.name || "Unknown",
              dueDate: new Date(a.assignment.dueDate).toLocaleDateString(),
              status: "pending",
              description: a.assignment.description,
              maxScore: a.assignment.maxScore,
            }))}
            onUpload={handleUpload}
          />
        </TabsContent>
      </Tabs>
    </div>
  )

  const renderCourses = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Courses</h2>
        <Badge variant="outline">{subjects.length} enrolled</Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {subjects.map((subject) => {
          const subjectAssignments = assignments.filter((a) => a.assignment.subjectId === subject._id)
          const completedCount = subjectAssignments.filter((a) => a.submission?.status === "graded").length
          const totalCount = subjectAssignments.length
          const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

          return (
            <Card key={subject._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                  <Badge variant="outline">{subject.type}</Badge>
                </div>
                <CardTitle className="text-lg">{subject.name}</CardTitle>
                <CardDescription>
                  {subject.code} • {subject.credits} Credits
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center p-2 bg-blue-50 rounded">
                      <div className="font-medium text-blue-600">{totalCount}</div>
                      <div className="text-blue-600">Total</div>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded">
                      <div className="font-medium text-green-600">{completedCount}</div>
                      <div className="text-green-600">Completed</div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full bg-transparent">
                    View Details
                  </Button>
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
        <h2 className="text-2xl font-bold">My Submissions</h2>
        <div className="flex gap-2">
          <Badge variant="outline">{assignments.filter((a) => a.submission).length} submitted</Badge>
          <Badge className="bg-green-100 text-green-800">{completedAssignments.length} graded</Badge>
        </div>
      </div>

      <div className="space-y-4">
        {assignments
          .filter(({ submission }) => submission)
          .map(({ assignment, submission }) => (
            <Card key={assignment._id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{assignment.title}</CardTitle>
                    <CardDescription>
                      {subjects.find((s) => s._id === assignment.subjectId)?.name} • Submitted:{" "}
                      {submission?.submittedAt ? new Date(submission.submittedAt).toLocaleDateString() : "N/A"}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(submission?.status || "pending")}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(submission?.status || "pending")}
                      {submission?.status || "pending"}
                    </div>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {submission?.finalScore && (
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium text-green-800">Final Score</p>
                        <p className="text-sm text-green-600">
                          {submission.finalScore}/{assignment.maxScore} (
                          {Math.round((submission.finalScore / assignment.maxScore) * 100)}%)
                        </p>
                      </div>
                      <div className="text-2xl font-bold text-green-600">{submission.grade || "N/A"}</div>
                    </div>
                  )}

                  {submission?.aiEvaluation.score && (
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <p className="font-medium text-purple-800">AI Evaluation</p>
                      <p className="text-sm text-purple-600">Score: {submission.aiEvaluation.score}/100</p>
                      {submission.aiEvaluation.feedback && (
                        <p className="text-sm text-purple-600 mt-1">"{submission.aiEvaluation.feedback}"</p>
                      )}
                    </div>
                  )}

                  {submission?.teacherReview.feedback && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="font-medium text-blue-800">Teacher Feedback</p>
                      <p className="text-sm text-blue-600">"{submission.teacherReview.feedback}"</p>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">Files: {submission?.files.length || 0} uploaded</div>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  )

  const renderCalendar = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Assignment Calendar</h2>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Calendar View
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} className="rounded-md border" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {assignments
                .filter((a) => new Date(a.assignment.dueDate) >= new Date())
                .sort((a, b) => new Date(a.assignment.dueDate).getTime() - new Date(b.assignment.dueDate).getTime())
                .slice(0, 5)
                .map(({ assignment, submission }) => (
                  <div key={assignment._id} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <p className="text-sm font-medium">{assignment.title}</p>
                      <p className="text-xs text-gray-500">
                        {subjects.find((s) => s._id === assignment.subjectId)?.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">{new Date(assignment.dueDate).toLocaleDateString()}</p>
                      <Badge className={getStatusColor(submission?.status || "pending")}>
                        {submission?.status || "pending"}
                      </Badge>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderProgress = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Academic Progress</h2>
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-yellow-500" />
          <span className="font-medium">Average: {Math.round(averageScore)}%</span>
        </div>
      </div>

      {/* Grade Summary */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Overall Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{Math.round(averageScore)}%</div>
                <p className="text-sm text-gray-600">Average Score</p>
              </div>
              <Progress value={averageScore} className="h-2" />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-medium">{completedAssignments.length}</div>
                  <div className="text-gray-600">Completed</div>
                </div>
                <div className="text-center">
                  <div className="font-medium">{assignments.length - completedAssignments.length}</div>
                  <div className="text-gray-600">Remaining</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Grade Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {["A", "B", "C", "D", "F"].map((grade) => {
                const gradeCount = completedAssignments.filter((a) => {
                  const score = a.submission?.finalScore || 0
                  switch (grade) {
                    case "A":
                      return score >= 90
                    case "B":
                      return score >= 80 && score < 90
                    case "C":
                      return score >= 70 && score < 80
                    case "D":
                      return score >= 60 && score < 70
                    case "F":
                      return score < 60
                    default:
                      return false
                  }
                }).length
                const percentage =
                  completedAssignments.length > 0 ? (gradeCount / completedAssignments.length) * 100 : 0

                return (
                  <div key={grade} className="flex items-center justify-between">
                    <span className="font-medium">{grade}</span>
                    <div className="flex items-center gap-2 flex-1 ml-4">
                      <Progress value={percentage} className="flex-1 h-2" />
                      <span className="text-sm text-gray-600 w-8">{gradeCount}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {completedAssignments
                .filter((a) => (a.submission?.finalScore || 0) >= 90)
                .slice(0, 3)
                .map(({ assignment, submission }) => (
                  <div key={assignment._id} className="flex items-center gap-3 p-2 bg-green-50 rounded">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <div>
                      <p className="text-sm font-medium">{assignment.title}</p>
                      <p className="text-xs text-gray-600">Score: {submission?.finalScore}/100</p>
                    </div>
                  </div>
                ))}
              {completedAssignments.filter((a) => (a.submission?.finalScore || 0) >= 90).length === 0 && (
                <p className="text-sm text-gray-500">No high scores yet. Keep working!</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subject-wise Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Subject-wise Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subjects.map((subject) => {
              const subjectAssignments = assignments.filter((a) => a.assignment.subjectId === subject._id)
              const subjectCompleted = subjectAssignments.filter((a) => a.submission?.status === "graded")
              const subjectAverage =
                subjectCompleted.length > 0
                  ? subjectCompleted.reduce((sum, a) => sum + (a.submission?.finalScore || 0), 0) /
                    subjectCompleted.length
                  : 0

              return (
                <div key={subject._id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">{subject.name}</span>
                      <span className="text-sm text-gray-600 ml-2">({subject.code})</span>
                    </div>
                    <div className="text-right">
                      <span className="font-medium">{Math.round(subjectAverage)}%</span>
                      <span className="text-sm text-gray-600 ml-2">
                        ({subjectCompleted.length}/{subjectAssignments.length})
                      </span>
                    </div>
                  </div>
                  <Progress value={subjectAverage} className="h-2" />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Grades */}
      <Card>
        <CardHeader>
          <CardTitle>Assignment Grades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {completedAssignments.map(({ assignment, submission }) => (
              <div key={assignment._id} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <p className="font-medium">{assignment.title}</p>
                  <p className="text-sm text-gray-600">{subjects.find((s) => s._id === assignment.subjectId)?.name}</p>
                  <p className="text-xs text-gray-500">
                    Submitted: {submission?.submittedAt ? new Date(submission.submittedAt).toLocaleDateString() : "N/A"}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">
                    {submission?.finalScore}/{assignment.maxScore}
                  </div>
                  <Badge className="bg-green-100 text-green-800">{submission?.grade || "N/A"}</Badge>
                  {submission?.teacherReview.feedback && (
                    <p className="text-xs text-gray-500 mt-1 max-w-xs">"{submission.teacherReview.feedback}"</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // Loading state
  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  // Main render based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderMainDashboard()
      case "assignments":
        return renderAssignments()
      case "calendar":
        return renderCalendar()
      case "progress":
        return renderProgress()
      case "submissions":
        return renderSubmissions()
      case "courses":
        return renderCourses()
      default:
        return renderMainDashboard()
    }
  }

  return <div className="p-6">{renderContent()}</div>
}

// Assignment Card Component
interface AssignmentCardProps {
  assignment: IAssignment
  submission?: ISubmission
  subjects: ISubject[]
}

function AssignmentCard({ assignment, submission, subjects }: AssignmentCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "submitted":
      case "ai_evaluated":
        return <AlertCircle className="h-4 w-4" />
      case "graded":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const isOverdue = !submission && new Date(assignment.dueDate) < new Date()
  const subject = subjects.find((s) => s._id === assignment.subjectId)

  return (
    <Card className={`hover:shadow-lg transition-shadow ${isOverdue ? "border-red-200 bg-red-50" : ""}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{assignment.title}</CardTitle>
            <CardDescription>
              {subject?.name} • Due {new Date(assignment.dueDate).toLocaleDateString()}
              {isOverdue && <span className="text-red-600 ml-2">(Overdue)</span>}
            </CardDescription>
          </div>
          <Badge className={getStatusColor(submission?.status || "pending")}>
            <div className="flex items-center gap-1">
              {getStatusIcon(submission?.status || "pending")}
              {submission?.status || "pending"}
            </div>
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">{assignment.description}</p>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Max Score: {assignment.maxScore}</p>
              {submission?.finalScore && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    Your Score: {submission.finalScore}/{assignment.maxScore}
                  </p>
                  <Progress value={(submission.finalScore / assignment.maxScore) * 100} className="w-32" />
                  {submission.aiEvaluation.score && (
                    <p className="text-xs text-gray-500">AI Score: {submission.aiEvaluation.score}/100</p>
                  )}
                </div>
              )}
              {submission?.teacherReview.feedback && (
                <p className="text-sm text-gray-600 italic mt-2">Feedback: "{submission.teacherReview.feedback}"</p>
              )}
            </div>

            <div className="space-x-2">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
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
