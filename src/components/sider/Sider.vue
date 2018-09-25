<template>
    <div class="sider">
        <div class="nav">
            <div class="add">
                <n-icon name="add" class="icon" @click="showAddPop = true" style="cursor:pointer;"></n-icon>
                <span @click="showAddPop = true">新建文档</span>
                <div class="popover" v-show="showAddPop">
                    <p ref="note" @click="onAddNote()">新建笔记</p>
                    <p ref="notebook" @click="showNewBook = true">新建文件夹</p>
                </div>
            </div>
            <div class="recent" :class="{active:selectedTab==='recent'}" @click="onClickTab($event,'recent')">
                <n-icon name="new" class="icon"></n-icon>
                <span>最新文档</span>
            </div>
            <div class="books" :class="{active:selectedTab==='books'}" @click="onClickTab($event,'books')">
                <p @click="retractBooks = !retractBooks" :class="{active:!retractBooks}" ref="booksTri"></p>
                <n-icon name="wenjianjia" class="icon"></n-icon>
                <span>我的文件夹</span>
            </div>
            <div class="book" v-for="(book,index) in allNotebooks" :key="book.id" v-if="allNotebooks&&allNotebooks.length&&!retractBooks" :class="{active:book===selectedBook}" @click="onClickBook($event,index,book)" @click.right="onClickBook($event,index,book)">
                <template v-if="book!==renameBook">
                    <n-icon name="wenjian" class="icon"></n-icon>
                    <span>{{book.title}}</span>
                    <p @click.stop="onClickBook($event,index,book)" ref="bookTri"></p>
                    <div class="book-pop" :ref="`bookPop${index}`" v-show="showBookPop&&selectedBook.id===book.id">
                        <p ref="addNote" @click="onAddNote(book)">新建笔记</p>
                        <p ref="rename" @click="onClickRenameBook(book)">重命名</p>
                        <p ref="cancle" @click="onClickDeleteBook(book)">删除</p>
                    </div>
                </template>
                <template v-else>
                    <n-icon name="wenjian" class="icon"></n-icon>
                    <input type="text" v-model="newBookTitle" autofocus="autofocus" @focus="onFocus($event)" @blur="onRenameBook(book)" @keyup.enter="onRenameBook(book)">
                </template>
            </div>
            <div class="book" v-show="showNewBook">
                <n-icon name="wenjian" class="icon"></n-icon>
                <input type="text" v-model="newName" @blur="onAddNotebook" ref="newName" autofocus="autofocus" @focus="onFocus($event)">
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
                <template v-if="selectedTab==='books'">
                    <div class="book" v-for="book in allNotebooks" :key="book.id" v-if="allNotebooks&&allNotebooks.length">
                        <div class="icon-wrapper">
                            <n-icon name="wenjian" class="icon"></n-icon>
                            <span>{{book.title}}</span>
                            <n-icon name="trash" class="icon" @click="onClickDeleteBook(book)"></n-icon>
                        </div>
                        <p>{{book.createdAt}}</p>
                    </div>
                </template>
                <template v-if="selectedBook">
                    <div class="book" v-for="(note,index) in notes" :key="index" v-if="notes&&notes.length" @click="onClickNote(note)">
                        <div class="icon-wrapper">
                            <n-icon name="note" class="icon"></n-icon>
                            <span>{{note.title}}</span>
                            <n-icon name="trash" class="icon" @click="onDeleteNote(note)"></n-icon>
                        </div>
                        <p>{{note.createdAt}}</p>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>
