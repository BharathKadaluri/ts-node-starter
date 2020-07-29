import { getConnection } from 'typeorm';
import  LOG  from '../utils/logger';
import  TribyteQuizUsagedata from '../nsdcEntity/tribyteQuizUsageDataModel';
import  TribyteVideoUsageData from '../nsdcEntity/tribyteVideoUsageDataModel';
import  NsdcCourseBatch from '../nsdcEntity/nsdcCourseBatchModel';
import {CronJob} from 'cron';
import config from '../config/config';


// Get video usage data
const quizUsageData = async () => {
    const insightsConnection = getConnection('insights');
    const nsdcConnection = getConnection('nsdc');
    // fetch all insights data
    const insightsManager = insightsConnection.manager;
    const tribyteQuizDataRepo = nsdcConnection.getRepository(TribyteQuizUsagedata);


    // fetch the list of video courses list for video consumption
    const quizList = ['16954673', '16965695', '17931611', '999', '19093204', '18860818'];

    quizList.forEach(async quizId => {
        let tribyteQuizUsage = null;
        if (quizId == '17931611') {
            tribyteQuizUsage = await insightsManager.query(`select * from tribyte_quiz_usage_data where tquiz_id = ${quizId} and tcourse_id = 24209`);
        } else if (quizId == '999') {
            tribyteQuizUsage = await insightsManager.query(`select * from tribyte_quiz_usage_data where tquiz_id = 17931611 and tcourse_id = 25356`);
        }
        else {
            tribyteQuizUsage = await insightsManager.query(`select * from tribyte_quiz_usage_data where tquiz_id = ${quizId}`);
        }
        const tribyteQuizUsageJson = JSON.parse(JSON.stringify(tribyteQuizUsage));
        const tribyteQuizArray: TribyteQuizUsagedata[] =
            tribyteQuizUsageJson as TribyteQuizUsagedata[]
        // create a map
        const quizMap = new Map();
        // remove duplicates
        tribyteQuizArray.forEach(x => {
            if (quizMap.has(x.uid)) {
                const entry = quizMap.get(x.uid);
                if (entry.passScore < x.passScore) {
                    quizMap.set(x.uid, x);
                }
            } else {
                quizMap.set(x.uid, x);
            }
        });

        Array.from(quizMap.values()).map(x => tribyteQuizDataRepo.
            save(TribyteQuizUsagedata.create(x)));
    });
}

// Get video usage
const  videoUsageData = async () => {
    const insightsConnection = getConnection('insights');
    const nsdcConnection = getConnection('nsdc');
    const insightsManager = insightsConnection.manager;
    const tribyteVideoDataRepo = nsdcConnection.getRepository(TribyteVideoUsageData);

    // Get all the courses
    // Hard coded courses
    const nsdcCourses = ['24209', '24554','25356', '25740'];

    nsdcCourses.forEach( async courseId => {
        try {
            const tribyteVideoUsageData = await insightsManager
            .query(`select * from tribyte_video_usage_data where tcourse_id = ${courseId} and tvideo_title = "Watch"`);
            const tribyteVideoUsageJson = JSON.parse(JSON.stringify(tribyteVideoUsageData));
            const tribyteVideoArray : TribyteVideoUsageData[] =
                tribyteVideoUsageJson as TribyteVideoUsageData[];
            tribyteVideoArray.map(x => {
                tribyteVideoDataRepo.save(TribyteVideoUsageData.create(x));
            });
        } catch(ex) {
            LOG.error(`Error while getting video usage`)
        }
    });
}

const insightsCronJob = new CronJob(config.INSIGHTS_CRON_JOB, () => {
    LOG.info(`starting cron job to fetch insights data`)
    quizUsageData();
    videoUsageData();
});

export {insightsCronJob}