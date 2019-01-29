import {commonParams, options} from "./config"
import axios from 'axios'
import jsonp from "../common/js/jsonp";

export function getTopList() {  //  排行榜
    const url = commonParams.prefix + '/getTopList';
    const data = Object.assign({}, commonParams, {
        platform: 'h5',
        needNewCode: 1,
        format: 'json',
        uin: 0,
    });
    return axios.get(url, {
        params: data
    }).then((res) => {
        return Promise.resolve(res.data);
    });
}

export function getTopListSongs(topid) {  //  排行榜歌曲列表
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg';
    const data = Object.assign({}, commonParams, {
        uin: 0,
        platform: 'h5',
        needNewCode: 1,
        type: 'top',
        page: 'detail',
        topid,
        tpl: 3
    });
    return jsonp(url, data, options);
}
