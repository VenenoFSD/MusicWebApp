<template>
    <div class="music-list">
        <div class="back" @click="back">
            <i class="icon-back"></i>
        </div>
        <h1 class="title" v-html="title"></h1>
        <div class="bg-image" :style="bgStyle" ref="bgImage">
            <div class="play" v-show="songs.length" ref="playBtn" @click="random">
                <i class="icon-play"></i>
                <span class="text">随机播放全部</span>
            </div>
            <div class="filter" ref="filter"></div>
        </div>
        <div class="bg-layer" ref="layer"></div>
        <scroll class="list" :data="songs" ref="list" :probeType="probeType" :listenScroll="listenScroll" @scroll="scroll">
            <div class="song-list-wrapper">
                <song-list :songs="songs" @select="selectItem" :rank="rank"></song-list>
            </div>
            <div class="loading-container" v-show="!songs.length">
                <loading></loading>
            </div>
        </scroll>
    </div>
</template>

<script>
    import SongList from '../../base/song-list/SongList'
    import Scroll from '../../base/scroll/Scroll'
    import Loading from '../../base/loading/Loading'
    import {mapActions} from 'vuex'
    import {playlistMixin} from "../../common/js/mixin";

    const RESERVE_HEIGHT = 40;
    export default {
        mixins: [playlistMixin],
        name: "MusicList",
        data () {
            return {
                scrollY: 0
            }
        },
        props: {
            title: {
                type: String,
                default: ''
            },
            bgImage: {
                type: String,
                default: ''
            },
            songs: {
                type: Array,
                default: []
            },
            rank: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            bgStyle () {
                return `background-image: url(${this.bgImage})`;
            }
        },
        components: {
            SongList,
            Scroll,
            Loading
        },
        created () {
            this.probeType = 3;
            this.listenScroll = true;
        },
        mounted () {
            this.imageHeight = this.$refs.bgImage.clientHeight;
            this.$refs.list.$el.style.top = `${this.imageHeight}px`;

            this.minHeight = -this.imageHeight + RESERVE_HEIGHT;
        },
        methods: {
            scroll (pos) {
                this.scrollY = pos.y;
            },
            back () {
                this.$router.back();
            },
            //  state中的sequenceList，playlist赋值
            selectItem (song, index) {
                this.selectPlay({
                    list: this.songs,
                    index
                });
            },
            ...mapActions([
                'selectPlay',
                'randomPlay'
            ]),
            random () {
                this.randomPlay({
                    list: this.songs
                });
            },
            handlePlaylist (playlist) {
                const bottom = playlist.length > 0 ? '60px' : '';
                this.$refs.list.$el.style.bottom = bottom;
                this.$refs.list.refresh();
            }
        },
        watch: {
            scrollY (newY) {
                let translateY = Math.max(this.minHeight, newY);
                let zIndex = 0;
                let scale = 1;
                let blur = 0;

                //  上拉至顶覆盖效果
                this.$refs.layer.style['transform'] = `translate3d(0, ${translateY}px, 0)`;
                if (newY < translateY) {
                    zIndex = 1;
                    this.$refs.bgImage.style.paddingBottom = 0;
                    this.$refs.bgImage.style.height = `${RESERVE_HEIGHT}px`;
                    this.$refs.playBtn.style.display = 'none';
                } else {
                    zIndex = 0;
                    this.$refs.bgImage.style.paddingBottom = '70%';
                    this.$refs.bgImage.style.height = 0;
                    this.$refs.playBtn.style.display = 'block';
                }

                //  下拉放大效果与上拉模糊效果
                let percent = Math.abs(newY / this.imageHeight);  //  放大/模糊比例
                if (newY > 0) {
                    scale = 1 + percent;
                    zIndex = 1;
                } else {
                    blur = Math.min(20 * percent, 20);
                    this.$refs.filter.style['backdrop-filter'] = `blur(${blur}px)`;
                }
                this.$refs.bgImage.style['transform'] = `scale(${scale})`;

                this.$refs.bgImage.style.zIndex = zIndex;
            }
        }
    }
</script>

<style scoped lang="stylus">
    @import '../../common/stylus/variable.styl'
    @import '../../common/stylus/mixin.styl'
    .music-list
        position: fixed
        top: 0
        left: 0
        bottom: 0
        right: 0
        background-color: $color-background
        .back
            display: inline-block
            font-size: 0
            position: absolute
            left: 16px
            top: 10px
            z-index: 2
            .icon-back
                font-size: $font-size-large-x
                color: $color-theme
        .title
            width: 75%
            position: absolute
            z-index: 2
            line-height: 40px
            font-size: $font-size-large
            color: $color-text
            left: 50%
            transform: translateX(-50%)
            no-wrap()
        .bg-image
            position: relative
            width: 100%
            height: 0
            padding-bottom: 70%
            background-size: cover
            z-index: 0
            transform-origin: top  /* 图片放大基点 */
            .play
                width: 135px
                padding: 7px 0
                position: absolute
                left: 50%
                transform: translateX(-50%)
                bottom: 20px
                text-align: center
                z-index: 2
                border: 1px solid $color-theme
                border-radius: 100px
                color: $color-theme
                font-size: 0
                box-sizing: border-box
                .icon-play
                    margin-right: 6px
                    font-size: $font-size-medium-x
                    vertical-align: middle
                .text
                    font-size: $font-size-small
                    vertical-align: middle
            .filter
                position: absolute
                width: 100%
                height: 100%
                left: 0
                top: 0
                background-color: rgba(7, 17, 27, .4)
        .bg-layer
            position: relative
            height: 100%
            background: $color-background
        .list
            position: fixed
            width: 100%
            top: 0
            bottom: 0
            background-color: $color-background
            .song-list-wrapper
                padding: 20px 30px
            .loading-container
                position: absolute
                width: 100%
                left: 0
                top: 50%
                transform: translateY(-50%)
</style>
