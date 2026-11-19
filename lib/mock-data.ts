import type {
  IUser,
  IAssignment,
  ISubmission,
  ISubject,
  IDepartment,
  ISection,
  IGroup,
  INotification,
} from "./database/schemas"

// Mock Users Data
const mockUsers: IUser[] = [
  {
    _id: "user_001",
    name: "Rahul Verma",
    email: "rahul.verma@cu.edu.in",
    password: "student123",
    role: "student",
    studentId: "CU/CSE/2024/001",
    rollNumber: "2024CSE001",
    department: "dept_001",
    section: "section_001",
    group: "group_001",
    batch: "2024-28",
    semester: 3,
    phone: "+91-9876543210",
    joiningDate: new Date("2024-08-01"),
    status: "active",
    lastLogin: new Date(),
    profilePicture: "",
    address: {
      street: "123 Student Hostel",
      city: "Mohali",
      state: "Punjab",
      zipCode: "140413",
      country: "India",
    },
  },
  {
    _id: "user_002",
    name: "Dr. Priya Sharma",
    email: "priya.sharma@cu.edu.in",
    password: "teacher123",
    role: "teacher",
    employeeId: "CU/CSE/T001",
    department: "dept_001",
    designation: "Assistant Professor",
    phone: "+91-9876543211",
    joiningDate: new Date("2020-07-01"),
    status: "active",
    lastLogin: new Date(),
    profilePicture: "",
    address: {
      street: "456 Faculty Colony",
      city: "Mohali",
      state: "Punjab",
      zipCode: "140413",
      country: "India",
    },
  },
  {
    _id: "user_003",
    name: "Dr. Rajesh Kumar",
    email: "admin@cu.edu.in",
    password: "admin123",
    role: "admin",
    employeeId: "CU/ADMIN/001",
    department: "dept_001",
    designation: "Head of Department",
    phone: "+91-9876543212",
    joiningDate: new Date("2018-01-01"),
    status: "active",
    lastLogin: new Date(),
    profilePicture: "",
    address: {
      street: "789 Admin Block",
      city: "Mohali",
      state: "Punjab",
      zipCode: "140413",
      country: "India",
    },
  },
  // Additional students
  {
    _id: "user_004",
    name: "Ananya Singh",
    email: "ananya.singh@cu.edu.in",
    password: "student123",
    role: "student",
    studentId: "CU/CSE/2024/002",
    rollNumber: "2024CSE002",
    department: "dept_001",
    section: "section_001",
    group: "group_001",
    batch: "2024-28",
    semester: 3,
    phone: "+91-9876543213",
    joiningDate: new Date("2024-08-01"),
    status: "active",
    lastLogin: new Date(),
    profilePicture: "",
    address: {
      street: "124 Student Hostel",
      city: "Mohali",
      state: "Punjab",
      zipCode: "140413",
      country: "India",
    },
  },
  {
    _id: "user_005",
    name: "Arjun Patel",
    email: "arjun.patel@cu.edu.in",
    password: "student123",
    role: "student",
    studentId: "CU/CSE/2024/003",
    rollNumber: "2024CSE003",
    department: "dept_001",
    section: "section_001",
    group: "group_002",
    batch: "2024-28",
    semester: 3,
    phone: "+91-9876543214",
    joiningDate: new Date("2024-08-01"),
    status: "active",
    lastLogin: new Date(),
    profilePicture: "",
    address: {
      street: "125 Student Hostel",
      city: "Mohali",
      state: "Punjab",
      zipCode: "140413",
      country: "India",
    },
  },
]

// Mock Departments
const mockDepartments: IDepartment[] = [
  {
    _id: "dept_001",
    name: "Computer Science & Engineering",
    code: "CSE",
    description: "Department of Computer Science and Engineering",
    headOfDepartment: "user_003",
    establishedYear: 2010,
    location: "Block A",
    contactEmail: "cse@cu.edu.in",
    contactPhone: "+91-172-3041000",
    website: "https://cu.edu.in/cse",
    status: "active",
  },
  {
    _id: "dept_002",
    name: "Electronics & Communication Engineering",
    code: "ECE",
    description: "Department of Electronics and Communication Engineering",
    headOfDepartment: "user_003",
    establishedYear: 2012,
    location: "Block B",
    contactEmail: "ece@cu.edu.in",
    contactPhone: "+91-172-3041001",
    website: "https://cu.edu.in/ece",
    status: "active",
  },
]

