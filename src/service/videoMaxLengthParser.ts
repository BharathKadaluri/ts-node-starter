import fs from 'fs';
import csvParser from 'csv-parser';
import config from '../config/config';
import LOG from '../utils/logger';
import {getConnection, getRepository} from 'typeorm';
import TribyteMaxVideoLength from '../nsdcEntity/tribyteMaxVideoLengthModel';

const parseMaxVideoLength = () => {
    const nsdcConnection = getConnection('nsdc');
    const tribyteMaxVideoLengthRepo =  nsdcConnection.getRepository(TribyteMaxVideoLength);

    fs.createReadStream(config.MAX_VIDEO_LENGTH_FILE)
        .pipe(csvParser())
        .on('data', (data) => tribyteMaxVideoLengthRepo.save(TribyteMaxVideoLength.create(data)))
        .on('end', () => {
            LOG.info(`finished reading csv file`)
        })
}

export {parseMaxVideoLength}