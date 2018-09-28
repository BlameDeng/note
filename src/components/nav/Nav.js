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
            bookName: '新文件夹' //
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
            notes: state => state.notes.notes,
            trashNotes: state => state.notes.trashNotes,
            currentNote: state => state.notes.currentNote
        })
    },
    created() {
        this.getBooks().then(res => {
            this.eventBus.$emit('scrollbar-resize');
        })
    },
    methods: {
        ...mapActions(['createNote', 'getBooks']),
        ...mapMutations(['setCurrentTab', 'setCurrentBook']),

        onAddNote() {
            this.retract = false;
            this.createNote()
        },
        onAddBook() {
            this.addBook = true;
            this.eventBus.$emit('scrollbar-resize');
            this.eventBus.$emit('scrollbar-toend');
            this.retract = false;
        },
        onClickTab(e, tab) {
            this.setCurrentTab(tab);
            if (tab === 'books') {
                if (this.allBooks) { this.retract = false; return }
                this.getBooks().then(res => {
                    this.retract = false;
                }).catch(err => {});
            } else {
                this.setCurrentBook(null);
            }
        },
        onClickBook(e, book) {
            this.setCurrentBook(book);
            if (this.currentTab !== 'books') {
                this.setCurrentTab('books');
            }
            let { clientX: x, clientY: y, which } = e;
            if (which === 3) {
                let pop = this.$refs.bookPop;
                pop.style.top = y + 3 + "px";
                pop.style.left = x + 3 + "px";
                this.bookPop = true;
            }
        },
        listenPop() {
            this.addPop ? this.addPop = false : 0;
            this.bookPop ? this.bookPop = false : 0;
        },
        // listenAddPop() {
        //   this.showAddPop = false;
        // },
        // listenBookPop() {
        //   this.showBookPop = false;
        // },

        // onAddNotebook() {
        //   if (this.creating) {
        //     return;
        //   }
        //   this.creating = true;
        //   this.showNewBook = false;
        //   this.createNotebooks({ title: this.newName }).then(res => {
        //     this.newName = "新建文件夹";
        //     this.selectedBook = res.data;
        //     this.selectedTab = "";
        //     this.creating = false;
        //   });
        // },
        // onClickDeleteBook(book) {
        //   this.showBookPop = false;
        //   this.deleteNotebooks({ notebookId: book.id }).then(res => {
        //     this.selectedBook = null;
        //     this.$message({
        //       type: "info",
        //       message: "该文件夹已删除",
        //       duration: 1500
        //     });
        //     this.filterNotebooks({ id: book.id });
        //   });
        // },
        // onClickRenameBook(book) {
        //   this.renameBook = book;
        //   this.selectedBook = null;
        //   this.newBookTitle = book.title;
        // },
        // onRenameBook(book) {
        //   if (this.changing) {
        //     return;
        //   }
        //   this.changing = true;
        //   book.title = this.newBookTitle;
        //   this.renameNotebooks({
        //     title: book.title,
        //     notebookId: book.id
        //   }).then(res => {
        //     this.updateNotebooks({ notebook: book });
        //     this.renameBook = null;
        //     this.changing = false;
        //   });
        // },
        // onClickNote(note) {
        //   this.setCurrentNote(note);
        //   if (this.batchType) {
        //     let index = this.batchArr.indexOf(note);
        //     if (index > -1) {
        //       this.batchArr.splice(index, 1);
        //       return;
        //     }
        //     this.batchArr.push(note);
        //   }
        // },
        // selectAll() {
        //   this.batchArr = this.trashNotes;
        //   this.showAllSelect = false;
        // },
        // selectNone() {
        //   this.batchArr = [];
        //   this.showAllSelect = true;
        // }
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
        },
        // selectedBook(val) {
        //   if (val) {
        //     this.getNotes({ notebookId: val.id }).then(res => {
        //       this.eventBus.$emit("select-book");
        //     });
        //   }
        // },
        // selectedTab(val) {
        //   if (val !== "trash") {
        //     this.batchType = false;
        //     this.batchArr = [];
        //     this.showAllSelect = true;
        //   }
        //   if (val === "books") {
        //     this.eventBus.$emit("select-tab-books");
        //   }
        // },
    },
    mounted() {
        this.$el.oncontextmenu = () => { return false; };
    },
    beforeDestroy() {
        document.removeEventListener("click", this.listenPop);
        document.removeEventListener("click", this.listenPop);
    }
};