import url from '@/api/url.js'
import request from '@/helpers/request.js'

const state = {
    allNotebooks: null
}

const getters = {}

const mutations = {
    setAllNotebooks(state, payload) {
        state.allNotebooks = payload.allNotebooks;
    }
}

const actions = {
    async getNotebooks({ commit }) {
        let res = await request({ url: url.getNotebooks });
        commit('setAllNotebooks', { allNotebooks: res.data });
        return res;
    },
    async createNotebooks({ commit }, { title }) {
        let res = await request({ url: url.createNotebooks, method: 'POST', data: { title } });
        return res;
    }
}

export default { state, getters, mutations, actions }