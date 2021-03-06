<template>
  <div class="header" :class="{['header-login']:isLogin}">
    <n-upload container-id="upload" browse-id="new-avatar" @uploaded="uploaded($event)" v-if="userInfo&&maskType==='person'"></n-upload>
    <div class="logo">
      <span class="pen">
        <n-icon name="pen"></n-icon>
      </span>
      <span class="text">我的云笔记</span>
    </div>
    <div class="user-info" v-if="isLogin">
      <div class="avatar" title="个人信息" @click="onMask('person')"><img :src="userInfo.avatar" v-if="userInfo"></div>
        <n-icon name="xiala" style="cursor:pointer;" @click="showSet=true"></n-icon>
        <ul class="set" v-show="showSet&&isLogin">
          <li @click="onMask('person')">个人信息</li>
          <li @click="onMask('account')">账号信息</li>
          <li @click="onLogout">注销登录</li>
        </ul>
      </div>
      <transition name="fade">
        <div class="mask" v-show="showMask">
        </div>
      </transition>
      <transition name="slide">
        <div class="per-info" v-if="userInfo" v-show="maskType==='person'">
          <div class="title">个人信息
            <n-icon name="x" style="cursor:pointer;" class="n-icon" title="关闭" @click="closeMask"></n-icon>
          </div>
          <div class="item">
            <span class="item-key">头 像</span>
            <div class="avatar"><img :src="userInfo.avatar" title="点击查看原图" v-if="userInfo.avatar" @click="openOrigin"></div>
              <div id="upload" class="upload">
                <el-button plain id="new-avatar" class="new-avatar">上传新头像</el-button>
                <p>支持JPG、PNG格式，小于200KB</p>
              </div>
            </div>
            <div class="item">
              <span class="item-key">账 号</span>
              <p v-if="user">{{user.username}}</p>
            </div>
            <div class="item">
              <span class="item-key">昵 称</span>
              <el-input v-model.trim="userInfo.nickname" maxlength="10"></el-input>
            </div>
            <div class="item">
              <span class="item-key">性 别</span>
              <el-radio v-model="userInfo.sex" label="male">男</el-radio>
              <el-radio v-model="userInfo.sex" label="female">女</el-radio>
              <el-radio v-model="userInfo.sex" label="secret">保密</el-radio>
            </div>
            <div class="item">
              <span class="item-key">签 名</span>
              <el-input type="textarea" :rows="3" v-model.trim="userInfo.sign" resize="none" maxlength="60">
              </el-input>
              <span class="sign-limit" v-show="userInfo.sign">{{userInfo.sign.length}} / 60</span>
            </div>
            <div class="item">
              <el-button type="primary" @click="onUpdateUserInfo">保存</el-button>
              <el-button plain @click="closeMask">取消</el-button>
            </div>
          </div>
      </transition>
      <transition name="fade">
        <div class="account-info" v-show="maskType==='account'">
          <div class="title">个人信息
            <n-icon name="x" style="cursor:pointer;" class="n-icon" title="关闭" @click="closeMask"></n-icon>
          </div>
          <div class="item">
            <span class="item-key">账号</span>
            <p v-if="user">{{user.username}}</p>
          </div>
          <div class="item">
            <span class="item-key">注册日期</span>
            <p v-if="user">{{formatDate(user.createdAt)}}</p>
          </div>
        </div>
      </transition>
    </div>
