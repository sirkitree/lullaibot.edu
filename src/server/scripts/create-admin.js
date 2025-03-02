/**
 * Create Admin User Script
 * 
 * This script creates an admin user in the database.
 * Usage: node create-admin.js <name> <email> <password>
 * 
 * Example: node create-admin.js "Admin User" admin@example.com password123
 */

const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = require('../models/User');
const { connectDB } = require('../config/database');

// Load environment variables
dotenv.config();

// Function to create admin user
const createAdminUser = async (name, email, password) => {
  try {
    // Connect to the database
    await connectDB();
    console.log('Connected to the database');

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.role === 'admin') {
        console.log(`User ${email} already exists as an admin.`);
        
        // Update password if provided
        if (password) {
          existingUser.password = password;
          await existingUser.save();
          console.log(`Updated password for ${email}`);
        }
      } else {
        // Update to admin role
        existingUser.role = 'admin';
        await existingUser.save();
        console.log(`Upgraded ${email} to admin role`);
        
        // Update password if provided
        if (password) {
          existingUser.password = password;
          await existingUser.save();
          console.log(`Updated password for ${email}`);
        }
      }
      
      await mongoose.disconnect();
      return;
    }

    // Create admin user
    const user = await User.create({
      name,
      email,
      password,
      role: 'admin'
    });

    console.log(`Admin user created successfully!`);
    console.log(`Name: ${user.name}`);
    console.log(`Email: ${user.email}`);
    console.log(`Role: ${user.role}`);
    console.log(`ID: ${user._id}`);

    // Disconnect from the database
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

// Get command line arguments
const args = process.argv.slice(2);

if (args.length < 2) {
  console.log('Usage: node create-admin.js <name> <email> <password>');
  process.exit(1);
}

const name = args[0];
const email = args[1];
const password = args[2] || 'admin123'; // Default password if not provided

// Create admin user
createAdminUser(name, email, password); 