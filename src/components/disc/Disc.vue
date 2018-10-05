<template>
    <transition>
        <music-list :title="title" :bgImage="bgImage" :songs="songs"></music-list>
    </transition>
</template>

<script>
    import MusicList from '../music-list/MusicList'
    import {mapGetters} from 'vuex'
    import {getDiscSongList} from "../../api/recommend";
    import {ERR_OK} from "../../api/config";
    import {createSong} from "../../common/js/song";
    import {getSongVkey} from "../../api/song";

    export default {
        name: "Disc",
        data () {
            return {
                songs: []
            }
        },
        computed: {
            ...mapGetters([
                'disc'
            ]),
            title () {
                return this.disc.dissname;
            },
            bgImage () {
                return this.disc.imgurl;
            }
        },
        created () {
            this._getDiscSongList();
        },
        methods: {
            _getDiscSongList () {
                if (!this.disc.dissid) {
                    this.$router.push('/recommend');
                    return;
                }
                getDiscSongList(this.disc.dissid).then((res) => {
                    if (res.code === ERR_OK) {
                        this.songs = this._normalizeSong(res.cdlist[0].songlist);
                    }
                });
            },
            _normalizeSong (list) {
                let ret = [];
                list.forEach((item) => {
                    if (item.songid && item.albummid) {
                        getSongVkey(item.songmid, item.strMediaMid).then((res) => {
                            if (res.code === ERR_OK) {
                                let vkey = res.data.items[0].vkey;
                                ret.push(createSong(item, vkey));
                            }
                        });
                    }
                });
                return ret;
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
