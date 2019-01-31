<template>
    <div class="recommend" ref="recommend">
        <scroll class="recommend-content" ref="scroll" :data="discList">
            <div>
                <div class="slider">
                    <swiper :options="swiperOption" v-if="swiperShow">
                        <swiper-slide v-for="item of recommend" :key="item.id">
                            <a :href="item.linkUrl" class="link">
                                <img :src="item.picUrl" class="swiper-img">
                            </a>
                        </swiper-slide>
                        <div class="swiper-pagination" slot="pagination"></div>
                    </swiper>
                </div>
                <div class="recommend-list">
                    <h1 class="list-title">热门歌单推荐</h1>
                    <ul>
                        <li v-for="item in discList" class="item" @click="selectItem(item)">
                            <div class="img">
                                <img v-lazy="item.imgurl" width="60" height="60">
                            </div>
                            <div class="text">
                                <h2 class="name">{{item.dissname}}</h2>
                                <p class="author" v-html="'by ' + item.creator.name"></p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="loading-container" v-show="!discList.length">
                <loading></loading>
            </div>
        </scroll>
        <router-view></router-view>
    </div>
</template>

<script>
    import get from '../../common/js/get'
    import Scroll from '../../base/scroll/Scroll'
    import Loading from '../../base/loading/Loading'
    import {playlistMixin} from "../../common/js/mixin";
    import {mapMutations} from 'vuex'

    export default {
        mixins: [playlistMixin],
        name: "Recommend",
        data () {
            return {
                recommend: [],
                discList: [],
                swiperOption: {
                    pagination: '.swiper-pagination',
                    loop: true,
                    autoplay: 3000,
                    speed: 500,
                    autoplayDisableOnInteraction: false
                }
            }
        },
        components: {
            Scroll,
            Loading
        },
        methods: {
            async getBanner () {
                let {data: {data}, status} = await get('/recommend/banner')
                if (status === 200) {
                    this.recommend = data.slider;
                }
            },
            async getDiscList () {
                let {data: {data}, status} = await get('/recommend/disc')
                if (status === 200) {
                    this.discList = data.list;
                }
            },
            loadImage () {
                /* better-scroll 无法滚动或滚动异常：图片和列表其中一个或两个还未渲染DOM */
                /* 由于无法判断图片和列表哪个先渲染，1. 对于图片：绑定 @load="loadImage" */
                if (!this.checkLoaded) {  //  只要有一张图片渲染高度就已经被撑开了
                    this.$refs.scroll.refresh();
                    this.checkLoaded = true;
                }
                /* 2. 对于列表：:data="discList"，在 Scroll.vue 中处理 */
            },
            handlePlaylist (playlist) {
                const bottom = playlist.length > 0 ? '60px' : '';
                this.$refs.recommend.style.bottom = bottom;
                this.$refs.scroll.refresh();
            },
            selectItem (item) {
                this.$router.push(`/recommend/${item.dissid}`);
                this.setDisc(item);
            },
            ...mapMutations({
                setDisc: 'SET_DISC'
            })
        },
        computed: {
            swiperShow () {
                return this.recommend.length;
            }
        },
        created () {
            this.getBanner();
            this.getDiscList();
        }
    }
</script>

<style scoped lang="stylus">
    @import '../../common/stylus/variable.styl'
    @import '../../common/stylus/mixin.styl'
    .recommend
        width: 100%
        top: 88px
        bottom: 0
        position: fixed
        .recommend-content
            width: 100%
            height: 100%
            overflow: hidden
            .slider >>> .swiper-pagination-bullet
                background-color: $color-text-l
                opacity: 1
            .slider >>> .swiper-pagination-bullet-active
                background-color: $color-theme
            .slider
                width: 100%
                font-size: 0
                .link
                    display: inline-block
                    .swiper-img
                        width: 100vw
            .recommend-list
                .list-title
                    height: 65px
                    line-height: 65px
                    text-align: center
                    font-size: $font-size-medium
                    color: $color-theme
                .item
                    padding: 0 20px 20px 20px
                    display: flex
                    align-items: center
                    .img
                        display: inline-block
                        width: 60px
                        height: 60px
                        margin-right: 20px
                    .text
                        display: inline-block
                        flex: 1
                        line-height: 20px
                        font-size: $font-size-medium
                        overflow: hidden
                        .name
                            margin-bottom: 8px
                            color: $color-text
                            no-wrap()
                        .author
                            color: $color-text-d
            .loading-container
                position: absolute
                width: 100%
                left: 0
                top: 50%
                transform: translateY(-50%)
</style>
