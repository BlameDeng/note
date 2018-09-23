import url from '@/api/url.js'
import request from '@/helpers/request.js'

const state = {
    user: null,
    isLogin: false,
}

const getters = {}

const mutations = {
    setUser(state, playload) {
        state.user = playload;
    },
    setLogin(state, playload) {
        state.isLogin = playload.isLogin;
    }
}

const actions = {
    async login({ commit }, { username, password }) {
        let res = await request({ url: url.login, method: 'POST', data: { username, password } })
        commit('setUser', res.data);
        commit('setLogin', { isLogin: true })
        return res;
    }
}

export default { state, getters, mutations, actions }