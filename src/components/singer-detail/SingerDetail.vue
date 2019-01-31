<template>
    <transition>
        <music-list :songs="songs" :title="title" :bgImage="bgImage"></music-list>
    </transition>
</template>

<script>
    import {mapGetters} from 'vuex'
    import get from '../../common/js/get'
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
            this.getSingerDetail();
        },
        methods: {
            async getSingerDetail () {
                if (!this.singer.id) {
                    this.$router.push('/singer');
                    return;
                }
                let {data: {data}, status} = await get(`/singer/detail?singerId=${this.singer.id}`);
                if (status === 200) {
                    this.songs = this._normalizeSongs(data.list);
                }
            },
            _normalizeSongs (list) {
                let ret = [];
                list.forEach(async item => {
                    let {musicData} = item;
                    if (musicData.songid && musicData.albummid) {
                        let {data: {data}, status} = await get(`/song/vkey?songmid=${musicData.songmid}&strMediaMid=${musicData.strMediaMid}`);
                        if (status === 200) {
                            const vkey = data.items[0].vkey;
                            ret.push(createSong(musicData, vkey));
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
