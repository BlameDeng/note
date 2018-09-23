import url from '@/api/url.js'
import request from '@/helpers/request.js'

const state = {
    user: null,
    isLogin: true,
}

const getters = {}

const mutations = {
    setUser(state, payload) {
        state.user = payload;
    },
    setLogin(state, payload) {
        state.isLogin = payload.isLogin;
    }
}

const actions = {
    async login({ commit }, { username, password }) {
        let res = await request({
            url: url.login,
            method: 'POST',
            data: { username, password }
        });
        commit('setUser', res.data);
        commit('setLogin', { isLogin: true });
        return res;
    },
    async logout({ commit }) {
        let res = await request({ url: url.logout });
        commit('setUser', null);
        commit('setLogin', { isLogin: false });
        return res;
    },
    async register({ commit }, { username, password }) {
        let res = await request({
            url: url.register,
            method: 'POST',
            data: { username, password }
        });
        commit('setUser', res.data);
        commit('setLogin', { isLogin: true });
        return res;
    },
}

export default { state, getters, mutations, actions }