import url from '@/api/url.js'
import request from '@/helpers/request.js'

const state = {}

const getters = {}

const mutations = {}

const actions = {
    async getNotebooks({ commit }) {
        let res = await request({ url: url.getNotebooks });
        return res;
    },
    async createNotebooks({ commit }, { title }) {
        let res = await request({ url: url.createNotebooks, method: 'POST', data: { title } });
        return res;
    }
}

export default { state, getters, mutations, actions }