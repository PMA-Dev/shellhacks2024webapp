import path from 'path';
import { copyTemplateFileToProject } from './factory';
import { getProjectData, writeToFileForced } from './routes/commands';
import { runCmd } from './shellProxy';

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

export const writeNewFileForBackendServer = async (projectId: number) => {
    const project = await getProjectData(projectId);
    const toPath = path.join(project.backendWorkingDir!, 'src/router/index.ts');
    runCmd('rm', ['-f', toPath]);
    await copyTemplateFileToProject('index.ts', projectId, toPath);
};

export const writeDbFileForBackendServer = async (projectId: number) => {
    const project = await getProjectData(projectId);
    const toPath = path.join(project.backendWorkingDir!, 'src/db.ts');
    await copyTemplateFileToProject('db.ts', projectId, toPath);
};

export const writeDbDataForBackendServer = async (projectId: number) => {
    const project = await getProjectData(projectId);
    const toPath = path.join(project.backendWorkingDir!, 'db.json');
    await copyTemplateFileToProject('db.json', projectId, toPath);
};
