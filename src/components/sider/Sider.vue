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
            <div class="recent" :class="{active:selectedTab==='recent'}" @click="onClickTab($event,'recent')">
                <n-icon name="new" class="icon"></n-icon>
                <span>最新文档</span>
            </div>
            <div class="my-documents" :class="{active:selectedTab==='myDocuments'}" @click="onClickTab($event,'myDocuments')">
                <p @click="toggleCollect" :class="{active:!collectNotebooks}" ref="wenjianjiaP"></p>
                <n-icon name="wenjianjia" class="icon"></n-icon>
                <span>我的文件夹</span>
            </div>
            <div class="document" v-for="(notebook,index) in allNotebooks" :key="notebook.id" v-if="allNotebooks&&allNotebooks.length&&!collectNotebooks" @click.right="onRightNotebook($event,index,notebook)" :class="{active:index===clickNotebookIndex}" @click="onLeftNotebook(index)">
                <template v-if="notebook.id!==renameNotebookId">
                    <n-icon name="wenjian" class="icon"></n-icon>
                    <span>{{notebook.title}}</span>
                    <p @click="onRightNotebook($event,index,notebook)" ref="wenjiaP"></p>
                    <div class="popover" ref="documentPopover" :class="{active:notebook.id===selectedNotebookId}">
                        <p ref="rename" @click="onRenameNotebook(notebook)">重命名</p>
                        <p ref="cancle" @click="onDeleteNotebooks(notebook)">删除</p>
                    </div>
                </template>
                <template v-else>
                    <n-icon name="wenjian" class="icon"></n-icon>
                    <input type="text" v-model="notebooksNewName" autofocus="autofocus" @focus="onFocus" @blur="onSubmitRenameNotebook(notebook)">
                </template>
            </div>
            <div class="document" v-if="showNewNotebook">
                <n-icon name="wenjian" class="icon"></n-icon>
                <input type="text" v-model="newNotebookName" autofocus="autofocus" @focus="onFocus" @blur="onSubmitAddNotebook">
            </div>
            <div class="trash" :class="{active:selectedTab==='trash'}" @click="onClickTab($event,'trash')">
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
                rightNotebookIndex: -1,
                notebooksNewName: '',
                renameNotebookId: '',
                collectNotebooks: true
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
                'deleteNotebooks', 'renameNotebooks'
            ]),
            ...mapMutations(['addNotebooks', 'filterNotebooks', 'updateNotebooks']),
            onClick() { this.logout(); },
            onClickAdd() { this.showPop = true; },
            onClickTab(e, tab) {
                this.selectedTab = tab;
                this.selectedNotebookId = '';
                this.clickNotebookIndex = -1;
                this.rightNotebookIndex = -1;
                if (tab === 'myDocuments' && e.target !== this.$refs.wenjianjiaP) {
                    this.collectNotebooks = false;
                }
            },
            toggleCollect() { this.collectNotebooks = !this.collectNotebooks; },
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
                if (e.target === this.$refs.wenjiaP[index]) {
                    x = 220;
                    y = 40;
                }
                this.notebookPop(x, y, index);
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
            },
            onRenameNotebook(notebook) {
                this.notebooksNewName = notebook.title;
                this.renameNotebookId = notebook.id;
            },
            onSubmitRenameNotebook(notebook) {
                this.renameNotebooks({ title: this.notebooksNewName, notebookId: this.renameNotebookId })
                    .then(res => {
                        notebook.title = this.notebooksNewName;
                        this.updateNotebooks({ notebook });
                        this.notebooksNewName = '';
                        this.renameNotebookId = '';
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