</template>
<script>
import Icon from "./icon.vue";
import Upload from "@/components/upload/upload.vue";
import { mapState, mapActions } from "vuex";
import Notebooks from "@/helpers/leancloud.js";
export default {
  name: "Header",
  components: { "n-icon": Icon, "n-upload": Upload },
  data() {
    return {
      showSet: false,
      showMask: false,
      userInfo: null,
      objectId: "",
      maskType: ""
    };
  },
  computed: {
    ...mapState({
      isLogin: state => state.auth.isLogin,
      user: state => state.auth.user
    })
  },
  created() {
    if (this.user) {
      Notebooks.queryUser({ userId: this.user.id })
        .then(res => {
          if (res.length === 0) {
            this.userInfo = {
              userId: this.user.id,
              sex: "secret",
              nickname: "",
              sign: "",
              avatar:
                "https://notebooksavatar.oss-cn-shenzhen.aliyuncs.com/default.png?x-oss-process=style/avatar"
            };
            Notebooks.createUser(this.userInfo)
              .then(res => {
                this.objectId = res.id;
              })
              .catch(err => {});
          } else {
            this.objectId = res[0].id;
            this.userInfo = { ...res[0].attributes };
          }
        })
        .catch(err => {});
    }
  },
  methods: {
    ...mapActions(["logout"]),
    onLogout() {
      this.logout()
        .then(res => {})
        .catch(err => {});
    },
    listenDocument() {
      this.showSet = false;
    },
    onMask(type) {
      this.showMask = true;
      this.maskType = type;
    },
    closeMask() {
      this.showMask = false;
      this.maskType = "";
    },
    onUpdateUserInfo() {
      Notebooks.updateUser(
        {
          ...this.userInfo
        },
        this.objectId
      ).then(res => {
        this.showMask = false;
        this.maskType = "";
      });
    },
    uploaded(url) {
      this.userInfo.avatar = url;
    },
    openOrigin() {
      window.open(
        this.userInfo.avatar.replace("?x-oss-process=style/avatar", ""),
        "_blank"
      );
    }
  },
  watch: {
    showSet(val) {
      if (val) {
        document.addEventListener("click", this.listenDocument);
      } else {
        document.removeEventListener("click", this.listenDocument);
      }
    }
  },
  beforeDestroy() {
    document.removeEventListener("click", this.listenDocument);
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/base.scss";
.header {
  background: $tcolor;
  color: #fff;
  padding: 54px 0;
  flex-grow: 0;
  flex-shrink: 0;
  min-width: 960px;
  > .logo {
    width: 960px;
    margin: 0 auto;
    padding: 0 20px;
    > .pen {
      border: 1px solid #fff;
      width: 44px;
      height: 44px;
      font-size: 42px;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      border-top-left-radius: 6px;
      border-bottom-right-radius: 6px;
      vertical-align: middle;
      margin-right: 4px;
    }
    > .text {
      font-size: 43px;
      vertical-align: middle;
    }
  }
  &.header-login {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 0;
    > .logo {
      width: auto;
      margin: 0 0;
      padding: 0 20px;
      > .pen {
        width: 24px;
        height: 24px;
        font-size: 22px;
      }
      > .text {
        font-size: 23px;
      }
    }
    > .user-info {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 22px;
      margin-right: 250px;
      position: relative;
      .avatar {
        width: 40px;
        height: 40px;
        border-radius: 4px;
        cursor: pointer;
        margin-right: 5px;
        > img {
          width: 40px;
          height: 40px;
          border-radius: 4px;
        }
      }
      > .set {
        position: absolute;
        top: 100%;
        left: -10px;
        transform: translateY(14px);
        width: 100px;
        font-size: 14px;
        background: #fff;
        color: $tcolor3;
        box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.4);
        cursor: pointer;
        user-select: none;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
        > li {
          width: 100%;
          height: 40px;
          text-align: center;
          display: flex;
          justify-content: center;
          align-items: center;
          &:hover {
            background: $hcolor2;
          }
          &:not(:last-child) {
            border-bottom: 1px solid $hcolor1;
          }
        }
      }
    }
    > .mask {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.3);
      z-index: 2;
    }
    > .per-info {
      position: fixed;
      top: 50%;
      left: 50%;
      width: 400px;
      transform: translateX(-50%) translateY(-50%);
      background: #fff;
      color: $tcolor3;
      font-size: 14px;
      border-radius: 4px;
      padding: 30px 20px;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
      outline: inset 2px solid #666;
      z-index: 3;
      > .title {
        color: $tcolor2;
        text-align: center;
        padding: 5px 0;
        font-size: 16px;
        margin-bottom: 10px;
        position: relative;
        user-select: none;
        > .n-icon {
          position: absolute;
          top: 50%;
          right: 0;
          transform: translateY(-50%);
          font-size: 12px;
          color: $tcolor4;
          &:hover {
            color: $tcolor3;
          }
        }
      }
      > .item {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding: 10px 0;
        position: relative;
        > .item-key {
          display: inline-block;
          padding-left: 10px;
          flex-shrink: 0;
          width: 60px;
        }
        > .sign-limit {
          position: absolute;
          bottom: 16px;
          right: 4px;
          font-size: 12px;
          color: $tcolor4;
        }
        &:nth-child(2) {
          .avatar {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            > img {
              width: 50px;
              height: 50px;
              border-radius: 50%;
              cursor: pointer;
            }
          }
          > .upload {
            margin-left: 20px;
            > .new-avatar {
              padding: 6px 8px;
              font-size: 12px;
              margin-bottom: 6px;
            }
            > p {
              font-size: 12px;
              color: $tcolor4;
            }
          }
        }
        &:last-child {
          justify-content: center;
          margin-top: 15px;
        }
      }
    }
    > .account-info {
      position: fixed;
      top: 50%;
      left: 50%;
      width: 400px;
      transform: translateX(-50%) translateY(-50%);
      background: #fff;
      color: $tcolor3;
      font-size: 14px;
      border-radius: 4px;
      padding: 30px 20px;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
      outline: inset 2px solid #666;
      z-index: 3;
      > .title {
        color: $tcolor2;
        text-align: center;
        padding: 5px 0;
        font-size: 16px;
        margin-bottom: 10px;
        position: relative;
        user-select: none;
        > .n-icon {
          position: absolute;
          top: 50%;
          right: 0;
          transform: translateY(-50%);
          font-size: 12px;
          color: $tcolor4;
          &:hover {
            color: $tcolor3;
          }
        }
      }
      > .item {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding: 10px 0;
        > .item-key {
          display: inline-block;
          flex-shrink: 0;
          width: 70px;
          text-align: end;
          margin-right: 20px;
          font-weight: bold;
          padding-left: 10px;
        }
      }
    }
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
  .slide-enter-active {
    animation: slide-in 0.3s ease;
  }
  .slide-leave-active {
    animation: slide-in 0.3s ease reverse;
  }
  @keyframes slide-in {
    from {
      transform: translateX(-50%) translateY(-60%);
      opacity: 0;
    }
    to {
      transform: translateX(-50%) translateY(-50%);
      opacity: 1;
    }
  }
}
</style>