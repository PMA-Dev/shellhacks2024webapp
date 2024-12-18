import { useCallback, useEffect, useState } from 'react';
import api from './api';

export const useFetchGhPat = (galacticId?: string) => {
    const [ghPat, setGhPat] = useState<string>();

    const fetchGhPat = useCallback(async () => {
        console.log(`Fetching GitHub PATs, galacticId is: ${galacticId}`);
        if (!galacticId) {
            return;
        }
        try {
            const response = await api.get(
                `/commands/getGhPat`,
                { params: { id: galacticId } }
            );
            setGhPat(response.data);
            console.log(`Fetched GitHub PATs: ${response.data}`);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch GitHub PATs:', error);
        }
    }, [galacticId]);

    useEffect(() => {
        fetchGhPat();
    }, [fetchGhPat]);

    return {
        data: ghPat,
        refetch: fetchGhPat,
        fetch: fetchGhPat,
    };
};
