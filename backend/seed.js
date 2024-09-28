const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

const SALT_ROUNDS = 10;

async function main() {
  // Clear existing data
  await prisma.review.deleteMany();
  await prisma.jobApplication.deleteMany();
  await prisma.job.deleteMany();
  await prisma.user.deleteMany();

  // Create Users (Both Employees and Employers)
  const users = [];
  for (let i = 1; i <= 50; i++) {
    const isEmployer = i <= 10; // First 10 users are employers
    const hashedPassword = await bcrypt.hash('password123', SALT_ROUNDS);
    const user = await prisma.user.create({
      data: {
        username: `user${i}`,
        email: `user${i}@example.com`,
        password: hashedPassword,
        userType: isEmployer ? 'employer' : 'employee',
        hasCompletedSetup: true,
        skills: isEmployer ? null : 'Communication, Teamwork, Problem Solving',
        strengths: isEmployer ? null : 'Adaptability, Time Management',
        preferredCategories: isEmployer ? [] : ['Construction', 'Agriculture', 'Transportation'],
        rating: Math.random() * 5,
        completedJobs: Math.floor(Math.random() * 20),
      },
    });
    users.push(user);
    console.log(`Created user: ${user.username}`);
  }

  // Create Jobs
  const jobCategories = ['Agriculture', 'Construction', 'Domestic Work', 'Transportation', 'Retail', 'Food Service', 'Manufacturing'];
  const jobs = [];
  for (let i = 1; i <= 100; i++) {
    const employer = users.find(u => u.userType === 'employer');
    const job = await prisma.job.create({
      data: {
        title: `Job ${i}`,
        description: `This is the description for Job ${i}`,
        category: jobCategories[Math.floor(Math.random() * jobCategories.length)],
        amount: Math.floor(Math.random() * 500) + 50,
        paymentMethod: ['Cash', 'Bank Transfer', 'Mobile Money'][Math.floor(Math.random() * 3)],
        location: ['City A', 'City B', 'City C', 'City D'][Math.floor(Math.random() * 4)],
        estimatedTime: Math.floor(Math.random() * 40) + 1,
        deadline: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
        status: ['open', 'in progress', 'completed'][Math.floor(Math.random() * 3)],
        employerId: employer.id,
      },
    });
    jobs.push(job);
    console.log(`Created job: ${job.title}`);
  }

  // Create Job Applications
  for (const job of jobs) {
    const applicationsCount = Math.floor(Math.random() * 5) + 1;
    const applicants = users.filter(u => u.userType === 'employee').sort(() => 0.5 - Math.random()).slice(0, applicationsCount);
    
    for (const applicant of applicants) {
      const application = await prisma.jobApplication.create({
        data: {
          jobId: job.id,
          employeeId: applicant.id,
          status: ['pending', 'approved', 'rejected'][Math.floor(Math.random() * 3)],
        },
      });
      console.log(`Created job application for job ${job.id} by user ${applicant.username}`);
    }
  }

  // Create Reviews
  for (let i = 1; i <= 200; i++) {
    const reviewer = users[Math.floor(Math.random() * users.length)];
    const reviewee = users.filter(u => u.id !== reviewer.id)[Math.floor(Math.random() * (users.length - 1))];
    
    const review = await prisma.review.create({
      data: {
        rating: Math.floor(Math.random() * 5) + 1,
        comment: `This is review ${i}. The work was satisfactory.`,
        reviewerId: reviewer.id,
        revieweeId: reviewee.id,
      },
    });
    console.log(`Created review ${i}`);
  }

  console.log('Seed data creation completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });