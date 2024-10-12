// src/hooks/useBackendRoutes.ts

import { useCallback, useEffect, useState } from 'react';
import api from './api';

export interface BackendRoute {
    id?: string;
    lastUpdated?: string;
    fileName?: string;
    physicalPath?: string;
    routeName?: string;
    controllerIds?: number[];
    projectId?: string;
    middleWares?: object;
}

export const useBackendRoutes = (projectId?: string) => {
    const [routes, setRoutes] = useState<BackendRoute[]>([]);

    const fetchRoutes = useCallback(async () => {
        const response = await api.get('/metadata/all/route');
        response.data = response.data.filter(
            (route: BackendRoute) => route.projectId === projectId
        );
        console.log(`data from route fetch is: ${response.data}`);
        setRoutes(response.data);
    }, [projectId]);

    const fetchRoute = useCallback(async (routeId?: string) => {
        if (!routeId) {
            return;
        }
        const response = await api.get(`/metadata/get/route?id=${routeId}`);
        console.log(`data from route fetch single is: ${response.data}`);
        return response.data;
    }, []);

    useEffect(() => {
        fetchRoutes();
    }, [fetchRoutes]);

    const addRoute = async (route: BackendRoute) => {
        await api.post(`/metadata/post/route?projectId=${projectId}`, route);
        await fetchRoutes();
    };

    const updateRoute = (updatedRoute: BackendRoute) => {
        // TODO: Integrate with backend to update the route
        throw new Error('UnimplementedError: have not implemented updateRoute');
        setRoutes(
            routes.map((route) =>
                route.id === updatedRoute.id ? updatedRoute : route
            )
        );
    };

    const deleteRoute = (routeId: string) => {
        // TODO: Integrate with backend to delete the route
        throw new Error('UnimplementedError: have not implemented deleteRoute');
        setRoutes(routes.filter((route) => route.id !== routeId));
    };

    return {
        routes,
        fetchRoute,
        fetchRoutes,
        addRoute,
        updateRoute,
        deleteRoute,
    };
};
