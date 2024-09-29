// src/pages/project/RouterPage.tsx

import React, { useState } from 'react';
import { useBackendRoutes } from '@/hooks/useBackendRoutes';
import { BackendRoute } from '@/models/BackendRoute';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Trash, Edit } from 'lucide-react';

function RouterPage() {
    const { routes, addRoute, updateRoute, deleteRoute } = useBackendRoutes();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingRoute, setEditingRoute] = useState<BackendRoute | null>(null);

    const [routeData, setRouteData] = useState<Partial<BackendRoute>>({
        path: '',
        method: 'GET',
        middlewares: [],
    });

    const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRouteData({ ...routeData, [e.target.name]: e.target.value });
    };

    const handleMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setRouteData({ ...routeData, method: e.target.value });
    };

    const handleMiddlewaresChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRouteData({ ...routeData, middlewares: e.target.value.split(',') });
    };

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
                id: Date.now().toString(),
                path: routeData.path || '',
                method: routeData.method || 'GET',
                middlewares: routeData.middlewares || [],
            };
            addRoute(newRoute);
        }
        setIsDialogOpen(false);
        setEditingRoute(null);
        setRouteData({ path: '', method: 'GET', middlewares: [] });
    };

    const openEditDialog = (route: BackendRoute) => {
        setEditingRoute(route);
        setRouteData(route);
        setIsDialogOpen(true);
    };

    const openAddDialog = () => {
        setEditingRoute(null);
        setRouteData({ path: '', method: 'GET', middlewares: [] });
        setIsDialogOpen(true);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Backend Routes</h2>
                <Button onClick={openAddDialog} className="flex items-center">
                    <Plus className="mr-2" />
                    Add Route
                </Button>
            </div>

            {/* Routes Table */}
            <table className="w-full table-auto">
                <thead>
                    <tr>
                        <th className="px-4 py-2">Path</th>
                        <th className="px-4 py-2">Method</th>
                        <th className="px-4 py-2">Middlewares</th>
                        <th className="px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {routes.map((route) => (
                        <tr key={route.id} className="border-t">
                            <td className="px-4 py-2">{route.path}</td>
                            <td className="px-4 py-2">{route.method}</td>
                            <td className="px-4 py-2">{route.middlewares.join(', ')}</td>
                            <td className="px-4 py-2">
                                <div className="flex space-x-2">
                                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(route)}>
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => deleteRoute(route.id)}
                                    >
                                        <Trash className="w-4 h-4 text-red-500" />
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Add/Edit Route Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingRoute ? 'Edit Route' : 'Add New Route'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="path" className="block text-sm font-medium text-gray-700">
                                Path
                            </label>
                            <Input
                                id="path"
                                name="path"
                                value={routeData.path}
                                onChange={handleInputChange}
                                placeholder="/api/example"
                            />
                        </div>
                        <div>
                            <label htmlFor="method" className="block text-sm font-medium text-gray-700">
                                Method
                            </label>
                            <select
                                id="method"
                                name="method"
                                value={routeData.method}
                                onChange={handleMethodChange}
                                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
                            >
                                {methods.map((method) => (
                                    <option key={method} value={method}>
                                        {method}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label
                                htmlFor="middlewares"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Middlewares (comma-separated)
                            </label>
                            <Input
                                id="middlewares"
                                name="middlewares"
                                value={routeData.middlewares?.join(', ')}
                                onChange={handleMiddlewaresChange}
                                placeholder="authMiddleware, logMiddleware"
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
}

export default RouterPage;
