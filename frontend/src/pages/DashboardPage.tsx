// src/pages/DashboardPage.tsx

import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ProjectList from '@/components/ProjectList';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { ProjectContext } from '@/context/ProjectContext';
import { UserCircle } from 'lucide-react';

function DashboardPage() {
    const [projectName, setProjectName] = useState('');
    const { projects, addProject } = useContext(ProjectContext)!;
    const navigate = useNavigate();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleCreateProject = () => {
        if (projectName.trim() !== '') {
            const newProject = {
                id: Date.now().toString(),
                name: projectName,
                pages: [],
            };
            addProject(newProject);
            setProjectName('');
            setIsDialogOpen(false);
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
                                className="p-6 bg-white rounded-lg shadow hover:shadow-lg"
                            >
                                <h2 className="mb-2 text-xl font-semibold text-gray-800">
                                    {project.name}
                                </h2>
                                <p className="text-gray-600">Project description here...</p>
                                <Button
                                    variant="primary"
                                    className="mt-4"
                                    onClick={() => navigate(`/projects/${project.id}`)}
                                >
                                    Open Project
                                </Button>
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

export default DashboardPage;
