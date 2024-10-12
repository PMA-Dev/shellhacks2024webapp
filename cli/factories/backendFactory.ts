import HTTPMethod from 'http-method-enum';
import path from 'path';
import { getProjectData } from '../db';
import { ControllerMetadata, DbMiddleWare, RouteMetadata } from '../models';
import { postControllerMetadataInner } from '../routes/postControllerMetadata';
import { postRouteMetadataInner } from '../routes/postRouteMetadata';
import { runCmd, writeToFileForced } from '../shellProxy';
import { copyTemplateFileToProject } from './factory';

export const writeConfigForBackendInFrontend = async (projectId: number) => {
    const project = await getProjectData(projectId);
    const config = `
// fetchConfig.ts
export const fetchConfig = {
  baseUrl: 'http://localhost:${project.backendPort}',
};

export const makeFetchRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = fetchConfig.baseUrl + endpoint;
  const config = {
    ...fetchConfig,
    ...options,
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      throw new Error('HTTP error! Status: ' + response.status);
    }
    return await response.json();
  } catch (error) {
    console.error('Error making fetch request:', error);
    throw error;
  }
};
    `;
    const filePath = path.join(project.workingDir!, 'src/fetchConfig.ts');
    await writeToFileForced(filePath, config);
};

export const setupAllBackendFiles = async (projectId: number) => {
    const project = await getProjectData(projectId);
    const toPaths = [
        'src/router/index.ts',
        'src/db.ts',
        'db.json',
        'src/app.ts',
    ];
    for (const pathName of toPaths) {
        const toPath = path.join(project.backendWorkingDir!, pathName);
        const templateName = pathName.split('/').at(-1);
        runCmd('rm', ['-f', toPath]);
        await copyTemplateFileToProject(templateName!, projectId, toPath);
    }
};

export const registerSetupAndCopyInitialRouteAndControllers = async (
    projectId: number
) => {
    const route = {
        routeName: 'MainRoute',
        middleWares: [new DbMiddleWare()],
        controllerIds: [],
    } as RouteMetadata;
    const routeId = await postRouteMetadataInner(projectId, route);

    console.log(`---done with making the route`);

    const controllers: ControllerMetadata[] = [
        {
            method: HTTPMethod.POST,
            pathName: '/samplePost',
            injectedCode: `const logData = req.body; if (!logData || !logData.logName || !logData.timestamp) { return res.status(400).json({ error: 'Missing required log data' }); } pushLog(logData) .then((newLogId) => { res.json({ success: true, id: newLogId }); }) .catch((err) => { res.status(500).json({ error: err.message }); });`,
            samplePayload: JSON.stringify({
                logName: 'test',
                timestamp: '2024-10-04T17:22',
            }),
        },
        {
            method: HTTPMethod.GET,
            pathName: '/sampleFetch',
            injectedCode: `const id = parseInt(req.query.id as string, 10); if (isNaN(id)) { return res .status(400) .json({ error: 'Invalid or missing id query parameter' }); } queryAll().then((data) => { res.json(data); });`,
            sampleQueryParams: JSON.stringify({ id: 12 }),
        },
    ];
    for (const controller of controllers) {
        await postControllerMetadataInner(
            projectId,
            routeId,
            controller as ControllerMetadata
        );
    }
};
