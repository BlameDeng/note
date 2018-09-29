import Icon from "../icon.vue";
import Scrollbar from "../scrollbar.vue";
import { mapState, mapActions, mapMutations } from "vuex";
export default {
    name: "Detail",
    components: { "n-icon": Icon, "n-scrollbar": Scrollbar },
    data() {
        return {
            batchType: false,
            batchNotes: []
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
            allBooks: state => state.notebooks.allBooks,
            notes: state => state.notes.notes,
            currentTab: state => state.notebooks.currentTab,
            currentBook: state => state.notebooks.currentBook,
            currentNote: state => state.notes.currentNote,
            trashNotes: state => state.notes.trashNotes,
        })
    },
    created() {
        this.eventBus.$on('nav-click-book', this.callScrollbarStart);
        this.eventBus.$on('note-added', this.callScrollbarEnd);
        console.log(this.currentNote)
    },
    methods: {
        ...mapActions([
            'deleteBook',
            'deleteNote',
            'getNotes',
            'revertNote',
            'deleteNoteConfirm',
            'revertNote'
        ]),
        ...mapMutations(['setCurrentBook', 'setCurrentNote']),
        onClick() { alert(1) },
        callScrollbarStart() {
            this.$refs.noteScrollbar.scrollToStart();
        },
        callScrollbarEnd() {
            this.$refs.noteScrollbar.scrollToEnd();
        },
        onClickBook(book) {
            this.setCurrentBook(book);
            this.getNotes({ notebookId: this.currentBook.id }).then(res => {

            }).catch(err => {});
        },
        onDeleteBook(book) {
            this.deleteBook(book.id).then(res => {}).catch(err => {});
        },
        onClickNote(note) {
            this.setCurrentNote(note);
        },
        onDeleteNote(note) {
            this.deleteNote(note.id).then(res => {

            }).catch(err => {});
        },
        onRevert(note) {
            this.revertNote(note);
        },
        onDeleteConfirm(note) {
            this.$confirm("此操作将永久删除该笔记, 是否继续?", "提示", {
                    confirmButtonText: "确定删除",
                    cancelButtonText: "取消删除",
                    type: "warning"
                })
                .then(() => {
                    this.deleteNoteConfirm(note).then(res => {
                        this.$message({
                            type: "success",
                            message: "删除成功!",
                            duration: 1500
                        });
                    });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除",
                        duration: 1500
                    });
                });
        },
        onClickTrashNote(note) {
            if (!this.batchType) {
                return
            }
            let index = this.batchNotes.indexOf(note);
            if (index > -1) {
                this.batchNotes.splice(index, 1);
            } else {
                this.batchNotes.push(note);
            }
        },
        onBatchDelete() {
            if (this.batchNotes.length === 0) {
                this.$message({
                    type: "warning",
                    message: "请至少选择一个笔记哦~~",
                    duration: 1500
                });
                return
            }
            this.$confirm("此操作将永久删除选中的笔记, 是否继续?", "提示", {
                    confirmButtonText: "确定删除",
                    cancelButtonText: "取消删除",
                    type: "warning"
                })
                .then(
                    () => {
                        const promises = this.batchNotes.map(note => {
                            return this.deleteNoteConfirm(note);
                        });
                        Promise.all(promises).then(res => {
                            this.$message({
                                type: "info",
                                message: "批量删除成功!",
                                duration: 1500
                            });
                        }).catch(err => {});
                    }).catch(err => {});
        },
        onBatchRevert() {
            if (this.batchNotes.length === 0) {
                this.$message({
                    type: "warning",
                    message: "请至少选择一个笔记哦~~",
                    duration: 1500
                });
                return
            }
            const promises = this.batchNotes.map(note => {
                return this.revertNote(note);
            });
            Promise.all(promises).then(res => {
                this.$message({
                    type: "success",
                    message: "批量恢复成功!",
                    duration: 1500
                });
            }).catch(err => {});
        },
        selectAll() {
            this.batchNotes = this.trashNotes;
        },
        cancleAll() {
            this.batchNotes = [];
        }
    },
    watch: {
        batchType(val) {
            val ? 0 : this.batchNotes = [];
        },
        currentTab(val) {
            val !== 'trash' ? this.batchType = false : 0;
            val !== 'books' ? this.setCurrentNote(null) : 0;
        }
    },
    mounted() {
        this.$el.oncontextmenu = () => { return false; };
    },
    beforeDestroy() {
        // document.removeEventListener("click", this.listenAddPop);
        // document.removeEventListener("click", this.listenBookPop);
    }
};