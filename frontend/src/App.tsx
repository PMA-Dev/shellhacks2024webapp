// src/App.tsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import ProjectPage from './pages/project/ProjectPage';
import { Toaster } from '@/components/ui/sonner';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<OnboardingPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route
                    path="/projects/:projectId/*"
                    element={<ProjectPage />}
                />
            </Routes>
            <Toaster />
        </Router>
    );
}

export default App;
