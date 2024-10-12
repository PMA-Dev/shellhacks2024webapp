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
import api from '@/hooks/api';
import {
    BackendController,
    useBackendControllers,
} from '@/hooks/useBackendController';
import { BackendRoute, useBackendRoutes } from '@/hooks/useBackendRoutes';
import HTTPMethod from 'http-method-enum';
import { Plus } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';
import ControllersTable from './ControllersTable';

export interface IProps {
    projectId?: string;
    routeId?: string;
}

const RoutersTable = (props: IProps) => {
    const [route, setRoute] = useState<BackendRoute>();
    const { addController } = useBackendControllers(props.routeId);
    const { fetchRoute } = useBackendRoutes(props.projectId);
    const [isLoading, setIsLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [controllerBeingAdded, setControllerBeingAdded] =
        useState<BackendController>({});

    const fetchRouteAndSet = useCallback(async () => {
        const data = await fetchRoute(props.routeId);
        setRoute(data);
    }, [fetchRoute, props.routeId]);

    useEffect(() => {
        fetchRouteAndSet();
    }, [fetchRoute, fetchRouteAndSet, props.routeId]);

    const handleAddController = useCallback(async () => {
        if (controllerBeingAdded.pathName && controllerBeingAdded.method) {
            setIsLoading(true);
            const id = await addController(
                controllerBeingAdded,
                props.projectId
            );
            setIsDialogOpen(false);
            setControllerBeingAdded({
                pathName: '',
                method: '' as HTTPMethod,
                injectedCode: '',
                samplePayload: '',
                sampleQueryParams: '',
            });

            setRoute({
                ...route,
                controllerIds: [...(route?.controllerIds ?? []), id],
            });
            await api.get(`/commands/stopVite?projectId=${props.projectId}`);
            await new Promise((resolve) => setTimeout(resolve, 500));
            await api.get(`/commands/startVite?projectId=${props.projectId}`);
            setIsLoading(false);
        }
    }, [controllerBeingAdded, addController, props.projectId, route]);

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
                <ControllersTable projectId={props.projectId} route={route} />

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
                            <div>
                                {isLoading ? (
                                    <ClipLoader size={20} color="#AAA" />
                                ) : (
                                    <Button onClick={handleAddController}>
                                        Add Controller
                                    </Button>
                                )}
                            </div>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        )
    );
};

export default RoutersTable;
