import Icon from "../icon.vue";
import Scrollbar from "../scrollbar.vue";
import { mapState, mapActions, mapMutations } from "vuex";
export default {
    name: "Sider",
    components: { "n-icon": Icon, "n-scrollbar": Scrollbar },
    data() {
        return {
            showAddPop: false, //新建文档弹框
            retract: true //文件夹收起
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
            allBooks: state => state.notebooks.allNotebooks,
            currentBook: state => state.notebooks.currentBook,
            notes: state => state.notes.notes,
            trashNotes: state => state.notes.trashNotes,
            currentNote: state => state.notes.currentNote
        })
    },
    created() {},
    methods: {
        ...mapActions([

        ]),
        ...mapMutations([]),

        onAddNote() {
            this.retract = false;
            this.eventBus.$emit("add-note");
        },
        onAddBook() {
            this.showNewBook = true;
            this.retractBooks = false;
        },
        // onClickTab(e, tab) {
        //   this.selectedTab = tab;
        //   this.selectedBook = null;
        //   if (tab !== "books") {
        //     this.setCurrentNote(null);
        //   }
        //   if (tab === "books" && e.target !== this.$refs.booksTri) {
        //     this.retractBooks = false;
        //   }
        //   if (tab === "trash") {
        //     this.getTrashNotes().then(res => {
        //       this.eventBus.$emit("get-trashnotes-done");
        //     });
        //   }
        // },
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
        // onClickBook(e, index, book) {
        //   this.showBookPop = false;
        //   this.selectedTab = "";
        //   let { clientX: x, clientY: y, which } = e;
        //   this.selectedBook = book;
        //   if (which === 1 && e.target.tagName !== "P") {
        //     return;
        //   } else {
        //     this.notebookPop(x, y, index);
        //     this.showBookPop = true;
        //   }
        // },
        // notebookPop(x, y, index) {
        //   let pop = this.$refs[`bookPop${index}`][0];
        //   pop.style.top = y + 3 + "px";
        //   pop.style.left = x + 3 + "px";
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
        // showAddPop(val) {
        //   if (val) {
        //     document.addEventListener("click", this.listenAddPop);
        //   } else {
        //     document.removeEventListener("click", this.listenAddPop);
        //   }
        // },
        // showBookPop(val) {
        //   if (val) {
        //     document.addEventListener("click", this.listenBookPop);
        //   } else {
        //     document.removeEventListener("click", this.listenBookPop);
        //   }
        // },
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
        // document.removeEventListener("click", this.listenAddPop);
        // document.removeEventListener("click", this.listenBookPop);
    }
};