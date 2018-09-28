<template>
    <span class="icon-wrapper">
        <svg class="x-icon" aria-hidden="true" @click="$emit('click',$event)">
            <use v-bind:xlink:href="`#icon-${name}`"></use>
        </svg>
    </span>
</template>
<script>
    import './svg';
    export default {
        name: 'xIcon',
        props: {
            name: { type: String }
        }
    }
</script>
<style lang="scss" scoped>
    .icon-wrapper {
        width: 1em;
        height: 1em;
        .x-icon {
            fill: currentColor;
            width: 100%;
            height: 100%;
            vertical-align: top;
            overflow: hidden;
        }
    }
</style>