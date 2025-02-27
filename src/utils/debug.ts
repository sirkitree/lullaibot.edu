// Debug file to help verify environment variables during build
export const printEnvVars = () => {
  console.log('==== Environment Variables ====');
  console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
  console.log('MODE:', import.meta.env.MODE);
  console.log('============================');
};

// Log debug info if not in production
if (import.meta.env.DEV) {
  printEnvVars();
} 