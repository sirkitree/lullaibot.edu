const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const path = require('path');
const { connectDB } = require('./config/database');

// Load environment variables from server directory
dotenv.config({ path: path.join(__dirname, '.env') });

// Initialize express app
const app = express();

// Port Configuration:
// 1. Use PORT from environment variables if set
// 2. Use DEFAULT_PORT from environment variables if set
// 3. Fall back to 3001 as a sensible default (backend typically runs on frontend port + 1)
const PORT = process.env.PORT || process.env.DEFAULT_PORT || 3001;

// CORS Configuration for multiple environments
const corsOptions = {
  origin: function(origin, callback) {
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'http://localhost:3000',
      // Dynamic localhost with any port (for development flexibility)
      /^http:\/\/localhost:\d+$/,
      /\.onrender\.com$/
    ];
    
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    // Check if the origin is allowed
    const allowed = allowedOrigins.some(allowedOrigin => {
      if (typeof allowedOrigin === 'string') {
        return origin === allowedOrigin;
      } else if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return false;
    });
    
    if (allowed) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
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
const { router: resourceRoutes, adminRouter: resourceAdminRoutes } = require('./routes/resources');
const categoryRoutes = require('./routes/categories');
const { router: userRoutes } = require('./routes/users');
const authRoutes = require('./routes/auth');
const llmRoutes = require('./routes/llm');
const analyticsRoutes = require('./routes/analytics');

// Mount routes
app.use('/api/resources', resourceRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/llm', llmRoutes);
app.use('/api/admin', resourceAdminRoutes);
app.use('/api/admin/analytics', analyticsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`
🚀 Server is running on port ${PORT}
📁 API endpoints available at http://localhost:${PORT}/api
🔄 Environment: ${process.env.NODE_ENV || 'development'}
  `);
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`⚠️  Port ${PORT} is already in use. Please try these steps:
    1. Check if another instance of the server is running
    2. Stop any process using port ${PORT} with: lsof -i :${PORT} | grep LISTEN
    3. Kill the process with: kill -9 <PID>
    4. Restart the server
    `);
  } else {
    console.error('Server failed to start:', error);
  }
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM. Performing graceful shutdown...');
  server.close(() => {
    console.log('Server closed. Exiting process.');
    process.exit(0);
  });
});

// Update existing users with legacyId if not present
const User = require('./models/User');
const updateUsersWithLegacyId = async () => {
  try {
    // Find users without legacyId
    const users = await User.find({ legacyId: { $exists: false } });
    console.log(`Found ${users.length} users without legacyId`);
    
    // Update each user with a legacyId
    for (const user of users) {
      user.legacyId = user._id.toString();
      await user.save();
      console.log(`Added legacyId to user: ${user.name}`);
    }
  } catch (err) {
    console.error('Error updating users with legacyId:', err);
  }
};

// Run migration after database connection is established
if (process.env.NODE_ENV !== 'test') {
  connectDB().then(() => {
    console.log('Running user migration for legacyIds...');
    updateUsersWithLegacyId();
  }).catch(err => {
    console.error(`Database connection error: ${err.message}`);
  });
} else {
  connectDB().catch(err => {
    console.error(`Database connection error: ${err.message}`);
  });
}

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
      auth: '/api/auth',
      llm: '/api/llm',
      health: '/api/health'
    },
    documentation: '/api/docs'
  });
});

module.exports = app; // Export for testing 