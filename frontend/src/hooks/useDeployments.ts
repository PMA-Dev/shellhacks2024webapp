import { useCallback, useState } from 'react';
import api from './api';

export const useDeployments = (projectId: string) => {
    type DeploymentStatusData = {url: string, status: string};
    const [status, setStatus] = useState<Record<string, DeploymentStatusData>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const deploy = useCallback(async (services: Record<string, boolean>) => {
        const selected = Object.keys(services).filter((key) => services[key]);
        if (selected.length === 0) return;

        setIsLoading(true);
        setError(null);
        try {
            await Promise.all(
                selected.map((service) =>
                    api.get('/deployment/deployByName', {
                        params: { projectId, service },
                    })
                )
            );
        } catch (err) {
            setError('Failed to trigger deployment');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchStatus = useCallback(async () => {
        try {
            const response = await api.get('/deployment/getLatestStatus', {
                params: { projectId },
            });
            setStatus(response.data);
        } catch (err) {
            console.error('Failed to fetch deployment status');
        }
    }, []);

    return {
        deploy,
        fetchStatus,
        status,
        isLoading,
        error,
    };
};
