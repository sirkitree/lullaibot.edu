import captureWebsite from 'capture-website';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

// Define the directory to save screenshots
const SCREENSHOTS_DIR = path.join(process.cwd(), 'public', 'uploads', 'screenshots');

// Ensure the directory exists
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

/**
 * Captures a screenshot of the given URL and saves it to the screenshots directory
 * @param {string} url - The URL to capture
 * @returns {Promise<string>} - The path to the saved screenshot (relative to the public directory)
 */
export async function captureScreenshot(url) {
  try {
    // Generate a unique filename using a UUID and the current timestamp
    const filename = `${uuidv4()}-${Date.now()}.png`;
    const fullPath = path.join(SCREENSHOTS_DIR, filename);
    
    // Capture the website screenshot
    await captureWebsite.file(url, fullPath, {
      width: 1280,
      height: 800,
      fullPage: false,
      delay: 2, // Delay in seconds before capturing the screenshot
      timeout: 30, // Timeout in seconds
      scaleFactor: 1, // Device scale factor
      disableAnimations: true,
    });
    
    // Return the relative path to the screenshot (for serving via the web server)
    return `/uploads/screenshots/${filename}`;
  } catch (error) {
    console.error(`Error capturing screenshot for ${url}:`, error);
    throw new Error(`Failed to capture screenshot: ${error.message}`);
  }
} 