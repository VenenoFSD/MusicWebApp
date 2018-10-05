<template>
    <div class="search-box">
        <i class="icon-search"></i>
        <input type="text" class="box" :placeholder="placeholder" v-model="query" ref="query">
        <i class="icon-dismiss" v-show="query" @click="clear"></i>
    </div>
</template>

<script>
    import {debounce} from "../../common/js/util";

    export default {
        name: "SearchBox",
        data () {
            return {
                query: ''
            }
        },
        props: {
            placeholder: {
                type: String,
                default: '搜索歌曲、歌手'
            }
        },
        methods: {
            clear () {
                this.query = '';
            },
            setQuery (query) {
                this.query = query;
            },
            blur () {
                this.$refs.query.blur();  //  移出输入框焦点
            }
        },
        created () {
            this.$watch('query', debounce((newQuery) => {
                this.$emit('query', newQuery);
            }, 200));
        }
    }
</script>

<style scoped lang="stylus">
    @import '../../common/stylus/variable.styl'
    .search-box
        width: 100%
        height: 40px
        display: flex
        align-items: center
        padding: 0 6px
        box-sizing: border-box
        background: $color-highlight-background
        border-radius: 6px
        .icon-search
            font-size: 24px
            color: $color-background
        .box
            flex: 1
            background: $color-highlight-background
            color: $color-text
            font-size: $font-size-medium
            margin: 0 5px
            outline: none
            line-height: 18px
            &::placeholder
                color: $color-text-d
        .icon-dismiss
            font-size: 16px
            color: $color-background
</style>
