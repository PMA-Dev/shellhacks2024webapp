import { NextFunction, Request, Response } from 'express';
import { runCmdAsync } from '../shellProxy';

export const refreshAzureCredentials = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const output = await runCmdAsync('az', ['account', 'show'], {
            join: true,
        });
        const data = JSON.parse((output || '').trim() || '{}');
        res.json(data);
    } catch (error) {
        next(error);
    }
};

export const getResourceGroups = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const output = await runCmdAsync(
            'az',
            ['group', 'list', '-o', 'json'],
            {
                join: true,
                fail: true,
            }
        );
        if (output?.includes('ERROR')) {
            throw new Error(output);
        }
        const parsed = JSON.parse((output || '').trim() || '[]');
        const mapped = parsed.map((g: any) => ({
            id: g.id,
            name: g.name,
            location: g.location,
        }));
        res.json(mapped);
    } catch (error) {
        if (
            (error as Error).message.includes(
                'The refresh token has expired due to inactivity'
            )
        ) {
            res.status(400).json({
                error: 'Azure credentials expired. Please login again using this command: `az login --scope https://management.core.windows.net//.default` in your terminal.',
            });
        } else if ((error as Error).message.includes('AADSTS50076')) {
            res.status(400).json({
                error: (error as Error).message,
                cmd: 'az login --use-device-code',
            });
        }
        next(error);
    }
};

export const getResourcesInGroup = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const rgName = req.query.rgName as string;
        if (!rgName) {
            res.status(400).json({ error: 'rgName is required' });
            return;
        }
        const output = await runCmdAsync(
            'az',
            ['resource', 'list', '--resource-group', rgName, '-o', 'json'],
            {
                join: true,
            }
        );
        const parsed = JSON.parse((output || '').trim() || '[]');
        const mapped = parsed.map((r: any) => ({
            id: r.id,
            name: r.name,
            type: r.type,
            location: r.location,
        }));
        res.status(200).json(mapped);
    } catch (error) {
        next(error);
    }
};

export const terraformApply = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const subIdOutput = await runCmdAsync(
            'az',
            ['account', 'show', '--query', 'id', '-o', 'tsv'],
            {
                join: true,
            }
        );
        const subId = subIdOutput?.trim();
        const prefix = (req.query.prefix as string) || 'myproj';
        const adminPassword =
            (req.query.admin_password as string) || 'Secret123';
        await runCmdAsync('terraform', ['-chdir=./infra', 'init'], {
            join: true,
        });
        const applyOutput = await runCmdAsync(
            'terraform',
            [
                '-chdir=./infra',
                'apply',
                '-auto-approve',
                '-var',
                `subscription_id=${subId}`,
                '-var',
                `prefix=${prefix}`,
                '-var',
                `admin_password=${adminPassword}`,
            ],
            { join: true }
        );
        res.json({ output: applyOutput });
    } catch (error) {
        next(error);
    }
};

export const terraformDestroy = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const subIdOutput = await runCmdAsync(
            'az',
            ['account', 'show', '--query', 'id', '-o', 'tsv'],
            {
                join: true,
            }
        );
        const subId = subIdOutput?.trim();
        const prefix = (req.query.prefix as string) || 'myproj';
        const adminPassword =
            (req.query.admin_password as string) || 'Secret123';
        await runCmdAsync('terraform', ['-chdir=./infra', 'init'], {
            join: true,
        });
        const destroyOutput = await runCmdAsync(
            'terraform',
            [
                '-chdir=./infra',
                'destroy',
                '-auto-approve',
                '-var',
                `subscription_id=${subId}`,
                '-var',
                `prefix=${prefix}`,
                '-var',
                `admin_password=${adminPassword}`,
            ],
            { join: true }
        );
        res.json({ output: destroyOutput });
    } catch (error) {
        next(error);
    }
};
