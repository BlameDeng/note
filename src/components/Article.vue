<template>
    <div class="article">
        <div class="title-bar">
            <template v-if="editing">
                <input type="text" v-model="title">
                <el-button plain class="el-btn" @click="onCreateNote">保存</el-button>
            </template>
        </div>
        <div class="tool-bar"></div>
        <div class="context">
            <textarea v-model="content"></textarea>
        </div>
    </div>
</template>
<script>
    import marked from 'marked'
    import { mapActions } from 'vuex'
    export default {
        name: 'Article',
        data() {
            return {
                title: '无标题笔记',
                editing: false,
                content: '',
                book: null
            }
        },
        inject: ['eventBus'],
        created() {
            this.eventBus.$on('add-note', () => {
                this.editing = true;
            });
            this.eventBus.$on('selected-book-change', (book) => {
                this.book = book;
            })
        },
        methods: {
            ...mapActions(['createNote']),
            onCreateNote() {
                this.createNote({
                    notebookId: this.book.id,
                    title: this.title,
                    content: this.content
                }).then(res => {
                    console.log(res)
                }).catch(err => {})
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