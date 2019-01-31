import {Base64} from 'js-base64'
import get from './get'

export default class Song {
    constructor({id, mid, singer, name, album, duration, image, url}) {
        this.id = id;
        this.mid = mid;
        this.singer = singer;
        this.name = name;
        this.album = album;
        this.duration = duration;
        this.image = image;
        this.url = url;
    }

    getSongLyric () {
        if (this.lyric) {
            return Promise.resolve(this.lyric);
        }
        return new Promise(async (resolve, reject) => {
            let {retcode, lyric} = await get(`/song/lyric?songmid=${this.mid}`);
            if (retcode === 0) {
                this.lyric = Base64.decode(lyric);
                resolve(this.lyric);
            } else {
                reject('no lyric');
            }
        });
    }
}

export function createSong(musicData, vkey = '') {
    return new Song({
        id: musicData.songid,
        mid: musicData.songmid,
        singer: filterSinger(musicData.singer),
        name: musicData.songname,
        album: musicData.albumname,
        duration: musicData.interval,
        image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
        url: `http://isure.stream.qqmusic.qq.com/C400${musicData.strMediaMid || musicData.songmid}.m4a?guid=5448538077&vkey=${vkey}&uin=0&fromtag=66`
    });
}

//  处理歌曲的歌手名称
export function filterSinger(singer) {
    let ret = [];
    if (!singer) {
        return '';
    }
    singer.forEach((s) => {
        ret.push(s.name);
    });
    return ret.join(' / ');
}
