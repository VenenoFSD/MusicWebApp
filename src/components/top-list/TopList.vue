<template>
    <transition>
        <music-list :title="title" :bgImage="bgImage" :songs="songs" :rank="rank"></music-list>
    </transition>
</template>

<script>
    import MusicList from '../music-list/MusicList'
    import {mapGetters} from 'vuex'
    import get from "../../common/js/get"
    import {createSong} from "../../common/js/song"

    export default {
        name: "TopList",
        data () {
            return {
                songs: [],
                rank: true
            }
        },
        methods: {
            async getTopListSongs () {
                if (!this.topList.id) {
                    this.$router.push('/rank');
                    return;
                }
                let {data, status} = await get(`/rank/list?topid=${this.topList.id}`);
                if (status === 200) {
                    this.songs = this._normalizeSongs(data.songlist);
                }
            },
            _normalizeSongs (list) {
                let ret = [];
                list.forEach(async item => {
                    let musicData = item.data;
                    if (musicData.songid && musicData.albumid) {
                        let {data: {data}, status} = await get(`/song/vkey?songmid=${musicData.songmid}&strMediaMid=${musicData.strMediaMid}`);
                        if (status === 200) {
                            const vkey =  data.items[0].vkey;
                            ret.push(createSong(musicData, vkey));
                        }
                    }
                });
                return ret;
            }
        },
        created () {
            this.getTopListSongs();
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
