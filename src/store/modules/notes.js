import url from '@/api/url.js'
import request from '@/helpers/request.js'

const state = {
    notes: null
}

const getters = {

}

const mutations = {
    setNotes(state, payload) {
        state.notes = payload.notes;
    }
}

const actions = {
    async createNote({ commit }, { notebookId, title, content }) {
        let res = await request({
            url: url.createNote.replace(':notebookId', notebookId),
            method: 'POST',
            data: { title, content }
        });
        return res;
    },
    async getNotes({ commit }, { notebookId }) {
        let res = await request({ url: url.getNotes.replace(':notebookId', notebookId) });
        commit('setNotes',{notes:res.data});
        return res;
    },
    async deleteNote({ commit }, { noteId }) {
        let res = await request({ url: url.deleteNote.replace(':noteId', noteId) });
        return res;
    }
}

export default { state, getters, mutations, actions }