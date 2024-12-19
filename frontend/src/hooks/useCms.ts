import { useCallback, useEffect, useState } from 'react';
import api from './api';

interface Video {
    id: number;
    title: string;
    url: string;
}

export const useCms = () => {
    const [videos, setVideos] = useState<Video[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchVideos = useCallback(async () => {
        console.log('Fetching videos...');
        setIsLoading(true);
        setError(null);

        try {
            const response = await api.get('/content/getAll');
            console.log('Fetched videos:', response.data);
            setVideos(response.data);
        } catch (err) {
            console.error('Error fetching videos:', err);
            setError('Failed to fetch videos');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const uploadVideo = useCallback(
        async (file: File) => {
            console.log('Uploading video...');
            const formData = new FormData();
            formData.append('file', file);

            setIsLoading(true);
            setError(null);

            try {
                const response = await api.post('/content/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                console.log('Video uploaded:', response.data);
                await fetchVideos(); // Refresh videos after upload
            } catch (err) {
                console.error('Error uploading video:', err);
                setError('Failed to upload video');
            } finally {
                setIsLoading(false);
            }
        },
        [fetchVideos]
    );

    useEffect(() => {
        fetchVideos();
    }, [fetchVideos]);

    return {
        videos,
        isLoading,
        error,
        fetchVideos,
        uploadVideo,
    };
};
