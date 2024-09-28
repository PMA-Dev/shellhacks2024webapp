import { useState, useEffect } from 'react';
import { Page } from '@/models';
import api from './api';

export const usePages = () => {
    const [pages, setPages] = useState<Page[]>([]);

    useEffect(() => {
        const fetchPages = async () => {
            const response = await api.get('/pages');
            setPages(response.data);
        };

        fetchPages();
    }, []);

    const addPage = async (page: Page) => {
        const response = await api.post('/pages', page);
        setPages([...pages, response.data]);
    };

    const updatePage = async (page: Page) => {
        const response = await api.put(`/pages/${page.id}`, page);
        setPages(pages.map((p) => (p.id === page.id ? response.data : p)));
    };

    const deletePage = async (pageId: string) => {
        await api.delete(`/pages/${pageId}`);
        setPages(pages.filter((p) => p.id !== pageId));
    };

    return {
        pages,
        addPage,
        updatePage,
        deletePage,
    };
};