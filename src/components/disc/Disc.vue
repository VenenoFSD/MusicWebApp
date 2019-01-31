<template>
    <transition>
        <music-list :title="title" :bgImage="bgImage" :songs="songs"></music-list>
    </transition>
</template>

<script>
    import MusicList from '../music-list/MusicList'
    import {mapGetters} from 'vuex'
    import get from '../../common/js/get'
    import {createSong} from "../../common/js/song"

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
            this.getDiscSongList();
        },
        methods: {
            async getDiscSongList () {
                if (!this.disc.dissid) {
                    this.$router.push('/recommend');
                    return;
                }
                let {data, status} = await get(`/recommend/songList?dissid=${this.disc.dissid}`);
                if (status === 200) {
                    this.songs = this._normalizeSong(data.cdlist[0].songlist);
                }
            },
            _normalizeSong (list) {
                let ret = [];
                list.forEach(async item => {
                    if (item.songid && item.albummid) {
                        let {data: {data}, status} = await get(`/song/vkey?songmid=${item.songmid}&strMediaMid=${item.strMediaMid}`);
                        if (status === 200) {
                            const vkey = data.items[0].vkey;
                            ret.push(createSong(item, vkey));
                        }
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
