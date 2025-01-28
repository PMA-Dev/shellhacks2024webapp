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
        isFetchingWorker,
        error,
        getFrontendLogs,
        getBackendLogs,
        getWorkerLogs,
    } = useLogs(Number(project?.id));

    const [activeTab, setActiveTab] = useState<
        'frontend' | 'backend' | 'worker'
    >('frontend');
    const [lastUpdated, setLastUpdated] = useState<Record<string, Date | null>>(
        {
            frontend: null,
            backend: null,
            worker: null,
        }
    );

    const logsRef = useRef<HTMLDivElement>(null);

    const handleRefresh = async (type: 'frontend' | 'backend' | 'worker') => {
        if (type === 'frontend') await getFrontendLogs();
        if (type === 'backend') await getBackendLogs();
        if (type === 'worker') await getWorkerLogs();

        setLastUpdated((prev) => ({
            ...prev,
            [type]: new Date(),
        }));

        logsRef.current?.scrollTo({
            top: logsRef.current.scrollHeight,
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
        <div className="flex flex-col items-center w-full h-full">
            {/* Toggle Buttons */}
            <div className="flex space-x-4 mb-4">
                {['frontend', 'backend', 'worker'].map((type) => (
                    <Button
                        key={type}
                        onClick={() =>
                            setActiveTab(
                                type as 'frontend' | 'backend' | 'worker'
                            )
                        }
                        className={`px-4 py-2 rounded-md ${
                            activeTab === type
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700'
                        }`}
                    >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Button>
                ))}
            </div>

            {/* Logs Display */}
            <div className="flex flex-col w-full max-w-7xl">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">
                        {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}{' '}
                        Logs
                    </h3>
                    <div className="flex items-center space-x-2">
                        <Button
                            onClick={() => handleRefresh(activeTab)}
                            disabled={
                                (activeTab === 'frontend' &&
                                    isFetchingFrontend) ||
                                (activeTab === 'backend' &&
                                    isFetchingBackend) ||
                                (activeTab === 'worker' && isFetchingWorker)
                            }
                            className="px-4 py-2 bg-blue-500 text-white rounded-md"
                        >
                            {activeTab === 'frontend' && isFetchingFrontend
                                ? 'Refreshing...'
                                : activeTab === 'backend' && isFetchingBackend
                                ? 'Refreshing...'
                                : activeTab === 'worker' && isFetchingWorker
                                ? 'Refreshing...'
                                : `Refresh ${
                                      activeTab.charAt(0).toUpperCase() +
                                      activeTab.slice(1)
                                  }`}
                        </Button>
                        <span className="text-gray-500 text-sm">
                            Last Updated: {formatDate(lastUpdated[activeTab])}
                        </span>
                    </div>
                </div>
                <div
                    ref={logsRef}
                    className="h-[80vh] border rounded-md p-4 overflow-y-auto bg-gray-50 shadow-md whitespace-pre-wrap text-wrap"
                >
                    {logData[activeTab] ? (
                        <pre style={{whiteSpace: "pre-wrap"}}>{logData[activeTab]}</pre>
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
