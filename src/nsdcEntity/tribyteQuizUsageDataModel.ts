import {Entity, Column, PrimaryColumn} from 'typeorm';
import { transports } from 'winston';

@Entity('tribyte_quiz_usage_data')
export default class TribyteQuizUsagedata {
    @PrimaryColumn()
    uid!: number;
    @Column({nullable: true, name: 'user_email'})
    userEmail: string;
    @Column({nullable: true, name: 'tquiz_id'})
    tquizId: number;
    @Column({nullable: true, name: 'tquiz_title'})
    tquizTitle: string;
    @Column({nullable: true, name: 'quiz_type'})
    quizType: string;
    @Column({nullable: true, name: 'pass_score'})
    passScore: number;
    @Column({nullable: true, name: 'user_score'})
    userScore: number;
    @Column({nullable: true, name: 'attempt_starttime'})
    attemptStarttime: number;
    @Column({nullable: true, name: 'attempt_endtime'})
    attemptEndtime: number;
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
    @Column({ name: 'tlesson_title', nullable:true})
    tlessonTitle: string;
    @Column({nullable: true, name: 'final_assessment'})
    finalAssessment: number;

    public static create (obj:any): TribyteQuizUsagedata {
      const tbj: TribyteQuizUsagedata = new TribyteQuizUsagedata();
      tbj.uid = obj.uid;
      tbj.userEmail = obj.user_email;
      tbj.tquizId = obj.tquiz_id;
      tbj.tquizTitle =  obj.tquiz_title;
      tbj.quizType =  obj.quiz_type;
      tbj.passScore = obj.pass_score;
      tbj.userScore =  obj.user_score;
      tbj.attemptStarttime = obj.attempt_starttime;
      tbj.attemptEndtime = obj.attempt_endtime;
      tbj.tcourseId = obj.tcourse_id;
      tbj.tcourseTitle = obj.tcourse_title;
      tbj.tmoduleId = obj.tmodule_id;
      tbj.tmoduleTitle = obj.tmodule_title;
      tbj.tlessonId =  obj.tlesson_id;
      tbj.tlessonTitle = obj.tlesson_title;
      tbj.finalAssessment = obj.final_assessment;
      return tbj;
    }
}