import Icon from "../icon.vue";
import Scrollbar from "../scrollbar.vue";
import { mapState, mapActions, mapMutations } from "vuex";
export default {
    name: "Nav",
    components: { "n-icon": Icon, "n-scrollbar": Scrollbar },
    data() {
        return {
            addPop: false, //新建文档弹框
            retract: true, //文件夹收起
            bookPop: false, //右键文件弹框
            addBook: false, //新建文件夹命名框
            bookName: '新文件夹', //新文件夹名字
            newName: '', //重命名文件夹名字
        };
    },
    inject: ["eventBus"],
    directives: {
        select: {
            inserted: function(el) {
                el.select();
            }
        }
    },
    computed: {
        ...mapState({
            currentTab: state => state.notebooks.currentTab,
            allBooks: state => state.notebooks.allBooks,
            currentBook: state => state.notebooks.currentBook,
            trashNotes: state => state.notes.trashNotes
        })
    },
    created() {
        this.getBooks().then(res => {
            if (!res.data.length) {
                this.createBook({ title: '我的资源' }).then(res => {}).catch(err => {});
            }
        })
    },
    methods: {
        ...mapActions([
            'createNote',
            'getBooks',
            'createBook',
            'deleteBook',
            'patchBook',
            'getTrashNotes',
            'getNotes'
        ]),
        ...mapMutations([
            'setCurrentTab',
            'setCurrentBook',
            'setNotes'
        ]),
        onAddNote() {
            if (!this.allBooks.length) {
                this.$message({
                    type: "warning",
                    message: "创建笔记前需先创建文件夹",
                    duration: 1500
                });
                return
            }
            this.retract = false;
            this.currentTab === 'books' ? 0 : this.setCurrentTab('books');
            if (!this.currentBook) {
                this.setCurrentBook(this.allBooks[0]);
                this.getNotes({ notebookId: this.currentBook.id }).then(res => {
                    this.$refs.bookScrollbar.scrollToStart();
                }).catch(err => {});
            }
            this.createNote({
                notebookId: this.currentBook.id,
                title: `无标题笔记${this.formatDate(new Date())}`,
                content: ''
            }).then(res => {
                this.eventBus.$emit('note-added');
            }).catch(err => {});
        },
        onAddBook() {
            this.addBook = true;
            this.setCurrentTab('books');
            this.retract = false;
            this.$refs.bookScrollbar.scrollToEnd();
            this.setNotes({ notes: null });
        },
        onClickTab(e, tab) {
            this.setCurrentTab(tab);
            if (tab === 'books') {
                if (!this.allBooks) {
                    this.getBooks().then(res => {
                        this.retract = false;
                    }).catch(err => {});
                }
                this.retract = false;
            } else if (tab === 'trash') {
                if (!this.trashNotes) {
                    this.getTrashNotes().then(res => {}).catch(err => {});
                }
            }
            this.setCurrentBook(null);
        },
        onClickBook(e, book) {
            this.setCurrentBook(book);
            if (this.currentTab !== 'books') {
                this.setCurrentTab('books');
            }
            let { clientX: x, clientY: y, which } = e;
            if (which === 3) {
                this.bookPop = true;
                let pop = this.$refs.bookPop;
                pop.style.top = y + 3 + "px";
                pop.style.left = x + 3 + "px";
            }
            this.getNotes({ notebookId: this.currentBook.id }).then(res => {
                this.eventBus.$emit('nav-click-book');
            }).catch(err => {});
        },
        listenPop() {
            this.addPop ? this.addPop = false : 0;
            this.bookPop ? this.bookPop = false : 0;
        },
        onCreateBook() {
            this.createBook({ title: this.bookName }).then(res => {
                this.bookName = '新文件夹';
                this.addBook = false;
            }).catch(err => {})
        },
        onDeleteBook() {
            this.deleteBook(this.currentBook.id).then(() => {
                this.$refs.bookScrollbar.scrollToStart();
                this.$message({
                    type: "info",
                    message: "文件夹删除成功!",
                    duration: 1500
                });
            }).catch(err => {});
        },
        onPatchBook(type) {
            if (type === 'rename') {
                this.newName = this.currentBook.title;
            } else if (type === 'submit') {
                this.patchBook({
                    title: this.newName,
                    bookId: this.currentBook.id
                }).then(res => {
                    this.newName = '';
                }).catch(err => {})
            }
        }
    },
    watch: {
        addPop(val) {
            if (val) {
                document.addEventListener("click", this.listenPop);
            } else {
                document.removeEventListener("click", this.listenPop);
            }
        },
        bookPop(val) {
            if (val) {
                document.addEventListener("click", this.listenPop);
            } else {
                document.removeEventListener("click", this.listenPop);
            }
        }
    },
    mounted() {
        this.$el.oncontextmenu = () => { return false; };
    },
    beforeDestroy() {
        document.removeEventListener("click", this.listenPop);
        document.removeEventListener("click", this.listenPop);
    }
};