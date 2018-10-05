<template>
    <div class="player" v-show="playlist.length">
        <transition name="normal"
                    @enter="enter"
                    @after-enter="afterEnter"
                    @leave="leave"
                    @after-leave="afterLeave">
            <div class="normal-player" v-show="fullScreen">
                <div class="background">
                    <img width="100%" height="100%" :src="currentSong.image">
                </div>
                <div class="top">
                    <div class="back" @click="back">
                        <i class="icon-back"></i>
                    </div>
                    <h1 class="title" v-html="currentSong.name"></h1>
                    <h2 class="subtitle" v-html="currentSong.singer"></h2>
                </div>
                <div class="middle">
                    <swiper :options="swiperOption">
                        <swiper-slide>
                            <div class="middle-left">
                                <div class="cd-wrapper" ref="cdWrapper">
                                    <img class="image" :src="currentSong.image" :class="cdRotate">
                                </div>
                                <div class="playing-lyric" v-html="playingLyric"></div>
                            </div>
                        </swiper-slide>
                        <swiper-slide>
                            <scroll class="middle-right" :data="currentLyric && currentLyric.lines" ref="lyricList">
                                <div class="lyric-wrapper">
                                    <div v-if="currentLyric">
                                        <p v-for="(line, index) in currentLyric.lines"
                                           v-html="line.txt"
                                           class="text"
                                           :class="{'current': currentLineNum === index}"
                                           ref="lyricLine"></p>
                                    </div>
                                </div>
                            </scroll>
                        </swiper-slide>
                        <div class="swiper-pagination" slot="pagination"></div>
                    </swiper>
                </div>
                <div class="bottom">
                    <div class="progress-wrapper">
                        <span class="time">{{formatTime(currentTime)}}</span>
                        <div class="progress-bar-wrapper">
                            <progress-bar :percent="percent" @changePercent="changePercent"></progress-bar>
                        </div>
                        <span class="time time-right">{{formatTime(currentSong.duration)}}</span>
                    </div>
                    <div class="operators">
                        <div class="icon icon-left" @click="changeMode">
                            <i :class="iconMode"></i>
                        </div>
                        <div class="icon icon-left" @click="prev" :class="disableIcon">
                            <i class="icon-prev"></i>
                        </div>
                        <div class="icon icon-center" @click="togglePlaying" :class="disableIcon">
                            <i :class="playIcon"></i>
                        </div>
                        <div class="icon icon-right" @click="next" :class="disableIcon">
                            <i class="icon-next"></i>
                        </div>
                        <div class="icon icon-right">
                            <i :class="getFavoriteIcon(currentSong)" @click="toggleFavorite(currentSong)"></i>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <transition name="mini">
            <div class="mini-player" v-show="!fullScreen" @click="open">
                <div class="icon" :class="cdRotate">
                    <img width="40" height="40" :src="currentSong.image">
                </div>
                <div class="text">
                    <h2 class="title" v-html="currentSong.name"></h2>
                    <p class="desc" v-html="currentSong.singer"></p>
                </div>
                <div class="control" @click.stop="togglePlaying">
                    <progress-circle :radius="32" :percent="percent">
                        <i class="icon-mini" :class="miniIcon"></i>
                    </progress-circle>
                </div>
                <div class="control" @click.stop="showPlaylist">
                    <i class="icon-playlist"></i>
                </div>
            </div>
        </transition>
        <playlist ref="playlist"></playlist>
        <audio :src="currentSong.url" ref="audio" @play="ready" @error="error" @timeupdate="updateTime" @ended="end"></audio>
    </div>
</template>

