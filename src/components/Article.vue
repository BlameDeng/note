<template>
    <div class="article">
        <div class="title-bar">
            <div class="inner-wrapper" v-show="note">
                <input type="text" v-model.trim="note.title" ref="input" v-if="note">
                <div class="btn-wrapper">
                    <el-button plain class="el-btn" @click="onSaveNote">保存</el-button>
                    <el-button plain class="el-btn" @click="onPreview" :class="{[`preview-btn`]:preview}">Markdown 预览</el-button>
                </div>
            </div>
        </div>
        <div class="tool-bar">
            <div class="inner-wrapper" v-show="note">
                <span>字体大小</span>
                <el-select v-model="fontSize" size="mini" style="width:65px;">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
        </div>
        <div class="context">
            <div class="inner-wrapper" v-show="note">
                <textarea v-model="note.content" ref="textarea" v-show="!preview" :style="{['font-size']:`${fontSize}px`}" v-if="note"></textarea>
                <div class="preview" v-show="preview" v-html="markdown"></div>
            </div>
        </div>
    </div>
</template>
<script>
    import marked from "marked";
    import { mapActions, mapGetters, mapState, mapMutations } from "vuex";
    export default {
        name: "Article",
        data() {
            return {
                saving: false,
                preview: false,
                fontSize: 14,
                options: [{
                    value: 12,
                    label: 12
                }, {
                    value: 14,
                    label: 14
                }, {
                    value: 16,
                    label: 16
                }, {
                    value: 18,
                    label: 18
                }, {
                    value: 20,
                    label: 20
                }],
            };
        },
        computed: {
            ...mapState({
                note: state => state.notes.currentNote
            }),
            markdown() {
                if (this.note) {
                    return marked(this.note.content);
                }
            }
        },
        inject: ["eventBus"],
        created() {
            this.eventBus.$on("click-add-note", book => {
                this.createNote({
                        notebookId: book.id,
                        title: `无标题笔记 ${this.formatDate(new Date())}`,
                        content: ""
                    })
                    .then(res => {
                        this.$refs.input.select();
                    })
                    .catch(err => {});
            });
        },
        methods: {
            ...mapActions(["createNote", "patchNote"]),
            onSaveNote() {
                if (this.saving) {
                    return;
                }
                this.saving = true;
                this.patchNote({
                    noteId: this.note.id,
                    title: this.note.title,
                    content: this.note.content
                }).then(res => {
                    this.saving = false;
                    this.$message({
                        type: "success",
                        message: "保存成功!",
                        duration: 1500
                    });
                });
            },
            onPreview() {
                this.preview = !this.preview;
            },
        },
        beforeDestroy() {
            this.eventBus.$off("click-add-note");
        }
    };
</script>
<style lang="scss" scoped>
    @import "@/assets/base.scss";
    .article {
        width: 100%;
        height: 100%;
        >.title-bar {
            height: 60px;
            flex-grow: 1;
            border-bottom: 1px solid $bcolor1;
            >.inner-wrapper {
                height: 100%;
                display: flex;
                justify-content: space-between;
                align-items: center;
                >input {
                    border: none;
                    font-size: 18px;
                    padding-left: 20px;
                    &:focus {
                        outline: none;
                    }
                }
                >.btn-wrapper {
                    margin-right: 80px;
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    >.el-btn {
                        padding: 8px 10px;
                        &.preview-btn {
                            background: $tcolor;
                            color: #fff;
                        }
                    }
                }
            }
        }
        >.tool-bar {
            padding: 2px 0 2px 20px;
            border-bottom: 1px solid $bcolor2;
            color: $tcolor3;
            font-size: 12px;
            height: 33px;
            input {
                padding: 2px .5em;
                text-align: center;
                border: 1px solid $bcolor1;
                border-radius: 3px;
            }
        }
        >.context {
            textarea {
                // height: 710px;
                width: 100%;
                border: none;
                font-size: 18px;
                padding: 0.5em;
                &:focus {
                    outline: none;
                }
            }
            .preview {
                // height: 710px;
                width: 100%;
                font-size: 18px;
                padding: 1em;
            }
        }
    }
</style>