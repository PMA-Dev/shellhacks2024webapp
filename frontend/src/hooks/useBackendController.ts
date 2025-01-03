import HTTPMethod from 'http-method-enum';
import { useCallback, useEffect, useState } from 'react';
import api from './api';

export interface BackendController {
    method?: HTTPMethod;
    pathName?: string;
    injectedCode?: string;
    dataSourceId?: number;
    id?: string;
    routeId?: string;
    samplePayload?: string;
    sampleQueryParams?: string;
    basePath?: string;
}

export const useBackendControllers = (routeId?: string) => {
    const [controllers, setControllers] = useState<BackendController[]>([]);

    const fetchControllers = useCallback(async () => {
        console.log(`in fetch controller, routeid is: ${routeId}`);
        if (!routeId) {
            return;
        }
        const response = await api.get('/metadata/all/controller');
        response.data = response.data.filter(
            (controller: BackendController) => controller.routeId === routeId
        );
        setControllers(response.data);
    }, [routeId]);

    useEffect(() => {
        fetchControllers();
    }, [fetchControllers]);

    const addController = useCallback(
        async (controller: BackendController, projectId?: string) => {
            if (!projectId) {
                return;
            }
            const response = await api.post(
                `/metadata/post/controller?projectId=${projectId}&routeId=${routeId}`,
                controller
            );
            fetchControllers();
            return response.data.id;
        },
        [fetchControllers, routeId]
    );

    const updateController = (updatedController: BackendController) => {
        // TODO: Integrate with backend to update the controller
        throw new Error(
            'UnimplementedError: have not implemented updateController'
        );
        setControllers(
            controllers.map((controller) =>
                controller.id === updatedController.id
                    ? updatedController
                    : controller
            )
        );
    };

    const deleteController = (controllerId: string) => {
        // TODO: Integrate with backend to delete the controller
        throw new Error(
            'UnimplementedError: have not implemented deleteController'
        );
        setControllers(
            controllers.filter((controller) => controller.id !== controllerId)
        );
    };

    return {
        controllers,
        addController,
        updateController,
        deleteController,
    };
};
