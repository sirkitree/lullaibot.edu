const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { ensureMongoRunning } = require('../utils/mongoManager');

// Load environment variables
dotenv.config();

// MongoDB connection URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lullaibot-edu';

// MongoDB connection options
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: true,
};

// Connect to MongoDB
const connectDB = async () => {
  try {
    // First ensure MongoDB is running
    const isRunning = await ensureMongoRunning();
    if (!isRunning) {
      throw new Error('MongoDB could not be started');
    }

    // Attempt to connect
    const conn = await mongoose.connect(MONGODB_URI, options);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    console.error('Please ensure MongoDB is installed and can be started.');
    console.error('On macOS: brew install mongodb-community');
    console.error('On Linux: sudo apt install mongodb');
    console.error('On Windows: Download and install from https://www.mongodb.com/try/download/community');
    process.exit(1);
  }
};

// Disconnect from MongoDB
const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB Disconnected');
  } catch (error) {
    console.error(`Error disconnecting from MongoDB: ${error.message}`);
  }
};

// Connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
  console.log(`Mongoose connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

// Handle process termination
process.on('SIGINT', async () => {
  await disconnectDB();
  process.exit(0);
});

module.exports = {
  connectDB,
  disconnectDB,
  mongoose,
}; 