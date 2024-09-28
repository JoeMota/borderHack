require("dotenv").config();
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(cors());

// Step 4: Implement registration endpoint
app.post('/register', async (req, res) => {
  const { username, password, email, userType } = req.body;
  
  try {
    const user = await prisma.user.create({
      data: {
        username,
        password, // Note: In a real application, you should hash the password
        email,
        userType,
      },
    });
    
    res.status(201).json({ message: 'User registered successfully', userId: user.id });
  } catch (err) {
    console.error('Error registering user', err);
    res.status(500).json({ message: 'Error registering user' });
  }
});

// Step 5: Implement login endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });
    
    if (user && password === user.password) { // Note: In a real application, you should compare hashed passwords
      const token = jwt.sign({ userId: user.id, userType: user.userType }, 'your_jwt_secret', { expiresIn: '1h' });
      res.json({ message: 'Login successful', token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    console.error('Error during login', err);
    res.status(500).json({ message: 'Error during login' });
  }
});

// Step 6: Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await prisma.$connect();
  console.log('Connected to the database');
});

// Remember to handle prisma disconnection when the server shuts down
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit();
});