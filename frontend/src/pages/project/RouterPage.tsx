// src/pages/project/RouterPage.tsx

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useProject } from '@/context/ProjectContext';
import { BackendRoute, useBackendRoutes } from '@/hooks/useBackendRoutes';
import { useProjects } from '@/hooks/useProjects';
import { Plus } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import RoutersTable from './RoutersTable';

const RouterPage = () => {
    const { projectId } = useParams();
    const { addRoute, updateRoute } = useBackendRoutes(projectId);
    const {fetchProjects} = useProjects();
    const project = useProject();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingRoute, setEditingRoute] = useState<BackendRoute | null>(null);
    const [routeData, setRouteData] = useState<Partial<BackendRoute>>({
        routeName: '',
    });

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setRouteData({ ...routeData, [e.target.name]: e.target.value });
        },
        [routeData]
    );

    const handleAddOrUpdateRoute = () => {
        if (editingRoute) {
            // Update existing route
            const updatedRoute: BackendRoute = {
                ...editingRoute,
                ...routeData,
                id: editingRoute.id,
            };
            updateRoute(updatedRoute);
        } else {
            // Add new route
            const newRoute: BackendRoute = {
                routeName: routeData.routeName || '',
            };
            addRoute(newRoute);
        }
        setIsDialogOpen(false);
        setEditingRoute(null);
        setRouteData({ routeName: '' });
        fetchProjects();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Backend Routes</h2>
                <Button onClick={() => setIsDialogOpen(true)} className="flex items-center">
                    <Plus className="mr-2" />
                    Add Route
                </Button>
            </div>
            {project?.routeIds?.map((routeId) => (
                <div key={routeId}>
                    <RoutersTable projectId={projectId} routeId={routeId} />
                </div>
            ))}

            {/* Add/Edit Route Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editingRoute ? 'Edit Route' : 'Add New Route'}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <label
                                htmlFor="routeName"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Route Name
                            </label>
                            <Input
                                id="routeName"
                                name="routeName"
                                value={routeData.routeName}
                                onChange={handleInputChange}
                                placeholder="OtherRouter"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleAddOrUpdateRoute}>
                            {editingRoute ? 'Update Route' : 'Add Route'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default RouterPage;
