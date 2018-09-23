<template>
    <div class="signIn">
        <n-header></n-header>
    </div>
</template>
<script>
    import Header from '@/components/Header.vue'
    export default {
        name: 'SignIn',
        components: { 'n-header': Header },
        data() {
            return {

            }
        }
    }
</script>
<style scoped lang="scss" src='./signIn.scss'></style>