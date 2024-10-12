// src/hooks/useControllerTest.ts

import { Project } from '@/models';
import { AxiosError, AxiosResponse } from 'axios';
import api from './api';
import { BackendController } from './useBackendController';

export const useControllerTest = (project?: Project | null) => {
    const hitEndpointAndReturnData = async (
        controller?: BackendController | null,
        data?: object,
        params?: string
    ): Promise<{ response?: AxiosResponse; error?: AxiosError }> => {
        if (!project || !controller) {
            return { response: undefined, error: undefined };
        }

        try {
            const response = await api({
                method: controller.method,
                url: `http://127.0.0.1:${project.backendPort}${controller.pathName}`,
                data,
                params
            });
            return { response, error: undefined };
        } catch (e) {
            return { error: e as AxiosError };
        }
    };
    return { hitEndpointAndReturnData };
};
