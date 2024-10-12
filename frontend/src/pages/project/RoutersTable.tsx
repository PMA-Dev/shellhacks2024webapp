// src/pages/project/RoutersTable.tsx

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
    BackendController,
    useBackendControllers,
} from '@/hooks/useBackendController';
import { BackendRoute, useBackendRoutes } from '@/hooks/useBackendRoutes';
import { Plus } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import ControllersTable from './ControllersTable';

export interface IProps {
    projectId?: string;
    routeId?: string;
}

const RoutersTable = (props: IProps) => {
    const [route, setRoute] = useState<BackendRoute>();
    const { addController, updateController } = useBackendControllers(
        props.routeId
    );
    const { fetchRoute } = useBackendRoutes(props.projectId);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingController, setEditingController] =
        useState<BackendController | null>(null);
    const [controllerData, setControllerData] = useState<
        Partial<BackendController>
    >({
        pathName: '',
    });

    useEffect(() => {
        const fetchRouteAndSet = async () => {
            const data = await fetchRoute(props.routeId);
            setRoute(data);
        };
        fetchRouteAndSet();
    }, [fetchRoute, props.routeId]);

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setControllerData({
                ...controllerData,
                [e.target.name]: e.target.value,
            });
        },
        [controllerData]
    );

    const handleAddOrUpdateController = () => {
        if (editingController) {
            // Update existing route
            const updatedController: BackendController = {
                ...editingController,
                // ...routeData,
                id: editingController.id,
            };
            updateController(updatedController);
        } else {
            // Add new route
            const newController: BackendController = {
                pathName: controllerData.pathName || '',
            };
            addController(newController, props.projectId);
        }
        setIsDialogOpen(false);
        setEditingController(null);
        setControllerData({ pathName: '' });
    };

    return (
        route && (
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">{route.routeName}</h2>
                    <Button onClick={() => {}} className="flex items-center">
                        <Plus className="mr-2" />
                        Add Controller
                    </Button>
                </div>

                {/* Controllers Table */}
                <ControllersTable
                    projectId={props.projectId}
                    routeId={props.routeId}
                    route={route}
                />

                {/* Add/Edit Route Dialog */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {editingController
                                    ? 'Edit Controller'
                                    : 'Add New Controller'}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <label
                                    htmlFor="routeName"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Path Name
                                </label>
                                <Input
                                    id="pathName"
                                    name="pathName"
                                    value={controllerData.pathName}
                                    onChange={handleInputChange}
                                    placeholder="/api/example"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleAddOrUpdateController}>
                                {editingController
                                    ? 'Update Controller'
                                    : 'Add Controller'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        )
    );
};

export default RoutersTable;