<script>
    import Icon from "../icon.vue";
    import { mapState, mapActions, mapMutations } from "vuex";
    export default {
        name: "Sider",
        components: { "n-icon": Icon },
        data() {
            return {
                showAddPop: false,
                showBookPop: false,
                showNewBook: false,
                newName: "新建文件夹",
                selectedTab: "",
                selectedBook: null,
                renameBook: null,
                newBookTitle: "",
                retractBooks: true
            };
        },
        inject: ["eventBus"],
        computed: {
            ...mapState({
                isLogin: state => state.auth.isLogin,
                allNotebooks: state => state.notebooks.allNotebooks,
                notes: state => state.notes.notes
            })
        },
        methods: {
            ...mapActions([
                "logout",
                "getNotebooks",
                "createNotebooks",
                "deleteNotebooks",
                "renameNotebooks",
                "getNotes",
                "deleteNote"
            ]),
            ...mapMutations(["addNotebooks", "filterNotebooks", "updateNotebooks"]),
            onAddNote(book) {
                if (book) {
                    this.eventBus.$emit("add-note", book);
                } else {
                    if (!this.selectedBook && this.allNotebooks && this.allNotebooks.length) {
                        this.selectedBook = this.allNotebooks[0];
                        this.selectedTab = '';
                        this.retractBooks = false;
                    }
                    this.eventBus.$emit("add-note", this.selectedBook);
                }
            },
            onClickTab(e, tab) {
                this.selectedTab = tab;
                this.selectedBook = null;
                if (tab === "books" && e.target !== this.$refs.booksTri) {
                    this.retractBooks = false;
                }
            },
            listenAddPop(e) {
                let note = this.$refs.note;
                let notebook = this.$refs.notebook;
                if (e.target === note || e.target === notebook) {
                    return;
                } else {
                    this.showAddPop = false;
                }
            },
            listenBookPop() {
                this.showBookPop = false;
            },
            onFocus(e) {
                e.target.select();
            },
            onAddNotebook() {
                this.createNotebooks({ title: this.newName }).then(res => {
                    this.showNewBook = false;
                    this.selectedTab = 'books';
                    this.newName = "新建文件夹";
                    this.addNotebooks({ notebook: res.data });
                    this.retractBooks = false;
                });
            },
            onClickDeleteBook(book) {
                this.showBookPop = false;
                this.deleteNotebooks({ notebookId: book.id }).then(res => {
                    this.filterNotebooks({ id: book.id });
                });
            },
            onClickBook(e, index, book) {
                this.showBookPop = false;
                this.selectedTab = "";
                let { clientX: x, clientY: y, which } = e;
                this.selectedBook = book;
                if (which === 1 && e.target.tagName !== "P") {
                    return;
                } else {
                    this.notebookPop(x, y, index);
                    this.showBookPop = true;
                }
            },
            notebookPop(x, y, index) {
                let pop = this.$refs[`bookPop${index}`][0];
                pop.style.top = y + 3 + "px";
                pop.style.left = x + 3 + "px";
            },
            onClickRenameBook(book) {
                this.renameBook = book;
                this.selectedBook = null;
                this.newBookTitle = book.title;
            },
            onRenameBook(book) {
                book.title = this.newBookTitle;
                this.renameNotebooks({
                    title: book.title,
                    notebookId: book.id
                }).then(res => {
                    this.updateNotebooks({ notebook: book });
                    this.renameBook = null;
                });
            },
            onClickNote(note) {
                this.eventBus.$emit('click-note', note.id);
            },
            onDeleteNote(note) {
                this.deleteNote({ noteId: note.id }).then(res => {
                    console.log(res)
                }).catch(err => {});
            }
        },
        watch: {
            showAddPop(val) {
                if (val) {
                    document.addEventListener("click", this.listenAddPop);
                } else {
                    document.removeEventListener("click", this.listenAddPop);
                }
            },
            showBookPop(val) {
                if (val) {
                    document.addEventListener("click", this.listenBookPop);
                } else {
                    document.removeEventListener("click", this.listenBookPop);
                }
            },
            selectedBook(val) {
                if (val) {
                    this.getNotes({ notebookId: val.id }).then(res => {

                    })
                }
            }
        },
        mounted() {
            this.$el.oncontextmenu = () => {
                return false;
            };
        },
        beforeDestroy() {
            document.removeEventListener("click", this.listenAddPop);
            document.removeEventListener("click", this.listenBookPop);
        }
    };
</script>
<style lang="scss" scoped src='./Sider.scss'></style>