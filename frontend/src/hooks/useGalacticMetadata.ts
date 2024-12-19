import { GalacticMetadata } from '@/models';
import { useEffect, useState } from 'react';
import api from './api';

export const useGalacticMetadata = () => {
    const [galacticMetadata, setGalacticMetadata] =
        useState<GalacticMetadata>();

    useEffect(() => {
        const fetchGalacticMetadata = async () => {
            const response = await api.get('/metadata/get/galactic');
            setGalacticMetadata(response.data);
        };

        fetchGalacticMetadata();
    }, []);

    const updateGalacticMetadata = async (metadata: GalacticMetadata) => {
        const response = await api.patch(
            `/metadata/patch/galactic?id=${metadata.id}`,
            metadata
        );
        setGalacticMetadata(response.data);
    };

    const createGalacticMetadata = async (metadata: GalacticMetadata) => {
        const response = await api.post('/metadata/post/galactic', metadata);
        setGalacticMetadata(response.data);
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
        galacticMetadata,
        updateGalacticMetadata,
        createGalacticMetadata,
        getAllGalacticMetadata,
        getGalacticMetadataById,
    };
};
