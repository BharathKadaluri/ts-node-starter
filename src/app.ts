import express, { Application } from 'express';
import config from './utils/config';
import LOG from './utils/logger';
import actuator from 'express-actuator';
import dotenv from 'dotenv';

const app: Application = express();

// heath, metrics, info endpoint
app.use(actuator());

// dotenv
dotenv.config();

app.listen(config.PORT, () => {
    LOG.info(`Server listening on port ${config.PORT}`);
});