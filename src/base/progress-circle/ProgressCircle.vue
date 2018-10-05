<template>
    <div class="progress-circle">
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1"
             viewBox="0 0 100 100"
             :width="radius"
             :height="radius">
            <circle class="progress-background" r="50" cx="50" cy="50"
                    fill="transparent"/>
            <circle class="progress-bar" r="50" cx="50" cy="50"
                    fill="transparent"
                    :stroke-dasharray="dashArray"
                    :stroke-dashoffset="dashOffset"/>
        </svg>
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: "ProgressCircle",
        props: {
            radius: {
                type: Number,
                default: 0
            },
            percent: {
                type: Number,
                default: 0
            }
        },
        data () {
            return {
                dashArray: Math.PI * 100
            }
        },
        computed: {
            dashOffset () {
                return (1 - this.percent) * this.dashArray;
            }
        }
    }
</script>

<style scoped lang="stylus">
    @import '../../common/stylus/variable.styl'
    .progress-circle
        position: relative
        circle
            stroke-width: 8px
            transform-origin: center
            &.progress-background
                transform: scale(0.9)
                stroke: $color-theme-d
                stroke-opacity: 0.5
            &.progress-bar
                transform: scale(0.9) rotate(-90deg)
                stroke: $color-theme
</style>
