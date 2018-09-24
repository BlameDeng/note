<template>
    <div class="file">
        <n-header></n-header>
        <n-sider></n-sider>
        <button @click="onClick">123456</button>
        <button @click="onClick1">注销</button>
    </div>
</template>
<script>
    import Header from "@/components/Header.vue"
    import Sider from "@/components/sider.vue"
    import { mapActions } from "vuex"
    export default {
        name: "File",
        components: { "n-header": Header, 'n-sider': Sider },
        data() {
            return {};
        },
        created() {
            this.getNotebooks().then(res => {
                console.log(res);
            })
        },
        methods: {
            ...mapActions(['getNotebooks', 'createNotebooks', 'logout']),
            onClick() {
                this.createNotebooks({ title: '我的笔记本' }).then(res => {
                    console.log(res);
                })
            },
            onClick1() {
                this.logout();
            }
        }
    };
</script>
<style scoped lang="scss" src='./file.scss'></style>