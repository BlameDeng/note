<template>
    <div>
        <button id="btn">123</button>
        <button id="start">321</button>
    </div>
</template>
<script>
    import plupload from 'plupload'
    // import uploader from './uploader.js'
    import Crypto from './crypto-min.js';
    import sha1 from './sha1-min.js';
    import hmac from './hmac-min.js';
    import Base64 from './base64.js';
    export default {
        name: 'Upload',
        mounted() {
            console.log(Base64)
            console.log(sha1)
            console.log(Crypto)
            let accessid = 'LTAIW5DpJ9UZaAvE';
            let accesskey = 'BujhhVwR2C8u1CyhHrxSXmlNOxlPtA';
            let host = 'https://notebooksavatar.oss-cn-shenzhen.aliyuncs.com';
            let g_dirname = ''
            let g_object_name = ''
            let g_object_name_type = ''
            let now = Date.parse(new Date()) / 1000; //timestamp

            var policyText = {
                "expiration": "2020-01-01T12:00:00.000Z", //设置该Policy的失效时间，超过这个失效时间之后，就没有办法通过这个policy上传文件了
                "conditions": [
                    ["content-length-range", 0, 1048576000] // 设置上传文件的大小限制
                ]
            };

            var policyBase64 = Base64.encode(JSON.stringify(policyText))
            var message = policyBase64
            var bytes = Crypto.HMAC(Crypto.SHA1, message, accesskey, { asBytes: true });
            var signature = Crypto.util.bytesToBase64(bytes);

            function set_upload_param(up, filename, ret) {
                g_object_name = g_dirname;
                if (filename != '') {
                    suffix = get_suffix(filename)
                    calculate_object_name(filename)
                }
              let  new_multipart_params = {
                    'key': g_object_name,
                    'policy': policyBase64,
                    'OSSAccessKeyId': accessid,
                    'success_action_status': '200', //让服务端返回200,不然，默认会返回204
                    'signature': signature,
                };

                up.setOption({
                    'url': host,
                    'multipart_params': new_multipart_params
                });

                up.start();
            }
            var uploader = new plupload.Uploader({
                browse_button: 'btn', //触发文件选择对话框的按钮，为那个元素id
                url: 'https://notebooksavatar.oss-cn-shenzhen.aliyuncs.com', //服务器端的上传页面地址
                silverlight_xap_url: 'js/Moxie.xap', //silverlight文件，当需要使用silverlight方式进行上传时需要配置该参数
                init: function() {
                    set_upload_param(uploader, '', false);
                },
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
    }
</script>
<style lang="scss" scoped>

</style>