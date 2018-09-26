import Icon from "../icon.vue"
import { mapState, mapActions, mapMutations } from "vuex"
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
            retractBooks: true,
            batchType: false,
            batchArr: [],
            showAllSelect: true,
            creating: false,
            changing: false,
            move: false,
            diff:''
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
            isLogin: state => state.auth.isLogin,
            allNotebooks: state => state.notebooks.allNotebooks,
            notes: state => state.notes.notes,
            trashNotes: state => state.notes.trashNotes,
            currentNote: state => state.notes.currentNote
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
            "deleteNote",
            "getTrashNotes",
            "revertNote",
            "deleteNoteConfirm"
        ]),
        ...mapMutations([
            "filterNotebooks",
            "updateNotebooks",
            "setCurrentNote"
        ]),
        onAddNote() {
            if (!this.selectedBook && this.allNotebooks && this.allNotebooks.length) {
                this.selectedBook = this.allNotebooks[0];
                this.selectedTab = '';
                this.retractBooks = false;
            }
            this.eventBus.$emit("click-add-note", this.selectedBook);
        },
        onClickTab(e, tab) {
            this.selectedTab = tab;
            this.selectedBook = null;
            if (tab !== 'books') {
                this.setCurrentNote(null);
            }
            if (tab === "books" && e.target !== this.$refs.booksTri) {
                this.retractBooks = false;
            };
            if (tab === 'trash') {
                this.getTrashNotes().then(res => {
                    let scrollWrapper = this.$refs.scrollWrapper;
                    let scrollbar = this.$refs.scrollbar;
                    let detail = this.$refs.detail;
                    let slider = this.$refs.slider;
                    let { height: detailHeight } = detail.getBoundingClientRect();
                    scrollbar.style.height = `${detailHeight-133}px`;
                    let style = this.$refs.scrollWrapper.getBoundingClientRect();
                    let height = document.documentElement.clientHeight;
                    let { bottom } = style;
                    let hidden = bottom - height;
                    let diff = hidden / 150;
                    this.diff=diff;
                    console.log(hidden)
                });
            }
        },
        scrollBarController(){

        },
        mousedown(e) {
            this.move = true;
            let scrollWrapper = this.$refs.scrollWrapper;
            // scroll.addEventListener('mousemove',(e)=>{
            //     console.log(e);
            // })
        },
        mouseup(e) { this.move = false; },
        mousewheel(e) {
            let { deltaY: y } = e;
            let slider = this.$refs.slider;
            let n = (y / 100) * 25;


            let scrollWrapper = this.$refs.scrollWrapper;
            let style = this.$refs.scrollWrapper.getBoundingClientRect();
            let height = document.documentElement.clientHeight;        
            let { bottom } = style;
            let hidden = bottom - height;
            // let diff = hidden / 150;

            if (slider.style.transform) {
                let arr = slider.style.transform.match(/[\d]{1,3}/);
                let m = parseInt(arr[0]);
                if (m + n > 150 || m + n < 0) {
                    return
                }
                slider.style.transform = `translateY(${m+n}%)`;
                scrollWrapper.style.transform = `translateY(-${this.diff*(m+n)}px)`
                return
            }
            if (n < 0) {
                return
            }
            slider.style.transform = `translateY(${n}%)`;
            scrollWrapper.style.transform = `translateY(-${this.diff*(n)}px)`
        },
        mousemove(e) {
            if (!this.move) {
                return
            }
            console.log(e)
        },
        listenAddPop() { this.showAddPop = false; },
        listenBookPop() { this.showBookPop = false; },
        onClickAddBook() {
            this.showNewBook = true;
            this.retractBooks = false;
        },
        onAddNotebook() {
            if (this.creating) { return }
            this.creating = true;
            this.showNewBook = false;
            this.createNotebooks({ title: this.newName }).then(res => {
                this.newName = "新建文件夹";
                this.selectedBook = res.data;
                this.selectedTab = '';
                this.creating = false;
            });
        },
        onClickDeleteBook(book) {
            this.showBookPop = false;
            this.deleteNotebooks({ notebookId: book.id }).then(res => {
                this.selectedBook = null;
                this.$message({
                    type: 'info',
                    message: '该文件夹已删除',
                    duration: 1500
                });
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
            if (this.changing) { return }
            this.changing = true;
            book.title = this.newBookTitle;
            this.renameNotebooks({
                title: book.title,
                notebookId: book.id
            }).then(res => {
                this.updateNotebooks({ notebook: book });
                this.renameBook = null;
                this.changing = false;
            });
        },
        onClickNote(note) {
            this.setCurrentNote(note);
            if (this.batchType) {
                let index = this.batchArr.indexOf(note);
                if (index > -1) {
                    this.batchArr.splice(index, 1);
                    return
                }
                this.batchArr.push(note);
            }
        },
        selectAll() {
            this.batchArr = this.trashNotes;
            this.showAllSelect = false;
        },
        selectNone() {
            this.batchArr = [];
            this.showAllSelect = true;
        },
        onBatchDelete() {
            if (this.batchArr.length === 0) {
                this.$message({
                    type: 'warning',
                    message: '请至少选择一个笔记哦~~',
                    duration: 1500
                });
            } else {
                this.$confirm('此操作将永久删除选中的笔记, 是否继续?', '提示', {
                    confirmButtonText: '确定删除',
                    cancelButtonText: '取消删除',
                    type: 'warning'
                }).then(() => {
                    this.batchArr.forEach(note => {
                        this.deleteNoteConfirm(note);
                    });
                    this.batchArr = [];
                    this.$message({
                        type: 'success',
                        message: '批量删除成功!',
                        duration: 1500
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除',
                        duration: 1500
                    });
                });
            }
        },
        onBatchRevert() {
            if (this.batchArr.length === 0) {
                this.$message({
                    type: 'warning',
                    message: '请至少选择一个笔记哦~~',
                    duration: 1500
                });
            } else {
                this.batchArr.forEach(note => {
                    this.revertNote(note);
                });
                this.$message({
                    type: 'success',
                    message: '已批量恢复至原文件夹!',
                    duration: 1500
                });
                this.batchArr = [];
            }
        },
        onDeleteNote(note) {
            this.deleteNote({ noteId: note.id }).then(res => {
                this.$message({
                    type: 'info',
                    message: '该笔记已放入回收站',
                    duration: 1500
                });
            }).catch(err => {});
        },
        onRevertNote(note) {
            this.revertNote(note);
        },
        onDeleteConfirm(note) {
            this.$confirm('此操作将永久删除该笔记, 是否继续?', '提示', {
                confirmButtonText: '确定删除',
                cancelButtonText: '取消删除',
                type: 'warning'
            }).then(() => {
                this.deleteNoteConfirm(note).then(res => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!',
                        duration: 1500
                    });
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除',
                    duration: 1500
                });
            });
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
            if (val) { this.getNotes({ notebookId: val.id }); }
        },
        selectedTab(val) {
            if (val !== 'trash') {
                this.batchType = false;
                this.batchArr = [];
                this.showAllSelect = true;
            }
        }
    },
    mounted() {
        this.$el.oncontextmenu = () => { return false; };
    },
    beforeDestroy() {
        document.removeEventListener("click", this.listenAddPop);
        document.removeEventListener("click", this.listenBookPop);
    }
};