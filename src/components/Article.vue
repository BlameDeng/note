<template>
    <div class="article">
        <div class="title-bar">
            <div class="inner-wrapper" v-if="title">
                <input type="text" v-model.trim="title" ref="input" v-if="currentNote">
                <div class="btn-wrapper">
                    <el-button plain class="el-btn" @click="onSaveNote">保存</el-button>
                    <el-button plain class="el-btn" @click="onPreview" :class="{[`preview-btn`]:preview}">Markdown 预览</el-button>
                </div>
            </div>
        </div>
        <div class="tool-bar">
            <div class="inner-wrapper" v-if="title">
                <span>字体大小</span>
                <el-select v-model="fontSize" size="mini" style="width:65px;">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
        </div>
        <n-scrollbar :slider="{background:'#409EFF',opacity:0.3}" ref="context" v-if="title" v-show="!preview">
            <pre class="content" ref="content" contenteditable="true" :style="{['font-size']:`${fontSize}px`}" @blur="changeContent" v-text="content">
            </pre>
        </n-scrollbar>
        <n-scrollbar :slider="{background:'#409EFF',opacity:0.3}" ref="preview" v-if="title" v-show="preview">
            <div class="preview" v-html="markdown" :style="{['font-size']:`${fontSize}px`}"></div>
        </n-scrollbar>
    </div>
</template>
<script>
    import Scrollbar from "./scrollbar.vue";
    import marked from "marked";
    import { mapActions, mapState, mapMutations } from "vuex";
    export default {
        name: "Article",
        components: { "n-scrollbar": Scrollbar },
        data() {
            return {
                saving: false,
                preview: false,
                fontSize: 14,
                title: '',
                content: '',
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
                if (this.content) {
                    return marked(this.content);
                }
            }
        },
        inject: ["eventBus"],
        created(){
            this.eventBus.$on('note-added',this.selectTitle);
        },
        methods: {
            ...mapActions(["createNote", "patchNote"]),
            onSaveNote() {
                this.content = this.$refs.content.innerText;
                if (this.saving) { return; }
                this.saving = true;
                this.patchNote({
                    noteId: this.currentNote.id,
                    title: this.title,
                    content: this.content
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
                this.$refs.context ? this.$refs.context.scrollToStart() : 0;
                this.$refs.preview ? this.$refs.preview.scrollToStart() : 0;
            },
            resizeScroll() {
                this.$refs.context.resize();
            },
            changeContent() {
                this.content = this.$refs.content.innerText;
            },
            selectTitle(){
                this.$refs.input.select();
            }
        },
        watch: {
            currentNote: {
                handler: function(val) {
                    this.$refs.context ? this.$refs.context.scrollToStart() : 0;
                    this.$refs.preview ? this.$refs.preview.scrollToStart() : 0;
                    if (val) {
                        this.title = val.title;
                        this.content = val.content;
                    }else{
                        this.title='';
                        this.content='';
                    }
                },
                deep: true,
                immediate: true
            }
        },
        beforeDestroy(){
            this.eventBus.$off('note-added',this.selectTitle);
        }
    };
</script>
<style lang="scss" scoped>
    @import "@/assets/base.scss";
    .article {
        width: 100%;
        height: 100%;
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
        .content {
            flex-grow: 1;
            min-height: 100px;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            padding: .5em;
            &:focus {
                outline: none;
            }
        }
        .preview {
            width: 100%;
            font-size: 18px;
            padding: .5em;
        }
    }
</style>