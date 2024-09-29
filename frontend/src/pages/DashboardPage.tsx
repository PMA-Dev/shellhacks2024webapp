// src/pages/DashboardPage.tsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { UserCircle } from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';
import { toast } from 'sonner';
import { Canvas } from '@react-three/fiber';
import SolarSystem from '@/components/SolarSystem';

function DashboardPage() {
    const [projectName, setProjectName] = useState('');
    const { projects, addProject } = useProjects();
    const navigate = useNavigate();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleCreateProject = async () => {
        try {
            if (projectName.trim() !== '') {
                const newProject = {
                    projectName,
                    pages: [],
                    pageIds: [],
                };
                await addProject(newProject);
                setProjectName('');
                setIsDialogOpen(false);
                toast.success('Successfully created a new project!');
            }
        } catch (error) {
            toast.error('Failed to create a new project!');
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="container flex items-center justify-between px-6 py-4 mx-auto">
                    <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                    <div className="flex items-center space-x-4">
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button>Create New Project</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>New Project</DialogTitle>
                                    <DialogDescription>
                                        Enter a name for your new project.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="projectName">Project Name</Label>
                                        <Input
                                            id="projectName"
                                            placeholder="My Awesome Project"
                                            value={projectName}
                                            onChange={(e) => setProjectName(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={handleCreateProject}>Create Project</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        <UserCircle className="w-8 h-8 text-gray-600" />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container px-6 py-8 mx-auto">
                {projects.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                className="relative px-4 py-32 bg-black rounded-lg shadow hover:shadow-lg transition-all hover:scale-105 cursor-pointer overflow-hidden"
                                onClick={() => navigate(`/projects/${project.id}/general`)}
                            >
                                {/* Solar System Animation */}
                                <div className="absolute inset-0">
                                    <Canvas camera={{ position: [10, 10, 10], fov: 75 }}>
                                        <SolarSystem
                                            seed={project.id}
                                        />
                                    </Canvas>
                                </div>
                                {/* Overlay for readability */}
                                <div className="absolute inset-0 bg-black opacity-30"></div>
                                {/* Project Title */}
                                <div className="relative z-10">
                                    <h2 className="mb-2 text-xl font-semibold text-white">
                                        {project.projectName}
                                    </h2>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center mt-16">
                        <p className="mb-4 text-lg text-gray-600">
                            You don't have any projects yet.
                        </p>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button>Create Your First Project</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>New Project</DialogTitle>
                                    <DialogDescription>
                                        Enter a name for your new project.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="projectName">Project Name</Label>
                                        <Input
                                            id="projectName"
                                            placeholder="My Awesome Project"
                                            value={projectName}
                                            onChange={(e) => setProjectName(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={handleCreateProject}>Create Project</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                )}
            </main>
        </div>
    );
}

// Helper function to generate a consistent sun color per project
function getSunColor(id: string) {
    const colors = ['#ffcc00', '#ff6600', '#ff0066']; // Yellow, Orange, Pink
    const index = Math.abs(hashString(id)) % colors.length;
    return colors[index];
}

// Simple hash function
function hashString(str: string) {
    let hash = 0;
    if (str.length === 0) return hash;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
}

export default DashboardPage;
