import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/pages/login/login.vue'
import Register from '@/pages/register/register.vue'
import File from '@/pages/file/file.vue'

import store from '@/store'
Vue.use(Router)

const router = new Router({
    routes: [{
            path: '/',
            redirect: { name: 'login' }
        },
        {
            path: '/login',
            name: 'login',
            component: Login
        },
        {
            path: '/register',
            name: 'register',
            component: Register
        },
        {
            path: '/file',
            name: 'file',
            component: File,
            meta: { requiresAuth: true }
        }
    ]
})

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        // this route requires auth, check if logged in
        // if not, redirect to login page.
        if (!store.state.auth.isLogin) {
            next({
                path: '/login',
                query: {}
            })
        } else {
            next()
        }
    } else {
        next() // 确保一定要调用 next()
    }
})

export default router