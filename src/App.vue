<template>
    <div id="app">
        <router-view />
    </div>
</template>

<script>
    export default {
        name: "App"
    };
</script>

<style>
    #app {
        font-family: "Helvetica Neue", Helvetica, "PingFang SC",
            "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑",
            Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #303133;
        width: 100%;
        height: 100%;
    }
    *,
    *::before,
    *::after {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    html, body {
        width: 100%;
        height: 100%;
    }
    ol,li{list-style: none;}
    img {
        vertical-align: middle;
    }
</style>