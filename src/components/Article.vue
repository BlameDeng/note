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
        <div class="context" ref="context">
            <n-scrollbar :slider="{background:'#409EFF',opacity:0.3}" v-if="currentNote"
            ref="scroll">
                <!-- <div class="inner-wrapper" v-if="currentNote"> -->
                <!-- <textarea v-model="currentNote.content" ref="textarea" v-if="currentNote"
                    v-show="!preview" :style="{['font-size']:`${fontSize}px`}" 
                    @input="auto"></textarea> -->
                <div class="fake-textarea" contenteditable="true" ref="fake" @keyup="abc"></div>
                <!-- <div class="preview" v-show="preview" v-html="markdown"></div> -->
                <!-- </div> -->
            </n-scrollbar>
        </div>
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
                // this.$nextTick(() => {
                //     let textarea = this.$refs.textarea;

                //     console.log(textarea.getBoundingClientRect());
                //     console.log(textarea.scrollHeight);
                //     // textarea.style.height = 'auto';
                //     textarea.style.scrollTop = 0;
                //     textarea.style.height = textarea.scrollHeight + 'px';
                // })
            },
            abc(){
              this.$refs.scroll.resize();  
            }
        },
        mounted() {
            this.$nextTick(() => {
            })
            // setInterval(() => {
            //     console.log(this.$refs.fake.innerHTML)
            // }, 3000)

        },
        beforeUpdate() {
            // let textarea = this.$refs.textarea;
            // let { height } = this.$refs.context.getBoundingClientRect();
            // let { height: tHeight } = this.$refs.textarea.getBoundingClientRect();

            // if (textarea.scrollHeight <= height) {
            //     textarea.style.height = height + 'px';
            // } else {
            //     textarea.style.height = 'auto';
            // }

            // if (tHeight>=0) {

            // }
            console.log(this.$refs.fake)
            this.$refs.scroll.resize();


        },
    };
</script>
<style lang="scss" scoped>
    @import "@/assets/base.scss";
    .article {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
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
        >.context {
            flex-grow: 1;
            // display: flex;
            // flex-direction: column;
            // justify-content: stretch;
            width: 100%;
            // .inner-wrapper {
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
            // }
        }
    }
</style>