// Mock Sections
const mockSections: ISection[] = [
  {
    _id: "section_001",
    name: "Section A",
    departmentId: "dept_001",
    semester: 3,
    batch: "2024-28",
    capacity: 60,
    currentStrength: 45,
    classTeacher: "user_002",
    subjects: ["subject_001", "subject_002", "subject_003"],
    schedule: {
      monday: ["09:00-10:00", "10:00-11:00", "11:30-12:30"],
      tuesday: ["09:00-10:00", "10:00-11:00", "11:30-12:30"],
      wednesday: ["09:00-10:00", "10:00-11:00", "11:30-12:30"],
      thursday: ["09:00-10:00", "10:00-11:00", "11:30-12:30"],
      friday: ["09:00-10:00", "10:00-11:00", "11:30-12:30"],
    },
    status: "active",
  },
]

// Mock Groups
const mockGroups: IGroup[] = [
  {
    _id: "group_001",
    name: "Group 1",
    sectionId: "section_001",
    students: ["user_001", "user_004"],
    capacity: 30,
    type: "lab",
    instructor: "user_002",
    schedule: {
      monday: ["14:00-17:00"],
      wednesday: ["14:00-17:00"],
    },
    status: "active",
  },
  {
    _id: "group_002",
    name: "Group 2",
    sectionId: "section_001",
    students: ["user_005"],
    capacity: 30,
    type: "lab",
    instructor: "user_002",
    schedule: {
      tuesday: ["14:00-17:00"],
      thursday: ["14:00-17:00"],
    },
    status: "active",
  },
]

// Mock Subjects
const mockSubjects: ISubject[] = [
  {
    _id: "subject_001",
    name: "Data Structures and Algorithms",
    code: "CSE301",
    description: "Comprehensive study of data structures and algorithmic techniques",
    departmentId: "dept_001",
    semester: 3,
    credits: 4,
    type: "core",
    syllabus: {
      modules: [
        {
          name: "Arrays and Linked Lists",
          topics: ["Array operations", "Linked list implementation", "Dynamic memory allocation"],
          duration: "2 weeks",
        },
        {
          name: "Stacks and Queues",
          topics: ["Stack operations", "Queue implementation", "Applications"],
          duration: "2 weeks",
        },
        {
          name: "Trees and Graphs",
          topics: ["Binary trees", "Graph traversal", "Shortest path algorithms"],
          duration: "3 weeks",
        },
      ],
      practicals: ["Implement various sorting algorithms", "Binary tree operations", "Graph algorithms implementation"],
      references: ["Introduction to Algorithms by Cormen", "Data Structures and Algorithms by Aho"],
    },
    prerequisites: ["CSE201"],
    instructor: "user_002",
    schedule: {
      theory: {
        monday: "09:00-10:00",
        wednesday: "10:00-11:00",
        friday: "11:30-12:30",
      },
      lab: {
        tuesday: "14:00-17:00",
        thursday: "14:00-17:00",
      },
    },
    assessment: {
      internal: 40,
      external: 60,
      practical: 50,
    },
    status: "active",
  },
  {
    _id: "subject_002",
    name: "Database Management Systems",
    code: "CSE302",
    description: "Fundamentals of database design and management",
    departmentId: "dept_001",
    semester: 3,
    credits: 3,
    type: "core",
    syllabus: {
      modules: [
        {
          name: "Database Fundamentals",
          topics: ["DBMS concepts", "Data models", "Database architecture"],
          duration: "2 weeks",
        },
        {
          name: "SQL and Query Processing",
          topics: ["SQL syntax", "Query optimization", "Indexing"],
          duration: "3 weeks",
        },
        {
          name: "Transaction Management",
          topics: ["ACID properties", "Concurrency control", "Recovery"],
          duration: "2 weeks",
        },
      ],
      practicals: ["Database design and normalization", "SQL query implementation", "Transaction processing"],
      references: ["Database System Concepts by Silberschatz", "Fundamentals of Database Systems by Elmasri"],
    },
    prerequisites: ["CSE201"],
    instructor: "user_002",
    schedule: {
      theory: {
        tuesday: "09:00-10:00",
        thursday: "10:00-11:00",
        friday: "09:00-10:00",
      },
      lab: {
        monday: "14:00-17:00",
        wednesday: "14:00-17:00",
      },
    },
    assessment: {
      internal: 40,
      external: 60,
      practical: 50,
    },
    status: "active",
  },
  {
    _id: "subject_003",
    name: "Operating Systems",
    code: "CSE303",
    description: "Principles and design of operating systems",
    departmentId: "dept_001",
    semester: 3,
    credits: 4,
    type: "core",
    syllabus: {
      modules: [
        {
          name: "OS Fundamentals",
          topics: ["OS structure", "System calls", "Process management"],
          duration: "2 weeks",
        },
        {
          name: "Memory Management",
          topics: ["Virtual memory", "Paging", "Segmentation"],
          duration: "2 weeks",
        },
        {
          name: "File Systems",
          topics: ["File organization", "Directory structure", "File allocation"],
          duration: "2 weeks",
        },
      ],
      practicals: ["Process scheduling algorithms", "Memory management simulation", "File system implementation"],
      references: ["Operating System Concepts by Silberschatz", "Modern Operating Systems by Tanenbaum"],
    },
    prerequisites: ["CSE201"],
    instructor: "user_002",
    schedule: {
      theory: {
        monday: "10:00-11:00",
        wednesday: "09:00-10:00",
        friday: "10:00-11:00",
      },
      lab: {
        tuesday: "14:00-17:00",
        thursday: "14:00-17:00",
      },
    },
    assessment: {
      internal: 40,
      external: 60,
      practical: 50,
    },
    status: "active",
  },
]

