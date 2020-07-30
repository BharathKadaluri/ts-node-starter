import {getConnection, EntityManager, getRepository} from 'typeorm';
import LOG from '../utils/logger';
import NsdcUser from '../nsdcEntity/nsdcUserModel';
import TribyteQuizUsagedata from '../nsdcEntity/tribyteQuizUsageDataModel';
import moment from 'moment';
import {CronJob} from 'cron';
import config from '../config/config';


const GRADED = 'Graded';
const PARTICIPATION = 'Participation';
const CERTIFICATION_ISSUE_DATE = '2020-08-10 00:00:00';
const GRADED_QUIZ_PERCENTAGE = 40;
const OVERALL_COMPLETIRION_PERCENTAGE = 50;
const INDIVIDUAL_COMPLETIRION_PERCENTAGE = 50;


const NSDC_DATE_FORMAT = 'yyyy-MM-DD hh:mm:ss';

const getMaxVideoUsageDataMap = async(nsdcManager: EntityManager) => {

    const moduleMaxData = await nsdcManager
    .query(`select tmodule_id as tmoduleId, sum(video_length_in_sec) as videoLength from tribyte_max_video_length group by tmodule_id`);
    const moduleMaxLengthMap = new Map();
    const moduleMaxVideoData = JSON.parse(JSON.stringify(moduleMaxData))
    moduleMaxVideoData.map((x: ModuleMaxVideo) =>
        // tslint:disable-next-line: radix
        moduleMaxLengthMap.set(Number.parseInt(x.tmoduleId), Number.parseInt(x.videoLength)));
    LOG.info(`MaxModuleLength Map ${moduleMaxLengthMap}`);

    const courseMaxData = await nsdcManager
    .query(`select tcourse_id as tcourseId, sum(video_length_in_sec) as videoLength from tribyte_max_video_length group by  tcourse_id`);
    const courseMaxLengthMap = new Map();
    const courseMaxVideoData = JSON.parse(JSON.stringify(courseMaxData))
    courseMaxVideoData.map((x: CourseMaxVideo) =>
        // tslint:disable-next-line: radix
        courseMaxLengthMap.set(Number.parseInt(x.tcourseId), Number.parseInt(x.videoLength)));
    LOG.info(`Course Max lengthMap ${courseMaxLengthMap}`)

    return {moduleMaxLengthMap, courseMaxLengthMap}
}

