<template>
    <div class="article">
        <div class="title-bar">
            <div class="inner-wrapper" v-show="currentNote">
                <input type="text" v-model.trim="currentNote.title" ref="input" v-if="currentNote">
                <div class="btn-wrapper">
                    <el-button plain class="el-btn" @click="onSaveNote">保存</el-button>
                    <el-button plain class="el-btn" @click="onPreview" :class="{[`preview-btn`]:preview}">Markdown 预览</el-button>
                </div>
            </div>
        </div>
        <div class="tool-bar">
            <div class="inner-wrapper" v-show="currentNote">
                <span>字体大小</span>
                <el-select v-model="fontSize" size="mini" style="width:65px;">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
        </div>
        <n-scrollbar :slider="{background:'#409EFF',opacity:0.3}" ref="scroll" v-if="currentNote" v-show="!preview">
            <pre class="context" ref="context" contenteditable="true" @focus="auto" 
            :style="{['font-size']:`${fontSize}px`}" 
            v-text="currentNote.content">
            </pre>
        </n-scrollbar>
        <n-scrollbar :slider="{background:'#409EFF',opacity:0.3}" ref="scroll" v-if="currentNote" v-show="preview">
            <div class="preview" v-html="markdown"></div>
        </n-scrollbar>
    </div>
</template>
<script>
    import Scrollbar from "./scrollbar.vue";
    import marked from "marked";
    import { mapActions, mapGetters, mapState, mapMutations } from "vuex";
    export default {
        name: "Article",
        components: { "n-scrollbar": Scrollbar },
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
                currentNote: state => state.notes.currentNote
            }),
            markdown() {
                if (this.currentNote) {
                    return marked(this.currentNote.content);
                }
            }
        },
        inject: ["eventBus"],
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
            auto() {
                let context = this.$refs.context;
                setInterval(() => {
                    this.$refs.scroll.resize();
                    let txt = context.innerHTML.replace(/<\/[pbr]\/?>/g, '&nbsp;&nbsp;&nbsp;').replace(/<\/?[^>]*>/g, '')
                    console.log(txt);
                    console.log(context.innerText)
                }, 4000)
            }
        },
        mounted() {
            this.$nextTick(() => {})
        },
        beforeUpdate() {},
    };
</script>
<style lang="scss" scoped>
    @import "@/assets/base.scss";
    .article {
        width: 100%;
        height: 100%;
        // display: flex;
        // flex-direction: column;
        // justify-content: flex-start;
        overflow: hidden;
        >.title-bar {
            height: 60px;
            flex-grow: 0;
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
            flex-grow: 0;
            input {
                padding: 2px .5em;
                text-align: center;
                border: 1px solid $bcolor1;
                border-radius: 3px;
            }
        }
        .context {
            flex-grow: 1;
            min-height: 100px;
            border: 1px solid red;
            position: absolute;
            top: 0;
            left: 0;
            // display: flex;
            // flex-direction: column;
            // justify-content: stretch;
            width: 100%;
            .inner-wrapper {
                width: 100%;
                // textarea {
                //     width: 100%;
                //     height: 100%;
                //     border: none;
                //     font-size: 18px;
                //     padding: 0.5em;
                //     display: block;
                //     overflow-x: hidden;
                //     overflow-y: hidden;
                //     resize: none;
                //     border: 1px solid red;
                //     &:focus {
                //         outline: none;
                //     }
                // }
                .fake-textarea {
                    min-height: 100px;
                    border: 1px solid red;
                }
                .preview {
                    width: 100%;
                    height: 100%;
                    font-size: 18px;
                    padding: 1em;
                }
            }
        }
    }
</style>