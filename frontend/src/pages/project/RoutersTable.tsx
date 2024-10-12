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
import { useProject } from '@/context/ProjectContext';
import {
    BackendController,
    useBackendControllers,
} from '@/hooks/useBackendController';
import { BackendRoute, useBackendRoutes } from '@/hooks/useBackendRoutes';
import { useProjects } from '@/hooks/useProjects';
import HTTPMethod from 'http-method-enum';
import { Plus } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import ControllersTable from './ControllersTable';

export interface IProps {
    projectId?: string;
    routeId?: string;
}

const RoutersTable = (props: IProps) => {
    const [route, setRoute] = useState<BackendRoute>();
    const { getProjectById } = useProjects();
    const { setProject } = useProject();
    const { addController } = useBackendControllers(props.routeId);
    const { fetchRoute } = useBackendRoutes(props.projectId);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [controllerBeingAdded, setControllerBeingAdded] =
        useState<BackendController>({});

    useEffect(() => {
        const fetchRouteAndSet = async () => {
            const data = await fetchRoute(props.routeId);
            setRoute(data);
        };
        fetchRouteAndSet();
    }, [fetchRoute, props.routeId]);

    const handleAddController = useCallback(async () => {
        if (controllerBeingAdded.pathName && controllerBeingAdded.method) {
            await addController(controllerBeingAdded, props.projectId);
            setIsDialogOpen(false);
            setControllerBeingAdded({
                pathName: '',
                method: '' as HTTPMethod,
                injectedCode: '',
                samplePayload: '',
                sampleQueryParams: '',
            });

            const updatedProject = await getProjectById(
                props.projectId as string
            );
            setProject(updatedProject);
        }
    }, [
        controllerBeingAdded,
        addController,
        props.projectId,
        getProjectById,
        setProject,
    ]);

    return (
        route && (
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">{route.routeName}</h2>
                    <Button
                        onClick={() => setIsDialogOpen(true)}
                        className="flex items-center"
                    >
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
                            <DialogTitle>Add New Controller</DialogTitle>
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
                                    value={controllerBeingAdded.pathName}
                                    onChange={(event) =>
                                        setControllerBeingAdded({
                                            ...controllerBeingAdded,
                                            pathName: event.target.value,
                                        })
                                    }
                                    placeholder="/test/example"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="method"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Method
                                </label>
                                <Input
                                    id="method"
                                    name="method"
                                    value={controllerBeingAdded.method}
                                    onChange={(event) =>
                                        setControllerBeingAdded({
                                            ...controllerBeingAdded,
                                            method: event.target
                                                .value as HTTPMethod,
                                        })
                                    }
                                    placeholder="POST or GET"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="injectedCode"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Injected Code
                                </label>
                                <Input
                                    id="injectedCode"
                                    name="injectedCode"
                                    value={controllerBeingAdded.injectedCode}
                                    onChange={(event) =>
                                        setControllerBeingAdded({
                                            ...controllerBeingAdded,
                                            injectedCode: event.target.value,
                                        })
                                    }
                                    placeholder="Injected code here"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="samplePayload"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Sample Payload
                                </label>
                                <Input
                                    id="samplePayload"
                                    name="samplePayload"
                                    value={controllerBeingAdded.samplePayload}
                                    onChange={(event) =>
                                        setControllerBeingAdded({
                                            ...controllerBeingAdded,
                                            samplePayload: event.target.value,
                                        })
                                    }
                                    placeholder="Sample payload (JSON format)"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="sampleQueryParams"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Sample Query Params
                                </label>
                                <Input
                                    id="sampleQueryParams"
                                    name="sampleQueryParams"
                                    value={
                                        controllerBeingAdded.sampleQueryParams
                                    }
                                    onChange={(event) =>
                                        setControllerBeingAdded({
                                            ...controllerBeingAdded,
                                            sampleQueryParams:
                                                event.target.value,
                                        })
                                    }
                                    placeholder="Sample query params (JSON format)"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleAddController}>
                                Add Controller
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        )
    );
};

export default RoutersTable;
