//  搜索历史、播放历史 - 本地存储
import storage from 'good-storage'

const SEARCH_KEY = '__search__';
const SEARCH_MAX_LENGTH = 15;  //  最多存储15条数据

const PLAY_KEY = '__play__';
const PLAY_MAX_LENGTH = 200;

const FAVORITE_KEY = '__favorite__';
const FAVORITE_MAX_LENGTH = 200;

function insertArray (arr, val, compare, maxLength) {
    //  功能：将新元素插到数组前面，检查是否重复，控制长度在 SEARCH_MAX_LENGTH 以内
    const index = arr.findIndex(compare);
    if (index === 0) {  //  记录重复且原来的数据在第一条
        return;
    }
    if (index > 0) {  //  记录重复且原来的数据不在第一条
        arr.splice(index, 1);
    }
    arr.unshift(val);
    if (maxLength && arr.length > maxLength) {
        arr.pop();
    }
}

function deleteFromArray (arr, compare) {
    const index = arr.findIndex(compare);
    if (index > -1) {
        arr.splice(index, 1);
    }
}

export function saveSearch (query) {  //  搜索记录存储到本地
    let searches = storage.get(SEARCH_KEY, []);
    insertArray(searches, query, (item) => item === query, SEARCH_MAX_LENGTH);
    storage.set(SEARCH_KEY, searches);
    return searches;
}

export function deleteSearch (query) {  //  从本地删除搜索记录
    let searches = storage.get(SEARCH_KEY, []);
    deleteFromArray(searches, (item) => item === query);
    storage.set(SEARCH_KEY, searches);
    return searches;
}

export function clearSearch () {  //  从本地清空搜索记录
    storage.remove(SEARCH_KEY);
    return [];
}

export function loadSearch () {  //  从本地提取搜索记录
    return storage.get(SEARCH_KEY, []);
}

export function savePlay (song) {  //  最近播放记录存储到本地
    let songs = storage.get(PLAY_KEY, []);
    insertArray(songs, song, (item) => item.id === song.id, PLAY_MAX_LENGTH);
    storage.set(PLAY_KEY, songs);
    return songs;
}

export function loadPlay () {  //  从本地提取最近播放记录
    return storage.get(PLAY_KEY, []);
}

export function saveFavorite (song) {
    let songs = storage.get(FAVORITE_KEY, []);
    insertArray(songs, song, (item) => item.id === song.id, FAVORITE_MAX_LENGTH);
    storage.set(FAVORITE_KEY, songs);
    return songs;
}

export function deleteFavorite (song) {
    let songs = storage.get(FAVORITE_KEY, []);
    deleteFromArray(songs, (item) => item.id === song.id);
    storage.set(FAVORITE_KEY, songs);
    return songs;
}

export function loadFavorite () {
    return storage.get(FAVORITE_KEY, []);
}
