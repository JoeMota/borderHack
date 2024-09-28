require('dotenv').config();
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { authenticateToken } = require('./authMiddleware');
const employeeRoutes = require('./routes/employeeRoutes');

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Use employee routes
app.use('/api/employee', authenticateToken, (req, res, next) => {
  console.log('Employee route accessed, user:', req.user);
  next();
}, employeeRoutes);

// Multer configuration for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload an image.'), false);
    }
  }
});

// Get employee profile
app.get('/api/employee/profile', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        username: true,
        email: true,
        userType: true,
        skills: true,
        strengths: true,
        preferredCategories: true,
        rating: true,
        completedJobs: true,
        hasCompletedSetup: true,
      },
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const pendingJobs = await prisma.jobApplication.count({
      where: {
        employeeId: req.user.id,
        status: 'pending',
      },
    });

    res.json({ ...user, pendingJobs });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
});

// Update employee profile
// Update employee profile
app.put('/api/employee/profile', authenticateToken, async (req, res) => {
  try {
    const { name, email, skills } = req.body;
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { 
        name, 
        email, 
        skills: skills ? skills.join(',') : undefined, // Join skills array into a string
      },
    });
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
});

// Get all jobs
app.get('/api/jobs', authenticateToken, async (req, res) => {
  console.log('Jobs route accessed');
  try {
    const jobs = await prisma.job.findMany({
      where: { status: 'open' },
      orderBy: { createdAt: 'desc' },
    });
    res.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: 'Error fetching jobs' });
  }
});

// Apply for a job
app.post('/api/employee/apply-job', authenticateToken, async (req, res) => {
  try {
    const { jobId } = req.body;
    const existingApplication = await prisma.jobApplication.findFirst({
      where: {
        jobId: parseInt(jobId),
        employeeId: req.user.id,
      },
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    const jobApplication = await prisma.jobApplication.create({
      data: {
        job: { connect: { id: parseInt(jobId) } },
        employee: { connect: { id: req.user.id } },
        status: 'pending',
      },
    });
    res.status(201).json(jobApplication);
  } catch (error) {
    console.error('Error applying for job:', error);
    res.status(500).json({ message: 'Error applying for job', error: error.message });
  }
});

// Get applied jobs
app.get('/api/employee/applied-jobs', authenticateToken, async (req, res) => {
  try {
    const appliedJobs = await prisma.jobApplication.findMany({
      where: { employeeId: req.user.id },
      include: {
        job: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(appliedJobs);
  } catch (error) {
    console.error('Error fetching applied jobs:', error);
    res.status(500).json({ message: 'Error fetching applied jobs', error: error.message });
  }
});

// In your server.js or relevant route file
app.post('/api/employee/setup', authenticateToken, async (req, res) => {
  try {
    const { skills } = req.body;
    
    console.log('Received setup data:', { skills });
    
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        skills,
        hasCompletedSetup: true
      }
    });
    
    console.log('User updated:', updatedUser);
    
    res.json({ message: 'Profile setup completed', user: updatedUser });
  } catch (error) {
    console.error('Error setting up profile:', error);
    res.status(500).json({ message: 'Error setting up profile', error: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));