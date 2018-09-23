<template>
    <div class="file">
        <n-header></n-header>
        <n-sider></n-sider>
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
        created() {},
        methods: {
            ...mapActions(['login', 'logout']),
        }
    };
</script>
<style scoped lang="scss" src='./file.scss'></style>