const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Get employee profile
router.get('/profile', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        username: true,
        email: true,
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
    console.error('Error fetching employee profile:', error);
    res.status(500).json({ message: 'Error fetching employee profile' });
  }
});

// Get employee reviews
router.get('/reviews', async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { revieweeId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching employee reviews:', error);
    res.status(500).json({ message: 'Error fetching employee reviews' });
  }
});

// Get pending jobs
router.get('/pending-jobs', async (req, res) => {
  try {
    const pendingJobs = await prisma.jobApplication.findMany({
      where: {
        employeeId: req.user.id,
      },
      include: {
        job: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(pendingJobs);
  } catch (error) {
    console.error('Error fetching pending jobs:', error);
    res.status(500).json({ message: 'Error fetching pending jobs' });
  }
});


// Apply for a job
router.post('/apply-job', async (req, res) => {
    const { jobId } = req.body;
    const employeeId = req.user.id;
  
    try {
      const existingApplication = await prisma.jobApplication.findFirst({
        where: {
          jobId: parseInt(jobId),
          employeeId: employeeId,
        },
      });
  
      if (existingApplication) {
        return res.status(400).json({ message: 'You have already applied for this job' });
      }
  
      const jobApplication = await prisma.jobApplication.create({
        data: {
          job: { connect: { id: parseInt(jobId) } },
          employee: { connect: { id: employeeId } },
          status: 'pending',
        },
      });
  
      res.status(201).json(jobApplication);
    } catch (error) {
      console.error('Error applying for job:', error);
      res.status(500).json({ message: 'Error applying for job' });
    }
  });
  

module.exports = router;