const computeLogicForBritanniaCourses = async () => {
    LOG.info(`Running Cron Job to update Britannia Courses`)
    const nsdcManager = getConnection('nsdc').manager;
    const {moduleMaxLengthMap, courseMaxLengthMap} = await getMaxVideoUsageDataMap(nsdcManager);


    const userCourseVideo = await nsdcManager
    .query(`select user_email as userEmail, tcourse_id as tcourseId, sum(duration) as duration from tribyte_video_usage_data group by tcourse_id, user_email`)

    const userCourseVideoData = JSON.parse(JSON.stringify(userCourseVideo));

    LOG.info(`Course Watch Video Data length :: ${userCourseVideoData.length}`)
    const nsdcUserRepo = nsdcManager.getRepository(NsdcUser);
    const tribyteQuizUsagedataRepo = nsdcManager.getRepository(TribyteQuizUsagedata);


    // LOOP through video usage
    userCourseVideoData.forEach(async (x:UserCourseVideo) => {
       try {
        // Get the user from nsdcUser if the user doesnot exist create one
        LOG.info(`user email ${x.userEmail}`)
        const emailArr = x.userEmail.split('@');
        const checkNumber = Number.parseInt(emailArr[0], 10);
        if(Number.isNaN(checkNumber)){
            LOG.info(`CandidateId ${emailArr[0]} , Email ${x.userEmail} is local  email hence not updating`)
            return;
        }
        const users : NsdcUser [] = await nsdcUserRepo
        .find({where:{candidateId: emailArr[0], candidateLmsCourseId: x.tcourseId}});
        let user: NsdcUser;

        if(users.length === 0){
            LOG.info(`Could not find user ${x.userEmail} in nsdc_users table, creating a new entry`)
            user = new NsdcUser();
            user.candidateId = emailArr[0];
            user.candidateLmsCourseId = x.tcourseId.toString();
            // handle course id
        } else{
            LOG.info(`Found user with ${x.userEmail} in nsdc_users table ${users[0]}`)
            user = users[0];
        }
        user.certificationIssueDate = CERTIFICATION_ISSUE_DATE;
        // Check if user has taken the quiz for the course
        const tribyteQuizUsagedatas:  TribyteQuizUsagedata[] =
            await tribyteQuizUsagedataRepo
            .find({where:{userEmail: x.userEmail, tcourseId: x.tcourseId}});

        LOG.info(`quiz data for ${x.userEmail}  course ${x.tcourseId} is ${JSON.stringify(tribyteQuizUsagedatas)}`);
        if(tribyteQuizUsagedatas.length !== 0){
            const userQuizData: TribyteQuizUsagedata =  tribyteQuizUsagedatas[0];
            if(userQuizData.userScore >= GRADED_QUIZ_PERCENTAGE) {
                LOG.info(`User ${user.candidateId} has quiz score ${userQuizData.userScore} greater than,
                ${GRADED_QUIZ_PERCENTAGE}`)
            // if taken and >=40
                // set course_status = 4
                // set certification_status = 1;
                // certification_type = 'Graded'
                user.courseStatus = '4';
                user.certificationStatus = '1';
                user.certificationType = GRADED;
            }
            // assessment_taken = 1;
            // assessment_percentage = %
            // assessment_date =
            // certification_percentage =
            user.assessmentTaken = '1';
            user.assessmentPercentage = userQuizData.userScore.toString();
            user.assessmentDate = moment.unix(userQuizData.attemptEndtime).format(NSDC_DATE_FORMAT);
            user.certificationPercentage = userQuizData.userScore.toString();

        } else {
            user.assessmentTaken = '0';
        }

     /*   const userCourseVideoWatchData = await nsdcManager
        .query(`select user_email as userEmail, tcourse_id as tcourseId,
        sum(duration) as duratiom from tribyte_video_usage_data group by
        // tslint:disable-next-line: max-line-length
        tcourse_id, user_email having user_email = \'${x.userEmail}\' 
        and tcourse_id = ${x.tcourseId}`);
        const userCourseWatchVideos: UserCourseVideo[] = JSON
        .parse(JSON.stringify(userCourseVideoWatchData));

        const userCourseWatchVideo: UserCourseVideo = userCourseWatchVideos[0];

        LOG.info(`Video Usage data for user ${x.userEmail} is 
        ${JSON.stringify(userCourseWatchVideo)}`) 
        */
        const coursePercent = Math.
        ceil((x.duration/(courseMaxLengthMap
            .get(x.tcourseId)))*100);
        LOG.info(`Course percent for ${x.userEmail} is ${coursePercent}, max length  :: ${courseMaxLengthMap
            .get(x.tcourseId)}, courseId :: ${x.tcourseId} duration :: ${x.duration}`);
        user.courseCompletionPencentage = coursePercent.toString();
        // Get coursewise duration
        // compute percentage
        // course_completion_percentage
        // check  course_status !==4
        // tslint:disable-next-line: radix
        if(user.courseStatus !== '4'){
        // tslint:disable-next-line: radix
            if(coursePercent >= OVERALL_COMPLETIRION_PERCENTAGE &&
                checkIndividualModuleProgress(x, moduleMaxLengthMap, nsdcManager)){
                // check if overall percentage is >= 50 && check individual >=40
                    user.courseStatus = '3';
                    user.certificationStatus = '1';
                    user.certificationType = PARTICIPATION;
                        // set course_status = 3
                        // set certification_status = 1;
                        // certification_type = 'Participation'

            } else if (user.assessmentTaken === '1') {
                        // else if  assessment_taken = 1
                        // set course_status = 2
                        // set certification_status = 0;
                        user.courseStatus = '2';
                        user.certificationStatus = '0';
            } else {    // else
                        // set course_status = 1
                        // set certification_status = 0
                        user.courseStatus = '1';
                        user.certificationStatus = '0';
            }
        }
        LOG.info(`persisiting for user ${JSON.stringify(user)}`)
        nsdcUserRepo.save(user);
    }catch(error) {
        LOG.error(`Error ${JSON.stringify(error)}`)
    }
    });

    // loop quiz data
    // check if it exists in video data
    //   if exists skip
    //   else
   const nsdcQuizUsage = await nsdcManager.query('SELECT user_email as userEmail, user_score as userScore, tcourse_id as tcourseId, attempt_endtime as attemptEndtime FROM tribyte_quiz_usage_data')
   const nsdcQuizUsageData = JSON.parse(JSON.stringify(nsdcQuizUsage));

   nsdcQuizUsageData.forEach( async (x: UserQuiz) => {

        const userCovered = userCourseVideoData
        .filter((y:UserCourseVideo) => {
            LOG.info(`video usage and quiz data comparision video :: ${y.userEmail} :: quiz :: ${x.userEmail}`)
            return y.userEmail === x.userEmail
        })

        LOG.info(`userCovered value ${JSON.stringify(userCovered)}`)
        if(userCovered.length === 0) {
          LOG.info(`quiz done but not watch video user_email ${x.userEmail}`)
        }

       /* if(userCovered.length === 0){
            try {
                // Get the user from nsdcUser if the user doesnot exist create one
                LOG.info(`user email ${x.userEmail}`)
                const emailArr = x.userEmail.split('@');
                const checkNumber = Number.parseInt(emailArr[0], 10);
                if(Number.isNaN(checkNumber)){
                    LOG.info(`CandidateId ${emailArr[0]} , Email ${x.userEmail} is local  email hence not updating`)
                    return;
                }
                const users : NsdcUser [] = await nsdcUserRepo
                .find({where:{candidateId: emailArr[0], candidateLmsCourseId: x.tcourseId}});
                let user: NsdcUser;

                if(users.length === 0){
                    LOG.info(`Could not find user ${x.userEmail} in nsdc_users table, creating a new entry`)
                    user = new NsdcUser();
                    user.candidateId = emailArr[0];
                    user.candidateLmsCourseId = x.tcourseId.toString();
                    // handle course id
                } else{
                    LOG.info(`Found user with ${x.userEmail} in nsdc_users table ${users[0]}`)
                    user = users[0];
                }

                if(x.userScore >= GRADED_QUIZ_PERCENTAGE) {
                    LOG.info(`User ${user.candidateId} has quiz score ${x.userScore} greater than,
                    ${GRADED_QUIZ_PERCENTAGE}`)
                // if taken and >=40
                    // set course_status = 4
                    // set certification_status = 1;
                    // certification_type = 'Graded'
                    user.courseStatus = '4';
                    user.certificationStatus = '1';
                    user.certificationType = GRADED;
                }
                // assessment_taken = 1;
                // assessment_percentage = %
                // assessment_date =
                // certification_percentage =
                user.assessmentTaken = '1';
                user.assessmentPercentage = x.userScore.toString();
                user.assessmentDate = moment.unix(x.attemptEndtime).format(NSDC_DATE_FORMAT);
                user.certificationPercentage = x.userScore.toString();
                nsdcUserRepo.save(user);
            }  catch(error) {
                LOG.error(`Error ${JSON.stringify(error)}`)
            }
            
        } */
    });

}

