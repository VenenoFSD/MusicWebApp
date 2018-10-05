<template>
    <transition>
        <music-list :title="title" :bgImage="bgImage" :songs="songs" :rank="rank"></music-list>
    </transition>
</template>

<script>
    import MusicList from '../music-list/MusicList'
    import {mapGetters} from 'vuex'
    import {ERR_OK} from "../../api/config";
    import {getTopListSongs} from "../../api/rank";
    import {createSong} from "../../common/js/song";
    import {getSongVkey} from "../../api/song";

    export default {
        name: "TopList",
        data () {
            return {
                songs: [],
                rank: true
            }
        },
        methods: {
            _getTopListSongs () {
                if (!this.topList.id) {
                    this.$router.push('/rank');
                    return;
                }
                getTopListSongs(this.topList.id).then((res) => {
                    if (res.code === ERR_OK) {
                        this.songs = this._normalizeSongs(res.songlist);
                    }
                });
            },
            _normalizeSongs (list) {
                let ret = [];
                list.forEach((item) => {
                    let musicData = item.data;
                    if (musicData.songid && musicData.albumid) {
                        getSongVkey(musicData.songmid, musicData.strMediaMid).then((res) => {
                            if (res.code === ERR_OK) {
                                let vkey = res.data.items[0].vkey;
                                ret.push(createSong(musicData, vkey));
                            }
                        });
                    }
                });
                return ret;
            }
        },
        created () {
            this._getTopListSongs();
        },
        computed: {
            ...mapGetters([
                'topList'
            ]),
            title () {
                return this.topList.topTitle;
            },
            bgImage () {
                return this.songs.length ? this.songs[0].image : '';
            }
        },
        components: {
            MusicList
        }
    }
</script>

<style scoped lang="stylus">
    .v-enter, .v-leave-to
        transform: translate3d(100%, 0, 0)
    .v-enter-active, .v-leave-active
        transition: all .3s
</style>
