import { BlobServiceClient } from '@azure/storage-blob';
import { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import { pushMetadata, query, queryAll } from '../db';
import { ContentMetadata, MetadataType } from '../models';

export const getFileByIdFromDb = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.query.id) {
            res.status(400).json({ error: 'id is required' });
            return;
        }
        const file = await query<ContentMetadata>(
            MetadataType.Content,
            Number(req.query.id)
        );
        res.json(file);
    } catch (error) {
        next(error);
    }
};

export const getAllFilesFromDb = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const files = await queryAll<ContentMetadata>(MetadataType.Content);
        res.json(files);
    } catch (error) {
        next(error);
    }
};

export const uploadFileHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        multer().single('file')(req, res, async (err) => {
            if (err) {
                res.status(400).json({
                    error: 'File upload failed',
                    details: err,
                });
                return;
            }

            if (!req.file) {
                res.status(400).json({ error: 'No file provided' });
                return;
            }

            const { originalname, buffer } = req.file;

            console.log(`File received: ${originalname}`);

            try {
                // Directly stream the file to Azure
                const azureUrl = await uploadFileToAzure(buffer, originalname);
                const metadataId = await pushMetadata(MetadataType.Content, {
                    url: azureUrl,
                    metadata: { filename: originalname },
                });
                res.json({ id: metadataId, url: azureUrl });
            } catch (azureError) {
                console.error('Error uploading file to Azure:', azureError);
                res.status(500).json({
                    error: 'Failed to upload file to Azure',
                });
            }
        });
    } catch (error) {
        next(error);
    }
};

export const uploadFileToAzure = async (
    buffer: Buffer,
    fileName: string
): Promise<string> => {
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;

    if (!connectionString || !containerName) {
        throw new Error(
            'Azure Storage connection string or container name is missing'
        );
    }

    const blobServiceClient =
        BlobServiceClient.fromConnectionString(connectionString);
    const containerClient = blobServiceClient.getContainerClient(containerName);

    const blockBlobClient = containerClient.getBlockBlobClient(fileName);

    await blockBlobClient.uploadData(buffer, {
        blobHTTPHeaders: { blobContentType: 'application/octet-stream' },
    });

    return blockBlobClient.url;
};