const checkIndividualModuleProgress = async(userCourseVideo :UserCourseVideo,
    moduleMaxLengthMap:Map<number, number>, nsdcManager:EntityManager) => {
        let done = true;
        LOG.info(`userCourseVideo ${JSON.stringify(userCourseVideo)}`)
        const userModuleVideoData = await nsdcManager
        .query(`select user_email as userEmail, tmodule_id as tmoduleId,
        sum(duration) as duratiom from tribyte_video_usage_data group by tmodule_id, user_email, tcourse_id
         having tcourse_id = \'${userCourseVideo.tcourseId}\' and user_email = \'${userCourseVideo.userEmail}\'`);

        const userModuleArray: UserModuleVideo[] = JSON.parse(JSON.stringify(userModuleVideoData));
        if (userModuleArray.length === 0){
            done = false;
        } else {
            userModuleArray.forEach((x: UserModuleVideo) => {
                const maxModuleLength = moduleMaxLengthMap.get(x.tmoduleId) || x.duration;
                if((x.duration/maxModuleLength)*100 < INDIVIDUAL_COMPLETIRION_PERCENTAGE){
                    done = false;
                }
            });
        }
        return done;
}
interface ModuleMaxVideo {
    tmoduleId: string;
    videoLength: string;
}

interface CourseMaxVideo {
    tcourseId: string;
    videoLength: string;
}

interface UserModuleVideo {
    userEmail: string;
    tmoduleId: number;
    duration: number;
}

interface UserCourseVideo {
    userEmail: string;
    tcourseId: number;
    duration: number;
}

interface UserQuiz {
    userEmail: string;
    userScore: number;
    tcourseId: number;
    attemptEndtime: number
}


const britanniaCoursesCronJOb = new CronJob(config.NSDC_USERS_TABLE_UPDATE_CRON, 
    computeLogicForBritanniaCourses)
export {britanniaCoursesCronJOb}