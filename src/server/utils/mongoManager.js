const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

/**
 * Check if MongoDB is running
 * @returns {Promise<boolean>}
 */
const isMongoRunning = async () => {
  try {
    // Try different commands based on OS
    if (process.platform === 'darwin') {
      const { stdout } = await execAsync('pgrep mongod');
      return stdout.trim().length > 0;
    } else if (process.platform === 'linux') {
      const { stdout } = await execAsync('systemctl is-active mongod');
      return stdout.trim() === 'active';
    } else if (process.platform === 'win32') {
      const { stdout } = await execAsync('tasklist | findstr mongod');
      return stdout.trim().length > 0;
    }
    return false;
  } catch (error) {
    return false;
  }
};

/**
 * Start MongoDB
 * @returns {Promise<boolean>}
 */
const startMongo = async () => {
  try {
    if (process.platform === 'darwin') {
      // For macOS using Homebrew
      await execAsync('brew services start mongodb-community');
    } else if (process.platform === 'linux') {
      // For Linux using systemd
      await execAsync('sudo systemctl start mongod');
    } else if (process.platform === 'win32') {
      // For Windows (assuming MongoDB is installed as a service)
      await execAsync('net start MongoDB');
    }
    return true;
  } catch (error) {
    console.error('Error starting MongoDB:', error);
    return false;
  }
};

/**
 * Ensure MongoDB is running
 * @returns {Promise<boolean>}
 */
const ensureMongoRunning = async () => {
  const isRunning = await isMongoRunning();
  if (!isRunning) {
    console.log('MongoDB is not running. Attempting to start...');
    const started = await startMongo();
    if (started) {
      console.log('MongoDB started successfully');
      // Wait a bit for MongoDB to fully start
      await new Promise(resolve => setTimeout(resolve, 2000));
      return true;
    } else {
      console.error('Failed to start MongoDB');
      return false;
    }
  }
  return true;
};

module.exports = {
  isMongoRunning,
  startMongo,
  ensureMongoRunning
}; 