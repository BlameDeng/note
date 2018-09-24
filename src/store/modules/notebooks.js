import url from '@/api/url.js'
import request from '@/helpers/request.js'

const state = {
    allNotebooks: null
}

const getters = {}

const mutations = {
    setAllNotebooks(state, payload) {
        state.allNotebooks = payload.allNotebooks;
    },
    addNotebooks(state, payload) {
        state.allNotebooks.push(payload.notebook);
    },
    filterNotebooks(state, payload) {
        state.allNotebooks = state.allNotebooks.filter((notebook) => notebook.id !== payload.id);
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
    },
    async deleteNotebooks({ commit }, { notebookId }) {
        let res = await request({ url: url.deleteNotebooks.replace(':notebookId', notebookId), method: 'DELETE' });
        return res;
    }
}

export default { state, getters, mutations, actions }