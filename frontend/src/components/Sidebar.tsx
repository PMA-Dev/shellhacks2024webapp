// src/components/Sidebar.tsx

import { Button } from '@/components/ui/button';
import { useGalaxy } from '@/context/GalacticContext';
import { useProject } from '@/context/ProjectContext';
import useDarkMode from '@/hooks/useDarkMode';
import { useGalacticMetadata } from '@/hooks/useGalacticMetadata';
import { useProjects } from '@/hooks/useProjects';
import { cn } from '@/lib/utils';
import {
    Box,
    ChevronLeft,
    ChevronRight,
    Code,
    Database,
    FileText,
    Fish,
    Github,
    HammerIcon,
    Image,
    LayoutDashboardIcon,
    LayoutTemplate,
    LogOut,
    Server,
    ServerCog,
    Settings,
    Sun,
    Undo2Icon,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';

function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
        return localStorage.getItem('sidebar_collapsed') === 'true';
    });
    const { darkMode, setDarkMode } = useDarkMode();
    const { projectId } = useParams();
    const { galaxy, setGalaxy } = useGalaxy();
    const { project, setProject } = useProject();
    const { getProjectById } = useProjects();
    const { getGalacticMetadataById } = useGalacticMetadata();

    useEffect(() => {
        const fetchAndSetProject = async () => {
            if (!projectId) return;
            const data = await getProjectById(projectId);
            setProject(data);
            console.log('Project data:', data);
        };
        fetchAndSetProject();
    }, [getProjectById, projectId, setProject]);

    useEffect(() => {
        const fetchAndSetGalaxy = async () => {
            if (!project?.galaxyId) return;
            const data = await getGalacticMetadataById(
                Number(project.galaxyId)
            );
            setGalaxy(data);
            console.log('Galaxy data:', data);
        };
        fetchAndSetGalaxy();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [project?.galaxyId]);

    function toggleCollapsed() {
        setIsCollapsed((prev) => {
            const newVal = !prev;
            localStorage.setItem('sidebar_collapsed', String(newVal));
            return newVal;
        });
    }

    const sections = [
        {
            title: '',
            items: [
                {
                    to: `/projects/${projectId}/general`,
                    label: 'Dashboard',
                    icon: <LayoutDashboardIcon size={24} />,
                },
            ],
        },
        {
            title: 'Frontend',
            items: [
                {
                    to: `/projects/${projectId}/pages`,
                    label: 'Pages',
                    icon: <FileText size={24} />,
                },
                {
                    to: `/projects/${projectId}/templates`,
                    label: 'Templates',
                    icon: <LayoutTemplate size={24} />,
                },
                {
                    to: `/projects/${projectId}/components`,
                    label: 'Components',
                    icon: <Box size={24} />,
                },
            ],
        },
        {
            title: 'Backend',
            items: [
                {
                    to: `/projects/${projectId}/router`,
                    label: 'Router',
                    icon: <Server size={24} />,
                },
                {
                    to: `/projects/${projectId}/assets`,
                    label: 'Content',
                    icon: <Image size={24} />,
                },
                {
                    to: `/projects/${projectId}/dbschema`,
                    label: 'DB Schema',
                    icon: <Database size={24} />,
                },
            ],
        },
        {
            title: 'Deployment',
            items: [
                {
                    to: `/projects/${projectId}/azure`,
                    label: 'Azure',
                    icon: <ServerCog size={24} />,
                },
                {
                    to: `/projects/${projectId}/octopus`,
                    label: 'Octopus',
                    icon: <Fish size={24} />,
                },
            ],
        },
        {
            title: 'Tools',
            items: [
                {
                    to: `https://github.com/${galaxy?.githubOrg}/${project?.projectName}`,
                    label: 'Repo',
                    icon: <Github size={24} />,
                },
                {
                    to: `/projects/${projectId}/development`,
                    label: 'Development Mode',
                    icon: <HammerIcon size={24} />,
                },
                {
                    to: `vscode://file/${project?.workingDir}`,
                    label: 'VS Code',
                    icon: <Code size={24} />,
                },
            ],
        },
    ];

    return (
        <div
            className={cn(
                'h-full bg-secondary text-black border-r border-gray-300 transition-all duration-300 relative',
                isCollapsed ? 'w-16' : 'w-64'
            )}
        >
            {/* Top bar */}
            <div className="flex items-center justify-between p-4 border-b border-gray-300 text-gray-800">
                {!isCollapsed && (
                    <span className="text-xl font-bold text-gray-700">
                        {project?.projectName}
                    </span>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleCollapsed}
                    className="transition-all duration-200 hover:scale-105"
                >
                    {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
                </Button>
            </div>

            {/* Main nav */}
            <nav className="p-2">
                {sections.map((section) => (
                    <div key={section.title} className="mb-4">
                        {!isCollapsed && (
                            <div className="px-4 py-2 text-sm font-semibold uppercase transition-all duration-200 text-gray-900">
                                {section.title}
                            </div>
                        )}
                        {section.items.map((item) => (
                            <div key={item.to} className="relative group">
                                <NavLink
                                    to={item.to}
                                    target={
                                        item.to.startsWith('https') ||
                                        item.to.startsWith('vscode')
                                            ? '_blank'
                                            : undefined
                                    }
                                    className={({ isActive }) =>
                                        cn(
                                            'flex items-center transition-all duration-200 rounded-sm',
                                            isCollapsed
                                                ? 'justify-center px-0 py-2'
                                                : 'px-4 py-2',
                                            'mx-auto text-gray-500 hover:text-gray-700 hover:bg-gray-200 hover:scale-105',
                                            isActive
                                                ? 'bg-gray-300 font-semibold'
                                                : ''
                                        )
                                    }
                                >
                                    <div className="flex items-center space-x-2">
                                        {item.icon}
                                        {!isCollapsed && (
                                            <span>{item.label}</span>
                                        )}
                                    </div>
                                </NavLink>

                                {/* Tooltip: only show in collapsed mode, on hover */}
                                {isCollapsed && (
                                    <div
                                        className={
                                            'absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-black text-white text-sm rounded-md opacity-0 group-hover:opacity-100 pointer-events-none z-10'
                                        }
                                    >
                                        {item.label}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </nav>

            {/* Bottom nav */}
            <div className="absolute bottom-0 w-full border-t border-gray-300 bg-secondary">
                <div
                    className={cn(
                        'flex items-center py-2 transition-all duration-200',
                        isCollapsed ? 'flex-col space-y-2' : 'justify-around'
                    )}
                >
                    {/* Back to Dashboard */}
                    <NavLink
                        to="/dashboard"
                        className="p-2 hover:bg-gray-200 rounded-md transition-all duration-200 hover:scale-105 text-gray-500 hover:text-gray-700 flex items-center justify-center"
                    >
                        <Undo2Icon size={24} />
                        {/* tooltip in collapsed? */}
                        {isCollapsed && (
                            <div
                                className={
                                    'absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-black text-white text-sm rounded-md opacity-0 group-hover:opacity-100 pointer-events-none z-10'
                                }
                            >
                                Back to Dashboard
                            </div>
                        )}
                    </NavLink>

                    {/* Settings */}
                    <NavLink
                        to={`/projects/${projectId}/settings`}
                        className="p-2 hover:bg-gray-200 rounded-md transition-all duration-200 hover:scale-105 text-gray-500 hover:text-gray-700 flex items-center justify-center relative group"
                    >
                        <Settings size={24} />
                        {isCollapsed && (
                            <div
                                className={
                                    'absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-black text-white text-sm rounded-md opacity-0 group-hover:opacity-100 pointer-events-none z-10'
                                }
                            >
                                Settings
                            </div>
                        )}
                    </NavLink>

                    {/* Dark mode toggle */}
                    <div className="relative group">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="p-2 hover:bg-gray-200 rounded-md transition-all duration-200 hover:scale-105 text-gray-500 hover:text-gray-700 flex items-center justify-center"
                            onClick={() => setDarkMode(!darkMode)}
                        >
                            <Sun size={24} />
                        </Button>
                        {isCollapsed && (
                            <div
                                className={
                                    'absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-black text-white text-sm rounded-md opacity-0 group-hover:opacity-100 pointer-events-none z-10'
                                }
                            >
                                Toggle Dark Mode
                            </div>
                        )}
                    </div>

                    {/* Logout */}
                    <NavLink
                        to="/logout"
                        className="p-2 hover:bg-gray-200 rounded-md transition-all duration-200 hover:scale-105 text-gray-500 hover:text-gray-700 flex items-center justify-center relative group"
                    >
                        <LogOut size={24} color="#ff4f4b" />
                        {isCollapsed && (
                            <div
                                className={
                                    'absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-black text-white text-sm rounded-md opacity-0 group-hover:opacity-100 pointer-events-none z-10'
                                }
                            >
                                Logout
                            </div>
                        )}
                    </NavLink>
                </div>
            </div>
        </div>
    );
}

export { Sidebar };
