import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="not-found-page text-center">
      <h2>404 - Page Not Found</h2>
      <p>The page you are looking for doesn't exist or has been moved.</p>
      
      <div className="mt-lg">
        <Link to="/" className="button button-primary">
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage; 