<template>
    <div class="song-list">
        <ul>
            <li v-for="(song, index) in songs" class="item" @click="selectItem(song, index)">
                <div class="rank" v-show="rank">
                    <span :class="getRankCls(index)">{{getRankText(index)}}</span>
                </div>
                <div class="content">
                    <h2 class="name">{{song.name}}</h2>
                    <p class="desc">{{getDesc(song)}}</p>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "SongList",
        props: {
            songs: {
                type: Array,
                default: []
            },
            rank: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            getDesc (song) {
                return `${song.singer} · ${song.album}`;
            },
            selectItem (song, index) {
                this.$emit('select', song, index);
            },
            getRankCls (index) {
                if (index <= 2) {
                    return `icon icon${index}`;
                } else {
                    return 'text';
                }
            },
            getRankText (index) {
                if (index > 2) {
                    return index + 1;
                }
            },
        }
    }
</script>

<style scoped lang="stylus">
    @import '../../common/stylus/variable.styl'
    @import '../../common/stylus/mixin.styl'
    .item
        height: 64px
        font-size: $font-size-medium
        display: flex
        align-items: center
        .rank
            width: 25px
            flex: 0 0 25px
            margin-right: 30px
            text-align: center
            font-size: 0
            .icon
                display: inline-block
                width: 25px
                height: 24px
                background-size: 25px 24px
                &.icon0
                    bg-image('first')
                &.icon1
                    bg-image('second')
                &.icon2
                    bg-image('third')
            .text
                color: $color-theme
                font-size: $font-size-large
        .content
            flex: 1
            line-height: 20px
            overflow: hidden
            no-wrap()
            .name
                color: $color-text
            .desc
                margin-top: 4px
                color: $color-text-d
</style>
