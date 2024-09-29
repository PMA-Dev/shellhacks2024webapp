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
    const filePath = path.join(
        await getBackendWorkingDir(projectId),
        '..',
        'src/fetchConfig.ts'
    );
    await writeToFileForced(filePath, config);
};

export const writeNewFileForBackendServer = async (projectId: number) => {
    const filePath = path.join(
        await getBackendWorkingDir(projectId),
        'src/router/index.ts'
    );
    const content = `
import express from 'express';

import authentication from './authentication.rt';
import emojis from './emojis.rt';

const router = express.Router();

export default (): express.Router => {
  router.get('/', (req, res) => {
    res.json({
      message: 'API - 👋🌎🌍🌏',
    });
  });

  router.get('/data', (req, res) => {
    const id = parseInt(req.query.id as string, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid or missing id query parameter' });
    }
    const data = [
      { logName: 'Log entry ' + id + '-1', timestamp: new Date().toISOString() },
      { logName: 'Log entry ' + id + '-2', timestamp: new Date().toISOString() },
      { logName: 'Log entry ' + id + '-3', timestamp: new Date().toISOString() },
    ];
    res.json(data);
  });

  authentication(router);
  emojis(router);
  return router;
};
    `;
    await writeToFileForced(filePath, content);
};
