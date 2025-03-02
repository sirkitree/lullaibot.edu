// Debug module - Functions and utilities to help with debugging

// Log environment mode
console.log('Current Mode:', import.meta.env.MODE);

// Log API URL if available
if (import.meta.env.VITE_API_URL) {
  console.log('API URL from env:', import.meta.env.VITE_API_URL);
}

// Expose debugging functions to window object for console access
if (typeof window !== 'undefined') {
  // Function to check auth status
  window.checkAuth = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('Not authenticated: No token found');
      return { authenticated: false };
    }

    try {
      // Basic JWT structure check
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        console.log('Invalid token format');
        return { authenticated: false, tokenFormat: 'invalid' };
      }

      // Decode token payload
      const payload = JSON.parse(atob(tokenParts[1]));
      console.log('Token payload:', payload);

      // Check expiration
      const isExpired = payload.exp * 1000 < Date.now();
      if (isExpired) {
        console.log('Token expired at:', new Date(payload.exp * 1000).toLocaleString());
      } else {
        console.log('Token valid until:', new Date(payload.exp * 1000).toLocaleString());
      }

      return {
        authenticated: !isExpired,
        expired: isExpired,
        userId: payload.id,
        role: payload.role,
        iat: new Date(payload.iat * 1000).toLocaleString(),
        exp: new Date(payload.exp * 1000).toLocaleString()
      };
    } catch (error) {
      console.error('Error parsing token:', error);
      return { authenticated: false, error: error.message };
    }
  };

  // Function to check admin status
  window.checkAdminAccess = () => {
    const authStatus = window.checkAuth();
    
    if (!authStatus.authenticated) {
      console.log('Not authenticated. Admin access: No');
      return { isAdmin: false, reason: 'Not authenticated' };
    }
    
    const isAdmin = authStatus.role === 'admin';
    console.log(`User role: ${authStatus.role}. Admin access: ${isAdmin ? 'Yes' : 'No'}`);
    
    return { 
      isAdmin, 
      userId: authStatus.userId,
      role: authStatus.role
    };
  };

  // Function to clear auth data for testing
  window.clearAuth = () => {
    localStorage.removeItem('token');
    console.log('Auth token cleared from localStorage');
    return { success: true };
  };

  console.log('Debug utilities loaded. Available commands: checkAuth(), checkAdminAccess(), clearAuth()');
}

// Export debug functions for tests (not used in browser)
export const debugFunctions = {}; 