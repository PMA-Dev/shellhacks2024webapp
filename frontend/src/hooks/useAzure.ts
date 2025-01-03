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
