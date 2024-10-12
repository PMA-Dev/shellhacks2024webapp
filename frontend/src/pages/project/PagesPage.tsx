import PageOverviewWidget from '@/components/PageOverviewWidget.tsx';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import api from '@/hooks/api.ts';
import { usePages } from '@/hooks/usePages';
import { Template } from '@/models';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useProject } from '../../context/ProjectContext.tsx';

function PagesPage() {
    const [pageName, setPageName] = useState('');
    const [pageRoute, setPageRoute] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<Template>();
    const [templates, setTemplates] = useState<Template[]>([]);
    const { project } = useProject();
    const { pages, addPage } = usePages(project?.id || '');

    useEffect(() => {
        async function fetchTemplates() {
            const response = await api.get('/metadata/all/template');
            console.log('fetched templates:', response.data);
            setTemplates(response.data);
        }
        fetchTemplates();
    }, []);

    if (!project) {
        return <div>Project not found</div>;
    }

    const handleAddPage = async () => {
        try {
            if (pageName.trim() !== '') {
                console.log(
                    'selectedTemplate:',
                    selectedTemplate?.templateName
                );
                const newPage = {
                    pageName,
                    templateId: selectedTemplate!.id!,
                    projectId: project.id!,
                    routerPath: pageRoute,
                    templateType: selectedTemplate!.templateType!,
                };
                await addPage(newPage);
                setPageName('');
                setSelectedTemplate(undefined);
                toast.success('Page added successfully!');
                setIsDialogOpen(false);
            }
        } catch (error) {
            toast('Error adding page');
            console.error(error);
        }
    };

    return (
        <div>
            <h2 className="mb-4 text-2xl font-bold">Pages</h2>

            {/* Add New Page Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button>Add New Page</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Page</DialogTitle>
                        <DialogDescription>
                            Enter a name and select a template for your new
                            page.
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
                                {templates?.length &&
                                    templates.map((template) => (
                                        <div
                                            key={template.id}
                                            className="flex items-center space-x-2"
                                        >
                                            <input
                                                type="radio"
                                                id={template.id}
                                                name="template"
                                                value={template.id}
                                                onChange={(e) => {
                                                    console.log(
                                                        'selected template:',
                                                        e.target.value
                                                    );
                                                    const selectedId =
                                                        e.target.value;
                                                    const selected =
                                                        templates.find(
                                                            (t) =>
                                                                t.id ==
                                                                selectedId
                                                        );
                                                    console.log(
                                                        'selected:',
                                                        selected
                                                    );
                                                    setSelectedTemplate(
                                                        selected
                                                    );
                                                }}
                                                className="w-4 h-4"
                                            />
                                            <Label htmlFor={template.id}>
                                                {template.templateName}
                                            </Label>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            onClick={handleAddPage}
                            disabled={!pageName || !selectedTemplate}
                        >
                            Create Page
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* List of pages */}
            <div className="mt-4 space-y-2">
                {pages && pages.length > 0 ? (
                    <div className="mt-4 space-y-2">
                        {pages.map((page) => (
                            <PageOverviewWidget
                                key={page.id}
                                page={page}
                                project={project}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="mt-4">No pages created yet.</p>
                )}
            </div>
        </div>
    );
}

export default PagesPage;
