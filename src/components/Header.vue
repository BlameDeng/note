<template>
    <div class="header" :class="{login:isLogin}" @click="onClick">
        <div class="logo">
            <span class="pen">
                <n-icon name="pen"></n-icon>
            </span>
            <span class="text">我的云笔记</span>
        </div>
        <div class="user-info" v-if="isLogin">
            <img src="@/assets/nvdu.png" title="个人信息">
            <n-icon name="xiala" style="cursor:pointer;"></n-icon>
        </div>
    </div>
</template>
<script>
    import Icon from './icon.vue'
    export default {
        name: 'Header',
        components: { 'n-icon': Icon },
        data() {
            return {
                isLogin: false
            }
        },
        methods: {
            onClick() {
                this.isLogin = !this.isLogin;
            }
        }
    }
</script>
<style lang="scss" scoped>
    @import '@/assets/base.scss';
    .header {
        background: $tcolor;
        height: 60px;
        color: #fff;
        padding: 14px 0;
        min-width: 960px;
        >.logo {
            width: 960px;
            margin: 0 auto;
            padding: 0 20px;
            >.pen {
                border: 1px solid #fff;
                width: 24px;
                height: 24px;
                font-size: 22px;
                display: inline-flex;
                justify-content: center;
                align-items: center;
                border-top-left-radius: 6px;
                border-bottom-right-radius: 6px;
                vertical-align: middle;
                margin-right: 4px;
            }
            >.text {
                font-size: 23px;
                vertical-align: middle;
            }
        }
        &.login {
            display: flex;
            justify-content: space-between;
            align-items: center;
            >.logo {
                width: auto;
                margin: 0 0;
                padding: 0 20px;
            }
            >.user-info {
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 22px;
                margin-right: 250px;
                >img {
                    width: 40px;
                    height: 40px;
                    border-radius: 4px;
                    cursor: pointer;
                    margin-right: 5px;
                }
            }
        }
    }
</style>