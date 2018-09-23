<template>
    <div class="signIn">
        <n-header></n-header>
    </div>
</template>
<script>
    import Header from '@/components/Header.vue'
    import url from '@/api/url.js'
    import request from '@/helpers/request.js'
    export default {
        name: 'SignIn',
        components: { 'n-header': Header },
        data() {
            return {}
        },
        created() {
            request({ url: url.login, method: 'POST', data: { username: 'blame', password: 123456 } }).then(res => {
                console.log(res)
            })
            request({ url: url.checkLogin }).then(res => {
                console.log(res)
            })
        },
    }
</script>
<style scoped lang="scss" src='./signIn.scss'></style>