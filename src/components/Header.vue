<template>
    <div class="header" :class="{['header-login']:isLogin}" @click="a=!a">
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
    import { mapState, mapActions } from 'vuex'
    export default {
        name: 'Header',
        components: { 'n-icon': Icon },
        data() {
            return {
               a:false
            }
        },
        computed: {
            ...mapState({
                isLogin: state => state.auth.isLogin
            })
        },
        methods: {
            ...mapActions(['logout']),
            onClick() {
                this.logout();
            }
        }
    }
</script>
<style lang="scss" scoped>
    @import '@/assets/base.scss';
    .header {
        background: $tcolor;
        color: #fff;
        padding: 54px 0;
        flex-grow: 0;
        flex-shrink: 0;
        min-width: 960px;
        >.logo {
            width: 960px;
            margin: 0 auto;
            padding: 0 20px;
            >.pen {
                border: 1px solid #fff;
                width: 44px;
                height: 44px;
                font-size: 42px;
                display: inline-flex;
                justify-content: center;
                align-items: center;
                border-top-left-radius: 6px;
                border-bottom-right-radius: 6px;
                vertical-align: middle;
                margin-right: 4px;
            }
            >.text {
                font-size: 43px;
                vertical-align: middle;
            }
        }
        &.header-login {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 14px 0;
            >.logo {
                width: auto;
                margin: 0 0;
                padding: 0 20px;
                >.pen {
                    width: 24px;
                    height: 24px;
                    font-size: 22px;
                }
                >.text {
                    font-size: 23px;
                }
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