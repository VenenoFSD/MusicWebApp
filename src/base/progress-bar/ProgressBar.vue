<template>
    <div class="progress-bar" @click="progressClick" ref="progressBar">
        <div class="bar-inner">
            <div class="progress" ref="progress"></div>
            <div class="progress-btn-wrapper" ref="progressBtn"
                 @touchstart.prevent="progressTouchStart"
                 @touchmove.prevent="progressTouchMove"
                 @touchend="progressTouchEnd">
                <div class="progress-btn"></div>
            </div>
        </div>
    </div>
</template>

<script>
    const progressBtnWidth = 16;
    export default {
        name: "ProgressBar",
        props: {
            percent: {
                type: Number,
                default: 0
            }
        },
        created () {
            this.touch = {};
        },
        methods: {
            progressTouchStart (e) {
                this.touch.initiated = true;
                this.touch.startX = e.touches[0].pageX;  //  起始位置
                this.touch.left = this.$refs.progress.clientWidth;
            },
            progressTouchMove (e) {
                if (!this.touch.initiated) {
                    return;
                }
                const deltaX = e.touches[0].pageX - this.touch.startX;
                const offsetWidth = Math.min(Math.max(0, deltaX + this.touch.left), this.$refs.progressBar.clientWidth - progressBtnWidth);
                this._offset(offsetWidth);
            },
            progressTouchEnd () {
                this.touch.initiated = false;
                this._triggerPercent();  //  修改进度
            },
            progressClick (e) {
                //  this._offset(e.offsetX);有bug
                const rect = this.$refs.progressBar.getBoundingClientRect();
                const offsetWidth = e.pageX - rect.left;
                this._offset(offsetWidth);
                this._triggerPercent();
            },
            _offset (offsetWidth) {
                this.$refs.progress.style.width = `${offsetWidth}px`;
                this.$refs.progressBtn.style.transform = `translate3d(${offsetWidth}px, 0, 0)`;
            },
            _triggerPercent () {
                const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;
                const newPercent = this.$refs.progress.clientWidth / barWidth;
                this.$emit('changePercent', newPercent);
            }
        },
        watch: {
            percent (newPercent) {
                if (newPercent >= 0 && !this.touch.initiated) {
                    const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;
                    const offsetWidth = barWidth * newPercent;
                    this._offset(offsetWidth);
                }
            }
        }
    }
</script>

<style scoped lang="stylus">
    @import '../../common/stylus/variable.styl'
    .progress-bar
        width: 100%
        height: 30px
        .bar-inner
            width: 100%
            height: 4px
            background: rgba(0, 0, 0, 0.3)
            position: relative
            left: 0
            top: 13px
            .progress
                width: 0
                height: 100%
                position: absolute
                left: 0
                top: 0
                background-color: $color-theme
            .progress-btn-wrapper
                width: 24px
                height: 24px
                position: absolute
                left: -5px
                top: -10px
                box-sizing: border-box
                padding: 4px 0 0 4px
                .progress-btn
                    width: 10px
                    height: 10px
                    background: $color-theme
                    border: 3px solid $color-text
                    border-radius: 50%
</style>
