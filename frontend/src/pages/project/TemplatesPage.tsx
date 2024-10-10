// src/pages/project/TemplatesPage.tsx

import api from '@/hooks/api';
import { useState, useEffect } from 'react';
import { TemplateMetadata } from '../../../../cli/models';

function TemplatesPage() {
    const [templates, setTemplates] = useState<TemplateMetadata[]>([]);

    useEffect(() => {
        async function fetchTemplates() {
            const response = await api.get('/metadata/all/template');
            console.log('fetched templates:', response.data);
            setTemplates(response.data);
        }
        fetchTemplates();
    }, []);
    return (
        <div>
            <h2 className="mb-4 text-2xl font-bold">Templates</h2>
            <div className="mt-4 space-y-2">
                {templates && templates.length > 0 ? (
                    <div className="mt-4 space-y-2">
                        {templates.map((template) => (
                            <div
                                key={template.id}
                                className="p-2 bg-gray-100 rounded"
                            >
                                {template.templateName} ({template.templateType}
                                )
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="mt-4">No templates created yet.</p>
                )}
            </div>
        </div>
    );
}

export default TemplatesPage;
