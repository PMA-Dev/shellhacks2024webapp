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
import { useProject } from '@/context/ProjectContext';
import {
    BackendController,
    useBackendControllers,
} from '@/hooks/useBackendController';
import { BackendRoute } from '@/hooks/useBackendRoutes';
import { useControllerTest } from '@/hooks/useControllerTest';
import HTTPMethod from 'http-method-enum';
import { Edit, Trash } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';

export interface IProps {
    projectId?: string;
    routeId?: string;
    route?: BackendRoute;
}

const ControllerTable = (props: IProps) => {
    const { project } = useProject();
    const { controllers } = useBackendControllers(props.routeId);
    useEffect(() => {
        console.log(`controllers: ${JSON.stringify(controllers)}`);
    }, [controllers]);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isTestDialogOpen, setIsTestDialogOpen] = useState(false);
    const [isTestLoading, setIsTestLoading] = useState(false);
    const [testPostBodyData, setTestPostBodyData] = useState<string>('');
    const [testQueryParamsData, setTestQueryParamsData] = useState<string>('');
    const [testResultData, setTestResultData] = useState<string>('');
    const [editingController, setEditingController] =
        useState<BackendController | null>(null);
    const [testController, setTestController] =
        useState<BackendController | null>(null);

    const [controllerData, setControllerData] = useState<
        Partial<BackendController>
    >({
        pathName: '',
        method: HTTPMethod.GET,
    });

    const [isServing, setIsServing] = useState(false);
    useEffect(() => {
        // ping the server to see if it's running
        console.log('pinging server...');
        const pingServer = async () => {
            const response = await fetch(`${project?.sitePath}/ping`);
            if (response.status === 200) {
                setIsServing(true);
            } else {
                setIsServing(false);
            }
        };
        pingServer();
    }, [project]);

    const { hitEndpointAndReturnData } = useControllerTest(project);

    const handleRunTestSubmit = useCallback(async () => {
        setIsTestLoading(true);
        let jsonData = null;
        try {
            jsonData =
                testController?.method == HTTPMethod.GET
                    ? null
                    : JSON.parse(testPostBodyData!);
        } catch (e) {
            setTestResultData(`Invalid json: ${JSON.stringify(e)}`);
            setIsTestLoading(false);
            return;
        }

        let jsonDataParams = null;
        try {
            if (testQueryParamsData) {
                jsonDataParams =
                    testController?.method != HTTPMethod.GET
                        ? null
                        : JSON.parse(testQueryParamsData);
            }
        } catch (e) {
            setTestResultData(`Invalid json: ${JSON.stringify(e)}`);
            setIsTestLoading(false);
            return;
        }

        const { response, error } = await hitEndpointAndReturnData(
            testController,
            jsonData,
            jsonDataParams
        );
        if (
            error ||
            !response?.status ||
            response?.status >= 300 ||
            response?.status < 200
        ) {
            setTestResultData(JSON.stringify(error?.message));
            setIsTestLoading(false);
            return;
        }
        setTestResultData(JSON.stringify(response?.data));
        setIsTestLoading(false);
    }, [
        hitEndpointAndReturnData,
        testController,
        testPostBodyData,
        testQueryParamsData,
    ]);

    const resetTestDialog = useCallback(() => {
        setIsTestDialogOpen(false);
        setIsTestLoading(false);
        setTestPostBodyData('');
        setTestResultData('');
        setTestQueryParamsData('');
    }, []);

    const openEditDialog = (controller: BackendController) => {
        setEditingController(controller);
        setControllerData(controller);
        setIsDialogOpen(true);
    };

    const openTestDialog = (controller: BackendController) => {
        setTestController(controller);
        setIsTestDialogOpen(true);
        setTestQueryParamsData(controller.sampleQueryParams ?? '');
        setTestPostBodyData(controller.samplePayload ?? '');
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
                                        onClick={() =>
                                            openTestDialog(controller)
                                        }
                                        disabled={!isServing}
                                        className={`${
                                            !isServing
                                                ? 'opacity-80 cursor-not-allowed'
                                                : ''
                                        }`}
                                    >
                                        Test API{' '}
                                        {isServing
                                            ? ''
                                            : '- ensure server is running'}
                                    </Button>
                                </div>
                            </td>
                            <td className="px-4 py-2">
                                <div className="flex space-x-2">
                                    <Button
                                        variant="ghost"
                                        size="lg"
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

            <Dialog open={isTestDialogOpen} onOpenChange={setIsTestDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Test API</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <div>
                                Testing at:{' '}
                                {`http://127.0.0.1:${project?.backendPort}${testController?.pathName}`}
                            </div>
                        </div>
                        {testController?.method == HTTPMethod.POST ||
                        testController?.method == HTTPMethod.PATCH ? (
                            <div>
                                <label
                                    htmlFor="postData"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    JSON body data
                                </label>
                                <Input
                                    id="postData"
                                    name="postData"
                                    value={testPostBodyData}
                                    onChange={(event) =>
                                        setTestPostBodyData(event.target.value)
                                    }
                                    placeholder={
                                        testController.samplePayload ??
                                        '{"test" : "data"}'
                                    }
                                />
                            </div>
                        ) : (
                            <div>
                                <label
                                    htmlFor="queryParams"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Query Params
                                </label>
                                <Input
                                    id="queryParams"
                                    name="queryParams"
                                    value={testQueryParamsData}
                                    onChange={(event) =>
                                        setTestQueryParamsData(
                                            event.target.value
                                        )
                                    }
                                    placeholder={
                                        testController?.sampleQueryParams ??
                                        '{"id": 12, "format": "csv"}'
                                    }
                                />
                            </div>
                        )}
                        <div>
                            {isTestLoading ? (
                                <div>
                                    <div>Fetching.. </div>
                                </div>
                            ) : (
                                <div>Data: {testResultData} </div>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <div>
                            {isTestLoading ? (
                                <ClipLoader size={20} color="#AAA" />
                            ) : (
                                <Button onClick={handleRunTestSubmit}>
                                    Run Test
                                </Button>
                            )}
                        </div>
                        <Button onClick={resetTestDialog}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

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
