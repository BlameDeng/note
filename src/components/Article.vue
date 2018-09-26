<template>
    <div class="article">
        <div class="title-bar">
            <template v-if="editing&&note">
                <input type="text" v-model.trim="note.title" ref="input">
                <div class="btn-wrapper">
                    <el-button plain class="el-btn" @click="onSaveNote">保存</el-button>
                    <el-button plain class="el-btn" @click="onPreview" :class="{[`preview-btn`]:preview}">Markdown 预览</el-button>
                </div>
            </template>
        </div>
        <div class="tool-bar">
            <span>字体大小</span>
            <el-input-number v-model="fontSize" :min="12" :max="40" size="small" :controls="false" style="width:60px;"></el-input-number>
        </div>
        <div class="context">
            <template v-if="editing&&note">
                <textarea v-model="note.content" ref="textarea" v-show="!preview" :style="{['font-size']:`${fontSize}px`}"></textarea>
                <div class="preview" v-show="preview" v-html="markdown"></div>
            </template>
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
      editing: true,
      saving: false,
      preview: false,
      fontSize: 14
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
  > .title-bar {
    height: 60px;
    flex-grow: 1;
    border-bottom: 1px solid $bcolor1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    > input {
      border: none;
      font-size: 18px;
      padding-left: 20px;
      &:focus {
        outline: none;
      }
    }
    > .btn-wrapper {
      margin-right: 80px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      > .el-btn {
        padding: 8px 10px;
        &.preview-btn {
          background: $tcolor;
          color: #fff;
        }
      }
    }
  }
  > .tool-bar {
    padding: 2px 0 2px 20px;
    border-bottom: 1px solid $bcolor2;
    color: $tcolor3;
    font-size: 12px;
  }
  > .context {
    > textarea {
      height: 710px;
      width: 100%;
      border: none;
      font-size: 18px;
      padding: 0.5em;
      &:focus {
        outline: none;
      }
    }
    > .preview {
      height: 710px;
      width: 100%;
      font-size: 18px;
      padding: 1em;
    }
  }
}
</style>