<script>
    import ProgressBar from '../../base/progress-bar/ProgressBar'
    import ProgressCircle from '../../base/progress-circle/ProgressCircle'
    import {mapGetters, mapMutations, mapActions} from 'vuex'
    import animations from 'create-keyframe-animation'
    import {playMode} from "../../common/js/config";
    import Lyric from 'lyric-parser'
    import Scroll from '../../base/scroll/Scroll'
    import Playlist from '.././playlist/Playlist'
    import {playerMixin} from "../../common/js/mixin";

    export default {
        mixins: [playerMixin],
        name: "Player",
        data () {
            return {
                swiperOption: {
                    pagination: '.swiper-pagination',
                    autoplay: false,
                    effect : 'coverflow',
                    coverflow: {
                        slideShadows: false,
                        modifier: 1.3
                    }
                },
                songReady: false,  //  歌曲加载完毕标志位
                currentTime: 0,
                currentLyric: null,
                currentLineNum: 0,
                playingLyric: ''
            }
        },
        computed: {
            playIcon () {
                return this.playing ? 'icon-pause' : 'icon-play';
            },
            miniIcon () {
                return this.playing ? 'icon-pause-mini' : 'icon-play-mini';
            },
            cdRotate () {
                return this.playing ? 'play' : 'play pause';
            },
            disableIcon () {
                return this.songReady ? '' : 'disable';
            },
            percent () {
                return this.currentTime / this.currentSong.duration;
            },
            ...mapGetters([
                'fullScreen',
                'playing',
                'currentIndex'
            ])
        },
        methods: {
            ...mapMutations({
                setFullScreen: 'SET_FULL_SCREEN',
                setPlayingState: 'SET_PLAYING_STATE'
            }),
            back () {
                this.setFullScreen(false);
            },
            open () {
                this.setFullScreen(true);
            },
            /****************专辑图片飞入飞出动画*****************/
            enter (el, done) {
                const {x, y, scale} = this._getPosAndScale();
                //  小->大，动画效果
                let animation = {
                    0: {
                        transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
                    },
                    60: {
                        transform: `translate3d(0, 0, 0) scale(1.1)`
                    },
                    100: {
                        transform: `translate3d(0, 0, 0) scale(1)`
                    }
                };
                animations.registerAnimation({
                    name: 'move',
                    animation,
                    presets: {
                        duration: 400,
                        easing: 'linear'
                    }
                });
                animations.runAnimation(this.$refs.cdWrapper, 'move', done);  //  done即执行afterEnter
            },
            afterEnter () {
                animations.unregisterAnimation('move');
                this.$refs.cdWrapper.style.animation = '';
            },
            leave (el, done) {
                //  大->小，过渡效果
                const {x, y, scale} = this._getPosAndScale();
                this.$refs.cdWrapper.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
                this.$refs.cdWrapper.style.transition = 'all .4s';
                this.$refs.cdWrapper.addEventListener('transitionend', done);
            },
            afterLeave () {
                this.$refs.cdWrapper.style.transition = '';
                this.$refs.cdWrapper.style.transform = '';
            },
            _getPosAndScale () {
                //  小图片
                const paddingLeft = 40;
                const paddingBottom = 30;
                const targetWidth = 40;
                //  大图片
                const width = window.innerWidth * 0.8;
                const paddingTop = 90 + width / 2;

                //  大->小
                const x = -(window.innerWidth / 2 - paddingLeft);
                const y = window.innerHeight - paddingTop - paddingBottom;
                const scale = targetWidth / width;

                return {
                    x,
                    y,
                    scale
                }
            },
            /****************************************************/
            togglePlaying () {  //  playingState播放/暂停[入口] -> audio
                if (!this.songReady) {
                    return;
                }
                this.setPlayingState(!this.playing);
                if (this.currentLyric) {
                    this.currentLyric.togglePlay();
                }
            },
            prev () {
                if (!this.songReady) {  //  当前歌曲加载完毕才可以切换歌曲
                    return;
                }
                if (this.playlist.length === 1) {
                    this.loop();
                    return;
                } else {
                    let index = this.currentIndex - 1;
                    if (index === -1) {
                        index = this.playlist.length - 1;
                    }
                    this.setCurrentIndex(index);
                    if (!this.playing) {
                        this.togglePlaying();
                    }
                }
                this.songReady = false;
            },
            next () {
                if (!this.songReady) {
                    return;
                }
                if (this.playlist.length === 1) {
                    this.loop();
                    return;
                } else {
                    let index = this.currentIndex + 1;
                    if (index === this.playlist.length) {
                        index = 0;
                    }
                    this.setCurrentIndex(index);
                    if (!this.playing) {
                        this.togglePlaying();
                    }
                }
                this.songReady = false;
            },
            ready () {
                this.songReady = true;
                this.savePlayHistory(this.currentSong);
            },
            error () {
                this.songReady = true;  //  避免影响上一首和下一首的播放
            },
            updateTime (e) {
                this.currentTime = e.target.currentTime;
            },
            formatTime (interval) {
                interval = interval | 0;
                let minute = interval / 60 | 0;
                let second = this._pad(interval % 60);
                return `${minute}:${second}`;
            },
            _pad (num, targetLen = 2) {  //  补位函数
                let length = num.toString().length;
                while (length < targetLen) {
                    num = '0' + num;
                    length++;
                }
                return num;
            },
            changePercent (percent) {
                const currentTime = this.currentSong.duration * percent;
                this.$refs.audio.currentTime = currentTime;
                if (!this.playing) {
                    this.togglePlaying();
                }
                if (this.currentLyric) {
                    this.currentLyric.seek(currentTime * 1000);
                }
            },
            end () {
                if (this.mode === playMode.loop) {  //  单曲循环
                    this.loop();
                } else {
                    this.next();
                }
            },
            loop () {
                this.$refs.audio.currentTime = 0;
                this.$refs.audio.play();
                this.setPlayingState(true);
                if (this.currentLyric) {
                    this.currentLyric.seek(0);
                }
            },
            getLyric () {
                this.currentSong.getSongLyric().then((lyric) => {
                    if (this.currentSong.lyric !== lyric) {
                        return;
                    }
                    this.currentLyric = new Lyric(lyric, this.handleLyric);  //  歌词每一行发生改变时调用回调函数
                    if (this.playing) {
                        this.currentLyric.play();
                    }
                }).catch(() => {
                    this.currentLyric = null;
                    this.playingLyric = '';
                    this.currentLineNum = 0;
                });
            },
            handleLyric ({lineNum, txt}) {
                this.currentLineNum = lineNum;
                if (lineNum > 6) {  //  高亮在第7行
                    let lineEl = this.$refs.lyricLine[lineNum - 6];
                    this.$refs.lyricList.scrollToElement(lineEl, 500);
                } else {
                    this.$refs.lyricList.scrollTo(0, 0);
                }
                this.playingLyric = txt;
            },
            showPlaylist () {
                this.$refs.playlist.show();
            },
            ...mapActions([
                'savePlayHistory'
            ])
        },
        watch: {
            currentSong (newSong, oldSong) {
                if (!newSong.id) {
                    return;
                }
                if (newSong.id === oldSong.id) {
                    return;
                }
                if (this.currentLyric) {
                    this.currentLyric.stop();
                    this.currentTime = 0;
                    this.playingLyric = '';
                    this.currentLineNum = 0;
                }
                clearTimeout(this.timer);
                this.timer = setTimeout(() => {
                    this.$refs.audio.play();
                    this.getLyric();
                }, 1000);
            },
            playing (newState) {  //  audio播放/暂停
                const audio = this.$refs.audio;
                this.$nextTick(() => {
                    newState ? audio.play() : audio.pause();
                });
            }
        },
        components: {
            ProgressBar,
            ProgressCircle,
            Scroll,
            Playlist
        }
    }
