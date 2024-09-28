import { useState, useEffect } from 'react';
import api from './api';

type GalacticMetadata = {
    pat: string;
    dir: string;
};

export const useGalaticMetadata = () => {
    const [galaticMetadata, setGalaticMetadata] = useState<GalacticMetadata>();

    useEffect(() => {
        const fetchGalaticMetadata = async () => {
            const response = await api.get('/galatic');
            setGalaticMetadata(response.data);
        };

        fetchGalaticMetadata();
    }, []);

    const updateGalaticMetadata = async (metadata: GalacticMetadata) => {
        const response = await api.put('/galatic', metadata);
        setGalaticMetadata(response.data);
    };

    const createGalaticMetadata = async (metadata: GalacticMetadata) => {
        const response = await api.post('/galatic', metadata);
        setGalaticMetadata(response.data);
    };

    return {
        galaticMetadata,
        updateGalaticMetadata,
        createGalaticMetadata,
    };
};