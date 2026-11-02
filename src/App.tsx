import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Pages
import { HomePage } from './pages/Home/HomePage';
import { LoginPage } from './pages/Auth/LoginPage';
import { RegisterPage } from './pages/Auth/RegisterPage';
import { ForgotPasswordPage } from './pages/Auth/ForgotPasswordPage';
import { ProfilePage } from './pages/Auth/ProfilePage';
import { StudentDashboard } from './pages/Student/StudentDashboard';
import { PerformanceAnalytics } from './pages/Student/PerformanceAnalytics';
import { SavedQuestions } from './pages/Student/SavedQuestions';
import { PapersList } from './pages/Papers/PapersList';
import { PaperDashboard } from './pages/Papers/PaperDashboard';
import { TopicDetail } from './pages/Papers/TopicDetail';
import { McqPractice } from './pages/Practice/McqPractice';
import { MockExamList } from './pages/Examination/MockExamList';
import { MockExamInterface } from './pages/Examination/MockExamInterface';
import { ExamResults } from './pages/Examination/ExamResults';
import { ResourcesPage } from './pages/Resources/ResourcesPage';
import { LeaderboardPage } from './pages/Leaderboard/LeaderboardPage';
import { AboutPage } from './pages/About/AboutPage';
import { ContactPage } from './pages/Contact/ContactPage';
import { AdminDashboard } from './pages/Admin/AdminDashboard';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Full-screen dedicated CBE simulation route (outside standard layout for immersion) */}
          <Route
            path="/exams/take/:mockId"
            element={
              <ProtectedRoute>
                <MockExamInterface />
              </ProtectedRoute>
            }
          />

          {/* Standard Layout Routes */}
          <Route
            path="*"
            element={
              <Layout>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/leaderboard" element={<LeaderboardPage />} />
                  <Route path="/resources" element={<ResourcesPage />} />

                  {/* Syllabus & Practice routes */}
                  <Route path="/papers" element={<PapersList />} />
                  <Route path="/papers/:paperId" element={<PaperDashboard />} />
                  <Route path="/papers/:paperId/topics/:topicId" element={<TopicDetail />} />
                  <Route path="/practice" element={<McqPractice />} />
                  <Route path="/exams" element={<MockExamList />} />
                  <Route path="/exams/results/:attemptId" element={<ExamResults />} />

                  {/* Student Protected routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <StudentDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/analytics"
                    element={
                      <ProtectedRoute>
                        <PerformanceAnalytics />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/saved-questions"
                    element={
                      <ProtectedRoute>
                        <SavedQuestions />
                      </ProtectedRoute>
                    }
                  />

                  {/* Administrator Protected route */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute requireAdmin={true}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
