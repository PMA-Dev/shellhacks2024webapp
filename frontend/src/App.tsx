// src/App.tsx

import { Toaster } from '@/components/ui/sonner';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { GalaxyProvider } from './context/GalacticContext';
import { ProjectProvider } from './context/ProjectContext';
import DashboardPage from './pages/DashboardPage';
import { GitConfigPage } from './pages/GitConfigPage';
import OnboardingPage from './pages/OnboardingPage';
import ProjectPage from './pages/project/ProjectPage';

function App() {
    return (
        <GalaxyProvider>
            <ProjectProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<OnboardingPage />} />
                        <Route
                            path="/dashboard/*"
                            element={<DashboardPage />}
                        />
                        <Route
                            path="/projects/:projectId/*"
                            element={<ProjectPage />}
                        />

                        <Route path="/git" element={<GitConfigPage />} />
                    </Routes>
                    <Toaster />
                </Router>
            </ProjectProvider>
        </GalaxyProvider>
    );
}

export default App;
