require("dotenv").config();
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { authenticateToken } = require('./authMiddleware'); // Updated path if necessary

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(cors());

const PORT = 4003;
const saltRounds = 10;

// Registration endpoint
app.post('/register', async (req, res) => {
  const { username, password, email, userType } = req.body;
  
  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists with this username or email." });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        email,
        userType
      },
    });

    res.status(201).json({ message: "User registered successfully", userId: user.id });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: "Failed to register user. Please try again." });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);

    await prisma.token.create({
      data: {
        refreshToken,
        userId: user.id
      },
    });

    res.json({
        accessToken,
        refreshToken,
        userType: user.userType,
        hasCompletedSetup: user.hasCompletedSetup
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: "Login failed. Please try again." });
  }
});

// Token refresh endpoint
app.post('/token', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.sendStatus(401);

  try {
    const tokenRecord = await prisma.token.findFirst({
      where: { refreshToken },
    });

    if (!tokenRecord) return res.sendStatus(403);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      const accessToken = generateAccessToken({ id: user.id, username: user.username, userType: user.userType });
      res.json({ accessToken });
    });
  } catch (err) {
    console.error('Token refresh error:', err);
    res.status(500).json({ message: "Failed to refresh token. Please try again." });
  }
});

// Logout endpoint
app.delete('/logout', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ message: "Refresh token is required" });

  try {
    await prisma.token.deleteMany({
      where: { refreshToken },
    });
    res.sendStatus(204);
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ message: "Logout failed. Please try again." });
  }
});

function generateAccessToken(user) {
  return jwt.sign({ id: user.id, username: user.username, userType: user.userType }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
}

app.listen(PORT, () => {
  console.log(`Auth server running on port ${PORT}`);
});

// // Middleware for token authentication
// function authenticateToken(req, res, next) {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];

//   if (token == null) return res.sendStatus(401);

//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
//     if (err) return res.sendStatus(403);
//     req.user = user;
//     next();
//   });
// }

// Export the authenticateToken middleware
// module.exports = { authenticateToken };