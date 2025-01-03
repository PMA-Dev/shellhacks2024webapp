import { Button } from '@/components/ui/button';
import { useProject } from '@/context/ProjectContext';
import api from '@/hooks/api';
import { ChevronDown, ChevronUp, Layout, Pause, Play } from 'lucide-react';
import { useEffect, useState } from 'react';
import Draggable from 'react-draggable';

type DevelopmentModePageProps = {
    onToggleSidebar: () => void;
    isSidebarVisible: boolean;
};

export default function DevelopmentModePage({
    onToggleSidebar,
    isSidebarVisible,
}: DevelopmentModePageProps) {
    const { project } = useProject();
    const [isServing, setIsServing] = useState(false);
    const [disableServerButton, setDisableServerButton] = useState(false);
    const [isDocked, setIsDocked] = useState(() => {
        const cachedState = localStorage.getItem('devTrayDocked');
        console.log('cachedState:', cachedState);
        return cachedState !== null ? JSON.parse(cachedState) : true;
    });

    useEffect(() => {
        const cachedSidebarState = localStorage.getItem('sidebarVisible');
        if (cachedSidebarState !== null) {
            const isVisible = JSON.parse(cachedSidebarState);
            if (isVisible !== isSidebarVisible) {
                onToggleSidebar();
            }
        }
    }, [isSidebarVisible, onToggleSidebar]);

    useEffect(() => {
        if (project?.sitePath) {
            checkServerStatus();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [project?.sitePath]);

    const checkServerStatus = async () => {
        try {
            const response = await fetch(`${project?.sitePath}/ping`);
            setIsServing(response.status === 200);
        } catch {
            setIsServing(false);
            resetIframes();
        }
    };

    const resetIframes = () => {
        const iframes = document.querySelectorAll('iframe');
        iframes.forEach((iframe) => {
            // eslint-disable-next-line no-self-assign
            iframe.src = iframe.src;
        });
    };

    const handleToggleDocked = () => {
        setIsDocked((prev) => {
            const newState = !prev;
            localStorage.setItem('devTrayDocked', JSON.stringify(newState));
            return newState;
        });
    };

    useEffect(() => {
        const projectRouterWrapper = document.getElementById(
            'project-router-wrapper'
        );
        if (!isDocked) {
            projectRouterWrapper?.classList.add('!p-0');
        } else {
            projectRouterWrapper?.classList.remove('!p-0');
        }
    }, [isDocked]);

    const handleServer = async (start: boolean) => {
        setDisableServerButton(true);
        if (!project?.id) return;

        if (start) {
            await api.get(`/commands/startVite?projectId=${project.id}`);
            resetIframes();
            setTimeout(() => {
                setIsServing(true);
                setDisableServerButton(false);
            }, 1500);
        } else {
            await api.get(`/commands/stopVite?projectId=${project.id}`);
            setIsServing(false);
            setDisableServerButton(false);
        }
    };

    const handleToggleSidebar = () => {
        localStorage.setItem(
            'sidebarVisible',
            JSON.stringify(!isSidebarVisible)
        );
        onToggleSidebar();
    };

    if (!project) {
        return <div>Loading...</div>;
    }

    return (
        <div className="relative w-full h-full">
            {/* Docked Navbar */}
            {isDocked ? (
                <div className="top-0 left-0 w-full p-4 bg-white shadow-md z-50 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        {/* Start/Stop Server */}
                        {isServing ? (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 p-1 rounded-full bg-red-600 hover:bg-red-700"
                                disabled={disableServerButton}
                                onClick={() => handleServer(false)}
                                title="Stop Dev Server"
                            >
                                <Pause className="w-4 h-4 text-white" />
                            </Button>
                        ) : (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 p-1 rounded-full bg-green-600 hover:bg-green-700"
                                disabled={disableServerButton}
                                onClick={() => handleServer(true)}
                                title="Start Dev Server"
                            >
                                <Play className="w-4 h-4 text-white" />
                            </Button>
                        )}

                        {/* Toggle Sidebar */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleToggleSidebar}
                            className="h-8 w-8 p-1 rounded-full bg-gray-200 hover:bg-gray-300"
                            title={`${isSidebarVisible ? 'Hide' : 'Show'} Sidebar`}
                        >
                            <Layout size={16} />
                        </Button>
                    </div>

                    {/* Undock Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleToggleDocked}
                        className="h-8 w-8 p-1 rounded-full bg-gray-200 hover:bg-gray-300"
                        title="Float Dev Tray"
                    >
                        <ChevronUp size={16} />
                    </Button>
                </div>
            ) : (
                // Floating Dev Tray
                <Draggable handle=".dev-tray-handle">
                    <div className="absolute top-8 right-8 z-50 bg-white shadow-lg rounded-md w-56 p-2 flex flex-col space-y-2 dev-tray-handle">
                        <div className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                            <span className="text-sm font-semibold">
                                Dev Tray
                            </span>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleToggleDocked}
                                className="h-8 w-8 p-1 rounded-full bg-gray-200 hover:bg-gray-300"
                                title="Dock Dev Tray"
                            >
                                <ChevronDown size={16} />
                            </Button>
                        </div>

                        <div className="flex items-center justify-around">
                            {/* Start/Stop Server */}
                            {isServing ? (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 p-1 rounded-full bg-red-600 hover:bg-red-700"
                                    disabled={disableServerButton}
                                    onClick={() => handleServer(false)}
                                    title="Stop Dev Server"
                                >
                                    <Pause className="w-4 h-4 text-white" />
                                </Button>
                            ) : (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 p-1 rounded-full bg-green-600 hover:bg-green-700"
                                    disabled={disableServerButton}
                                    onClick={() => handleServer(true)}
                                    title="Start Dev Server"
                                >
                                    <Play className="w-4 h-4 text-white" />
                                </Button>
                            )}

                            {/* Toggle Sidebar */}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleToggleSidebar}
                                className="h-8 w-8 p-1 rounded-full bg-gray-200 hover:bg-gray-300"
                                title={`${isSidebarVisible ? 'Hide' : 'Show'} Sidebar`}
                            >
                                <Layout size={16} />
                            </Button>
                        </div>
                    </div>
                </Draggable>
            )}

            {/* Main iframe */}
            <div className={`w-full ${isDocked ? 'h-[90vh]' : 'h-full'}`}>
                <iframe
                    src={project.sitePath || ''}
                    title="Development Iframe"
                    style={{
                        width: '100%',
                        height: '100%',
                        border: 'none',
                    }}
                />
            </div>
        </div>
    );
}
