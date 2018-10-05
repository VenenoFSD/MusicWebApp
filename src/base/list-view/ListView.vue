<template>
    <scroll class="list-view" ref="listView" :listenScroll="listenScroll" @scroll="scroll" :probeType="probeType" :data="data">
        <ul>
            <li class="list-group" v-for="group in data" ref="listGroup">
                <h2 class="list-group-title">{{group.title}}</h2>
                <ul>
                    <li v-for="item in group.items" class="list-group-item" @click="selectItem(item)">
                        <img v-lazy="item.avatar" class="avatar">
                        <span class="name">{{item.name}}</span>
                    </li>
                </ul>
            </li>
        </ul>
        <div class="list-shortcut">
            <ul>
                <li v-for="(item, index) in shortcutList" class="shortcut-item" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove" :data-index="index" :class="{'current': currentIndex === index}">{{item}}</li>
            </ul>
        </div>
        <div class="list-fixed" v-show="fixedTitle" ref="fixed">
            <h2 class="fixed-title">{{fixedTitle}}</h2>
        </div>
        <div class="loading-container" v-show="!data.length">
            <loading></loading>
        </div>
    </scroll>
</template>

<script>
    import Scroll from '../scroll/Scroll'
    import {getData} from "../../common/js/dom"
    import Loading from '../../base/loading/Loading'

    const ANCHOR_HEIGHT = 18;
    const TITLE_HEIGHT = 30;

    export default {
        name: "ListView",
        props: {
            data: {
                type: Array,
                default: []
            }
        },
        data () {
            return {
                scrollY: -1,
                currentIndex: 0,
                diff: -1
            }
        },
        components: {
            Scroll,
            Loading
        },
        computed: {
            shortcutList () {  //  首字母数组
                return this.data.map((group) => {
                    return group.title.substr(0, 1);
                });
            },
            fixedTitle () {
                if (this.scrollY > 0) {
                    return '';
                }
                return this.data[this.currentIndex] ? this.data[this.currentIndex].title : '';
            }
        },
        methods: {
            onShortcutTouchStart (e) {
                let anchorIndex = getData(e.target, 'index');

                //  记录起始位置和起始索引存入touch给onShortcutTouchMove使用
                this.touch.y1 = e.touches[0].pageY;
                this.touch.anchorIndex = anchorIndex;

                this._scrollTo(anchorIndex);
            },
            onShortcutTouchMove (e) {
                this.touch.y2 = e.touches[0].pageY;
                let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0;
                let newIndex = parseInt(this.touch.anchorIndex) + delta;
                this._scrollTo(newIndex);
            },
            scroll (pos) {
                this.scrollY = pos.y;
            },
            _scrollTo (index) {
                if (!index && index !== 0) {
                    return;
                }
                if (index < 0) {
                    index = 0
                } else if (index > this.listHeight.length - 2) {
                    index = this.listHeight.length - 2;
                }
                this.currentIndex = index;
                this.scrollY = -this.listHeight[index];
                this.$refs.listView.scrollToElement(this.$refs.listGroup[index], 0);
            },
            _calculateHeight () {
                let height = 0;
                this.listHeight.push(height);
                let list = this.$refs.listGroup;
                for (let i = 0; i < list.length; i++) {
                    height += list[i].clientHeight;
                    this.listHeight.push(height);
                }
            },
            selectItem (item) {
                this.$emit('select', item);
            },
            refresh () {
                this.$refs.listView.refresh();
            }
        },
        watch: {
            data () {
                setTimeout(() => {
                    this._calculateHeight();
                }, 20);
            },
            scrollY (newY) {
                // 当滚动到顶部，newY>0
                if (newY > 0) {
                    this.currentIndex = 0;
                    return
                }
                // 在中间部分滚动
                for (let i = 0; i < this.listHeight.length - 1; i++) {
                    let h1 = this.listHeight[i];
                    let h2 = this.listHeight[i + 1];
                    if ((-newY) >= h1 && (-newY) < h2) {
                        this.currentIndex = i;
                        this.diff = h2 + newY;
                        return;
                    }
                }
                // 当滚动到底部，且-newY大于最后一个元素的上限
                this.currentIndex = this.listHeight.length - 2;
            },
            diff (newVal) {
                //  fixed-title 偏移高度值
                let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? (newVal - TITLE_HEIGHT) : 0;

                //  fixedTop不变则不操作DOM，减少操作DOM频率
                if (this.fixedTop === fixedTop) {
                    return;
                }
                this.fixedTop = fixedTop;

                this.$refs.fixed.style.transform = `translate3d(0, ${fixedTop}px, 0)`;
            }
        },
        created () {
            //  若在data中定义，会被Vue添加 getter，setter 监听变化，在此处不需要（props中数据也一样会）
            this.touch = {};
            this.listenScroll = true;
            this.listHeight = [];
            this.probeType = 3;
        }
    }
</script>

<style scoped lang="stylus">
    @import '../../common/stylus/variable.styl'
    .list-view
        width: 100%
        height: 100%
        overflow: hidden
        position: relative
        .list-group
            padding-bottom: 30px
            .list-group-title
                padding-left: 20px
                height: 30px
                line-height: 30px
                font-size: $font-size-small
                color: $color-text-l
                background-color: $color-highlight-background
            .list-group-item
                padding: 20px 0 0 30px
                font-size: 0
                display: flex
                align-items: center
                .avatar
                    width: 50px
                    border-radius: 50%
                .name
                    margin-left: 20px
                    color: $color-text-l
                    font-size: $font-size-medium
        .list-shortcut
            position: absolute
            right: 0
            top: 50%
            transform: translateY(-50%)
            width: 20px
            padding: 20px 0
            border-radius: 10px
            background-color: $color-background-d
            .shortcut-item
                text-align: center
                color: $color-text-l
                font-size: $font-size-small
                font-family: Helvetica
                padding: 3px
                line-height: 1
                &.current
                    color: $color-theme
        .list-fixed
            position: absolute
            left: 0
            top: 0
            width: 100%
            .fixed-title
                padding-left: 20px
                height: 30px
                line-height: 30px
                font-size: $font-size-small
                color: $color-text-l
                background-color: $color-highlight-background
        .loading-container
            position: absolute
            width: 100%
            left: 0
            top: 50%
            transform: translateY(-50%)
</style>
