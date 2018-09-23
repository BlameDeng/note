<template>
    <div class="login">
        <n-header></n-header>
        <div class="main-wrapper">
            <div class="main">
                <div class="login-info">
                    <el-input v-model.trim="username" placeholder="请输入用户名" class="input"></el-input>
                    <el-input v-model="password" placeholder="请输入密码" class="input"></el-input>
                    <el-button type="primary" @click="onLogin">立即登录</el-button>
                </div>
                <p class="line"></p>
                <div class="register-link">
                    <h3>欢迎使用云笔记</h3>
                    <p>还没有账号？您可以</p>
                    <el-button type="primary" plain @click="onToRegister">快速注册</el-button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import Header from "@/components/Header.vue";
    import url from "@/api/url.js";
    import request from "@/helpers/request.js";
    import { mapActions } from "vuex";
    export default {
        name: "Login",
        components: { "n-header": Header },
        data() {
            return { username: '', password: '' };
        },
        created() {},
        methods: {
            ...mapActions(['login', 'logout']),
            onLogin() {
                let regexp1 = /^[\w\u4e00-\u9fa5]{1,15}$/;
                let regexp2 = /^.{6,16}$/;
                if (!regexp1.test(this.username)) {
                    this.$message('用户名为长度1到15的字母、数字、下划线或汉字');
                    return
                }
                if (!regexp2.test(this.password)) {
                    this.$message('密码为长度6到16的字符');
                    return
                }
                this.login({ username: this.username, password: this.password }).then(res => {
                    console.log(res);
                }).catch((err) => {
                    this.$message.error('用户名不存在或密码不正确');
                })
            },
            onToRegister() {
                this.$router.push({ path: '/register' });
            }
        }
    };
</script>
<style scoped lang="scss" src='./login.scss'></style>