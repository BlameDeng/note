<template>
    <div class="article">
        <div class="title-bar">
            <input type="text" v-model="title">
            <el-button plain class="el-btn">保存</el-button>
        </div>
        <div class="tool-bar"></div>
        <div class="context">
            <textarea></textarea>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'Article',
        data() {
            return { title: '无标题笔记' }
        },
        inject: ['eventBus'],
        created() {
this.eventBus.$on('add-note',()=>{
    console.log('shoudaole')
})
        },
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