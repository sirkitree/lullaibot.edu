const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const { connectDB } = require('./config/database');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:3000',
  credentials: true
}));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Connect to database
if (process.env.NODE_ENV !== 'test') {
  connectDB().catch(err => {
    console.error(`Database connection error: ${err.message}`);
  });
}

// API routes
const resourceRoutes = require('./routes/resources');
const categoryRoutes = require('./routes/categories');
const { router: userRoutes } = require('./routes/users');
const { router: achievementRoutes } = require('./routes/achievements');
const authRoutes = require('./routes/auth');
const llmRoutes = require('./routes/llm');

// Mount routes
app.use('/api/resources', resourceRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/llm', llmRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'LullAIbot Education API is running',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// API documentation endpoint
app.get('/api', (req, res) => {
  res.status(200).json({
    message: 'Welcome to the LullAIbot Education API',
    endpoints: {
      resources: '/api/resources',
      categories: '/api/categories',
      users: '/api/users',
      achievements: '/api/achievements',
      auth: '/api/auth',
      llm: '/api/llm',
      health: '/api/health'
    },
    documentation: '/api/docs'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`
======================================
🚀 Server running on port ${PORT}
📝 API documentation: http://localhost:${PORT}/api
🔍 Health check: http://localhost:${PORT}/api/health
👤 Authentication routes: http://localhost:${PORT}/api/auth
🤖 LLM routes: http://localhost:${PORT}/api/llm
======================================
    `);
  });
}

module.exports = app; // Export for testing 