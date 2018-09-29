<template>
    <div class="login">
        <n-header></n-header>
        <div class="main-wrapper">
            <div class="main">
                <div class="login-info">
                    <el-input v-model.trim="username" placeholder="请输入用户名" class="input"></el-input>
                    <el-input v-model="password" placeholder="请输入密码" class="input" @keyup.enter.native="onLogin"></el-input>
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
        <button id="btn">上传</button><button id="start">开始</button>
    </div>
</template>
<script>
    import Header from "@/components/Header.vue"
    import url from "@/api/url.js"
    import { mapActions } from "vuex"
    import plupload from 'plupload'
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
                    this.$router.push('/file');
                }).catch((err) => {

                })
            },
            onToRegister() {
                this.$router.push({ path: '/register' });
            }
        },
        mounted() {
            console.log(plupload);
            var uploader = new plupload.Uploader({
                browse_button: 'btn', //触发文件选择对话框的按钮，为那个元素id
                url: 'upload.php', //服务器端的上传页面地址
                silverlight_xap_url: 'js/Moxie.xap' //silverlight文件，当需要使用silverlight方式进行上传时需要配置该参数
            });

            //在实例对象上调用init()方法进行初始化
            uploader.init();

            //绑定各种事件，并在事件监听函数中做你想做的事
            uploader.bind('FilesAdded', function(uploader, files) {
                //每个事件监听函数都会传入一些很有用的参数，
                //我们可以利用这些参数提供的信息来做比如更新UI，提示上传进度等操作
            });
            uploader.bind('UploadProgress', function(uploader, file) {
                //每个事件监听函数都会传入一些很有用的参数，
                //我们可以利用这些参数提供的信息来做比如更新UI，提示上传进度等操作
            });
            //......
            //......

            //最后给"开始上传"按钮注册事件
            document.getElementById('start').onclick = function() {
                uploader.start(); //调用实例对象的start()方法开始上传文件，当然你也可以在其他地方调用该方法
            }
        },
    };
</script>
<style scoped lang="scss" src='./login.scss'></style>