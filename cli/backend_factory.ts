import path from 'path';
import {
    getBackendWorkingDir,
    getProjectData,
    writeToFileForced,
} from './routes/commands';

export const writeConfigForBackendInFrontend = async (projectId: number) => {
    const project = await getProjectData(projectId);
    const config = `
// fetchConfig.ts
export const fetchConfig = {
  baseUrl: 'http://localhost:${project.backendPort}',
};

export const makeFetchRequest = async (endpoint: string, options: Partial<typeof fetchConfig> = {}) => {
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
    const filePath = path.join(
        await getBackendWorkingDir(projectId),
        '..',
        'src/fetchConfig.ts'
    );
    await writeToFileForced(filePath, config);
};
