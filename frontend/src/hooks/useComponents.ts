import { Component } from '@/models';
import { useEffect, useState } from 'react';
import api from './api';

export const useComponents = () => {
    const [components, setComponents] = useState<Component[]>([]);

    const fetchComponents = async () => {
        setComponents([
            {
                id: '1',
                componentName: 'Landing Page',
                componentIds: [1, 2, 3],
            },
            {
                id: '2',
                componentName: 'Blog',
                componentIds: [4, 5, 6],
            },
        ]);
    };

    useEffect(() => {
        fetchComponents();
    }, []);

    const addComponent = async (component: Component) => {
        await api.post('/metadata/post/component', component);
        await fetchComponents();
    };

    const updateComponent = async (component: Component) => {
        const response = await api.patch(
            `/metadata/patch/component?id=${component.id}`,
            component
        );
        setComponents(
            components.map((p) => (p.id === component.id ? response.data : p))
        );
    };

    const getComponentById = async (componentId: string) => {
        const response = await api.get(
            `/metadata/get/component?id=${componentId}`
        );
        return response.data;
    };

    return {
        components,
        addComponent,
        updateComponent,
        getComponentById,
    };
};
