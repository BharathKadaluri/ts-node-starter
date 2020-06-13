
import { Entity, PrimaryColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn} from 'typeorm';

@Entity('nsdc_course_batches')
export default class NsdcCourseBatch extends BaseEntity {

    @PrimaryColumn({name: 'course_id'})
    courseId!: string;

    @Column({name: 'batch_id'})
    batchId!: string;

    @Column()
    language!: string;

    @Column({name:'institute_id', default: '1111'})
    institueId: string

    @Column()
    country!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}