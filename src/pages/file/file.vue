<template>
    <div class="file">
        <n-header style="margin-top:-68px;"></n-header>
        <div class="main">
            <n-sider></n-sider>
            <n-article></n-article>
        </div>
    </div>
</template>
<script>
    import Header from "@/components/Header.vue"
    import Sider from "@/components/sider/Sider.vue"
    import Article from '@/components/Article.vue'
    import { mapActions, mapState } from "vuex"
    import Vue from 'vue'
    export default {
        name: "File",
        components: {
            "n-header": Header,
            'n-sider': Sider,
            'n-article': Article
        },
        data() {
            return { eventBus: new Vue() };
        },
        provide() {
            return { eventBus: this.eventBus };
        },
        computed: {
            ...mapState({
                allNotebooks: state => state.notebooks.allNotebooks
            })
        },
        created() {
            this.getNotebooks().then(res => {}).catch(() => {});
        },
        methods: {
            ...mapActions(['getNotebooks', 'createNotebooks', 'logout']),
            onClick() {
                this.createNotebooks({ title: '我的笔记本' }).then(res => {

                }).catch(() => {});
            },
            onClick1() {
                this.logout();
            }
        }
    };
</script>
<style scoped lang="scss" src='./file.scss'></style>