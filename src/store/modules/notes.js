import url from '@/api/url.js'
import request from '@/helpers/request.js'

const state = {
    notes: null
}

const getters = {
    getNoteById: (state) => {
        return (noteId) => {
            if (state.notes && state.notes.length) {
                return state.notes.find(note => note.id === noteId);
            }
        }
    }
}

const mutations = {
    setNotes(state, payload) {
        state.notes = payload.notes;
    },
    addNote(state, payload) {
        state.notes = state.notes || [];
        state.notes.push(payload.note);
    },
    deleteNote(state, payload) {
        state.notes = state.notes.filter(note => note.id !== payload.noteId)
    },
    updateNote(state, payload) {
        state.notes.map(note => {
            if (note.id === payload.noteId) {
                note.title = payload.title;
                note.content = payload.content;
            }
        })
    }
}

const actions = {
    async createNote({ commit }, { notebookId, title, content }) {
        let res = await request({
            url: url.createNote.replace(':notebookId', notebookId),
            method: 'POST',
            data: { title, content }
        });
        let note = { notebookId, ...res.data };
        commit('addNote', { note });
        return res;
    },
    async getNotes({ commit }, { notebookId }) {
        let res = await request({ url: url.getNotes.replace(':notebookId', notebookId) });
        commit('setNotes', { notes: res.data });
        return res;
    },
    async deleteNote({ commit }, { noteId }) {
        let res = await request({
            url: url.deleteNote.replace(':noteId', noteId),
            method: 'DELETE'
        });
        commit('deleteNote', { noteId });
        return res;
    },
    async patchNote({ commit }, { noteId, title, content }) {
        let res = await request({
            url: url.patchNote.replace(':noteId', noteId),
            method: 'PATCH',
            data: { title, content }
        });
        commit('updateNote', { noteId, title, content });
        return res;
    }
}

export default { state, getters, mutations, actions }