// src/pages/project/PagesPage.tsx

import { useState, useContext } from 'react';
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
import { ProjectContext } from '@/context/ProjectContext';

interface PagesPageProps {
    projectId: string;
}

function PagesPage({ projectId }: PagesPageProps) {
    const [pageName, setPageName] = useState('');
    const [pageRoute, setPageRoute] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const templates = ['Blog', 'Portfolio', 'E-commerce'];
    const { projects, addPageToProject } = useContext(ProjectContext)!;

    const project = projects.find((p) => p.id === projectId);

    if (!project) {
        return <div>Project not found</div>;
    }

    const handleAddPage = () => {
        if (pageName.trim() !== '' && selectedTemplate !== '') {
            const newPage = {
                id: Date.now().toString(),
                name: pageName,
                template: selectedTemplate,
            };
            addPageToProject(projectId, newPage);
            setPageName('');
            setSelectedTemplate('');
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
            {project.pages.length > 0 ? (
                <div className="mt-4 space-y-2">
                    {project.pages.map((page) => (
                        <div key={page.id} className="p-2 bg-gray-100 rounded">
                            {page.name} ({page.template})
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
