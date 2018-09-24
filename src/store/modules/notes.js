import url from '@/api/url.js'
import request from '@/helpers/request.js'

const state = {

}

const getters = {

}

const mutations = {

}

const actions = {
    async createNote({ commit }, { notebookId, title, content }) {
        let res = await request({ url: url.createNote.replace(':notebookId', notebookId), data: { title, content } });
        return res;
    },
    async getNotes({ commit }, { notebookId }) {
        let res = await request({ url: url.getNotes.replace(':notebookId', notebookId) });
        return res;
    },
    async deleteNote({ commit }, { noteId }) {
        let res = await request({ url: url.deleteNote.replace(':noteId', noteId) });
        return res;
    }
}

export default { state, getters, mutations, actions }