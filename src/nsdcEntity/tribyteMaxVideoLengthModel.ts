import {Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('tribyte_max_video_length')
export default class TribyteMaxVideoLength {

    @Column({name: 'tcourse_id'})
    tcourseId:string;

    @Column({name: 'tmodule_id'})
    tmoduleId: string

    @Column({name: 'tlesson_id'})
    tlessonId: string

    @PrimaryColumn({name: 'tvideo_id'})
    tvideoId: string

    @Column({name: 'lang'})
    lang: string

    @Column({name: 'video_length_in_sec'})
    videoLengthInSec: number

    public static create (obj: any):TribyteMaxVideoLength {
        const tbj : TribyteMaxVideoLength = new TribyteMaxVideoLength();

        tbj.tcourseId = obj.tcourse_id;
        tbj.tmoduleId = obj.tmodule_id;
        tbj.tlessonId = obj.tlesson_id;
        tbj.tvideoId = obj.tvideo_id;
        tbj.lang = obj.Lang;

        const times: string [] = obj['video_length_in_mins/sec'].split('.');
        let timeInSec : number = 0;
        if(times.length === 3) {
            // tslint:disable-next-line: radix
            timeInSec = Number.parseInt(times[0])*3600
            // tslint:disable-next-line: radix
            + Number.parseInt(times[1])*60 + Number.parseInt(times[2]);
        } else if (times.length === 2) {
            // tslint:disable-next-line: radix
            timeInSec = Number.parseInt(times[0])*60 + Number.parseInt(times[1]);
        } else if (times.length === 1) {
            // tslint:disable-next-line: radix
            timeInSec = Number.parseInt(times[0]);
        }
        tbj.videoLengthInSec = timeInSec;
        return tbj;

    }

}