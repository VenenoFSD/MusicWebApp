<template>
    <div class="rank" ref="rank">
        <scroll class="topList" ref="topList">
            <ul>
                <li class="item" v-for="item in topList" @click="selectItem(item)">
                    <div class="icon">
                        <img v-lazy="item.picUrl" width="100" height="100">
                    </div>
                    <ul class="songList">
                        <li class="song" v-for="(song, index) in item.songList">{{index + 1}}. {{song.singername}} - {{song.songname}}</li>
                    </ul>
                </li>
            </ul>
        </scroll>
        <div class="loading-container" v-show="!topList.length">
            <loading></loading>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
    import Loading from '../../base/loading/Loading'
    import Scroll from '../../base/scroll/Scroll'
    import {getTopList} from "../../api/rank";
    import {ERR_OK} from "../../api/config";
    import {playlistMixin} from "../../common/js/mixin";
    import {mapMutations} from 'vuex'

    export default {
        name: "Rank",
        mixins: [playlistMixin],
        data () {
            return {
                topList: []
            }
        },
        created () {
            this._getTopList();
        },
        methods: {
            _getTopList () {
                getTopList().then((res) => {
                    if (res.code === ERR_OK) {
                        this.topList = res.data.topList;
                    }
                });
            },
            handlePlaylist (playlist) {
                const bottom = playlist.length > 0 ? '60px' : '';
                this.$refs.rank.style.bottom = bottom;
                this.$refs.topList.refresh();
            },
            selectItem (item) {
                this.$router.push(`/rank/${item.id}`);
                this.setTopList(item);
            },
            ...mapMutations({
                setTopList: 'SET_TOP_LIST'
            })
        },
        components: {
            Loading,
            Scroll
        }
    }
</script>

<style scoped lang="stylus">
    @import '../../common/stylus/mixin.styl'
    @import '../../common/stylus/variable.styl'
    .rank
        position: fixed
        width: 100%
        top: 88px
        bottom: 0
        .topList
            width: 100%
            height: 100%
            overflow: hidden
            .item
                padding-top: 20px
                margin: 0 20px
                display: flex
                &:last-child
                    padding-bottom: 20px
                .icon
                    font-size: 0
                    flex: 0 0 100px
                .songList
                    flex: 1
                    padding: 0 20px
                    overflow: hidden
                    display: flex
                    flex-direction: column
                    justify-content: center
                    background: $color-highlight-background
                    color: $color-text-d
                    font-size: $font-size-small
                    .song
                        line-height: 26px
                        no-wrap()
        .loading-container
            position: absolute
            width: 100%
            left: 0
            top: 50%
            transform: translateY(-50%)
</style>
