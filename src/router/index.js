import Vue from 'vue'
import Router from 'vue-router'
import SignIn from '@/pages/signIn/signIn.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'SignIn',
      component: SignIn
    }
  ]
})
