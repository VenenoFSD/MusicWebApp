<template>
    <div class="singer" ref="singer">
        <list-view :data="singerList" @select="selectSinger" ref="list"></list-view>
        <router-view></router-view>
    </div>
</template>

<script>
    import {getSingerList} from '../../api/singer'
    import {ERR_OK} from "../../api/config"
    import Singer from '../../common/js/singer'
    import ListView from '../../base/list-view/ListView'
    import {mapMutations} from 'vuex'
    import {playlistMixin} from "../../common/js/mixin";

    const HOT_NAME = '热门';
    const HOT_SINGER_LEN = 10;

    export default {
        mixins: [playlistMixin],
        name: "Singer",
        data () {
            return {
                singerList: []
            }
        },
        components: {
            ListView
        },
        methods: {
            _getSingerList () {
                getSingerList().then((res) => {
                    /* 新版api
                    if (res.code === ERR_OK && res.singerList.code === ERR_OK) {
                        this.singerList = res.singerList.data.singerlist;
                        console.log(this.singerList);
                    }
                    */
                    if (res.code === ERR_OK) {  //  老版api
                        this.singerList = this._normalizeSinger(res.data.list);
                    }
                });
            },
            _normalizeSinger (list) {
                let map = {
                    hot: {
                        title: HOT_NAME,
                        items: []
                    }
                };
                list.forEach((item, index) => {
                    if (index < HOT_SINGER_LEN) {
                        map.hot.items.push(new Singer({
                            id: item.Fsinger_mid,
                            name: item.Fsinger_name
                        }));
                    }
                    let key = item.Findex;
                    if (!map[key]) {
                        map[key] = {
                            title: key,
                            items: []
                        }
                    }
                    map[key].items.push(new Singer({
                        id: item.Fsinger_mid,
                        name: item.Fsinger_name
                    }));
                });
                //  map对象按 '热门，A，B，....，Z' 排列
                let hot = [], ret = [];
                for (let k in map) {
                    let val = map[k];
                    if (val.title.match(/[a-zA-Z]/)) {
                        ret.push(val);
                    } else if (val.title === HOT_NAME) {
                        hot.push(val);
                    }
                }
                ret.sort((a, b) => {
                    return a.title.charCodeAt(0) - b.title.charCodeAt(0);
                });
                return hot.concat(ret);
            },
            selectSinger (singer) {
                this.$router.push(`/singer/${singer.id}`);
                this.setSinger(singer);  //  singer存入store
            },
            ...mapMutations({
                setSinger: 'SET_SINGER'  //   将 `this.setSinger()` 映射为 `this.$store.commit('SET_SINGER')`
            }),
            handlePlaylist (playlist) {
                const bottom = playlist.length > 0 ? '60px' : '';
                this.$refs.singer.style.bottom = bottom;
                this.$refs.list.refresh();
            }
        },
        created () {
            this._getSingerList();
        }
    }
</script>

<style scoped lang="stylus">
    @import '../../common/stylus/variable.styl'
    .singer
        position: fixed
        width: 100%
        top: 88px
        bottom: 0
</style>
