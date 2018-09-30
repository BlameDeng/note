<template>
    <div class="header" :class="{['header-login']:isLogin}">
        <div class="logo">
            <span class="pen">
                <n-icon name="pen"></n-icon>
            </span>
            <span class="text">我的云笔记</span>
        </div>
        <div class="user-info" v-if="isLogin">
            <img src="@/assets/nvdu.png" title="个人信息">
            <n-icon name="xiala" style="cursor:pointer;" @click="showSet=true"></n-icon>
            <ul class="set" v-show="showSet">
                <li @click="onMask">个人信息</li>
                <li>账号信息</li>
                <li @click="onLogout">注销登录</li>
            </ul>
        </div>
        <div class="mask" v-show="showMask">
            <div class="per-info">
                <div class="title">个人信息
                    <n-icon name="x" style="cursor:pointer;" class="n-icon" title="关闭" @click="closeMask"></n-icon>
                </div>
                <div class="item">
                    <span class="item-key">头像</span>
                    <img src="@/assets/nvdu.png" title="点击查看原图">
                    <div id="upload" class="upload">
                        <el-button plain id="new-avatar" class="new-avatar">上传新头像</el-button>
                        <p>支持JPG、PNG格式，小于200KB</p>
                    </div>
                </div>
                <div class="item">
                    <span class="item-key">账号</span>
                    <p v-if="user">{{user.name}}</p>
                </div>
                <div class="item">
                    <span class="item-key">昵称</span>
                    <el-input v-model.trim="nickname"></el-input>
                </div>
                <div class="item">
                    <span class="item-key">性别</span>
                    <el-radio v-model="sex" label="male">男</el-radio>
                    <el-radio v-model="sex" label="female">女</el-radio>
                    <el-radio v-model="sex" label="secret">保密</el-radio>
                </div>
                <div class="item">
                    <span class="item-key">签名</span>
                    <el-input type="textarea" :rows="2" v-model.trim="sign" resize="none">
                    </el-input>
                </div>
                <div class="item">
                    <el-button type="primary">保存</el-button>
                    <el-button plain>取消</el-button>
                </div>
            </div>
        </div>
        <n-upload container-id="upload" browse-id="new-avatar"></n-upload>
    </div>
</template>
<script>
    import Icon from './icon.vue'
    import Upload from "@/components/upload/upload.vue"
    import { mapState, mapActions } from 'vuex'
    import Notebooks from '@/helpers/leancloud.js'
    export default {
        name: 'Header',
        components: { 'n-icon': Icon, 'n-upload': Upload },
        data() {
            return {
                showSet: false,
                nickname: '',
                sex: 'secret',
                sign: '',
                showMask: false
            }
        },
        computed: {
            ...mapState({
                isLogin: state => state.auth.isLogin,
                user: state => state.auth.user
            })
        },
        created() {
            // Notebooks.saveAll({ name: 'jim', age: 20 }).then(res => {
            //     console.log(res)
            // }).catch(err => { console.log(err) })
        },
        methods: {
            ...mapActions(['logout']),
            onLogout() {
                this.logout().then(res => {}).catch(err => {});
            },
            listenDocument() {
                this.showSet = false;
            },
            onMask() {
                this.showMask = true;
            },
            closeMask() {
                this.showMask = false;
            }
        },
        watch: {
            showSet(val) {
                if (val) {
                    document.addEventListener('click', this.listenDocument);
                } else {
                    document.removeEventListener('click', this.listenDocument);
                }
            }
        },
        beforeDestroy() {
            document.removeEventListener('click', this.listenDocument);
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
                position: relative;
                >img {
                    width: 40px;
                    height: 40px;
                    border-radius: 4px;
                    cursor: pointer;
                    margin-right: 5px;
                }
                >.set {
                    position: absolute;
                    top: 100%;
                    left: -10px;
                    transform: translateY(14px);
                    width: 100px;
                    font-size: 14px;
                    background: #fff;
                    color: $tcolor3;
                    box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.3);
                    cursor: pointer;
                    user-select: none;
                    border-bottom-left-radius: 4px;
                    border-bottom-right-radius: 4px;
                    >li {
                        width: 100%;
                        height: 30px;
                        text-align: center;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        &:hover {
                            background: $hcolor2;
                        }
                        &:not(:last-child) {
                            border-bottom: 1px solid $hcolor1;
                        }
                    }
                }
            }
            >.mask {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.3);
                z-index: 1;
                >.per-info {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    width: 400px;
                    transform: translateX(-50%) translateY(-50%);
                    background: #fff;
                    color: $tcolor3;
                    font-size: 14px;
                    border-radius: 4px;
                    padding: 30px 20px;
                    box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
                    outline: inset 2px solid #666;
                    >.title {
                        color: $tcolor2;
                        text-align: center;
                        padding: 5px 0;
                        font-size: 16px;
                        margin-bottom: 10px;
                        position: relative;
                        user-select: none;
                        >.n-icon {
                            position: absolute;
                            top: 50%;
                            right: 0;
                            transform: translateY(-50%);
                            font-size: 12px;
                            color: $tcolor4;
                            &:hover {
                                color: $tcolor3;
                            }
                        }
                    }
                    >.item {
                        display: flex;
                        justify-content: flex-start;
                        align-items: center;
                        padding: 10px 0;
                        >.item-key {
                            display: inline-block;
                            flex-shrink: 0;
                            width: 60px;
                        }
                        &:nth-child(2) {
                            >img {
                                width: 50px;
                                height: 50px;
                                border-radius: 50%;
                                cursor: pointer;
                            }
                            >.upload {
                                margin-left: 20px;
                                >.new-avatar {
                                    padding: 6px 8px;
                                    font-size: 12px;
                                    margin-bottom: 6px;
                                }
                                >p {
                                    font-size: 12px;
                                    color: $tcolor4;
                                }
                            }
                        }
                        &:last-child {
                            justify-content: center;
                            margin-top: 15px;
                        }
                    }
                }
            }
        }
    }
</style>