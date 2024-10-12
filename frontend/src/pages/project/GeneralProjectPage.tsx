// src/pages/project/GeneralProjectPage.tsx

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import api from '@/hooks/api.ts';
import { usePages } from '@/hooks/usePages';
import { Copy, ExternalLink, Pause, Play } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useProject } from '../../context/ProjectContext.tsx';

function GeneralProjectPage() {
    const {project }= useProject();
    const { pages } = usePages(project?.id || '');
    const [isServing, setIsServing] = useState(false);
    const [disableServerButton, setDisableServerButton] = useState(false);

    const handleCopyUrl = () => {
        if (project?.sitePath) {
            navigator.clipboard.writeText(project.sitePath);
            toast('Copied to clipboard!');
        }
    };

    useEffect(() => {
        // ping the server to see if it's running
        console.log('pinging server...');
        const pingServer = async () => {
            const response = await fetch(`${project?.sitePath}/ping`);
            if (response.status === 200) {
                setIsServing(true);
            } else {
                resetIframes();
            }
        };
        pingServer();
    }, [project]);

    async function resetIframes() {
        // get all iframes
        console.log('resetting iframes...');
        const iframes = document.querySelectorAll('iframe');

        iframes.forEach((iframe) => {
            console.log('resetting iframe...', iframe);
            // eslint-disable-next-line no-self-assign
            iframe.src = iframe.src;
        });
    }

    if (!project) {
        return <div>Loading...</div>;
    }

    async function handleServer(desiredServerState: boolean) {
        setDisableServerButton(true);
        if (desiredServerState) {
            // start the server
            api.get(`/commands/startVite?projectId=${project?.id}`);
            resetIframes();
            // wait 2 seconds
            setTimeout(() => {
                console.log('resetting iframes...');
                resetIframes();
            }, 1500);

            setIsServing(true);
        } else {
            // stop the server
            api.get(`/commands/stopVite?projectId=${project?.id}`);
            setIsServing(false);
        }
        setDisableServerButton(false);
    }

    return (
        <div className="pt-12 flex flex-row items-start justify-between">
            {/* Left Pane: Live Site */}
            <div className=" w-1/2 h-full ">
                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold pb-5">Your Live Site</h1>
                    <div className="min-h-[60vh] h-full w-full border-2 border-gray-100 pt-2 rounded-xl shadow-lg relative">
                        <iframe
                            id="main-iframe"
                            src={project.sitePath}
                            title="Live Site"
                            style={{
                                width: '100%',
                                height: '100%',
                                border: 'none',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                borderRadius: 'inherit',
                                paddingTop: '0px',
                            }}
                        ></iframe>
                    </div>
                </div>
            </div>

            {/* Right Pane */}
            <div className="w-1/2 pl-8">
                {/* URL Input and View Site Button */}
                <div className="flex flex-row items-center mb-4">
                    {/* Start and stop button that toggles the serving of the site */}
                    <div className="relative">
                        {isServing ? (
                            <Button
                                id="stop-server"
                                disabled={disableServerButton}
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 p-1 rounded-full bg-red-600 hover:bg-red-700 mr-2 ${disableServerButton ? 'opacity-50' : ''"
                                onClick={() => handleServer(false)}
                            >
                                <Pause
                                    className="w-4 h-4"
                                    fill="white"
                                    stroke="white"
                                />
                            </Button>
                        ) : (
                            <Button
                                id="start-server"
                                disabled={disableServerButton}
                                variant="ghost"
                                size="icon"
                                className={`h-8 w-8 p-1 rounded-full bg-green-600 hover:bg-green-700 mr-2 ${disableServerButton ? 'opacity-50' : ''}`}
                                onClick={() => handleServer(true)}
                            >
                                <Play
                                    className="w-4 h-4"
                                    stroke="white"
                                    fill="white"
                                />
                            </Button>
                        )}
                    </div>

                    {/* Uneditable Text Input with Copy Button */}
                    <div className="flex-1 relative">
                        <Input
                            readOnly
                            value={project.sitePath || ''}
                            className="pr-12"
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full"
                            onClick={handleCopyUrl}
                        >
                            <Copy className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* View Site Button */}
                    <a href={project.sitePath} target="_blank" rel="noreferrer">
                        <Button className="ml-4 flex flex-row items-center">
                            View Site
                            <ExternalLink className="ml-2" />
                        </Button>
                    </a>
                </div>

                {/* Grid of Page Iframes */}
                <div className="grid grid-cols-1 gap-4 mt-4" id="iframe-list">
                    {pages && pages.length > 0 ? (
                        pages.map((page) => (
                            <div
                                key={page.id}
                                className="border rounded-lg overflow-hidden"
                            >
                                <div className="bg-gray-200 p-2 flex justify-between items-center">
                                    <span>{page.pageName}</span>
                                    <a
                                        href={`${project.sitePath}${page.routerPath}`}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                </div>
                                <div className="h-full min-h-[55vh] w-full">
                                    <iframe
                                        src={`${project.sitePath}${page.routerPath}`}
                                        title={page.pageName}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            border: 'none',
                                        }}
                                    ></iframe>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No pages available.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default GeneralProjectPage;