// Mock Assignments
const mockAssignments: IAssignment[] = [
  {
    _id: "assignment_001",
    title: "Binary Search Tree Implementation",
    description: "Implement a complete Binary Search Tree with all basic operations",
    instructions:
      "Create a BST class with insert, delete, search, and traversal methods. Include proper error handling and documentation.",
    subjectId: "subject_001",
    teacherId: "user_002",
    dueDate: new Date("2024-12-25"),
    maxScore: 100,
    submissionType: "file",
    allowedFileTypes: [".py", ".cpp", ".java", ".pdf"],
    maxFileSize: 10485760,
    targetType: "section",
    targetIds: ["section_001"],
    aiEvaluation: {
      enabled: true,
      model: "gemini-pro",
      weightage: 70,
      criteria: [
        { name: "Code Quality", weight: 30, description: "Clean, readable, and well-structured code" },
        { name: "Functionality", weight: 40, description: "All required operations implemented correctly" },
        { name: "Documentation", weight: 20, description: "Proper comments and documentation" },
        { name: "Error Handling", weight: 10, description: "Appropriate error handling and edge cases" },
      ],
    },
    rubric: [
      { criteria: "Implementation", maxPoints: 40, description: "Correct implementation of BST operations" },
      { criteria: "Code Quality", maxPoints: 30, description: "Clean and efficient code" },
      { criteria: "Documentation", maxPoints: 20, description: "Proper documentation and comments" },
      { criteria: "Testing", maxPoints: 10, description: "Comprehensive test cases" },
    ],
    status: "published",
    publishedAt: new Date("2024-12-01"),
    createdAt: new Date("2024-11-30"),
    updatedAt: new Date("2024-12-01"),
  },
  {
    _id: "assignment_002",
    title: "Database Design Project",
    description: "Design and implement a complete database system for a library management system",
    instructions:
      "Create ER diagram, normalize tables, implement in SQL, and provide sample queries with explanations.",
    subjectId: "subject_002",
    teacherId: "user_002",
    dueDate: new Date("2024-12-30"),
    maxScore: 100,
    submissionType: "file",
    allowedFileTypes: [".sql", ".pdf", ".docx"],
    maxFileSize: 10485760,
    targetType: "section",
    targetIds: ["section_001"],
    aiEvaluation: {
      enabled: true,
      model: "gemini-pro",
      weightage: 60,
      criteria: [
        { name: "Database Design", weight: 40, description: "Proper ER diagram and normalization" },
        { name: "SQL Implementation", weight: 35, description: "Correct SQL syntax and logic" },
        { name: "Documentation", weight: 25, description: "Clear explanations and documentation" },
      ],
    },
    rubric: [
      { criteria: "ER Diagram", maxPoints: 25, description: "Complete and accurate ER diagram" },
      { criteria: "Normalization", maxPoints: 25, description: "Proper database normalization" },
      { criteria: "SQL Implementation", maxPoints: 30, description: "Working SQL code" },
      { criteria: "Queries", maxPoints: 20, description: "Sample queries and explanations" },
    ],
    status: "published",
    publishedAt: new Date("2024-12-02"),
    createdAt: new Date("2024-12-01"),
    updatedAt: new Date("2024-12-02"),
  },
  {
    _id: "assignment_003",
    title: "Process Scheduling Algorithms",
    description: "Implement and compare different CPU scheduling algorithms",
    instructions:
      "Implement FCFS, SJF, Round Robin, and Priority scheduling. Compare their performance with different process sets.",
    subjectId: "subject_003",
    teacherId: "user_002",
    dueDate: new Date("2025-01-05"),
    maxScore: 100,
    submissionType: "file",
    allowedFileTypes: [".py", ".cpp", ".java", ".pdf"],
    maxFileSize: 10485760,
    targetType: "section",
    targetIds: ["section_001"],
    aiEvaluation: {
      enabled: true,
      model: "gemini-pro",
      weightage: 75,
      criteria: [
        { name: "Algorithm Implementation", weight: 50, description: "Correct implementation of all algorithms" },
        { name: "Performance Analysis", weight: 30, description: "Proper comparison and analysis" },
        { name: "Code Quality", weight: 20, description: "Clean and efficient code" },
      ],
    },
    rubric: [
      { criteria: "FCFS Implementation", maxPoints: 20, description: "First Come First Serve algorithm" },
      { criteria: "SJF Implementation", maxPoints: 20, description: "Shortest Job First algorithm" },
      { criteria: "Round Robin Implementation", maxPoints: 20, description: "Round Robin algorithm" },
      { criteria: "Priority Scheduling", maxPoints: 20, description: "Priority-based scheduling" },
      { criteria: "Performance Analysis", maxPoints: 20, description: "Comparison and analysis" },
    ],
    status: "published",
    publishedAt: new Date("2024-12-10"),
    createdAt: new Date("2024-12-09"),
    updatedAt: new Date("2024-12-10"),
  },
]