</script>

<style scoped lang="stylus">
    @import '../../common/stylus/variable.styl'
    @import '../../common/stylus/mixin.styl'
    @keyframes rotate
        0%
            transform: rotate(0)
        100%
            transform: rotate(360deg)
    .normal-player
        position: fixed
        left: 0
        top: 0
        width: 100vw
        height: 100vh
        background: $color-background
        &.normal-enter, &.normal-leave-to
            opacity: 0
            .top
                transform: translate3d(0, -100px, 0)
            .bottom
                transform: translate3d(0, 100px, 0)
        &.normal-enter-active, &.normal-leave-active
            transition: all .4s
            .top, .bottom
                transition: all .4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
        .background
            width: 100%
            height: 100%
            position: absolute
            left: 0
            top: 0
            opacity: 0.6
            z-index: -1
            filter: blur(20px)
        .top
            width: 100%
            height: 60px
            position: relative
            text-align: center
            margin-bottom: 30px
            .back
                position: absolute
                left: 15px
                top: 9px
                .icon-back
                    font-size: $font-size-large-x
                    color: $color-theme
                    display: block
                    transform: rotate(-90deg)
            .title
                font-size: $font-size-large
                color: $color-text
                line-height: 40px
            .subtitle
                font-size: $font-size-medium
                color: $color-text
                line-height: 20px
        .middle >>> .swiper-pagination
            bottom: 0
        .middle >>> .swiper-pagination-bullet
            background-color: $color-text-l
            opacity: 1
        .middle >>> .swiper-pagination-bullet-active
            background-color: $color-text-ll
            width: 20px
            border-radius: 5px
        .middle
            width: 100%
            height: calc(100vh - 230px)
            .swiper-container
                height: 100%
                overflow visible
                .middle-left, .middle-right
                    width: 100%
                    height: 100%
                .middle-left
                    .cd-wrapper
                        width: 80vw
                        height: 80vw
                        margin: 0 auto
                        border: 10px solid rgba(255, 255, 255, 0.1)
                        border-radius: 50%
                        overflow: hidden
                        box-sizing: border-box
                        .image
                            width: 100%
                            height: 100%
                            border-radius: 50%
                            &.play
                                animation: rotate 36s linear infinite
                            &.pause
                                animation-play-state: paused
                    .playing-lyric
                        width: 80%
                        height: 20px
                        line-height: 20px
                        margin: 30px auto
                        text-align: center
                        font-size: $font-size-medium
                        color: $color-text-l
                .middle-right
                    width: 100%
                    height: calc(100% - 20px)
                    overflow hidden
                    .lyric-wrapper
                        width: 80%
                        margin: 0 auto
                        .text
                            text-align: center
                            overflow: hidden
                            line-height: 32px
                            color: $color-text-l
                            font-size: $font-size-medium
                            &.current
                                color: $color-text
        .bottom
            position: absolute
            bottom: 50px
            left: 0
            width: 100%
            .progress-wrapper
                width: 80%
                margin: 0 auto
                padding: 10px 0
                display: flex
                align-items: center
                .time
                    width: 30px
                    flex: 0 0 30px
                    color: $color-text
                    font-size: $font-size-small
                    line-height: 30px
                    &.time-right
                        text-align: right
                .progress-bar-wrapper
                    flex: 1
            .operators
                width: 100%
                height: 40px
                display: flex
                align-items: center
                .icon
                    flex: 1
                    font-size: 30px
                    color: $color-theme
                    &.disable
                        color: $color-theme-d
                    &.icon-left
                        text-align: right
                    &.icon-center
                        text-align: center
                        margin: 0 20px
                        font-size: 40px
                    &.icon-right
                        text-align: left
                        .icon-favorite
                            color: $color-sub-theme
    .mini-player
        position: fixed
        left: 0
        bottom: 0
        width: 100vw
        height: 60px
        background: $color-highlight-background
        display: flex
        align-items: center
        z-index: 100
        &.mini-enter, &.mini-leave-to
            opacity: 0
        &.mini-enter-active, &.mini-leave-active
            transition: all .4s
        .icon
            flex: 0 0 40px
            font-size: 0
            margin: 0 10px 0 20px
            border-radius: 50%
            overflow: hidden
            &.play
                animation: rotate 20s linear infinite
            &.pause
                animation-play-state: paused
        .text
            flex: 1
            line-height: 20px
            display: flex
            flex-direction: column
            justify-content: center
            overflow: hidden
            no-wrap()
            .title
                font-size: $font-size-medium
                color: $color-text
            .desc
                font-size: $font-size-small
                color: $color-text-d
        .control
            flex: 0 0 30px
            width: 30px
            height: 30px
            padding: 0 10px
            font-size: 30px
            color: $color-theme-d
            .icon-mini
                font-size: 32px
                position: absolute
                left: 0
                top: 0
</style>
