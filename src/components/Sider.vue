<template>
    <div class="sider">
        <div class="nav">
            <div class="add">
                <n-icon name="add" class="icon"></n-icon><span>新建文档</span>
            </div>
            <div class="recent">
                <n-icon name="new" class="icon"></n-icon><span>最新文档</span>
            </div>
            <div class="my-documents">
                <n-icon name="wenjianjia" class="icon"></n-icon><span>我的文件夹</span>
            </div>
            <div class="document active">
                <n-icon name="wenjian" class="icon"></n-icon><span>我的资源</span>
                <p></p>
            </div>
            <div class="document">
                <n-icon name="wenjian" class="icon"></n-icon><span>我的资源</span>
                <p></p>
            </div>
            <div class="trash active">
                <n-icon name="trash" class="icon"></n-icon><span>回收站</span>
                <p></p>
            </div>
        </div>
        <div class="detail">
            <div class="search"></div>
        </div>
    </div>
</template>
<script>
    import Icon from './icon.vue'
    import { mapState, mapActions } from 'vuex'
    export default {
        name: 'Seader',
        components: { 'n-icon': Icon },
        data() {
            return {

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
    .sider {
        display: flex;
        width: 500px;
        >.nav {
            width: 250px;
            flex-grow: 0;
            flex-shrink: 0;
            background: #eee;
            border-right: 1px solid $bcolor1;
            font-size: 12px;
            height: 800px;
            >.add {
                height: 60px;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                padding-left: 40px;
                >.icon {
                    fill: $tcolor;
                }
                >span {
                    cursor: pointer;
                    margin-left: 15px;
                    position: relative;
                    &::after {
                        content: '';
                        display: inline-block;
                        width: 4px;
                        height: 4px;
                        border: 4px solid transparent;
                        border-top-color: #999;
                        position: absolute;
                        top: 0;
                        right: 0;
                        transform: translateY(7px) translateX(15px);
                    }
                    &:hover {
                        color: $tcolor;
                    }
                }

            }
            >.recent {
                height: 40px;
                cursor: pointer;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                padding-left: 40px;
                border-top: 1px solid #fff;
                >span {
                    margin-left: 15px;
                }
                &:hover {
                    background: $hcolor;
                    border-top: none;
                }
                &.active {
                    background: $tcolor;
                    color: #fff;
                }
            }
            >.my-documents {
                height: 40px;
                cursor: pointer;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                padding-left: 40px;
                >span {
                    margin-left: 15px;
                }
                &:hover {
                    background: $hcolor;
                }
                &.active {
                    background: $tcolor;
                    color: #fff;
                }
            }
            >.document {
                height: 40px;
                cursor: pointer;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                padding-left: 60px;
                position: relative;
                >span {
                    margin-left: 15px;
                }
                >p {
                    width: 5px;
                    height: 5px;
                    border: 5px solid transparent;
                    position: absolute;
                    top: 0;
                    right: 0;
                    transform: translateY(18px) translateX(-25px);
                }
                &:hover {
                    background: $hcolor;
                    >p {
                        border-top-color: #666;
                    }
                }
                &.active {
                    background: $tcolor;
                    color: #fff;
                    &:hover {
                        >p {
                            border-top-color: #fff;
                        }
                    }
                }
            }
            >.trash {
                height: 40px;
                cursor: pointer;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                padding-left: 40px;
                position: relative;
                >span {
                    margin-left: 15px;
                }
                >p {
                    width: 5px;
                    height: 5px;
                    border: 5px solid transparent;
                    position: absolute;
                    top: 0;
                    right: 0;
                    transform: translateY(18px) translateX(-25px);
                }
                &:hover {
                    background: $hcolor;
                    >p {
                        border-top-color: #666;
                    }
                }
                &.active {
                    background: $tcolor;
                    color: #fff;
                    &:hover {
                        >p {
                            border-top-color: #fff;
                        }
                    }
                }
            }
        }
        >.detail {
            width: 250px;
            flex-grow: 0;
            flex-shrink: 0;
            height: 800px;
            background: #888;
            >.search {
                height: 60px;
                border: 1px solid #333;
            }
        }
    }
</style>