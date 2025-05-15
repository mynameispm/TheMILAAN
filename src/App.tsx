import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import ProblemsPage from './pages/ProblemsPage';
import ProblemDetailPage from './pages/ProblemDetailPage';
import PostProblemPage from './pages/PostProblemPage';
import ProfilePage from './pages/ProfilePage';
import { AuthProvider } from './context/AuthContext';
import { ProblemProvider } from './context/ProblemContext';

function App() {
  return (
    <AuthProvider>
      <ProblemProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/problems" element={<ProblemsPage />} />
                <Route path="/problem/:id" element={<ProblemDetailPage />} />
                <Route path="/post-problem" element={<PostProblemPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/profile/:id" element={<ProfilePage />} />
                {/* Additional routes can be added here */}
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </ProblemProvider>
    </AuthProvider>
  );
}

export default App;