import { useCallback, useState } from 'react';
import api from './api';

type LogData = {
    frontend: string | null;
    backend: string | null;
    worker: string | null;
};

export function useLogs(projectId: number) {
    const [logData, setLogData] = useState<LogData>({
        frontend: null,
        backend: null,
        worker: null,
    });
    const [isFetchingFrontend, setIsFetchingFrontend] = useState(false);
    const [isFetchingBackend, setIsFetchingBackend] = useState(false);
    const [isFetchingWorker, setIsFetchingWorker] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getFrontendLogs = useCallback(async () => {
        setIsFetchingFrontend(true);
        setError(null);

        try {
            const response = await api.get('/ssh/getLogs', {
                params: { projectId, logType: 'frontend' },
            });
            setLogData((prev) => ({ ...prev, frontend: response.data.log }));
        } catch (err) {
            setError('Failed to fetch frontend logs');
        } finally {
            setIsFetchingFrontend(false);
        }
    }, [projectId]);

    const getWorkerLogs = useCallback(async () => {
        setIsFetchingWorker(true);
        setError(null);

        try {
            const response = await api.get('/ssh/getLogs', {
                params: { projectId, logType: 'worker' },
            });
            setLogData((prev) => ({ ...prev, worker: response.data.log }));
        } catch (err) {
            setError('Failed to fetch worker logs');
        } finally {
            setIsFetchingWorker(false);
        }
    }, [projectId]);

    const getBackendLogs = useCallback(async () => {
        setIsFetchingBackend(true);
        setError(null);

        try {
            const response = await api.get('/ssh/getLogs', {
                params: { projectId, logType: 'backend' },
            });
            setLogData((prev) => ({ ...prev, backend: response.data.log }));
        } catch (err) {
            setError('Failed to fetch backend logs');
        } finally {
            setIsFetchingBackend(false);
        }
    }, [projectId]);

    return {
        logData,
        isFetchingFrontend,
        isFetchingBackend,
        isFetchingWorker,
        error,
        getFrontendLogs,
        getBackendLogs,
        getWorkerLogs,
    };
}
