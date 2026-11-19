"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, FileText, Clock, CheckCircle, AlertCircle, X } from "lucide-react"

interface Assignment {
  id: string
  title: string
  subject: string
  dueDate: string
  status: string
  description: string
  maxScore: number
}

interface AssignmentUploadProps {
  assignments: Assignment[]
  onUpload: (assignmentId: string, file: File) => Promise<void>
}

export function AssignmentUpload({ assignments, onUpload }: AssignmentUploadProps) {
  const [selectedAssignment, setSelectedAssignment] = useState<string>("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "processing" | "completed" | "error">("idle")
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!selectedAssignment || !selectedFile) return

    setUploading(true)
    setUploadStatus("uploading")
    setUploadProgress(0)

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setUploadProgress(100)
      setUploadStatus("processing")

      // Call the actual upload function
      await onUpload(selectedAssignment, selectedFile)

      // Simulate AI processing
      await new Promise((resolve) => setTimeout(resolve, 3000))
      setUploadStatus("completed")

      // Reset form
      setTimeout(() => {
        setSelectedAssignment("")
        setSelectedFile(null)
        setUploadStatus("idle")
        setUploadProgress(0)
      }, 2000)
    } catch (error) {
      setUploadStatus("error")
    } finally {
      setUploading(false)
    }
  }

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case "uploading":
        return <Upload className="h-5 w-5 text-blue-600 animate-pulse" />
      case "processing":
        return <Clock className="h-5 w-5 text-yellow-600 animate-spin" />
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-600" />
      default:
        return <Upload className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusMessage = () => {
    switch (uploadStatus) {
      case "uploading":
        return "Uploading file..."
      case "processing":
        return "Processing with AI..."
      case "completed":
        return "Upload completed successfully!"
      case "error":
        return "Upload failed. Please try again."
      default:
        return "Ready to upload"
    }
  }

  const selectedAssignmentData = assignments.find((a) => a.id === selectedAssignment)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Assignment
          </CardTitle>
          <CardDescription>Select an assignment and upload your submission file</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Assignment Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Assignment</label>
            <Select value={selectedAssignment} onValueChange={setSelectedAssignment}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an assignment to submit" />
              </SelectTrigger>
              <SelectContent>
                {assignments.map((assignment) => (
                  <SelectItem key={assignment.id} value={assignment.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{assignment.title}</span>
                      <Badge variant="outline" className="ml-2">
                        {assignment.subject}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Assignment Details */}
          {selectedAssignmentData && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{selectedAssignmentData.title}</h4>
                    <Badge className="bg-blue-100 text-blue-800">{selectedAssignmentData.subject}</Badge>
                  </div>
                  <p className="text-sm text-gray-600">{selectedAssignmentData.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span>Due Date: {selectedAssignmentData.dueDate}</span>
                    <span>Max Score: {selectedAssignmentData.maxScore}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* File Upload Area */}
          <div className="space-y-4">
            <label className="text-sm font-medium">Upload File</label>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? "border-blue-400 bg-blue-50"
                  : selectedFile
                    ? "border-green-400 bg-green-50"
                    : "border-gray-300 hover:border-gray-400"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {selectedFile ? (
                <div className="space-y-2">
                  <FileText className="h-12 w-12 text-green-600 mx-auto" />
                  <div>
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setSelectedFile(null)} className="mt-2">
                    <X className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                  <div>
                    <p className="text-lg font-medium">Drop your file here</p>
                    <p className="text-sm text-gray-500">or click to browse</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    id="file-upload"
                    onChange={handleFileSelect}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.py,.cpp,.java,.txt"
                  />
                  <Button variant="outline" asChild>
                    <label htmlFor="file-upload" className="cursor-pointer">
                      Browse Files
                    </label>
                  </Button>
                  <p className="text-xs text-gray-400">
                    Supported formats: PDF, DOC, DOCX, JPG, PNG, PY, CPP, JAVA, TXT
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Upload Progress */}
          {uploadStatus !== "idle" && (
            <Card className="bg-gray-50">
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon()}
                      <span className="font-medium">{getStatusMessage()}</span>
                    </div>
                    {uploadStatus === "uploading" && <span className="text-sm text-gray-500">{uploadProgress}%</span>}
                  </div>
                  {uploadStatus === "uploading" && <Progress value={uploadProgress} className="h-2" />}
                  {uploadStatus === "processing" && (
                    <div className="space-y-2">
                      <Progress value={100} className="h-2" />
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>✓ File uploaded successfully</p>
                        <p>🤖 AI is analyzing your submission...</p>
                        <p>📝 Extracting text and evaluating content...</p>
                      </div>
                    </div>
                  )}
                  {uploadStatus === "completed" && (
                    <div className="text-sm text-green-600 space-y-1">
                      <p>✓ File uploaded successfully</p>
                      <p>✓ AI processing completed</p>
                      <p>✓ Submission recorded</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Upload Button */}
          <Button
            onClick={handleUpload}
            disabled={!selectedAssignment || !selectedFile || uploading}
            className="w-full"
            size="lg"
          >
            {uploading ? (
              <>
                <Upload className="h-4 w-4 mr-2 animate-pulse" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Submit Assignment
              </>
            )}
          </Button>

          {/* Instructions */}
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="pt-4">
              <h4 className="font-medium text-yellow-800 mb-2">Upload Instructions:</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>1. Select the assignment you want to submit</li>
                <li>2. Upload your completed assignment file</li>
                <li>3. Our AI will automatically process and evaluate your submission</li>
                <li>4. You'll receive feedback and grades once review is complete</li>
              </ul>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}
