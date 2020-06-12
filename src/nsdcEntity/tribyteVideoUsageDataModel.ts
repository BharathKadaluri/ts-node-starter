import {Entity, Column, PrimaryColumn} from 'typeorm';

@Entity('tribyte_video_usage_data')
export default class TribyteVideoUsageData {

    @Column({nullable: true, name: 'time_of_access'})
    timeOfAccess: number;
    @PrimaryColumn()
    id : number;
    @Column({nullable: true})
    tuserid: number;
    @Column({nullable: true, name: 'user_email'})
    userEmail: string;
    @Column({nullable: true})
    usertype: string;
    @Column({nullable: true, name: 'tbatch_id'})
    tbatchId: number;
    @Column({nullable: true, name: 'classroom_session'})
    classroomSession: string;
    @Column({nullable: true, name: 'tcourse_id'})
    tcourseId: number;
    @Column({nullable: true, name: 'tcourse_title'})
    tcourseTitle: string;
    @Column({nullable: true, name: 'tmodule_id'})
    tmoduleId: number;
    @Column({nullable: true, name: 'tmodule_title'})
    tmoduleTitle: string;
    @Column({nullable: true, name: 'tlesson_id'})
    tlessonId: number;
    @Column({nullable: true, name: 'tlesson_title'})
    tlessonTitle: string;
    @Column({nullable: true, name: 'tvideo_id'})
    tvideoId: number;
    @Column({nullable: true, name: 'tvideo_title'})
    tvideoTitle: string;
    @Column({nullable: true})
    duration: number;
    @Column({nullable: true, name: 'video_type'})
    videoType: string;
    @Column({nullable: true, name: 'app_type'})
    appType: string
    @Column({nullable: true, name: 'tinstitute_id'})
    tinstituteId: number;
    @Column({nullable: true, name: 'completion_status'})
    completionStatus: string;
    @Column({nullable: true, name: 'completion_status_id'})
    completionStatusId: number;
    @Column({nullable: true, name: 'last_execution_timestamp'})
    lastExecutionTimestamp: number

    public static create (obj:any): TribyteVideoUsageData {
        const tbj: TribyteVideoUsageData = new TribyteVideoUsageData();
        tbj.timeOfAccess = obj.time_of_access;
        tbj.id = obj.id;
        tbj.tuserid= tbj.tuserid;
        tbj.userEmail = obj.user_email;
        tbj.usertype = obj.usertype;
        tbj.tbatchId = obj.tbatch_id;
        tbj.classroomSession = obj.classroom_session;
        tbj.tcourseId = obj.tcourse_id;
        tbj.tcourseTitle = obj.tcourse_title;
        tbj.tmoduleId = obj.tmodule_id;
        tbj.tmoduleTitle = obj.tmodule_title;
        tbj.tlessonId = obj.tlesson_id;
        tbj.tlessonTitle = obj.tlesson_title;
        tbj.tvideoId = obj.tvideo_id;
        tbj.tvideoTitle = obj.tvideo_title;
        tbj.duration = obj.duration;
        tbj.videoType = obj.video_type;
        tbj.appType = obj.app_type
        tbj.tinstituteId = obj.tinstitute_id;
        tbj.completionStatus = obj.completion_status;
        tbj.completionStatusId = obj.completion_status_id;
        tbj.lastExecutionTimestamp = obj.last_execution_timestamp;
        return tbj;
      }
}