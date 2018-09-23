<template>
    <div class="signIn">
        <n-header></n-header>
    </div>
</template>
<script>
import Header from "@/components/Header.vue";
import url from "@/api/url.js";
import request from "@/helpers/request.js";
import { mapActions } from "vuex";
export default {
  name: "SignIn",
  components: { "n-header": Header },
  data() {
    return {};
  },
  created() {
    this.login({ username: "blame", password: 123456 }).then(res => {
      console.log(res);
    });
  },
  methods: {
    ...mapActions(["login"])
  }
};
</script>
<style scoped lang="scss" src='./signIn.scss'></style>