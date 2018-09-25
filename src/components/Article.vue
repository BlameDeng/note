<template>
    <div class="article">
        <div class="title-bar">
            <template v-if="editing&&note">
                <input type="text" v-model.trim="note.title">
                <el-button plain class="el-btn" @click="onSaveNote">保存</el-button>
            </template>
        </div>
        <div class="tool-bar"></div>
        <div class="context">
            <template v-if="editing&&note">
                <textarea v-model="note.content"></textarea>
            </template>
        </div>
    </div>
</template>
<script>
    import marked from 'marked'
    import { mapActions, mapGetters } from 'vuex'
    export default {
        name: 'Article',
        data() {
            return {
                editing: false,
                book: null,
                note: null,
            }
        },
        computed: {},
        inject: ['eventBus'],
        created() {
            this.eventBus.$on('add-note', (book) => {
                this.editing = true;
                this.book = book;
                this.createNote({
                    notebookId: this.book.id,
                    title: '无标题笔记',
                    content: ''
                }).then(res => {
                    console.log(res)
                }).catch(err => {});
            });
            this.eventBus.$on('click-note', (noteId) => {
                this.note = this.$store.getters.getNoteById(noteId);
                this.editing = true;
            })
        },
        methods: {
            ...mapActions(['createNote', 'patchNote']),
            onSaveNote() {
                this.patchNote({
                    noteId: this.note.id,
                    title: this.note.title,
                    content: this.note.content
                }).then(res => {
                    console.log(res)
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
    @import '@/assets/base.scss';
    .article {
        width: 100%;
        height: 800px;
        >.title-bar {
            height: 60px;
            flex-grow: 1;
            border-bottom: 1px solid $bcolor1;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            >input {
                border: none;
                font-size: 18px;
                padding-left: 20px;
                &:focus {
                    outline: none;
                }
            }
            >.el-btn {
                padding: 8px 20px;
                margin-left: auto;
                margin-right: 100px;
            }
        }
        >.tool-bar {
            height: 30px;
            border-bottom: 1px solid $bcolor2;
        }
        >.context {
            >textarea {
                height: 710px;
                width: 100%;
                border: none;
                font-size: 18px;
                padding: .5em;
                &:focus {
                    outline: none;
                }
            }
        }
    }
</style>