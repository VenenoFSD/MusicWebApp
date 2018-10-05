import {playMode} from "../common/js/config";
import {loadSearch, loadPlay, loadFavorite} from "../common/js/cache";

const state = {
    singer: {},
    //  播放器相关
    playing: false,
    fullScreen: false,
    playlist: [],  //  当前播放列表，受播放模式影响
    sequenceList: [],
    mode: playMode.sequence,
    currentIndex: -1,

    disc: {},  //  推荐歌单
    topList: {},  //  排行榜
    searchHistory: loadSearch(),  //  搜索历史[从本地存储读取]
    playHistory: loadPlay(),  //  最近播放
    favoriteList: loadFavorite()
};

export default state
