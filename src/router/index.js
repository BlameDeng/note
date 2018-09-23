import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/pages/login/login.vue'
import Register from '@/pages/register/register.vue'

Vue.use(Router)

export default new Router({
    routes: [{
            path: '/login',
            name: 'login',
            component: Login
        },
        {
            path: '/register',
            name: 'register',
            component: Register
        }
    ]
})