import { NextFunction, Request, Response } from 'express';
import { Client } from 'ssh2';
import { query } from '../db';
import { LogType, MetadataType, ProjectMetadata } from '../models';

export const getVmLogOutput = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const projectId = Number(req.query.projectId || '');
        const logType = req.query.logType as LogType;

        if (!projectId || !['frontend', 'backend'].includes(logType)) {
            res.status(400).json({ error: 'Invalid parameters' });
            return;
        }

        const output = await getVmLogOutputAsyncFromSSH(
            projectId,
            logType
        );
        res.json({ log: output });
    } catch (error) {
        next(error);
    }
};

export const getVmLogOutputAsyncFromSSH = async (
    projectId: number,
    logType: LogType
) => {
    const project = await query<ProjectMetadata>(
        MetadataType.Project,
        projectId
    );
    if (!project || !project.azureVmIp) {
        throw new Error('Project not found or VM IP is missing');
    }

    const vmIp = project.azureVmIp;
    const sshUsername = 'azureuser';
    const sshPassword = 'Secret123';

    const command =
        logType === 'frontend'
            ? 'journalctl -u nginx -n 70 --no-pager'
            : 'journalctl -u backend.service -n 70 --no-pager';

    return new Promise<string>((resolve, reject) => {
        const conn = new Client();
        let output = '';

        conn.on('ready', () => {
            conn.exec(command, (err: any, stream: any) => {
                if (err) {
                    reject(`Error executing command: ${err.message}`);
                    conn.end();
                    return;
                }

                stream
                    .on('close', () => {
                        conn.end();
                        resolve(output.trim());
                    })
                    .on('data', (data: any) => {
                        output += data.toString();
                    })
                    .stderr.on('data', (data: any) => {
                        reject(`Error: ${data.toString()}`);
                    });
            });
        })
            .on('error', (err: any) => {
                reject(`SSH Connection Error: ${err.message}`);
            })
            .connect({
                host: vmIp,
                port: 22,
                username: sshUsername,
                password: sshPassword,
            });
    });
};