// Mock Submissions
const mockSubmissions: ISubmission[] = [
  {
    _id: "submission_001",
    assignmentId: "assignment_001",
    studentId: "user_001",
    submissionType: "file",
    files: [
      {
        filename: "bst_implementation.py",
        originalName: "binary_search_tree.py",
        path: "/uploads/submissions/bst_implementation.py",
        size: 5120,
        mimeType: "text/x-python",
      },
      {
        filename: "documentation.pdf",
        originalName: "BST_Documentation.pdf",
        path: "/uploads/submissions/documentation.pdf",
        size: 2048000,
        mimeType: "application/pdf",
      },
    ],
    submittedAt: new Date("2024-12-20"),
    isLate: false,
    status: "graded",
    aiEvaluation: {
      score: 85,
      feedback:
        "Excellent implementation of BST with all required operations. Code is well-structured and documented. Minor improvements needed in error handling for edge cases.",
      criteria: [
        { name: "Code Quality", score: 28, maxScore: 30, feedback: "Clean and readable code structure" },
        { name: "Functionality", score: 35, maxScore: 40, feedback: "All operations implemented correctly" },
        { name: "Documentation", score: 18, maxScore: 20, feedback: "Good documentation, could be more detailed" },
        { name: "Error Handling", score: 8, maxScore: 10, feedback: "Basic error handling present" },
      ],
      processedAt: new Date("2024-12-20T10:30:00"),
      processingTime: 2.5,
    },
    teacherReview: {
      score: 88,
      feedback:
        "Great work on the BST implementation! Your code is clean and efficient. The documentation is comprehensive. Consider adding more test cases for edge scenarios.",
      reviewedAt: new Date("2024-12-21"),
      reviewedBy: "user_002",
    },
    finalScore: 87,
    grade: "A",
    gradedAt: new Date("2024-12-21"),
    gradedBy: "user_002",
  },
  {
    _id: "submission_002",
    assignmentId: "assignment_002",
    studentId: "user_004",
    submissionType: "file",
    files: [
      {
        filename: "library_db_design.sql",
        originalName: "library_management.sql",
        path: "/uploads/submissions/library_db_design.sql",
        size: 8192,
        mimeType: "application/sql",
      },
      {
        filename: "er_diagram.pdf",
        originalName: "Library_ER_Diagram.pdf",
        path: "/uploads/submissions/er_diagram.pdf",
        size: 1536000,
        mimeType: "application/pdf",
      },
    ],
    submittedAt: new Date("2024-12-28"),
    isLate: false,
    status: "ai_evaluated",
    aiEvaluation: {
      score: 78,
      feedback:
        "Good database design with proper normalization. ER diagram is clear and well-structured. SQL implementation is mostly correct with minor syntax issues in complex queries.",
      criteria: [
        {
          name: "Database Design",
          score: 32,
          maxScore: 40,
          feedback: "Well-designed ER diagram with proper relationships",
        },
        {
          name: "SQL Implementation",
          score: 26,
          maxScore: 35,
          feedback: "Good SQL implementation with minor syntax issues",
        },
        { name: "Documentation", score: 20, maxScore: 25, feedback: "Clear explanations and good documentation" },
      ],
      processedAt: new Date("2024-12-28T11:15:00"),
      processingTime: 3.2,
    },
    teacherReview: {
      score: 0,
      feedback: "",
      reviewedAt: null,
      reviewedBy: null,
    },
    finalScore: 0,
    grade: "",
    gradedAt: null,
    gradedBy: null,
  },
  {
    _id: "submission_003",
    assignmentId: "assignment_001",
    studentId: "user_005",
    submissionType: "file",
    files: [
      {
        filename: "bst_solution.cpp",
        originalName: "binary_search_tree.cpp",
        path: "/uploads/submissions/bst_solution.cpp",
        size: 6144,
        mimeType: "text/x-c++src",
      },
    ],
    submittedAt: new Date("2024-12-26"),
    isLate: true,
    status: "submitted",
    aiEvaluation: {
      score: 0,
      feedback: "",
      criteria: [],
      processedAt: null,
      processingTime: 0,
    },
    teacherReview: {
      score: 0,
      feedback: "",
      reviewedAt: null,
      reviewedBy: null,
    },
    finalScore: 0,
    grade: "",
    gradedAt: null,
    gradedBy: null,
  },
]

