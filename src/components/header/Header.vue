<template>
    <div class="header">
        <div class="icon"></div>
        <h1 class="text">Chicken Music</h1>
        <router-link to="/user" class="mine" tag="div">
            <i class="icon-mine"></i>
        </router-link>
    </div>
</template>

<script>
    export default {
        name: "MyHeader"
    }
</script>

<style scoped lang="stylus">
    @import '../../common/stylus/mixin.styl'
    @import '../../common/stylus/variable.styl'
    .header
        height: 44px
        text-align: center
        font-size: 0
        .icon, .text
            display: inline-block
            vertical-align: top
        .icon
            width: 30px
            height: 32px
            bg-image('logo')
            margin: 6px 9px 0 0
        .text
            line-height: 44px
            color: $color-theme
            font-size: $font-size-large
        .mine
            position: absolute
            top: 0
            right: 0
            .icon-mine
                display: block
                padding: 12px
                font-size: 20px
                color: $color-theme
</style>
