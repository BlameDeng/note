<template>
    <div class="sider">
        <div class="nav">
            <div class="add">
                <n-icon name="add" class="icon" @click="onClickAdd" style="cursor:pointer;"></n-icon>
                <span @click="onClickAdd">新建文档</span>
                <div class="popover" v-show="showAddPop">
                    <p ref="note" @click="onAddNote">新建笔记</p>
                    <p ref="notebook" @click="onAddNotebook">新建文件夹</p>
                </div>
            </div>
            <div class="recent" :class="{active:selectedTab==='recent'}" @click="onClickTab($event,'recent')">
                <n-icon name="new" class="icon"></n-icon>
                <span>最新文档</span>
            </div>
            <div class="books" :class="{active:selectedTab==='books'}" @click="onClickTab($event,'books')">
                <p @click="toggleCollect" :class="{active:!retractNotebooks}" ref="wenjianjiaP"></p>
                <n-icon name="wenjianjia" class="icon"></n-icon>
                <span>我的文件夹</span>
            </div>
            <div class="book" v-for="(book,index) in allNotebooks" :key="book.id" v-if="allNotebooks&&allNotebooks.length&&!retractNotebooks" @click.right="onRightNotebook($event,index,book)" :class="{active:index===clickNotebookIndex}" @click="onLeftNotebook(index)">
                <template v-if="book.id!==renameNotebookId">
                    <n-icon name="wenjian" class="icon"></n-icon>
                    <span>{{book.title}}</span>
                    <p @click="onRightNotebook($event,index,book)" ref="wenjiaP"></p>
                    <div class="popover" ref="bookPop" :class="{active:book.id===selectedNotebookId}">
                        <p ref="rename" @click="onRenameNotebook(book)">重命名</p>
                        <p ref="cancle" @click="onDeleteNotebooks(book)">删除</p>
                    </div>
                </template>
                <template v-else>
                    <n-icon name="wenjian" class="icon"></n-icon>
                    <input type="text" v-model="notebooksNewName" autofocus="autofocus" @focus="onFocus" @blur="onSubmitRenameNotebook(book)">
                </template>
            </div>
            <div class="book" v-if="showNewNotebook">
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
                <div class="book" v-for="book in allNotebooks" :key="book.id" v-if="allNotebooks&&allNotebooks.length">
                    <div class="icon-wrapper">
                        <n-icon name="wenjian" class="icon"></n-icon>
                        <span>{{book.title}}</span>
                        <n-icon name="trash" class="icon" @click="onDeleteNotebooks(book)"></n-icon>
                    </div>
                    <p>{{book.createdAt}}</p>
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
                showAddPop: false,
                showNewNotebook: false,
                newNotebookName: '新文件夹',
                selectedTab: '',
                selectedNotebookId: '',
                clickNotebookIndex: -1,
                rightNotebookIndex: -1,
                notebooksNewName: '',
                renameNotebookId: '',
                retractNotebooks: true
            }
        },
        inject:['eventBus'],
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
            onAddNote() { this.eventBus.$emit('add-note'); },
            onClickAdd() { this.showAddPop = true; },
            onClickTab(e, tab) {
                this.selectedTab = tab;
                this.selectedNotebookId = '';
                this.clickNotebookIndex = -1;
                this.rightNotebookIndex = -1;
                if (tab === 'books' && e.target !== this.$refs.wenjianjiaP) {
                    this.retractNotebooks = false;
                }
            },
            toggleCollect() { this.retractNotebooks = !this.retractNotebooks; },
            listenAddPop(e) {
                let note = this.$refs.note;
                let notebook = this.$refs.notebook;
                if (e.target === note || e.target === notebook) { return } else { this.showAddPop = false; }
            },
            listenBookPop(e) {
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
                    this.retractNotebooks=false;
                })
            },
            onDeleteNotebooks(notebook) {
                this.deleteNotebooks({ notebookId: notebook.id }).then(res => {
                    this.filterNotebooks({ id: notebook.id });
                })
            },
            onRightNotebook(e, index, notebook) {
                let { clientX: x, clientY: y } = e;
                this.notebookPop(x, y, index);
                this.selectedNotebookId = notebook.id;
                this.clickNotebookIndex = index;
                this.rightNotebookIndex = index;
            },
            notebookPop(x, y, index) {
                let pop = this.$refs.bookPop[index];
                pop.style.top = y + 'px';
                pop.style.left = x + 'px';
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
            showAddPop(val) {
                if (val) {
                    document.addEventListener('click', this.listenAddPop);
                } else {
                    document.removeEventListener('click', this.listenAddPop);
                }
            },
            selectedNotebookId(val) {
                if (val) {
                    document.addEventListener('click', this.listenBookPop);
                } else {
                    document.removeEventListener('click', this.listenBookPop);
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
            document.removeEventListener('click', this.listenAddPop);
            document.removeEventListener('click', this.listenBookPop);
        }
    }
</script>
<style lang="scss" scoped src='./Sider.scss'></style>