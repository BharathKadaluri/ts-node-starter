import { Entity, Column, BaseEntity, PrimaryGeneratedColumn,
    CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { transports } from 'winston';

@Entity('nsdc_users')
export default class NsdcUser {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: true, name: 'candidate_id'})
    candidateId: string;

    @Column({nullable: true, name: 'candidate_lms_id'})
    candidateLmsId: string;

    @Column({nullable: true, name: 'candidate_lms_course_id'})
    candidateLmsCourseId: string;

    @Column({nullable: true, name: 'candidate_lms_batch_id'})
    candidateLmsBatchId: string;

    @Column({nullable: true, name: 'course_id'})
    courseId: string;

    @Column({nullable: true, name: 'course_status', default: '0'})
    courseStatus!: string;

    @Column({nullable: true, name: 'course_completion_pencentage', default: '0'})
    courseCompletionPencentage!: string;

    @Column({nullable: true, name: 'course_enrollment_date'})
    courseEnrollmentDate: string;

    @Column({ nullable: true, name: 'course_last_date'})
    courseLastDate: string;

    @Column({default: '0'})
    paid!: string;

    @Column({nullable: true})
    amount: string;

    @Column({nullable: true, name: 'trans_id'})
    transId: string;

    @Column({nullable: true, name: 'certification_status', default: '0'})
    certificationStatus:  string;

    @Column({nullable: true, name: 'certification_issue_date'})
    certificationIssueDate: string;

    @Column({nullable: true, name: 'certification_type'})
    certificationType: string;

    @Column({nullable: true, name: 'certification_percentage'})
    certificationPercentage: string;

    @Column({nullable: true, name: 'assessment_taken', default: '0'})
    assessmentTaken:  string;

    @Column({nullable: true, name: 'assessment_date'})
    assessmentDate: string;

    @Column({nullable: true, name: 'assessment_number_q'})
    assessmentNumberQ: string;

    @Column({nullable: true, name: 'assessment_number_a'})
    assessmentNumberA: string;

    @Column({nullable: true, name: 'assessment_number_c'})
    assessmentNumberC: string;

    @Column({nullable: true, name: 'assessment_percentage'})
    assessmentPercentage: string;

    @Column({nullable: true})
    rating: string;

    @Column({nullable: true})
    review: string;

    @CreateDateColumn({nullable: true})
    createdAt: Date;

    @UpdateDateColumn({nullable: true})
    updatedAt!: Date;
}