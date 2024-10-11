import express from 'express';

import { pushLog, queryAll } from '../db';

export const route = (router: express.Router) => {
    router.get('/data', (req, res) => {
        const id = parseInt(req.query.id as string, 10);
        if (isNaN(id)) {
            return res
                .status(400)
                .json({ error: 'Invalid or missing id query parameter' });
        }
        queryAll().then((data) => {
            res.json(data);
        });
    });

    // New route to handle POST requests to /post
    router.post('/post', (req, res) => {
        const logData = req.body;

        // Basic validation to ensure required fields are present
        if (!logData || !logData.logName || !logData.timestamp) {
            return res.status(400).json({ error: 'Missing required log data' });
        }

        // Push the log to the database
        pushLog(logData)
            .then((newLogId) => {
                res.json({ success: true, id: newLogId });
            })
            .catch((err) => {
                res.status(500).json({ error: err.message });
            });
    });
};
