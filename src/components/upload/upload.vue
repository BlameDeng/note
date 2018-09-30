<template>
    <div id="my-plupload">
        <form name=theform>
            <input type="radio" name="myradio" value="local_name" checked=true /> 上传文件名字保持本地文件名字
            <input type="radio" name="myradio" value="random_name" /> 上传文件名字是随机文件名
            <br />
            上传到指定目录:<input type="text" id='dirname' placeholder="如果不填，默认是上传到根目录" size=50>
        </form>
        <h4>您所选择的文件列表：</h4>
        <div id="ossfile">你的浏览器不支持flash,Silverlight或者HTML5！</div>
        <br />
        <div id="plupload-container">
            <a id="plupload-selectfiles" href="javascript:void(0);" class='btn'>选择文件</a>
            <a id="plupload-postfiles" href="javascript:void(0);" class='btn'>开始上传</a>
        </div>
        <p>&nbsp;</p>
    </div>
</template>
<script>
    import plupload from 'plupload';
    import Crypto from './crypto-min.js';
    import sha1 from './sha1-min.js';
    import hmac from './hmac-min.js';
    import Base64 from './base64.js';
    export default {
        name: 'Upload',
        props: {
            containerId: { type: String, default: 'plupload-container' },
            browseId: { type: String, default: 'plupload-selectfiles' },
            postId: { type: String, default: '' }
        },
        data() {
            return {
                url: ''
            }
        },
        mounted() {
            let that = this;
            let accessid = 'LTAIW5DpJ9UZaAvE';
            let accesskey = 'BujhhVwR2C8u1CyhHrxSXmlNOxlPtA';
            let host = 'https://notebooksavatar.oss-cn-shenzhen.aliyuncs.com';
            let g_dirname = ''
            let g_object_name = ''
            let g_object_name_type = ''
            let now = Date.parse(new Date()) / 1000;
            let suffix = '';

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

            function check_object_radio() {
                var tt = document.getElementsByName('myradio');
                for (var i = 0; i < tt.length; i++) {
                    if (tt[i].checked) {
                        g_object_name_type = tt[i].value;
                        break;
                    }
                }
            }

            function get_dirname() {
                let dir = document.getElementById("dirname").value;
                if (dir != '' && dir.indexOf('/') != dir.length - 1) {
                    dir = dir + '/'
                }
                g_dirname = dir
            }

            function random_string(len) {
                len = len || 32;
                var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
                var maxPos = chars.length;
                var pwd = '';
                for (i = 0; i < len; i++) {
                    pwd += chars.charAt(Math.floor(Math.random() * maxPos));
                }
                return pwd;
            }

            function get_suffix(filename) {
                let pos = filename.lastIndexOf('.')
                if (pos != -1) {
                    suffix = filename.substring(pos)
                }
                return suffix;
            }

            function calculate_object_name(filename) {
                if (g_object_name_type == 'local_name') {
                    g_object_name += "${filename}"
                } else if (g_object_name_type == 'random_name') {
                    suffix = get_suffix(filename)
                    g_object_name = g_dirname + random_string(10) + suffix
                }
                return ''
            }

            function get_uploaded_object_name(filename) {
                if (g_object_name_type == 'local_name') {
                    let tmp_name = g_object_name
                    tmp_name = tmp_name.replace("${filename}", filename);
                    return tmp_name
                } else if (g_object_name_type == 'random_name') {
                    return g_object_name
                }
            }

            function set_upload_param(up, filename, ret) {
                g_object_name = g_dirname;
                if (filename != '') {
                    suffix = get_suffix(filename)
                    calculate_object_name(filename)
                }
                let new_multipart_params = {
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
                runtimes: 'html5,flash,silverlight,html4',
                browse_button: that.browseId,
                multi_selection: false,
                container: document.getElementById(that.containerId),
                flash_swf_url: 'lib/plupload-2.1.2/js/Moxie.swf',
                silverlight_xap_url: 'lib/plupload-2.1.2/js/Moxie.xap',
                url: host,
                filters: { max_file_size: '100kb' },

                init: {
                    PostInit: function() {
                        document.getElementById('ossfile').innerHTML = '';
                        if (that.postId) {
                            document.getElementById(that.postId).onclick = function() {
                                set_upload_param(uploader, '', false);
                                return false;
                            };
                        }
                    },

                    FilesAdded: function(up, files) {
                        if (!that.postId) {
                            set_upload_param(uploader, '', false);
                        }  //自动上传
                        // plupload.each(files, function(file) {
                        //     document.getElementById('ossfile').innerHTML += '<div id="' + file.id + '">' + file.name + ' (' + plupload.formatSize(file.size) + ')<b></b>' +
                        //         '<div class="progress"><div class="progress-bar" style="width: 0%"></div></div>' +
                        //         '</div>';
                        // });
                    },

                    BeforeUpload: function(up, file) {
                        check_object_radio();
                        get_dirname();
                        set_upload_param(up, file.name, true);
                    },

                    UploadProgress: function(up, file) {
                        // var d = document.getElementById(file.id);
                        // d.getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
                        // var prog = d.getElementsByTagName('div')[0];
                        // var progBar = prog.getElementsByTagName('div')[0]
                        // progBar.style.width = 2 * file.percent + 'px';
                        // progBar.setAttribute('aria-valuenow', file.percent);
                    },

                    FileUploaded: function(up, file, info) {
                        if (info.status == 200) {
                            // document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = 'upload to oss success, object name:' + get_uploaded_object_name(file.name);
                            that.url = host + '/' + get_uploaded_object_name(file.name) + '?x-oss-process=style/avatar';
                            that.$emit('uploaded', that.url);
                        } else {
                            // document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = info.response;
                        }
                    },

                    Error: function(up, err) {}
                }
            });
            uploader.init();
        }
    }
</script>
<style lang="scss" scoped>
    #my-plupload {
        position: absolute;
        top: 0;
        left: 0;
        width: 0;
        height: 0;
        overflow: hidden;
    }
</style>