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
            <div class="recent" :class="{active:selectedTab==='recent'}" @click="onClickTab('recent')">
                <n-icon name="new" class="icon"></n-icon>
                <span>最新文档</span>
            </div>
            <div class="my-documents" :class="{active:selectedTab==='myDocuments'}" @click="onClickTab('myDocuments')">
                <n-icon name="wenjianjia" class="icon"></n-icon>
                <span>我的文件夹</span>
            </div>
            <div class="document" v-for="(notebook,index) in allNotebooks" :key="notebook.id" v-if="allNotebooks&&allNotebooks.length" @click.right.self="onRightNotebook($event,index,notebook)" :class="{active:index===clickNotebookIndex}" @click="onLeftNotebook(index)">
                <n-icon name="wenjian" class="icon"></n-icon>
                <span>{{notebook.title}}</span>
                <p @click="onClcikP(index,notebook)" @click.right="onClcikP(index,notebook)"></p>
                <div class="popover" ref="documentPopover" :class="{active:notebook.id===selectedNotebookId}">
                    <p ref="rename">重命名</p>
                    <p ref="cancle">删除</p>
                </div>
            </div>
            <template>
                <div class="document" v-if="showNewNotebook">
                    <n-icon name="wenjian" class="icon"></n-icon>
                    <input type="text" v-model="newNotebookName" autofocus="autofocus" @focus="onFocus" @blur="onSubmitAddNotebook">
                </div>
            </template>
            <div class="trash" :class="{active:selectedTab==='trash'}" @click="onClickTab('trash')">
                <n-icon name="trash" class="icon"></n-icon>
                <span>回收站</span>
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
    import Icon from '../icon.vue'
    import { mapState, mapActions, mapMutations } from 'vuex'
    export default {
        name: 'Sider',
        components: { 'n-icon': Icon },
        data() {
            return {
                showPop: false,
                showNewNotebook: false,
                newNotebookName: '新文件夹',
                selectedTab: '',
                selectedNotebookId: '',
                clickNotebookIndex: -1,
                rightNotebookIndex: -1
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
            onClick() { this.logout(); },
            onClickAdd() { this.showPop = true; },
            onClickTab(tab) {
                this.selectedTab = tab;
                if (tab !== 'myDocuments') {
                    this.selectedNotebookId = '';
                    this.clickNotebookIndex = -1;
                    this.rightNotebookIndex = -1;
                }
            },
            listenToDocument(e) {
                let note = this.$refs.note;
                let notebook = this.$refs.notebook;
                if (e.target === note || e.target === notebook) { return } else { this.showPop = false; }
            },
            listenToDocumentNotebook1(e) {
                let rename = this.$refs.rename[this.rightNotebookIndex];
                let cancle = this.$refs.cancle[this.rightNotebookIndex];
                if (e.target === rename || e.target === cancle) { return } else { this.selectedNotebookId = ''; }
            },
            onFocus(e) { e.target.select(); },
            onAddNotebook() { this.showNewNotebook = true; },
            onSubmitAddNotebook() {
                this.createNotebooks({ title: this.newNotebookName }).then(res => {
                    this.showNewNotebook = false;
                    this.newNotebookName = '新文件夹';
                    this.addNotebooks({ notebook: res.data });
                })
            },
            onDeleteNotebooks(notebook) {
                this.deleteNotebooks({ notebookId: notebook.id }).then(res => {
                    this.filterNotebooks({ id: notebook.id });
                })
            },
            onRightNotebook(e, index, notebook) {
                let { offsetX: x, offsetY: y } = e;
                this.notebookPop(x, y, index);
                this.selectedNotebookId = notebook.id;
                this.clickNotebookIndex = index;
                this.rightNotebookIndex = index;
            },
            onClcikP(index, notebook) {
                this.notebookPop(220, 40, index);
                this.selectedNotebookId = notebook.id;
                this.clickNotebookIndex = index;
                this.rightNotebookIndex = index;
            },
            notebookPop(x, y, index) {
                let popover = this.$refs.documentPopover[index];
                popover.style.top = y + 'px';
                popover.style.left = x + 'px';
            },
            onLeftNotebook(index) {
                this.clickNotebookIndex = index;
            }
        },
        watch: {
            showPop(val) {
                if (val) {
                    document.addEventListener('click', this.listenToDocument);
                } else {
                    document.removeEventListener('click', this.listenToDocument);
                }
            },
            selectedNotebookId(val) {
                if (val) {
                    document.addEventListener('click', this.listenToDocumentNotebook1);
                } else {
                    document.removeEventListener('click', this.listenToDocumentNotebook1);
                }
            },
            clickNotebookIndex(val) {
                if (val > -1) {
                    this.selectedTab = '';
                }
            }
        },
        mounted() {
            this.$el.oncontextmenu = () => { return false; };
        },
        beforeDestroy() {
            document.removeEventListener('click', this.listenToDocument);
            document.removeEventListener('click', this.listenToDocumentNotebook1);
        }
    }
</script>
<style lang="scss" scoped src='./Sider.scss'></style>