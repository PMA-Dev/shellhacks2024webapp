// src/pages/project/ControllersTable.tsx

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
import { BackendRoute } from '@/hooks/useBackendRoutes';
import HTTPMethod from 'http-method-enum';
import { Edit, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';

export interface IProps {
    projectId?: string;
    routeId?: string;
    route?: BackendRoute;
}

const ControllerTable = (props: IProps) => {
    const { controllers } = useBackendControllers(props.routeId);
    useEffect(() => {
        console.log(`controllers: ${JSON.stringify(controllers)}`);
    }, [controllers]);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingController, setEditingController] =
        useState<BackendController | null>(null);

    const [controllerData, setControllerData] = useState<
        Partial<BackendController>
    >({
        pathName: '',
        method: HTTPMethod.GET,
    });

    // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setControllerData({ ...controllerData, [e.target.name]: e.target.value });
    // };

    // const handleMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    //     setControllerData({ ...controllerData, method: e.target.value });
    // };

    // const handleMiddlewaresChange = (
    //     e: React.ChangeEvent<HTMLInputElement>
    // ) => {
    //     setControllerData({ ...controllerData, middlewares: e.target.value.split(',') });
    // };

    // const handleAddOrUpdateController = () => {
    //     if (editingController) {
    //         // Update existing controller
    //         const updatedController: BackendController = {
    //             ...editingController,
    //             ...controllerData,
    //             id: editingController.id,
    //         };
    //         updateController(updatedController);
    //     } else {
    //         // Add new controller
    //         const newController: BackendController = {
    //             id: Date.now().toString(),
    //             pathName: controllerData.pathName || '',
    //             method: controllerData.method || 'GET',
    //             middlewares: controllerData.middlewares || [],
    //         };
    //         addController(newController);
    //     }
    //     setIsDialogOpen(false);
    //     setEditingController(null);
    //     setControllerData({ pathName: '', method: 'GET', middlewares: [] });
    // };

    const openEditDialog = (controller: BackendController) => {
        setEditingController(controller);
        setControllerData(controller);
        setIsDialogOpen(true);
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const openAddDialog = () => {
        setEditingController(null);
        setControllerData({ pathName: '', method: HTTPMethod.GET });
        setIsDialogOpen(true);
    };

    return (
        <div>
            {/* Controllers Table */}
            <table className="w-full table-auto">
                <thead>
                    <tr>
                        <th className="px-4 py-2">Path Name</th>
                        <th className="px-4 py-2">Method</th>
                    </tr>
                </thead>
                <tbody>
                    {controllers.map((controller) => (
                        <tr key={controller.id} className="border-t">
                            <td className="px-4 py-2">{controller.pathName}</td>
                            <td className="px-4 py-2">{controller.method}</td>
                            <td className="px-4 py-2">
                                <div className="flex space-x-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                            openEditDialog(controller)
                                        }
                                    >
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => {}}
                                    >
                                        <Trash className="w-4 h-4 text-red-500" />
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Add/Edit Controller Dialog */}
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
                                htmlFor="pathName"
                                className="block text-sm font-medium text-gray-700"
                            >
                                pathName
                            </label>
                            <Input
                                id="pathName"
                                name="pathName"
                                value={controllerData.pathName}
                                // onChange={handleInputChange}
                                placeholder="/api/example"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="method"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Method
                            </label>
                            <select
                                id="method"
                                name="method"
                                value={controllerData.method}
                                // onChange={handleMethodChange}
                                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
                            >
                                {['GET', 'POST', 'PATCH'].map((method) => (
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
                                // value={controllerData.middlewares?.join(', ')}
                                // onChange={handleMiddlewaresChange}
                                placeholder="authMiddleware, logMiddleware"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button //onClick={handleAddOrUpdateController}
                        >
                            {editingController
                                ? 'Update Controller'
                                : 'Add Controller'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ControllerTable;
