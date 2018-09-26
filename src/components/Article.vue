<template>
    <div class="article">
        <div class="title-bar">
            <template v-if="editing&&note">
                <input type="text" v-model.trim="note.title" ref="input">
                <div class="btn-wrapper">
                    <el-button plain class="el-btn" @click="onSaveNote" v-show="!preview">保存</el-button>
                    <el-button plain class="el-btn" @click="onClosePreview" v-show="preview">编辑</el-button>
                    <el-button plain class="el-btn" @click="onPreview" :class="{[`preview-btn`]:preview}">Markdown 预览</el-button>
                </div>
            </template>
        </div>
        <div class="tool-bar"></div>
        <div class="context">
            <template v-if="editing&&note">
                <textarea v-model="note.content" ref="textarea" v-show="!preview"></textarea>
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
    return { editing: true, saving: false, preview: false };
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
      this.preview = true;
    },
    onClosePreview() {
      this.preview = false;
      this.$refs.input.select();
    }
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
    justify-content: flex-start;
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
      margin-left: auto;
      padding-right: 100px;
      > .el-btn {
        padding: 8px 20px;
        &.preview-btn {
          background: $tcolor;
          color: #fff;
        }
      }
    }
  }
  > .tool-bar {
    height: 30px;
    border-bottom: 1px solid $bcolor2;
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