import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ResourcesPage from './pages/ResourcesPage';
import AddResourcePage from './pages/AddResourcePage';
import AchievementsPage from './pages/AchievementsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route 
            path="/add-resource" 
            element={
              <ProtectedRoute>
                <AddResourcePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/achievements" 
            element={
              <ProtectedRoute>
                <AchievementsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/leaderboard" 
            element={
              <ProtectedRoute>
                <LeaderboardPage />
              </ProtectedRoute>
            } 
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </AuthProvider>
  );
}

export default App; 