import jsonp from '../common/js/jsonp'
import {commonParams, options} from "./config"

export function getSingerList() {  //  热门歌手
    /* 新版api
    const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg';
    const data = Object.assign({}, commonParams, {
        hostUin: 0,
        platform: 'yqq',
        needNewCode: 0,
        日本
        data: `{"comm":{"ct":24,"cv":10000},"singerList":{"module":"Music.SingerListServer","method":"get_singer_list","param":{"area":4,"sex":-100,"genre":-100,"index":-100,"sin":0,"cur_page":1}}}`
        欧美
        data: `{"comm":{"ct":24,"cv":10000},"singerList":{"module":"Music.SingerListServer","method":"get_singer_list","param":{"area":5,"sex":-100,"genre":-100,"index":-100,"sin":0,"cur_page":1}}}`

    });
    const options = {};
    */
    /* 老版api*/
    const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg';
    const data = Object.assign({}, commonParams, {
        channel: 'singer',
        page: 'list',
        key: 'all_all_all',
        pagesize: 100,
        pagenum: 1,
        hostUin: 0,
        needNewCode: 0,
        platform: 'yqq'
    });

    return jsonp(url, data, options);
}

export function getSingerDetail(singerId) {  //  歌手详情
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg';
    const data = Object.assign({}, commonParams, {
        hostUin: 0,
        platform: 'yqq',
        needNewCode: 0,
        singermid: singerId,
        order: 'listen',
        begin: 0,
        num: 100,
        songstatus: 1
    });

    return jsonp(url, data, options);
}
