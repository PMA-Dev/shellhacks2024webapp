// src/hooks/usePages.ts

import { Page } from '@/models';
import { useEffect, useState } from 'react';
import api from './api';

export const usePages = (projectId: string) => {
    const [pages, setPages] = useState<Page[]>([]);

    const fetchPages = async () => {
        const response = await api.get('/metadata/all/page');
        // filter out pages that don't belong to the current project
        response.data = response.data.filter(
            (page: Page) => page.projectId === projectId
        );
        setPages(response.data);
    };

    useEffect(() => {
        fetchPages();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const addPage = async (page: Page) => {
        await api.post(`/metadata/post/page?projectId=${page.projectId}`, page);
        await fetchPages();
    };

    const updatePage = async (page: Page) => {
        const response = await api.patch(
            `/metadata/patch/page?id=${page.id}`,
            page
        );
        setPages(pages.map((p) => (p.id === page.id ? response.data : p)));
    };

    const deletePage = async (pageId: string) => {
        await api.delete(`/metadata/delete/page?id=${pageId}`);
        await fetchPages();
    };

    const getPageById = async (pageId: string) => {
        const response = await api.get(`/metadata/get/page?id=${pageId}`);
        return response.data;
    };

    return {
        pages,
        addPage,
        updatePage,
        deletePage,
        getPageById,
    };
};
