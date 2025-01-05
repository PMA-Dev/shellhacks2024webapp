import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useProject } from '@/context/ProjectContext';
import {
    useAzureAuth,
    useAzureResourceGroups,
    useAzureResources,
    useAzureTerraform,
    useDeployToVm,
} from '@/hooks/useAzure';
import * as React from 'react';
import ClipLoader from 'react-spinners/ClipLoader';

export const AzurePage = () => {
    const { project } = useProject();
    const projectName = project?.projectName;
    const rgName = `${projectName}-rg`;
    const projectId = project?.id;

    const { refreshAzureCredentials } = useAzureAuth();
    const { resourceGroups, fetchResourceGroups } = useAzureResourceGroups();
    const {
        resources,
        fetchResources,
        isLoading: isLoadingResources,
    } = useAzureResources(rgName);
    const { createAndDeploy, destroyResources, isProcessing } =
        useAzureTerraform(Number(projectId!));
    const { deployToVm, isDeploying } = useDeployToVm(Number(projectId!));

    const existingRG = resourceGroups.find((rg) => rg.name === rgName);

    const handleCreateDeploy = React.useCallback(async () => {
        try {
            await createAndDeploy('Secret123');
            await fetchResourceGroups();
            await fetchResources();
        } catch (err) {
            console.error('Error creating resources:', err);
        }
    }, [createAndDeploy, fetchResourceGroups, fetchResources]);

    const handleDelete = React.useCallback(async () => {
        try {
            await destroyResources('Secret123');
            await fetchResourceGroups();
        } catch (err) {
            console.error('Error deleting resources:', err);
        }
    }, [destroyResources, fetchResourceGroups]);

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow p-6 space-y-4">
                <h1 className="text-xl font-semibold">
                    Azure Resource Management
                </h1>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={refreshAzureCredentials}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md"
                    >
                        Connect or Refresh Azure Credentials
                    </button>
                    {!existingRG && (
                        <button
                            onClick={handleCreateDeploy}
                            className="px-4 py-2 bg-green-600 text-white rounded-md"
                            disabled={isProcessing}
                        >
                            {isProcessing ? (
                                <div className="flex items-center justify-center">
                                    <ClipLoader size={20} color="#fff" />
                                </div>
                            ) : (
                                'Create and Deploy'
                            )}
                        </button>
                    )}
                </div>
            </div>

            {existingRG && (
                <div className="bg-white rounded-xl shadow p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-medium">
                            {rgName} Resources
                        </h2>
                        <button
                            onClick={fetchResources}
                            className="px-4 py-2 bg-gray-500 text-white rounded-md"
                            disabled={isProcessing || isLoadingResources}
                        >
                            {isLoadingResources ? (
                                <div className="flex items-center justify-center">
                                    <ClipLoader size={20} color="#fff" />
                                </div>
                            ) : (
                                'Refresh Resources'
                            )}
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {resources?.map((resource) => (
                            <Card key={resource.id}>
                                <CardHeader>
                                    <CardTitle>{resource.name}</CardTitle>
                                    <CardDescription>
                                        {resource.type}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <a
                                        href={`https://portal.azure.com/#@/resource${resource.id}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="underline text-blue-600"
                                    >
                                        Open in Azure
                                    </a>
                                </CardContent>
                                <CardFooter>{resource.location}</CardFooter>
                            </Card>
                        ))}
                    </div>
                    {resources?.length > 0 && (
                        <div className="flex justify-end">
                            <button
                                onClick={deployToVm}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md"
                                disabled={isDeploying}
                            >
                                {isDeploying ? (
                                    <div className="flex items-center justify-center">
                                        <ClipLoader size={20} color="#fff" />
                                    </div>
                                ) : (
                                    'Deploy to VM'
                                )}
                            </button>
                        </div>
                    )}
                    <div className="flex justify-end mt-4">
                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 bg-red-600 text-white rounded-md"
                            disabled={isProcessing}
                        >
                            {isProcessing ? (
                                <div className="flex items-center justify-center">
                                    <ClipLoader size={20} color="#fff" />
                                </div>
                            ) : (
                                'Delete Resources'
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
