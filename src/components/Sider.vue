<template>
    <div class="sider">
        <div class="nav">
            <div class="add">
                <n-icon name="add" class="icon" @click="onClickAdd" style="cursor:pointer;"></n-icon>
                <span @click="onClickAdd">新建文档</span>
                <div class="popover" v-show="showPop">
                    <p ref="note">新建笔记</p>
                    <p ref="notebook" @click="onAddNotebook">新建文件夹</p>
                </div>
            </div>
            <div class="recent">
                <n-icon name="new" class="icon"></n-icon><span>最新文档</span>
            </div>
            <div class="my-documents">
                <n-icon name="wenjianjia" class="icon"></n-icon><span>我的文件夹</span>
            </div>
            <div class="document" v-for="notebook in allNotebooks" :key="notebook.id" v-if="allNotebooks&&allNotebooks.length">
                <n-icon name="wenjian" class="icon"></n-icon>
                <span>{{notebook.title}}</span>
                <p></p>
            </div>
            <template>
                <div class="document" v-if="showNewNotebook">
                    <n-icon name="wenjian" class="icon"></n-icon>
                    <input type="text" v-model="newNotebookName" autofocus="autofocus" @focus="onFocus" @blur="onSubmitAddNotebook">
                </div>
            </template>
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
                        <n-icon name="trash" class="icon" @click="onDeleteNotebooks(notebook)"></n-icon>
                    </div>
                    <p>{{notebook.createdAt}}</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import Icon from './icon.vue'
    import { mapState, mapActions, mapMutations } from 'vuex'
    export default {
        name: 'Sider',
        components: { 'n-icon': Icon },
        data() {
            return {
                showPop: false,
                showNewNotebook: false,
                newNotebookName: '新文件夹'
            }
        },
        computed: {
            ...mapState({
                isLogin: state => state.auth.isLogin,
                allNotebooks: state => state.notebooks.allNotebooks
            })
        },
        methods: {
            ...mapActions(['logout', 'getNotebooks', 'createNotebooks',
                'deleteNotebooks'
            ]),
            ...mapMutations(['addNotebooks', 'filterNotebooks']),
            onClick() {
                this.logout();
            },
            onClickAdd() {
                this.showPop = true;
            },
            listenToDocument(e) {
                let note = this.$refs.note;
                let notebook = this.$refs.notebook;
                if (e.target === note || e.target === notebook) {
                    return
                } else {
                    this.showPop = false;
                }
            },
            onFocus(e) {
                e.target.select();
            },
            onAddNotebook() {
                this.showNewNotebook = true;
            },
            onSubmitAddNotebook() {
                this.createNotebooks({ title: this.newNotebookName }).then(res => {
                    this.showNewNotebook = false;
                    this.newNotebookName = '新文件夹';
                    let notebook = res.data;
                    this.addNotebooks({ notebook });
                })
            },
            onDeleteNotebooks(notebook) {
                this.deleteNotebooks({ notebookId: notebook.id }).then(res => {
                    this.filterNotebooks({ id: notebook.id });
                })
            }
        },
        watch: {
            showPop(val) {
                if (val) {
                    document.addEventListener('click', this.listenToDocument);
                } else {
                    document.removeEventListener('click', this.listenToDocument);
                }
            }
        },
        beforeDestroy() {
            document.removeEventListener('click', this.listenToDocument);
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
                position: relative;
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
                >.popover {
                    position: absolute;
                    top: 50px;
                    left: 40px;
                    background: #fff;
                    color: $tcolor3;
                    cursor: pointer;
                    border-radius: 4px;
                    box-shadow: 0 1px 8px rgba(0, 0, 0, 0.2);
                    >p {
                        padding: 10px 30px 10px 25px;
                        &:hover {
                            background: $hcolor2;
                        }
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
                input {
                    width: 150px;
                    margin-left: 10px;
                    padding: 4px 0 4px 5px;
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