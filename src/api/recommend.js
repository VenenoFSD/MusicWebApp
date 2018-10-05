import jsonp from '../common/js/jsonp'
import {commonParams, options} from "./config"
import axios from 'axios'

export function getRecommend() {  //  轮播图
    const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg';
    const data = Object.assign({}, commonParams, {
        uin: 0,
        platform: 'h5',
        needNewCode: 1
    });
    return jsonp(url, data, options);
}

export function getDiscList() {  //  推荐歌单
    const url = '/api/getDiscList';
    const data = Object.assign({}, commonParams, {
        picmid: 1,
        platform: 'yqq',
        needNewCode: 0,
        categoryId: 10000000,
        sortId: 5,
        sin: 0,
        ein: 29,
        hostUin: 0,
        format: 'json',
        rnd: Math.random()
    });
    return axios.get(url, {
        params: data
    }).then((res) => {
        return Promise.resolve(res.data);
    });
}

export function getDiscSongList(dissid) {  //  推荐歌单歌曲列表
    const url = '/api/getDiscSongList';
    const data = Object.assign({}, commonParams, {
        type: 1,
        json: 1,
        utf8: 1,
        onlysong: 0,
        disstid: dissid,
        hostUin: 0,
        platform: 'yqq',
        needNewCode: 0,
    });
    return axios.get(url, {
        params: data
    }).then((res) => {
        return Promise.resolve(res.data);
    });
}
