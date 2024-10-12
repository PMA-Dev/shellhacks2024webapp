import path from 'path';
import { bunFormatBackend } from '../bootstrapper/backend';
import { editMetadataInPlace, getProjectData, query } from '../db';
import {
    ControllerMetadata,
    MetadataType,
    ProjectMetadata,
    RouteMetadata,
} from '../models';
import { writeToFileForced } from '../shellProxy';

export const writeConfigForBackendInFrontend = async (projectId: number) => {
    const project = await getProjectData(projectId);
    const routes = await Promise.all(
        project.routeIds.map((routeId) =>
            query<RouteMetadata>(MetadataType.Route, routeId)
        )
    );
    const strippedRouteName = (routeName: string) => routeName.replace('/', '');
    const importString = routes
        .map(
            (route) =>
                `import {route as ${strippedRouteName(
                    route?.routeName!
                )}Route} from './${strippedRouteName(route?.routeName!)}.rt';`
        )
        .join('\n');

    const routerUseString = routes
        .map((route) => `${strippedRouteName(route?.routeName!)}Route(router);`)
        .join('\n\t');

    const content = `
// src/router/index.ts
import express from 'express';
${importString}

const router = express.Router();

export default (): express.Router => {
    router.use(express.json());

    // generated routes
    ${routerUseString}

    return router;
};
`;
    const filePath = path.join(
        project.backendWorkingDir!,
        'src/router/index.ts'
    );
    await writeToFileForced(filePath, content);
};

export const createRouteAndUpdateIndex = async (
    projectId: number,
    routeId: number
) => {
    // first we need to create the code for the route and cp it
    const route = await query<RouteMetadata>(MetadataType.Route, routeId);
    const controllers = [];
    for (const controllerId of route?.controllerIds ?? []) {
        controllers.push(
            await query<ControllerMetadata>(
                MetadataType.Controller,
                controllerId
            )
        );
    }
    const project = await query<ProjectMetadata>(
        MetadataType.Project,
        projectId
    );
    const fileName = route?.routeName + '.rt.ts';
    const destPath = path.join(
        project?.backendWorkingDir!,
        'src',
        'router',
        fileName
    );
    const stripPathName = (pathName: string) =>
        pathName.startsWith('/') ? pathName : '/' + pathName;

    const getDefaultInjectedCodeForController = (
        controller: ControllerMetadata,
        route: RouteMetadata
    ) => {
        return `res.status(200).json({'result': 'Returning 200 response from :${controller?.pathName} method of ${route?.routeName} route.'}).end();`;
    };

    const controllerStrings = controllers
        .map(
            (data) => `
router.${data?.method?.toString().toLowerCase()}('/${
                data?.basePath
            }${stripPathName(
                data?.pathName!
            )}', async (req: express.Request, res: express.Response) => {
    ${data?.injectedCode ?? getDefaultInjectedCodeForController(data!, route!)}
});
`
        )
        .join('\n');

    const middleWareImports = route?.middleWares
        ?.map((middleWare) => middleWare.importString)
        .join('\n');

    const content = `
// src/router/${fileName}
import express from 'express';
${middleWareImports}

export const route = (router: express.Router) => {
    ${controllerStrings}
};
`;

    console.log('going to create route and cp to: ', destPath);
    await writeToFileForced(destPath, content);

    await editMetadataInPlace<RouteMetadata>(
        MetadataType.Route,
        routeId,
        (x) => {
            (x.fileName = fileName), (x.physicalPath = destPath);
        }
    );

    // must also rewrite the index file
    await writeConfigForBackendInFrontend(projectId);

    await bunFormatBackend(projectId);
};
