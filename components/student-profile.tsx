"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Award, FileText, Clock, CheckCircle } from "lucide-react"

interface StudentProfileProps {
  student: {
    id: string
    name: string
    email: string
    class: string
    batch: string
    status: string
  }
  isOpen: boolean
  onClose: () => void
}

export function StudentProfile({ student, isOpen, onClose }: StudentProfileProps) {
  const assignments = [
    {
      id: "1",
      title: "Calculus Derivatives",
      subject: "Mathematics",
      submittedAt: "2024-01-18",
      score: 85,
      maxScore: 100,
      status: "graded",
      feedback: "Good understanding of basic derivatives.",
    },
    {
      id: "2",
      title: "Integration Problems",
      subject: "Mathematics",
      submittedAt: "2024-01-20",
      score: 92,
      maxScore: 100,
      status: "graded",
      feedback: "Excellent work on integration techniques.",
    },
    {
      id: "3",
      title: "Physics Lab Report",
      subject: "Physics",
      submittedAt: "2024-01-22",
      score: null,
      maxScore: 100,
      status: "submitted",
      feedback: null,
    },
    {
      id: "4",
      title: "Chemistry Quiz",
      subject: "Chemistry",
      submittedAt: null,
      score: null,
      maxScore: 100,
      status: "pending",
      feedback: null,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "graded":
        return "bg-green-100 text-green-800"
      case "submitted":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "graded":
        return <CheckCircle className="h-4 w-4" />
      case "submitted":
        return <FileText className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const averageScore =
    assignments.filter((a) => a.score !== null).reduce((acc, a) => acc + (a.score || 0), 0) /
    assignments.filter((a) => a.score !== null).length

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="absolute inset-4 bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="flex h-full">
          {/* Student Info Sidebar */}
          <div className="w-80 bg-gradient-to-br from-blue-50 to-purple-50 border-r">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Student Profile</h2>
                <Button variant="outline" size="sm" onClick={onClose}>
                  ×
                </Button>
              </div>

              <div className="text-center">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xl">
                    {student.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-lg font-semibold">{student.name}</h3>
                <p className="text-sm text-gray-600">{student.email}</p>
                <div className="flex justify-center space-x-2 mt-2">
                  <Badge className="bg-blue-100 text-blue-800">{student.class}</Badge>
                  <Badge className="bg-purple-100 text-purple-800">Batch {student.batch}</Badge>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Overall Performance</span>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {averageScore ? `${Math.round(averageScore)}%` : "N/A"}
                </div>
                <Progress value={averageScore || 0} className="mt-2" />
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Assignments Completed</span>
                  <Award className="h-4 w-4 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {assignments.filter((a) => a.status === "graded").length}/{assignments.length}
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Pending Submissions</span>
                  <Clock className="h-4 w-4 text-yellow-600" />
                </div>
                <div className="text-2xl font-bold text-yellow-600">
                  {assignments.filter((a) => a.status === "pending").length}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
              <h2 className="text-2xl font-bold text-gray-900">Assignment History</h2>
              <p className="text-gray-600">Detailed view of all assignments and submissions</p>
            </div>

            <div className="flex-1 overflow-auto p-6">
              <Tabs defaultValue="all" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="all">All Assignments</TabsTrigger>
                  <TabsTrigger value="graded">Graded</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4">
                  {assignments.map((assignment) => (
                    <Card key={assignment.id} className="hover-lift">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg">{assignment.title}</CardTitle>
                            <CardDescription>{assignment.subject}</CardDescription>
                          </div>
                          <Badge className={getStatusColor(assignment.status)}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(assignment.status)}
                              {assignment.status}
                            </div>
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Submitted</p>
                            <p className="font-medium">{assignment.submittedAt || "Not submitted"}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Score</p>
                            <p className="font-medium">
                              {assignment.score !== null ? `${assignment.score}/${assignment.maxScore}` : "Not graded"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Performance</p>
                            {assignment.score !== null && (
                              <Progress value={(assignment.score / assignment.maxScore) * 100} className="mt-1" />
                            )}
                          </div>
                        </div>
                        {assignment.feedback && (
                          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-800">
                              <strong>Feedback:</strong> {assignment.feedback}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="graded" className="space-y-4">
                  {assignments
                    .filter((a) => a.status === "graded")
                    .map((assignment) => (
                      <Card key={assignment.id} className="hover-lift">
                        <CardHeader>
                          <CardTitle className="text-lg">{assignment.title}</CardTitle>
                          <CardDescription>{assignment.subject}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-2xl font-bold text-green-600">
                                {assignment.score}/{assignment.maxScore}
                              </p>
                              <p className="text-sm text-gray-600">
                                {Math.round((assignment.score! / assignment.maxScore) * 100)}%
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-600">Submitted</p>
                              <p className="font-medium">{assignment.submittedAt}</p>
                            </div>
                          </div>
                          {assignment.feedback && (
                            <div className="mt-4 p-3 bg-green-50 rounded-lg">
                              <p className="text-sm text-green-800">{assignment.feedback}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                </TabsContent>

                <TabsContent value="pending" className="space-y-4">
                  {assignments
                    .filter((a) => a.status === "pending")
                    .map((assignment) => (
                      <Card key={assignment.id} className="hover-lift border-yellow-200">
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center">
                            <Clock className="h-5 w-5 mr-2 text-yellow-600" />
                            {assignment.title}
                          </CardTitle>
                          <CardDescription>{assignment.subject}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="bg-yellow-50 p-4 rounded-lg">
                            <p className="text-yellow-800 font-medium">Assignment not yet submitted</p>
                            <p className="text-sm text-yellow-600 mt-1">
                              Please submit your work to receive AI evaluation and feedback.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </TabsContent>

                <TabsContent value="analytics" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="hover-lift">
                      <CardHeader>
                        <CardTitle>Performance by Subject</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Mathematics</span>
                              <span className="text-sm font-medium">88.5%</span>
                            </div>
                            <Progress value={88.5} />
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Physics</span>
                              <span className="text-sm font-medium">-</span>
                            </div>
                            <Progress value={0} />
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Chemistry</span>
                              <span className="text-sm font-medium">-</span>
                            </div>
                            <Progress value={0} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="hover-lift">
                      <CardHeader>
                        <CardTitle>Submission Timeline</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {assignments
                            .filter((a) => a.submittedAt)
                            .map((assignment) => (
                              <div key={assignment.id} className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{assignment.title}</p>
                                  <p className="text-xs text-gray-500">{assignment.submittedAt}</p>
                                </div>
                                <Badge className="bg-green-100 text-green-800">{assignment.score}%</Badge>
                              </div>
                            ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
