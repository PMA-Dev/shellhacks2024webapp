import { useEffect, useState } from 'react';
import api from './api';

export const useTemplates = () => {
    const [templates, setTemplates] = useState([]);
    const fetchTemplates = async () => {
        const response = await api.get('/metadata/all/template');
        setTemplates(response.data);
    };
    useEffect(() => {
        fetchTemplates();
        console.log('templates:', templates);
    });

    return {
        templates,
    };
};
