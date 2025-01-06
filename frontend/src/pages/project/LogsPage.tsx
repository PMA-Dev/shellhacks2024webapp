import { Button } from '@/components/ui/button';
import { useProject } from '@/context/ProjectContext';
import { useLogs } from '@/hooks/useLogs';

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

    return (
        <div className="flex flex-row space-x-4 h-full">
            {/* Frontend Logs */}
            <div className="w-1/2 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">Frontend Logs</h3>
                    <Button
                        onClick={getFrontendLogs}
                        disabled={isFetchingFrontend}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md"
                    >
                        {isFetchingFrontend
                            ? 'Refreshing...'
                            : 'Refresh Frontend'}
                    </Button>
                </div>
                <div className="h-full border rounded-md p-4 overflow-y-auto bg-gray-50 shadow-md">
                    {logData.frontend ? (
                        <pre>{logData.frontend}</pre>
                    ) : (
                        <p>No logs available</p>
                    )}
                </div>
            </div>

            {/* Backend Logs */}
            <div className="w-1/2 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">Backend Logs</h3>
                    <Button
                        onClick={getBackendLogs}
                        disabled={isFetchingBackend}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md"
                    >
                        {isFetchingBackend
                            ? 'Refreshing...'
                            : 'Refresh Backend'}
                    </Button>
                </div>
                <div className="h-full border rounded-md p-4 overflow-y-auto bg-gray-50 shadow-md">
                    {logData.backend ? (
                        <pre>{logData.backend}</pre>
                    ) : (
                        <p>No logs available</p>
                    )}
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="w-full bg-red-100 text-red-700 p-2 rounded-md mt-4">
                    {error}
                </div>
            )}
        </div>
    );
};
