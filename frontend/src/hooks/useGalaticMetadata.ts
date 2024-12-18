import { GalacticMetadata } from '@/models';
import { useEffect, useState } from 'react';
import api from './api';

export const useGalaticMetadata = () => {
    const [galaticMetadata, setGalaticMetadata] = useState<GalacticMetadata>();

    useEffect(() => {
        const fetchGalaticMetadata = async () => {
            const response = await api.get('/metadata/get/galactic');
            setGalaticMetadata(response.data);
        };

        fetchGalaticMetadata();
    }, []);

    const updateGalaticMetadata = async (metadata: GalacticMetadata) => {
        const response = await api.patch(`/metadata/patch/galactic?id=${metadata.id}`, metadata);
        setGalaticMetadata(response.data);
    };

    const createGalaticMetadata = async (metadata: GalacticMetadata) => {
        const response = await api.post('/metadata/post/galactic', metadata);
        setGalaticMetadata(response.data);
    };

    const getAllGalacticMetadata = async (): Promise<GalacticMetadata[]> => {
        const response = await api.get('/metadata/all/galactic');
        const values = response.data.sort(
            (a: GalacticMetadata, b: GalacticMetadata) =>
                new Date(b.lastUpdated!).getTime() -
                new Date(a.lastUpdated!).getTime()
        );
        return values;
    };

    const getGalacticMetadataById = async (
        id: number
    ): Promise<GalacticMetadata> => {
        const response = await api.get('/metadata/get/galactic?id=' + id);
        return response.data;
    };

    return {
        galaticMetadata,
        updateGalaticMetadata,
        createGalaticMetadata,
        getAllGalacticMetadata,
        getGalacticMetadataById,
    };
};
