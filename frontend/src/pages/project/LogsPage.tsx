import { Button } from '@/components/ui/button';
import { useProject } from '@/context/ProjectContext';
import { useLogs } from '@/hooks/useLogs';
import { useRef, useState } from 'react';

export const LogsPage = () => {
    const { project } = useProject();
    const {
        logData,
        isFetchingFrontend,
        isFetchingBackend,
        error,
        getFrontendLogs,
        getBackendLogs,
    } = useLogs(Number(project?.id));

    const [lastUpdatedFrontend, setLastUpdatedFrontend] = useState<Date | null>(
        null
    );
    const [lastUpdatedBackend, setLastUpdatedBackend] = useState<Date | null>(
        null
    );

    const frontendLogsRef = useRef<HTMLDivElement>(null);
    const backendLogsRef = useRef<HTMLDivElement>(null);

    const handleFrontendRefresh = async () => {
        await getFrontendLogs();
        setLastUpdatedFrontend(new Date());
        frontendLogsRef.current?.scrollTo({
            top: frontendLogsRef.current.scrollHeight,
            behavior: 'smooth',
        });
    };

    const handleBackendRefresh = async () => {
        await getBackendLogs();
        setLastUpdatedBackend(new Date());
        backendLogsRef.current?.scrollTo({
            top: backendLogsRef.current.scrollHeight,
            behavior: 'smooth',
        });
    };

    const formatDate = (date: Date | null) =>
        date
            ? date.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
              })
            : 'N/A';

    return (
        <div className="flex flex-row space-x-4 mx-auto max-w-1xl h-full">
            {/* Frontend Logs */}
            <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">Frontend Logs</h3>
                    <div className="flex items-center space-x-2">
                        <Button
                            onClick={handleFrontendRefresh}
                            disabled={isFetchingFrontend}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md"
                        >
                            {isFetchingFrontend
                                ? 'Refreshing...'
                                : 'Refresh Frontend'}
                        </Button>
                        <span className="text-gray-500 text-sm">
                            Last Updated: {formatDate(lastUpdatedFrontend)}
                        </span>
                    </div>
                </div>
                <div
                    ref={frontendLogsRef}
                    className="h-[80vh] border rounded-md p-4 overflow-y-auto bg-gray-50 shadow-md whitespace-pre-wrap break-words"
                >
                    {logData.frontend ? (
                        <pre>{logData.frontend}</pre>
                    ) : (
                        <p>No logs available</p>
                    )}
                </div>
            </div>

            {/* Backend Logs */}
            <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">Backend Logs</h3>
                    <div className="flex items-center space-x-2">
                        <Button
                            onClick={handleBackendRefresh}
                            disabled={isFetchingBackend}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md"
                        >
                            {isFetchingBackend
                                ? 'Refreshing...'
                                : 'Refresh Backend'}
                        </Button>
                        <span className="text-gray-500 text-sm">
                            Last Updated: {formatDate(lastUpdatedBackend)}
                        </span>
                    </div>
                </div>
                <div
                    ref={backendLogsRef}
                    className="h-[80vh] border rounded-md p-4 overflow-y-auto bg-gray-50 shadow-md whitespace-pre-wrap break-words"
                >
                    {logData.backend ? (
                        <pre>{logData.backend}</pre>
                    ) : (
                        <p>No logs available</p>
                    )}
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="absolute bottom-4 w-full bg-red-100 text-red-700 p-2 rounded-md">
                    {error}
                </div>
            )}
        </div>
    );
};
