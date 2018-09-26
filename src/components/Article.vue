<template>
    <div class="article">
        <div class="title-bar">
            <template v-if="editing&&note">
                <input type="text" v-model.trim="note.title" ref="input">
                <el-button plain class="el-btn" @click="onSaveNote">保存</el-button>
            </template>
        </div>
        <div class="tool-bar"></div>
        <div class="context">
            <template v-if="editing&&note">
                <textarea v-model="note.content" ref="textarea"></textarea>
            </template>
        </div>
    </div>
</template>
<script>
    import marked from 'marked'
    import { mapActions, mapGetters, mapState, mapMutations } from 'vuex'
    export default {
        name: 'Article',
        data() {
            return { editing: true, saving: false }
        },
        computed: {
            ...mapState({
                note: state => state.notes.currentNote
            })
        },
        inject: ['eventBus'],
        created() {
            this.eventBus.$on('click-add-note', (book) => {
                this.createNote({
                    notebookId: book.id,
                    title: `无标题笔记 ${this.formatDate(new Date())}`,
                    content: ''
                }).then(res => {
                    this.$refs.input.select();
                }).catch(err => {});
            });
        },
        methods: {
            ...mapActions(['createNote', 'patchNote']),
            ...mapMutations(['setCurrentNote']),
            onSaveNote() {
                if (this.saving) { return }
                this.saving = true;
                this.patchNote({
                    noteId: this.note.id,
                    title: this.note.title,
                    content: this.note.content
                }).then(res => {
                    this.saving = false;
                    this.$message({
                        type: 'success',
                        message: '保存成功!',
                        duration: 1500
                    });
                });

            }
        }
    }
</script>
<style lang="scss" scoped>
    @import '@/assets/base.scss';
    .article {
        width: 100%;
        height: 100%;
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