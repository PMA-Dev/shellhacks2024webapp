// src/pages/DashboardPage.tsx

import SolarSystem from '@/components/SolarSystem';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Dropdown } from '@/components/ui/dropdown';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGalaxy } from '@/context/GalacticContext';
import { useProject } from '@/context/ProjectContext';
import { useGalaticMetadata } from '@/hooks/useGalaticMetadata';
import { useProjects } from '@/hooks/useProjects';
import { GalacticMetadata, Project } from '@/models';
import { Canvas } from '@react-three/fiber';
import { UserCircle } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { toast } from 'sonner';

const getLabelFromDir = (dir: string) => {
    const parts = dir.split('/');
    return parts[parts.length - 2];
};

const DashboardPage = () => {
    const { setProject } = useProject();
    const { setGalaxy } = useGalaxy();
    useEffect(() => {
        setProject(null);
    }, [setProject]);
    const [projectName, setProjectName] = useState('');
    const [projects, setProjects] = useState<Project[]>([]);
    const { getProjectsForGalaxy, addProject } = useProjects();
    const { getAllGalacticMetadata } = useGalaticMetadata();
    const [galaxyId, setGalaxyId] = useState<number | undefined>(undefined);
    const [allGalaxyData, setAllGalaxyData] = useState<GalacticMetadata[]>();
    const navigate = useNavigate();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleCreateProject = useCallback(async () => {
        try {
            if (projectName.trim() !== '') {
                const newProject = {
                    projectName,
                    pages: [],
                    pageIds: [],
                };
                setIsLoading(true);
                await addProject(newProject, galaxyId);
                setProjectName('');
                setIsDialogOpen(false);
                toast.success('Successfully created a new project!');
                await fetchAndSetProjects();
                setIsLoading(false);
            }
        } catch (error) {
            toast.error('Failed to create a new project!');
            console.error(error);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addProject, galaxyId, projectName]);

    useEffect(() => {
        const fetchAndSetGalaxies = async () => {
            const allGalaxies = await getAllGalacticMetadata();
            setAllGalaxyData(allGalaxies);

            if (allGalaxies.length > 0 && !galaxyId) {
                setGalaxyId(allGalaxies[0].id);
            }
        };
        fetchAndSetGalaxies();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [galaxyId]);

    const fetchAndSetProjects = async () => {
        if (!galaxyId) {
            return;
        }
        const allProjects = await getProjectsForGalaxy(galaxyId);
        setProjects(allProjects);
    };

    useEffect(() => {
        fetchAndSetProjects();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [galaxyId]);

    const { getGalacticMetadataById } = useGalaticMetadata();
    useEffect(() => {
        async function fetchGalaxy() {
            const galaxy = await getGalacticMetadataById(Number(galaxyId));
            console.log(JSON.stringify(galaxy));
            setGalaxy(galaxy);
        }
        fetchGalaxy();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [galaxyId]);

    const CreateProjectDialog = useMemo(() => {
        return (
            <div key={10}>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>New Project</DialogTitle>
                            <DialogDescription>
                                Enter a name for your new project.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="projectName">
                                    Project Name
                                </Label>
                                <Input
                                    id="projectName"
                                    placeholder="My Awesome Project"
                                    value={projectName}
                                    onChange={(e) =>
                                        setProjectName(e.target.value)
                                    }
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                onClick={handleCreateProject}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div id="submit-project-spinner">
                                        <ClipLoader size={20} color="#fff" />
                                    </div>
                                ) : (
                                    'Create Project'
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        );
    }, [handleCreateProject, isDialogOpen, isLoading, projectName]);

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="container flex items-center justify-between px-6 py-4 mx-auto">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Dashboard
                    </h1>
                    <div className="flex items-center space-x-4">
                        <Dropdown
                            value={galaxyId}
                            options={
                                allGalaxyData?.map((data) => ({
                                    value: data.id!,
                                    label: getLabelFromDir(data.workingDir!),
                                })) ?? []
                            }
                            defaultValue={allGalaxyData?.at(0)?.id ?? undefined}
                            onChange={(data) => {
                                const galaxyId = data.target.value;
                                setGalaxyId(Number(galaxyId));
                                setGalaxy(
                                    allGalaxyData?.find(
                                        (data) => data.id === Number(galaxyId)
                                    ) ?? null
                                );
                            }}
                        />
                    </div>
                    <div className="flex items-center space-x-4">
                        <Button
                            onClick={() =>
                                navigate(`/git?galaxyId=${galaxyId}`)
                            }
                        >
                            Configure Git
                        </Button>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Button onClick={() => setIsDialogOpen(true)}>
                            Create New Project
                        </Button>
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
                                onClick={() =>
                                    navigate(`/projects/${project.id}/general`)
                                }
                            >
                                {/* Solar System Animation */}
                                <div className="absolute inset-0">
                                    <Canvas
                                        camera={{
                                            position: [10, 10, 10],
                                            fov: 75,
                                        }}
                                    >
                                        <SolarSystem
                                            seed={+(project.id || 0)}
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
                        <Button onClick={() => setIsDialogOpen(true)}>
                            Create New Project
                        </Button>
                    </div>
                )}

                {CreateProjectDialog}
            </main>
        </div>
    );
};

export default DashboardPage;
