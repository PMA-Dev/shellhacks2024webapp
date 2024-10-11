import express from 'express';

const router = express.Router();

export default (): express.Router => {
    router.use(express.json());
    return router;
};
