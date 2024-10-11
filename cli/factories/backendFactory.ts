import path from 'path';
import { getProjectData } from '../db';
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
    const toPaths = ['src/router/index.ts', 'src/db.ts', 'db.json'];
    for (const pathName of toPaths) {
        const toPath = path.join(project.backendWorkingDir!, pathName);
        const templateName = pathName.split('/').at(-1);
        runCmd('rm', ['-f', toPath]);
        await copyTemplateFileToProject(templateName!, projectId, toPath);
    }
};
