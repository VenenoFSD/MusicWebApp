import * as types from './mutation-types'
import {playMode} from "../common/js/config";
import {shuffle} from "../common/js/util";
import {saveSearch, deleteSearch, clearSearch, savePlay, saveFavorite, deleteFavorite} from "../common/js/cache";

//  选择歌曲播放
export const selectPlay = function ({commit, state}, {list, index}) {
    //  数据修改
    commit(types.SET_SEQUENCE_LIST, list);

    if (state.mode === playMode.random) {
        let randomList = shuffle(list);
        commit(types.SET_PLAYLIST, randomList);
        index = findIndex(randomList, list[index]);
    } else {
        commit(types.SET_PLAYLIST, list);
    }

    commit(types.SET_CURRENT_INDEX, index);
    commit(types.SET_FULL_SCREEN, true);
    commit(types.SET_PLAYING_STATE, true);
};

//  随机播放全部
export const randomPlay = function ({commit}, {list}) {
    commit(types.SET_PLAY_MODE, playMode.random);
    commit(types.SET_SEQUENCE_LIST, list);
    let randomList = shuffle(list);
    commit(types.SET_PLAYLIST, randomList);
    commit(types.SET_CURRENT_INDEX, 0);
    commit(types.SET_FULL_SCREEN, true);
    commit(types.SET_PLAYING_STATE, true);
};

function findIndex(list, song) {
    return list.findIndex((item) => {
        return item.id === song.id;
    });
}

export const insertSong = function ({commit, state}, song) {  //  在搜索结果点击播放时调用
    let playlist = state.playlist.slice();
    let sequenceList = state.sequenceList.slice();
    let currentIndex = state.currentIndex;
    let currentSong = playlist[currentIndex];

    //  playlist
    let fpIndex = findIndex(playlist, song);  //  检查插入的歌曲是否已经在播放列表中并返回索引
    currentIndex++;  //  插入歌曲的位置
    playlist.splice(currentIndex, 0, song);  //  插入
    if (fpIndex > -1) {  //  插入的歌曲之前已经在播放列表中，将其删除
        if (currentIndex > fpIndex) {
            playlist.splice(fpIndex, 1);
            currentIndex--;
        } else {
            playlist.splice(fpIndex + 1, 1);
        }
    }

    //  sequenceList
    let currentSIndex = findIndex(sequenceList, currentSong) + 1;  //  在sequenceList中插入的位置
    let fsIndex = findIndex(sequenceList, song);
    sequenceList.splice(currentSIndex, 0, song);
    if (fsIndex > -1) {  //  插入的歌曲之前已经在播放列表中，将其删除
        if (currentSIndex > fsIndex) {
            sequenceList.splice(fsIndex, 1);
        } else {
            sequenceList.splice(fsIndex + 1, 1);
        }
    }

    commit(types.SET_PLAYLIST, playlist);
    commit(types.SET_SEQUENCE_LIST, sequenceList);
    commit(types.SET_CURRENT_INDEX, currentIndex);
    commit(types.SET_FULL_SCREEN, true);
    commit(types.SET_PLAYING_STATE, true);
};

export const saveSearchHistory = function ({commit}, query) {  //  存储搜索历史到本地
    commit(types.SET_SEARCH_HISTORY, saveSearch(query));
};

export const deleteSearchHistory = function ({commit}, query) {  //  从本地删除搜索历史
    commit(types.SET_SEARCH_HISTORY, deleteSearch(query));
};

export const clearSearchHistory = function ({commit}) {  //  清空搜索历史
    commit(types.SET_SEARCH_HISTORY, clearSearch());
};

export const deleteSong = function ({commit, state}, song) {
    let playlist = state.playlist.slice();
    let sequenceList = state.sequenceList.slice();
    let currentIndex = state.currentIndex;

    let pIndex = findIndex(playlist, song);
    playlist.splice(pIndex, 1);

    let sIndex = findIndex(sequenceList, song);
    sequenceList.splice(sIndex, 1);

    if (currentIndex > pIndex || currentIndex === playlist.length) {
        currentIndex--;
    }

    commit(types.SET_PLAYLIST, playlist);
    commit(types.SET_SEQUENCE_LIST, sequenceList);
    commit(types.SET_CURRENT_INDEX, currentIndex);

    const playingState = playlist.length > 0;
    commit(types.SET_PLAYING_STATE, playingState);
};

export const deleteSongList = function ({commit}) {
    commit(types.SET_PLAYLIST, []);
    commit(types.SET_SEQUENCE_LIST, []);
    commit(types.SET_CURRENT_INDEX, -1);
    commit(types.SET_PLAYING_STATE, false);
};

export const savePlayHistory = function ({commit}, song) {  //  保存播放历史
    commit(types.SET_PLAY_HISTORY, savePlay(song));
};

export const saveFavoriteList = function ({commit}, song) {  //  保存收藏的歌曲
    commit(types.SET_FAVORITE_LIST, saveFavorite(song));
};

export const deleteFavoriteList = function ({commit}, song) {
    commit(types.SET_FAVORITE_LIST, deleteFavorite(song));
};
