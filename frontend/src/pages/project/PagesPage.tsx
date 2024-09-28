// src/pages/project/PagesPage.tsx

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { useProjects } from '@/hooks/useProjects';
import { usePages } from '@/hooks/usePages';
import { Page } from '@/models';
import { toast } from 'sonner';

interface PagesPageProps {
    projectId: string;
}

function PagesPage({ projectId }: PagesPageProps) {
    const [pageName, setPageName] = useState('');
    const [pageRoute, setPageRoute] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const templates = ['Landing Page', 'Blog'];
    const { projects } = useProjects();
    const { pages, addPage } = usePages();

    const project = projects.find((p) => p.id === projectId);

    if (!project) {
        return <div>Project not found</div>;
    }

    const handleAddPage = async () => {
        try {
            if (pageName.trim() !== '' && selectedTemplate !== '') {
                const newPage: Page = {
                    name: pageName,
                    templateIds: [selectedTemplate],
                    projectId: projectId,
                    route: pageRoute,
                };
                await addPage(newPage);
                setPageName('');
                setSelectedTemplate('');
            }
        } catch (error) {
            toast('Error adding page');
            console.error(error);
        }
    };

    return (
        <div>
            <h2 className="mb-4 text-2xl font-bold">Pages</h2>
            <Dialog>
                <DialogTrigger asChild>
                    <Button>Add New Page</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Page</DialogTitle>
                        <DialogDescription>
                            Enter a name and select a template for your new page.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="pageName">Page Name</Label>
                            <Input
                                id="pageName"
                                placeholder="Home"
                                value={pageName}
                                onChange={(e) => setPageName(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="pageRoute">Page Route</Label>
                            <Input
                                id="pageRoute"
                                placeholder="/home"
                                value={pageRoute}
                                onChange={(e) => setPageRoute(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label>Template</Label>
                            <div className="space-y-2">
                                {templates.map((template) => (
                                    <div key={template} className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            id={template}
                                            name="template"
                                            value={template}
                                            checked={selectedTemplate === template}
                                            onChange={(e) => setSelectedTemplate(e.target.value)}
                                            className="w-4 h-4"
                                        />
                                        <Label htmlFor={template}>{template}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleAddPage} disabled={!pageName || !selectedTemplate}>
                            Create Page
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* List of pages */}
            {pages.length > 0 ? (
                <div className="mt-4 space-y-2">
                    {pages.map((page) => (
                        <div key={page.id} className="p-2 bg-gray-100 rounded">
                            {page.name} ({page.route})
                        </div>
                    ))}
                </div>
            ) : (
                <p className="mt-4">No pages created yet.</p>
            )}
        </div>
    );
}

export default PagesPage;
