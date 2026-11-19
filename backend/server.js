// Express.js Backend Server
// const express = require('express')
// const mongoose = require('mongoose')
// const cors = require('cors')
// const multer = require('multer')
// const path = require('path')
// const bcrypt = require('bcryptjs')
// const jwt = require('jsonwebtoken')
// const { GoogleGenerativeAI } = require('@google/generative-ai')

// const app = express()
// const PORT = process.env.PORT || 5000

// // Middleware
// app.use(cors())
// app.use(express.json())
// app.use('/uploads', express.static('uploads'))

// // MongoDB Connection
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cu_assignment_platform', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })

// // Multer Configuration for File Uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/submissions/')
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + '-' + file.originalname)
//   }
// })

// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
//   fileFilter: (req, file, cb) => {
//     const allowedTypes = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png']
//     const fileExt = path.extname(file.originalname).toLowerCase()
//     if (allowedTypes.includes(fileExt)) {
//       cb(null, true)
//     } else {
//       cb(new Error('Invalid file type'))
//     }
//   }
// })

// // Initialize Gemini AI
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

// // Authentication Middleware
// const authenticateToken = (req, res, next) => {
//   const authHeader = req.headers['authorization']
//   const token = authHeader && authHeader.split(' ')[1]

//   if (!token) {
//     return res.sendStatus(401)
//   }

//   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//     if (err) return res.sendStatus(403)
//     req.user = user
//     next()
//   })
// }

// // Routes

// // Authentication Routes
// app.post('/api/auth/login', async (req, res) => {
//   try {
//     const { email, password } = req.body
//     const user = await User.findOne({ email })

//     if (!user || !await bcrypt.compare(password, user.password)) {
//       return res.status(401).json({ message: 'Invalid credentials' })
//     }

//     const token = jwt.sign(
//       { userId: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: '24h' }
//     )

//     res.json({ token, user: { ...user.toObject(), password: undefined } })
//   } catch (error) {
//     res.status(500).json({ message: error.message })
//   }
// })

// // User Routes
// app.get('/api/users', authenticateToken, async (req, res) => {
//   try {
//     const { role, department, section } = req.query
//     let query = {}

//     if (role) query.role = role
//     if (department) query.department = department
//     if (section) query.section = section

//     const users = await User.find(query).select('-password')
//     res.json(users)
//   } catch (error) {
//     res.status(500).json({ message: error.message })
//   }
// })

// app.post('/api/users', authenticateToken, async (req, res) => {
//   try {
//     const userData = req.body
//     userData.password = await bcrypt.hash(userData.password, 10)

//     const user = new User(userData)
//     await user.save()

//     res.status(201).json({ ...user.toObject(), password: undefined })
//   } catch (error) {
//     res.status(400).json({ message: error.message })
//   }
// })

// // Assignment Routes
// app.get('/api/assignments', authenticateToken, async (req, res) => {
//   try {
//     const { teacherId, subjectId, status } = req.query
//     let query = {}

//     if (teacherId) query.teacherId = teacherId
//     if (subjectId) query.subjectId = subjectId
//     if (status) query.status = status

//     const assignments = await Assignment.find(query)
//       .populate('subjectId', 'name code')
//       .populate('teacherId', 'name email')
//     res.json(assignments)
//   } catch (error) {
//     res.status(500).json({ message: error.message })
//   }
// })

// app.post('/api/assignments', authenticateToken, async (req, res) => {
//   try {
//     const assignment = new Assignment(req.body)
//     await assignment.save()
//     res.status(201).json(assignment)
//   } catch (error) {
//     res.status(400).json({ message: error.message })
//   }
// })

// // Submission Routes
// app.post('/api/submissions', authenticateToken, upload.array('files'), async (req, res) => {
//   try {
//     const submissionData = JSON.parse(req.body.data)
//     submissionData.files = req.files.map(file => ({
//       filename: file.filename,
//       originalName: file.originalname,
//       path: file.path,
//       size: file.size,
//       mimeType: file.mimetype
//     }))

//     const submission = new Submission(submissionData)
//     await submission.save()

//     // Trigger AI processing
//     processSubmissionWithAI(submission._id)

//     res.status(201).json(submission)
//   } catch (error) {
//     res.status(400).json({ message: error.message })
//   }
// })

// // AI Processing Function
// async function processSubmissionWithAI(submissionId) {
//   try {
//     const submission = await Submission.findById(submissionId)
//     const assignment = await Assignment.findById(submission.assignmentId)

//     // Update processing status
//     submission.aiProcessing.status = 'processing'
//     await submission.save()

//     // Extract text from files (OCR for images, text extraction for PDFs)
//     let extractedText = ''
//     for (const file of submission.files) {
//       if (file.mimeType.startsWith('image/')) {
//         // Use OCR library like Tesseract.js
//         extractedText += await extractTextFromImage(file.path)
//       } else if (file.mimeType === 'application/pdf') {
//         // Use PDF parsing library
//         extractedText += await extractTextFromPDF(file.path)
//       }
//     }

//     submission.aiProcessing.extractedText = extractedText

//     // Generate AI evaluation using Gemini
//     const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
//     const prompt = `
//       Evaluate this assignment submission:
//       Assignment: ${assignment.title}
//       Instructions: ${assignment.instructions}
//       Student Work: ${extractedText}
//       Max Score: ${assignment.maxScore}

//       Provide a score and detailed feedback.
//     `

//     const result = await model.generateContent(prompt)
//     const response = await result.response
//     const evaluation = response.text()

//     // Parse AI response and update submission
//     submission.aiEvaluation = parseAIEvaluation(evaluation, assignment.maxScore)
//     submission.aiProcessing.status = 'completed'
//     submission.status = 'ai_evaluated'

//     await submission.save()

//   } catch (error) {
//     console.error('AI Processing Error:', error)
//     await Submission.findByIdAndUpdate(submissionId, {
//       'aiProcessing.status': 'failed',
//       'aiProcessing.error': error.message
//     })
//   }
// }

// // Helper functions for text extraction
// async function extractTextFromImage(imagePath) {
//   // Implementation using Tesseract.js or Google Vision API
//   return "Extracted text from image..."
// }

// async function extractTextFromPDF(pdfPath) {
//   // Implementation using pdf-parse or similar library
//   return "Extracted text from PDF..."
// }

// function parseAIEvaluation(evaluation, maxScore) {
//   // Parse AI response to extract score and feedback
//   return {
//     score: Math.floor(Math.random() * maxScore), // Placeholder
//     feedback: evaluation,
//     confidence: 0.85
//   }
// }

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`)
// })

export const backendConfig = {
  port: 5000,
  mongoUri: "mongodb://localhost:27017/cu_assignment_platform",
  jwtSecret: "your-jwt-secret-key",
  geminiApiKey: "your-gemini-api-key",
}
