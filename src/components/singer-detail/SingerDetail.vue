<template>
    <transition>
        <music-list :songs="songs" :title="title" :bgImage="bgImage"></music-list>
    </transition>
</template>

<script>
    import {mapGetters} from 'vuex'
    import {getSingerDetail} from "../../api/singer";
    import {getSongVkey} from "../../api/song";
    import {ERR_OK} from "../../api/config";
    import {createSong} from "../../common/js/song";
    import MusicList from '../music-list/MusicList'

    export default {
        name: "SingerDetail",
        data () {
            return {
                songs: []
            }
        },
        computed: {
            ...mapGetters([
                'singer'  //  把 `this.singer` 映射为 `this.$store.getters.singer`
            ]),
            title () {
                return this.singer.name;
            },
            bgImage () {
                return this.singer.avatar;
            }
        },
        created () {
            this._getSingerDetail();
        },
        methods: {
            _getSingerDetail () {
                if (!this.singer.id) {
                    this.$router.push('/singer');
                    return;
                }
                getSingerDetail(this.singer.id).then((res) => {
                    if (res.code === ERR_OK) {
                        this.songs = this._normalizeSongs(res.data.list);
                    }
                });
            },
            _normalizeSongs (list) {
                let ret = [];
                list.forEach((item) => {
                    let {musicData} = item;
                    if (musicData.songid && musicData.albummid) {
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
