import express, { Application } from 'express';
import config from './config/config';
import LOG from './utils/logger';
import actuator from 'express-actuator';
import 'reflect-metadata';
import {createConnections, getConnection} from 'typeorm';
import { insightsCronJob } from './service/insightsDataCronService';
import { parseMaxVideoLength } from './service/videoMaxLengthParser';
import {britanniaCoursesCronJOb} from './service/nsdcDataAggregator';

createConnections([{
    name: 'insights',
    type: 'mysql',
    host: config.INSIGHTS_MYSQL_HOST,
    port: 3306,
    username: config.INSIGHTS_MYSQL_USERNAME,
    password: config.INSIGHTS_MYSQL_PASSWORD,
    database: config.INSIGHTS_MYSQL_DATABASE,
    entities: [__dirname + '/nsdcEntity/*{.js,.ts}'],
    synchronize: false
},{
    name: 'nsdc',
    type: 'mysql',
    host: config.NSDC_MYSQL_HOST,
    port: 3306,
    username: config.NSDC_MYSQL_USERNAME,
    password: config.NSDC_MYSQL_PASSWORD,
    database: config.NSDC_MYSQL_DATABASE,
    entities: [__dirname + '/nsdcEntity/*{.js,.ts}'],
    synchronize: true
}]).then(async connections => {
    const app: Application = express();

    // heath, metrics, info endpoint
    app.use(actuator());

    app.listen(config.PORT, () => {
        LOG.info(`Server listening on port ${config.PORT}`);
    });
    britanniaCoursesCronJOb.start();
    insightsCronJob.start();

    // endpoint  to add meta data
    app.use('/api/v1/loadMetadata', parseMaxVideoLength);
}).catch(error =>
    LOG.error(`Failed to start application , Error connecting to database ${error}`)
);


