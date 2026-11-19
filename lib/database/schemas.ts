// User Schema
export interface IUser {
  _id: string
  name: string
  email: string
  password: string
  role: "admin" | "teacher" | "student"

  // Student specific fields
  studentId?: string
  rollNumber?: string
  batch?: string
  semester?: number

  // Teacher/Admin specific fields
  employeeId?: string
  designation?: string

  // Common fields
  department?: string
  section?: string
  group?: string
  phone?: string
  joiningDate?: Date
  status: "active" | "inactive" | "graduated"
  lastLogin?: Date
  profilePicture?: string
  address?: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
}

// Academic Structure Schemas
export interface IBranch {
  _id: string
  name: string
  code: string
  description: string
  departments: string[]
  totalSemesters: number
  status: "active" | "inactive"
  createdAt: Date
  updatedAt: Date
}

export interface IDepartment {
  _id: string
  name: string
  code: string
  description: string
  headOfDepartment: string
  establishedYear: number
  location: string
  contactEmail: string
  contactPhone: string
  website?: string
  status: "active" | "inactive"
}

export interface ISection {
  _id: string
  name: string
  departmentId: string
  semester: number
  batch: string
  capacity: number
  currentStrength: number
  classTeacher: string
  subjects: string[]
  schedule: {
    [day: string]: string[]
  }
  status: "active" | "inactive"
}

export interface IGroup {
  _id: string
  name: string
  sectionId: string
  students: string[]
  capacity: number
  type: "theory" | "lab" | "tutorial"
  instructor: string
  schedule: {
    [day: string]: string[]
  }
  status: "active" | "inactive"
}

export interface ISubject {
  _id: string
  name: string
  code: string
  description: string
  departmentId: string
  semester: number
  credits: number
  type: "core" | "elective" | "lab"
  syllabus: {
    modules: Array<{
      name: string
      topics: string[]
      duration: string
    }>
    practicals: string[]
    references: string[]
  }
  prerequisites: string[]
  instructor: string
  schedule: {
    theory?: {
      [day: string]: string
    }
    lab?: {
      [day: string]: string
    }
  }
  assessment: {
    internal: number
    external: number
    practical: number
  }
  status: "active" | "inactive"
}

// Assignment Schema
export interface IAssignment {
  _id: string
  title: string
  description: string
  instructions: string
  subjectId: string
  teacherId: string
  dueDate: Date
  maxScore: number
  submissionType: "file" | "text" | "both"
  allowedFileTypes: string[]
  maxFileSize: number
  targetType: "section" | "group" | "individual"
  targetIds: string[]

  aiEvaluation: {
    enabled: boolean
    model: string
    weightage: number
    criteria: Array<{
      name: string
      weight: number
      description: string
    }>
  }

  rubric: Array<{
    criteria: string
    maxPoints: number
    description: string
  }>

  status: "draft" | "published" | "closed"
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
}

// Submission Schema
export interface ISubmission {
  _id: string
  assignmentId: string
  studentId: string
  submissionType: "file" | "text" | "both"

  files: Array<{
    filename: string
    originalName: string
    path: string
    size: number
    mimeType: string
  }>

  textContent?: string
  submittedAt: Date
  isLate: boolean

  status: "submitted" | "ai_evaluated" | "graded"

  aiEvaluation: {
    score: number
    feedback: string
    criteria: Array<{
      name: string
      score: number
      maxScore: number
      feedback: string
    }>
    processedAt: Date | null
    processingTime: number
  }

  teacherReview: {
    score: number
    feedback: string
    reviewedAt: Date | null
    reviewedBy: string | null
  }

  finalScore: number
  grade: string
  gradedAt: Date | null
  gradedBy: string | null
}

// Notification Schema
export interface INotification {
  _id: string
  userId: string
  title: string
  message: string
  type: "assignment" | "grade" | "reminder" | "system"
  priority: "low" | "medium" | "high"
  read: boolean
  createdAt: Date
  data?: {
    [key: string]: any
  }
}

// Analytics Schema
export interface IAnalytics {
  _id: string
  type: "assignment" | "student" | "subject" | "system"
  entityId: string
  metrics: {
    [key: string]: number | string
  }
  timestamp: Date
  period: "daily" | "weekly" | "monthly" | "semester"
}

// File Schema
export interface IFile {
  _id: string
  filename: string
  originalName: string
  path: string
  size: number
  mimeType: string
  uploadedBy: string
  uploadedAt: Date
  category: "assignment" | "submission" | "profile" | "document"
  metadata?: {
    [key: string]: any
  }
}

// AI Evaluation Result Schema
export interface IAIEvaluationResult {
  _id: string
  submissionId: string
  model: string
  version: string

  extractedText: string
  codeAnalysis?: {
    language: string
    complexity: number
    quality: number
    structure: number
    documentation: number
  }

  scores: Array<{
    criteria: string
    score: number
    maxScore: number
    reasoning: string
  }>

  overallScore: number
  feedback: string
  suggestions: string[]

  processingTime: number
  processedAt: Date
  confidence: number
}

// System Configuration Schema
export interface ISystemConfig {
  _id: string
  key: string
  value: any
  description: string
  category: "ai" | "upload" | "security" | "general"
  updatedBy: string
  updatedAt: Date
}

// Mock Data Store Interface
export interface MockDataStore {
  users: IUser[]
  branches: IBranch[]
  departments: IDepartment[]
  sections: ISection[]
  groups: IGroup[]
  subjects: ISubject[]
  assignments: IAssignment[]
  submissions: ISubmission[]
  notifications: INotification[]
  auditLogs: IAuditLog[]
  analytics: IAnalytics[]
  files: IFile[]
  aiEvaluationResults: IAIEvaluationResult[]
  systemConfigs: ISystemConfig[]
}

// Audit Log Schema
export interface IAuditLog {
  _id: string
  userId: string
  action: string
  resource: string
  resourceId: string
  details: Record<string, any>
  ipAddress: string
  userAgent: string
  createdAt: Date
}
