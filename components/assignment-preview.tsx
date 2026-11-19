"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { ZoomIn, ZoomOut, RotateCw, Download, CheckCircle, X, Star } from "lucide-react"

interface AssignmentPreviewProps {
  assignment: {
    id: string
    title: string
    studentName: string
    submittedAt: string
    imageUrl?: string
    extractedText: string
    aiScore: number
    feedback: string
    status: string
  }
  isOpen: boolean
  onClose: () => void
}

export function AssignmentPreview({ assignment, isOpen, onClose }: AssignmentPreviewProps) {
  const [zoom, setZoom] = useState(100)
  const [rotation, setRotation] = useState(0)
  const [finalScore, setFinalScore] = useState(assignment.aiScore)
  const [teacherFeedback, setTeacherFeedback] = useState("")

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 200))
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 50))
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360)

  const handleApprove = () => {
    console.log("Approving submission with score:", finalScore)
    onClose()
  }

  const handleReject = () => {
    console.log("Rejecting submission")
    onClose()
  }

  // Mock canvas rendering for assignment preview
  const renderAssignmentCanvas = () => (
    <div className="relative bg-white border rounded-lg overflow-hidden" style={{ height: "600px" }}>
      {/* Canvas Controls */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button size="sm" variant="outline" onClick={handleZoomOut}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="outline" onClick={handleZoomIn}>
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="outline" onClick={handleRotate}>
          <RotateCw className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="outline">
          <Download className="h-4 w-4" />
        </Button>
      </div>

      {/* Mock Assignment Document */}
      <div
        className="w-full h-full flex items-center justify-center bg-gray-50"
        style={{
          transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
          transition: "transform 0.3s ease",
        }}
      >
        <div className="bg-white p-8 shadow-lg max-w-2xl w-full mx-4">
          <div className="border-b pb-4 mb-6">
            <h3 className="text-xl font-bold">Binary Search Tree Implementation</h3>
            <p className="text-gray-600">Student: {assignment.studentName}</p>
            <p className="text-gray-600">Submitted: {assignment.submittedAt}</p>
          </div>

          {/* Mock handwritten content */}
          <div className="space-y-4 font-mono text-sm">
            <div className="bg-blue-50 p-4 rounded border-l-4 border-blue-400">
              <p className="font-semibold">Problem Statement:</p>
              <p>Implement a Binary Search Tree with insert, delete, search operations</p>
            </div>

            <div className="space-y-2">
              <p className="font-semibold">Solution:</p>
              <div className="bg-gray-100 p-4 rounded font-mono text-xs">
                <pre>{`class BST {
  constructor() {
    this.root = null;
  }
  
  insert(value) {
    if (!this.root) {
      this.root = new Node(value);
      return;
    }
    this.insertNode(this.root, value);
  }
  
  search(value) {
    return this.searchNode(this.root, value);
  }
}`}</pre>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded border-l-4 border-green-400">
              <p className="font-semibold">Test Cases:</p>
              <p>✓ Insert: [5, 3, 7, 2, 4, 6, 8]</p>
              <p>✓ Search: Found 4, Not found 9</p>
              <p>✓ Delete: Removed 3 successfully</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>
              {assignment.title} - {assignment.studentName}
            </span>
            <Badge
              className={
                assignment.status === "graded"
                  ? "bg-green-100 text-green-800"
                  : assignment.status === "ai_evaluated"
                    ? "bg-purple-100 text-purple-800"
                    : "bg-blue-100 text-blue-800"
              }
            >
              {assignment.status.replace("_", " ")}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="preview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="preview">Document Preview</TabsTrigger>
            <TabsTrigger value="extracted">Extracted Text</TabsTrigger>
            <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
            <TabsTrigger value="grading">Grading</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="space-y-4">
            {renderAssignmentCanvas()}
          </TabsContent>

          <TabsContent value="extracted" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Extracted Text (95% Confidence)
                </CardTitle>
                <CardDescription>AI-powered OCR extraction from the submitted document</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm">{assignment.extractedText}</pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>AI Evaluation Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-4">
                    <div className="text-4xl font-bold text-blue-600">{assignment.aiScore}/100</div>
                    <Progress value={assignment.aiScore} className="w-full" />
                    <p className="text-sm text-gray-600">Automated evaluation based on rubric criteria</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Rubric Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Code Quality</span>
                    <div className="flex items-center gap-2">
                      <Progress value={85} className="w-20" />
                      <span className="text-sm font-medium">25/30</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Functionality</span>
                    <div className="flex items-center gap-2">
                      <Progress value={90} className="w-20" />
                      <span className="text-sm font-medium">36/40</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Documentation</span>
                    <div className="flex items-center gap-2">
                      <Progress value={75} className="w-20" />
                      <span className="text-sm font-medium">15/20</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Test Cases</span>
                    <div className="flex items-center gap-2">
                      <Progress value={100} className="w-20" />
                      <span className="text-sm font-medium">10/10</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>AI Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm">{assignment.feedback}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Content Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">92%</div>
                    <div className="text-sm text-green-600">Readability</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">88%</div>
                    <div className="text-sm text-blue-600">Grammar</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">95%</div>
                    <div className="text-sm text-purple-600">Relevance</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="grading" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>AI Recommendation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <span className="font-medium">Recommended Score: {assignment.aiScore}/100</span>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-sm">{assignment.feedback}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>AI Confidence: 88%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Teacher Review</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="finalScore">Final Score</Label>
                    <Input
                      id="finalScore"
                      type="number"
                      min="0"
                      max="100"
                      value={finalScore}
                      onChange={(e) => setFinalScore(Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="feedback">Teacher Feedback</Label>
                    <Textarea
                      id="feedback"
                      placeholder="Add your feedback for the student..."
                      value={teacherFeedback}
                      onChange={(e) => setTeacherFeedback(e.target.value)}
                      className="mt-1"
                      rows={4}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleApprove} className="flex-1 bg-green-600 hover:bg-green-700">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve & Grade
                    </Button>
                    <Button onClick={handleReject} variant="outline" className="flex-1 bg-transparent">
                      <X className="h-4 w-4 mr-2" />
                      Request Revision
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
