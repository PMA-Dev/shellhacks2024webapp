import { Button } from '@/components/ui/button';
import { useProject } from '@/context/ProjectContext';
import { useDeployments } from '@/hooks/useDeployments';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export const DeploymentsPage = () => {
    const { project } = useProject();
    const { deploy, status, isLoading, fetchStatus } = useDeployments(
        project!.id!
    );
    const [selected, setSelected] = useState<Record<string, boolean>>({
        frontend: false,
        backend: false,
        worker: false,
    });

    useEffect(() => {
        fetchStatus();
    }, []);

    useEffect(() => {
        const interval = setInterval(fetchStatus, 5000);
        return () => clearInterval(interval);
    }, [fetchStatus]);

    const toggleSelection = (service: string) => {
        setSelected((prev) => ({ ...prev, [service]: !prev[service] }));
    };

    const selectAll = () => {
        setSelected({ frontend: true, backend: true, worker: true });
    };

    const deselectAll = () => {
        setSelected({ frontend: false, backend: false, worker: false });
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6">
            <h1 className="text-3xl font-bold mb-6">Deployments</h1>

            <div className="grid grid-cols-3 gap-4 mb-6">
                {['frontend', 'backend', 'worker'].map((service) => (
                    <Button
                        key={service}
                        className={cn(
                            'px-6 py-2 rounded-lg transition-all',
                            selected[service]
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-700'
                        )}
                        onClick={() => toggleSelection(service)}
                    >
                        {service.toUpperCase()}
                    </Button>
                ))}
            </div>

            <div className="flex gap-4 mb-6">
                <Button onClick={selectAll} className="bg-blue-500 text-white">
                    Select All
                </Button>
                <Button
                    onClick={deselectAll}
                    className="bg-gray-500 text-white"
                >
                    Deselect All
                </Button>
            </div>

            <Button
                onClick={() => deploy(selected)}
                disabled={isLoading}
                className="bg-yellow-500 text-black px-6 py-2 rounded-lg"
            >
                {isLoading ? 'Deploying...' : 'Deploy Selected'}
            </Button>

            <div className="mt-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-3">Deployment Status</h2>
                <div className="space-y-2">
                    {Object.entries(status).map(
                        ([service, { url, status }]) => (
                            <a key={url} href={url}>
                                <div
                                    key={service}
                                    className={cn(
                                        'p-3 rounded-lg text-white',
                                        status === 'success'
                                            ? 'bg-green-500'
                                            : status === 'failure'
                                            ? 'bg-red-500'
                                            : 'bg-yellow-500'
                                    )}
                                >
                                    {service.toUpperCase()}: {status}
                                </div>
                            </a>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};
