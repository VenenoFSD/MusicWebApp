<template>
    <scroll class="suggest"
            :data="result" :pullUp="pullUp" :beforeScroll="beforeScroll"
            @scrollToEnd="searchMore" @beforeScroll="listScroll"
            ref="suggest">
        <ul class="suggest-list">
            <li class="suggest-item" v-for="item in result" @click="selectItem(item)">
                <div class="icon">
                    <i :class="getIconCls(item)"></i>
                </div>
                <div class="name">
                    <p class="text" v-html="getDisplayName(item)"></p>
                </div>
            </li>
            <loading v-show="hasMore" title=""></loading>
        </ul>
        <div class="no-result-wrapper" v-show="!hasMore && !resultLength">
            <no-result title="抱歉，暂无搜索结果"></no-result>
        </div>
    </scroll>
</template>

<script>
    import Scroll from '../../base/scroll/Scroll'
    import Loading from '../../base/loading/Loading'
    import NoResult from '../../base/no-result/NoResult'
    import {search} from "../../api/search";
    import {ERR_OK} from "../../api/config";
    import {createSong} from "../../common/js/song";
    import Singer from '../../common/js/singer'
    import {mapMutations, mapActions} from 'vuex'
    import {getSongVkey} from "../../api/song";

    const TYPE_SINGER = 'singer';
    const perPage = 16;

    export default {
        name: "Suggest",
        props: {
            query: {
                type: String,
                default: ''
            },
            showSinger: {
                type: Boolean,
                default: true
            }
        },
        data () {
            return {
                page: 1,
                result: [],
                resultLength: 0,
                pullUp: true,
                hasMore: true,  //  能否继续加载
                beforeScroll: true
            }
        },
        methods: {
            ...mapMutations({
                setSinger: 'SET_SINGER'
            }),
            ...mapActions([
                'insertSong'
            ]),
            search () {  //  第一次搜索
                this.page = 1;
                this.hasMore = true;
                this.$refs.suggest.scrollTo(0, 0);
                search(this.query, this.page, this.showSinger, perPage).then((res) => {
                    if (res.code === ERR_OK) {
                        this.result = this._genResult(res.data);
                        this._checkMore(res.data);
                    }
                });
            },
            getIconCls (item) {
                if (item.type === TYPE_SINGER) {
                    return 'icon-mine';
                } else {
                    return 'icon-music';
                }
            },
            getDisplayName (item) {
                if (item.type === TYPE_SINGER) {
                    return item.singername;
                } else {
                    return `${item.name} - ${item.singer}`;
                }
            },
            searchMore () {  //  加载更多
                if (!this.hasMore) {
                    return;
                }
                this.page++;
                search(this.query, this.page, this.showSinger, perPage).then((res) => {
                    if (res.code === ERR_OK) {
                        this.result = this.result.concat(this._genResult(res.data));
                        this._checkMore(res.data);
                    }
                });
            },
            selectItem (item) {
                if (item.type === TYPE_SINGER) {  //  进入歌手页
                    const singer = new Singer({
                        id: item.singermid,
                        name: item.singername
                    });
                    this.$router.push(`/search/${singer.id}`);
                    this.setSinger(singer);
                } else {  //  播放歌曲
                    this.insertSong(item);
                }
                this.$emit('select');
            },
            listScroll () {
                this.$emit('listScroll');
            },
            refresh () {
                this.$refs.suggest.refresh();
            },
            _checkMore (data) {  //  检查能否加载更多
                const song = data.song;
                if (!song.list.length || (song.curnum + (song.curpage - 1) * perPage) === song.totalnum) {
                    this.hasMore = false;
                }
            },
            _genResult (data) {
                let ret = [];
                if (data.zhida && data.zhida.singerid) {  //  搜索结果为歌手
                    ret.push({...data.zhida, ...{type: TYPE_SINGER}});
                }
                if (data.song) {  //  搜索结果为歌曲
                    ret = ret.concat(this._normalizeSongs(data.song.list));
                }
                return ret;
            },
            _normalizeSongs (list) {
                let ret = [];
                list.forEach((musicData) => {
                    if (musicData.songmid && musicData.albummid) {
                        ret.push(createSong(musicData));
                    }
                });
                return ret;
            },
            _insertSongsVkey () {
                for (let i = 0; i < this.result.length; i++) {
                    let item = this.result[i];
                    if (item.type === TYPE_SINGER) {
                        continue;
                    }
                    getSongVkey(item.mid, item.mid).then((res) => {
                        if (res.code === ERR_OK) {
                            let vkey = res.data.items[0].vkey;
                            item.url = `http://isure.stream.qqmusic.qq.com/C400${item.mid}.m4a?guid=5448538077&vkey=${vkey}&uin=0&fromtag=66`;
                        }
                    });
                }
            }
        },
        watch: {
            query () {
                this.search();
            },
            result () {
                this.resultLength = this.result.length;
                if (this.resultLength) {
                    this._insertSongsVkey();
                }
            }
        },
        components: {
            Scroll,
            Loading,
            NoResult
        }
    }
</script>

<style scoped lang="stylus">
    @import '../../common/stylus/mixin.styl'
    @import '../../common/stylus/variable.styl'
    .suggest
        width: 100%
        height: 100%
        overflow: hidden
        .suggest-list
            padding: 0 30px
            .suggest-item
                display: flex
                align-items: center
                padding-bottom: 20px
                .icon
                    flex: 0 0 30px
                    width: 30px
                    [class^="icon-"]
                        font-size: 14px
                        color: $color-text-d
                .name
                    flex: 1
                    font-size: $font-size-medium
                    color: $color-text-d
                    overflow: hidden
                    .text
                        no-wrap()
        .no-result-wrapper
            position: absolute
            width: 100%
            top: 50%
            transform: translateY(-50%)
</style>
