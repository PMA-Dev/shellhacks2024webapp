import { useCallback, useEffect, useState } from 'react';
import api from './api';

export function useAzureAuth() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refreshAzureCredentials = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            await api.get('/azure/refresh');
        } catch (err) {
            setError('Failed to refresh Azure credentials');
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        refreshAzureCredentials,
        isLoading,
        error,
    };
}

type ResourceGroup = {
    id: string;
    name: string;
    location: string;
};

export function useAzureResourceGroups() {
    const [resourceGroups, setResourceGroups] = useState<ResourceGroup[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchResourceGroups = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const resp = await api.get('/azure/getResourceGroups');
            setResourceGroups(resp.data);
        } catch (err) {
            setError('Failed to get resource groups');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchResourceGroups();
    }, [fetchResourceGroups]);

    return {
        resourceGroups,
        isLoading,
        error,
        fetchResourceGroups,
    };
}

type Resource = {
    id: string;
    name: string;
    type: string;
    location: string;
};

export function useAzureResources(rgName?: string) {
    const [resources, setResources] = useState<Resource[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchResources = useCallback(async () => {
        if (!rgName) return;
        setIsLoading(true);
        setError(null);
        try {
            const resp = await api.get('/azure/getResourcesInGroup', {
                params: { rgName },
            });
            setResources(resp.data);
        } catch (err) {
            setError('Failed to get resources');
        } finally {
            setIsLoading(false);
        }
    }, [rgName]);

    useEffect(() => {
        if (rgName) {
            fetchResources();
        }
    }, [rgName, fetchResources]);

    return {
        resources,
        isLoading,
        error,
        fetchResources,
    };
}

export function useAzureTerraform(projectId: number) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [ghActionLink, setGhActionLink] = useState<string | null>(null);

    const createAndDeploy = useCallback(
        async (adminPassword?: string) => {
            setIsProcessing(true);
            setError(null);
            setGhActionLink(null);
            try {
                const response = await api.get('/azure/create', {
                    params: { projectId, admin_password: adminPassword },
                });

                if (response.data?.ghActionLink) {
                    setGhActionLink(response.data.ghActionLink);
                }
            } catch (err) {
                setError('Failed to create resources');
            } finally {
                setIsProcessing(false);
            }
        },
        [projectId]
    );

    const destroyResources = useCallback(
        async (adminPassword?: string) => {
            setIsProcessing(true);
            setError(null);
            try {
                await api.get('/azure/destroy', {
                    params: { projectId, admin_password: adminPassword },
                });
            } catch (err) {
                setError('Failed to destroy resources');
            } finally {
                setIsProcessing(false);
            }
        },
        [projectId]
    );

    return {
        createAndDeploy,
        destroyResources,
        isProcessing,
        error,
        ghActionLink,
    };
}

export function useDeployToVm(projectId: number) {
    const [isDeploying, setIsDeploying] = useState(false);
    const [actionUrl, setActionUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const deployToVm = useCallback(async () => {
        setIsDeploying(true);
        setError(null);
        setActionUrl(null);
        try {
            const response = await api.get('/azure/deployUsingAction', {
                params: { projectId },
            });
            setActionUrl(response.data.actionUrl);
        } catch (err) {
            setError('Failed to deploy to VM');
        } finally {
            setIsDeploying(false);
        }
    }, [projectId]);

    return {
        deployToVm,
        isDeploying,
        actionUrl,
        error,
    };
}
