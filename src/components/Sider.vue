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
            <div class="document" v-for="notebook in allNotebooks" :key="notebook.id" v-if="allNotebooks&&allNotebooks.length">
                <n-icon name="wenjian" class="icon"></n-icon><span>{{notebook.title}}</span>
                <p></p>
            </div>
            <div class="trash active">
                <n-icon name="trash" class="icon"></n-icon><span>回收站</span>
                <p></p>
            </div>
        </div>
        <div class="detail">
            <div class="search">
                <n-icon name="search" class="icon"></n-icon>
                <input type="text" placeholder="搜索...">
            </div>
            <div class="widget">
                <div class="document" v-for="notebook in allNotebooks" :key="notebook.id" v-if="allNotebooks&&allNotebooks.length">
                    <div class="icon-wrapper">
                        <n-icon name="wenjian" class="icon"></n-icon>
                        <span>{{notebook.title}}</span>
                        <n-icon name="trash" class="icon"></n-icon>
                    </div>
                    <p>{{notebook.createdAt}}</p>
                </div>
            </div>
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
            return {}
        },
        computed: {
            ...mapState({
                isLogin: state => state.auth.isLogin,
                allNotebooks: state => state.notebooks.allNotebooks
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
        font-size: 12px;
        flex-grow: 0;
        flex-shrink: 0;
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
                border-bottom: 1px solid $bcolor1;
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
                    background: $hcolor1;
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
                    background: $hcolor1;
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
                    background: $hcolor1;
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
                    background: $hcolor1;
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
            border-right: 1px solid $bcolor1;
            >.search {
                height: 60px;
                text-align: center;
                vertical-align: middle;
                position: relative;
                border-bottom: 1px solid $bcolor1;
                >.icon {
                    font-size: 16px;
                    fill: $tcolor2;
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    margin-left: 9px;
                    cursor: pointer;
                    &:hover {
                        fill: $tcolor;
                    }
                }
                >input {
                    width: 160px;
                    height: 36px;
                    margin-top: 12px;
                    border: 1px solid $bcolor1;
                    border-radius: 18px;
                    padding: 0 28px;
                    &:focus {
                        outline: none;
                    }
                }
            }
            >.widget {
                >.document {
                    cursor: pointer;
                    padding: 5px 0 5px 20px;
                    border-bottom: 1px solid $bcolor1;
                    >.icon-wrapper {
                        display: flex;
                        justify-content: flex-start;
                        align-items: center;
                        padding: 10px 0;
                        >span {
                            margin-left: 10px;
                        }
                        >.icon {
                            &:last-child {
                                margin-left: auto;
                                margin-right: 20px;
                                font-size: 16px;
                                display: none;
                                fill: $tcolor2;
                                &:hover {
                                    fill: $tcolor;
                                }
                            }
                        }
                    }
                    >p {
                        padding-bottom: 10px;
                        color: $tcolor4;
                    }
                    &:hover {
                        background: $hcolor2;
                        >.icon-wrapper {
                            >.icon {
                                &:last-child {
                                    display: inline;
                                }
                            }
                        }
                        >p {
                            border-top-color: #666;
                        }
                    }
                    &.active {
                        background: $acolor;
                        >.icon-wrapper {
                            >.icon {
                                &:last-child {
                                    display: inline;
                                }
                            }
                        }
                        &:hover {
                            >p {
                                border-top-color: #fff;
                            }
                        }
                    }
                }
            }
        }
    }
</style>