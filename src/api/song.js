import {commonParams} from "./config";
import axios from 'axios'

export function getLyric(songmid) {  //  歌词
    const url = commonParams.prefix + '/getLyric';
    const data = Object.assign({}, commonParams, {
        hostUin: 0,
        format: 'json',
        platform: 'yqq',
        needNewCode: 0,
        pcachetime: +new Date(),
        songmid
    });
    return axios.get(url, {
        params: data
    }).then((res) => {
        return Promise.resolve(res.data);
    });
}

export function getSongVkey(songmid, strMediaMid) {  //  歌曲vkey
    const url = commonParams.prefix + '/getVkey';
    const data = Object.assign({}, commonParams, {
        hostUin: 0,
        format: 'json',
        platform: 'yqq',
        needNewCode: 0,
        cid: 205361747,
        uin: 0,
        guid: 5448538077,
        songmid,
        filename: `C400${strMediaMid}.m4a`
    });
    return axios.get(url, {
        params: data
    }).then((res) => {
        return Promise.resolve(res.data);
    });
}
