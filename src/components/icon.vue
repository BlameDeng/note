<template>
    <svg class="x-icon" aria-hidden="true" @click="$emit('click',$event)">
        <use v-bind:xlink:href="`#icon-${name}`"></use>
    </svg>
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
    .x-icon {
        fill: currentColor;
        width: 1em;
        height: 1em;
        vertical-align: top;
        overflow: hidden;
    }
</style>