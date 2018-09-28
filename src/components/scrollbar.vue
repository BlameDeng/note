<template>
    <div class="x-scrollbar-container" @mousewheel="mousewheel" @mouseup="mouseup" @mouseleave="mouseleave">
        <slot></slot>
        <div class="scrollbar-position" v-if="overHeight>0">
            <div class="scroll-slider" ref="slider" @mousedown="sliderMousedown" :style="slider"></div>
        </div>
    </div>
</template>
<script>
    export default {
        name: "xScrollbar",
        props: {
            slider: {
                type: Object,
                default () {
                    return { background: "#ddd" };
                }
            },
            height: ''
        },
        data() {
            return { overHeight: 0, originY: 0 };
        },
        inject: ['eventBus'],
        computed: {},
        created() {
            this.eventBus.$on('scrollbar-resize', this.resize);
            this.eventBus.$on('scrollbar-toend', this.resize('end'));
            this.eventBus.$on('select-tab-books', this.resize);
            this.eventBus.$on('select-book', this.resize);
        },
        methods: {
            scroll(y) {
                //y其实就是slider每次滚动偏移百分比的变化值
                let scroll = this.overHeight / 150;
                let slider = this.$refs.slider;
                let slot = this.$slots.default[0].elm;
                if (slider.style.transform) {
                    let results = slider.style.transform.match(/[-+]?\d+(?:\.\d)?/);
                    let m = +results[0];
                    if (m + y <= 0 && y < 0) {
                        slider.style.transform = `translateY(0)`;
                        slot.style.transform = `translateY(0)`;
                        return;
                    }
                    if (m + y >= 150 && y > 0) {
                        slider.style.transform = `translateY(150%)`;
                        slot.style.transform = `translateY(${-this.overHeight}px)`;
                        return;
                    }
                    slider.style.transform = `translateY(${m + y}%)`;
                    slot.style.transform = `translateY(${-scroll * (m + y)}px)`;
                } else if (!slider.style.transform && y < 0) {
                    return;
                } else {
                    slider.style.transform = `translateY(${y}%)`;
                    slot.style.transform = `translateY(${-scroll * y}px)`;
                }
            },
            mousewheel(e) {
                if (this.overHeight <= 0) {
                    return;
                }
                let { deltaY: y } = e;
                y = y / 4;
                this.scroll(y);
            },
            sliderMousedown(e) {
                this.$el.removeEventListener("mousemove", this.mousemove);
                let { clientY: y } = e;
                this.originY = y;
                this.$el.addEventListener("mousemove", this.mousemove);
            },
            mousemove(e) {
                let { clientY: y } = e;
                let moveY = y - this.originY;
                if (Math.abs(moveY) < 5) { return }
                this.scroll(moveY);
                this.originY = y;
            },
            mouseup() {
                this.$el.removeEventListener("mousemove", this.mousemove);
            },
            mouseleave() {
                this.$el.removeEventListener("mousemove", this.mousemove);
            },
            resize(type) {
                let clientHeight = document.documentElement.clientHeight;
                let { y } = this.$el.getBoundingClientRect();
                this.$el.style.height = this.height || (clientHeight - y + "px");
                let slot = this.$slots.default[0].elm;
                this.$nextTick(() => {
                    let { height: slotHeight } = slot.getBoundingClientRect();
                    let { height: containerHeight } = this.$el.getBoundingClientRect();
                    if (this.height) {
                        this.overHeight = slotHeight - (+this.height.match(/\d+/)[0]);
                    } else {
                        this.overHeight = slotHeight - containerHeight;
                    }
                    if (this.overHeight <= 0) { return }
                    slot.style.transition = "transform .5s";
                    if (type === 'end') {
                        let slider = this.$refs.slider;
                        slider.style.transform = `translateY(150%)`;
                        slot.style.transform = `translateY(${-this.overHeight}px)`;
                    }
                })
            }
        },
        mounted() {
            this.$el.onselectstart = () => false;
            // this.resize();
        },
        beforeDestroy() {
            this.eventBus.$off('get-trashnotes-done', this.resize);
            this.eventBus.$off('select-books', this.resize);
            this.eventBus.$off('select-book', this.resize);
        }
    };
</script>
<style lang="scss" scoped>
    .x-scrollbar-container {
        width: 100%;
        height: 100%;
        overflow: hidden;
        position: relative;
        >.scrollbar-position {
            position: absolute;
            top: 0;
            right: 0;
            width: 15px;
            height: 100%;
            background: transparent;
            >.scroll-slider {
                display: none;
                width: 100%;
                height: 40%;
                transition: all 0.5s;
            }
        }
        &:hover {
            .scroll-slider {
                display: block;
            }
        }
    }
</style>