// Mock Notifications
const mockNotifications: INotification[] = [
  {
    _id: "notification_001",
    userId: "user_001",
    title: "New Assignment Posted",
    message: "Binary Search Tree Implementation assignment has been posted for Data Structures and Algorithms",
    type: "assignment",
    priority: "medium",
    read: false,
    createdAt: new Date("2024-12-01"),
    data: {
      assignmentId: "assignment_001",
      subjectId: "subject_001",
    },
  },
  {
    _id: "notification_002",
    userId: "user_001",
    title: "Assignment Graded",
    message: "Your Binary Search Tree Implementation has been graded. Score: 87/100",
    type: "grade",
    priority: "high",
    read: false,
    createdAt: new Date("2024-12-21"),
    data: {
      submissionId: "submission_001",
      score: 87,
      grade: "A",
    },
  },
  {
    _id: "notification_003",
    userId: "user_001",
    title: "Assignment Due Reminder",
    message: "Database Design Project is due in 2 days",
    type: "reminder",
    priority: "high",
    read: false,
    createdAt: new Date("2024-12-28"),
    data: {
      assignmentId: "assignment_002",
      dueDate: "2024-12-30",
    },
  },
]

// Mock API Functions
export const MockAPI = {
  // Authentication
  async authenticateUser(email: string, password: string): Promise<IUser | null> {
    await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API delay
    const user = mockUsers.find((u) => u.email === email && u.password === password)
    return user || null
  },

  // Users
  async getUsers(filters?: { role?: string }): Promise<IUser[]> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    if (filters?.role) {
      return mockUsers.filter((u) => u.role === filters.role)
    }
    return mockUsers
  },

  async createUser(userData: Partial<IUser>): Promise<IUser> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const newUser: IUser = {
      _id: `user_${Date.now()}`,
      ...userData,
    } as IUser
    mockUsers.push(newUser)
    return newUser
  },

  // Departments
  async getDepartments(): Promise<IDepartment[]> {
    await new Promise((resolve) => setTimeout(resolve, 200))
    return mockDepartments
  },

  // Sections
  async getSections(): Promise<ISection[]> {
    await new Promise((resolve) => setTimeout(resolve, 200))
    return mockSections
  },

  // Groups
  async getGroups(): Promise<IGroup[]> {
    await new Promise((resolve) => setTimeout(resolve, 200))
    return mockGroups
  },

  // Subjects
  async getSubjects(): Promise<ISubject[]> {
    await new Promise((resolve) => setTimeout(resolve, 200))
    return mockSubjects
  },

  // Assignments
  async getAssignments(filters?: { teacherId?: string; subjectId?: string }): Promise<IAssignment[]> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    let filtered = mockAssignments
    if (filters?.teacherId) {
      filtered = filtered.filter((a) => a.teacherId === filters.teacherId)
    }
    if (filters?.subjectId) {
      filtered = filtered.filter((a) => a.subjectId === filters.subjectId)
    }
    return filtered
  },

  async createAssignment(assignmentData: Partial<IAssignment>): Promise<IAssignment> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const newAssignment: IAssignment = {
      _id: `assignment_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...assignmentData,
    } as IAssignment
    mockAssignments.push(newAssignment)
    return newAssignment
  },

  // Submissions
  async getSubmissions(filters?: { studentId?: string; assignmentId?: string }): Promise<ISubmission[]> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    let filtered = mockSubmissions
    if (filters?.studentId) {
      filtered = filtered.filter((s) => s.studentId === filters.studentId)
    }
    if (filters?.assignmentId) {
      filtered = filtered.filter((s) => s.assignmentId === filters.assignmentId)
    }
    return filtered
  },

  async createSubmission(submissionData: {
    assignmentId: string
    studentId: string
    submissionType: "file" | "text" | "both"
    files?: Array<{
      filename: string
      originalName: string
      path: string
      size: number
      mimeType: string
    }>
    textContent?: string
  }): Promise<ISubmission> {
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate upload time

    const newSubmission: ISubmission = {
      _id: `submission_${Date.now()}`,
      assignmentId: submissionData.assignmentId,
      studentId: submissionData.studentId,
      submissionType: submissionData.submissionType,
      files: submissionData.files || [],
      textContent: submissionData.textContent,
      submittedAt: new Date(),
      isLate: false, // Calculate based on assignment due date
      status: "submitted",
      aiEvaluation: {
        score: 0,
        feedback: "",
        criteria: [],
        processedAt: null,
        processingTime: 0,
      },
      teacherReview: {
        score: 0,
        feedback: "",
        reviewedAt: null,
        reviewedBy: null,
      },
      finalScore: 0,
      grade: "",
      gradedAt: null,
      gradedBy: null,
    }

    mockSubmissions.push(newSubmission)

    // Simulate AI processing after a delay
    setTimeout(() => {
      const submission = mockSubmissions.find((s) => s._id === newSubmission._id)
      if (submission) {
        submission.status = "ai_evaluated"
        submission.aiEvaluation = {
          score: Math.floor(Math.random() * 30) + 70, // Random score between 70-100
          feedback:
            "AI has processed your submission. The code structure looks good with proper implementation of required functionality.",
          criteria: [
            { name: "Code Quality", score: 25, maxScore: 30, feedback: "Well-structured code" },
            { name: "Functionality", score: 35, maxScore: 40, feedback: "All requirements met" },
            { name: "Documentation", score: 15, maxScore: 20, feedback: "Good documentation" },
            { name: "Error Handling", score: 8, maxScore: 10, feedback: "Basic error handling" },
          ],
          processedAt: new Date(),
          processingTime: 2.1,
        }
      }
    }, 3000)

    return newSubmission
  },

  // Notifications
  async getNotifications(userId: string): Promise<INotification[]> {
    await new Promise((resolve) => setTimeout(resolve, 200))
    return mockNotifications.filter((n) => n.userId === userId)
  },
}

// Helper function to get student assignments with submissions
export async function getStudentAssignments(
  studentId: string,
): Promise<Array<{ assignment: IAssignment; submission?: ISubmission }>> {
  const [assignments, submissions] = await Promise.all([
    MockAPI.getAssignments(),
    MockAPI.getSubmissions({ studentId }),
  ])

  return assignments.map((assignment) => ({
    assignment,
    submission: submissions.find((s) => s.assignmentId === assignment._id),
  }))
}

// Authentication helper
export async function authenticateUser(email: string, password: string): Promise<IUser | null> {
  return MockAPI.authenticateUser(email, password)
}
