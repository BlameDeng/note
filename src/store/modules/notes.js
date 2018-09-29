import url from '@/api/url.js'
import request from '@/helpers/request.js'

const state = {
    notes: null,
    trashNotes: null,
    currentNote: null
}

const getters = {}

const mutations = {
    setNotes(state, payload) {
        state.notes = payload.notes;
    },
    addNote(state, payload) {
        state.notes = state.notes || [];
        state.notes.push(payload);
    },
    deleteNote(state, payload) {
        state.notes = state.notes.filter(note => note.id !== payload.noteId)
    },
    addTrashNote(state, note) {
        state.trashNotes = state.trashNotes || [];
        state.trashNotes.push(note);
    },
    updateNote(state, payload) {
        state.notes.map(note => {
            if (note.id === payload.noteId) {
                note.title = payload.title;
                note.content = payload.content;
            }
        })
    },
    setTrashNotes(state, payload) {
        state.trashNotes = payload.trashNotes;
    },
    updateTrashNotes(state, payload) {
        state.trashNotes = state.trashNotes.filter(note => note.id !== payload.id)
    },
    setCurrentNote(state, payload) {
        state.currentNote = payload;
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
        commit('addNote', note);
        commit('setCurrentNote', note);
        return res;
    },
    async getNotes({ commit }, { notebookId }) {
        let res = await request({ url: url.getNotes.replace(':notebookId', notebookId) });
        commit('setNotes', { notes: res.data });
        return res;
    },
    async deleteNote({ commit }, note) {
        let res = await request({
            url: url.deleteNote.replace(':noteId', note.id),
            method: 'DELETE'
        });
        commit('deleteNote', { noteId:note.id });
        commit('addTrashNote', note);
        commit('setCurrentNote', null);
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
    },
    async getTrashNotes({ commit }) {
        let res = await request({ url: url.getTrashNotes });
        commit('setTrashNotes', { trashNotes: res.data });
        return res;
    },
    async revertNote({ commit }, note) {
        let res = await request({
            url: url.revertNote.replace(':noteId', note.id),
            method: 'PATCH'
        });
        commit('updateTrashNotes', note);
        return res;
    },
    async deleteNoteConfirm({ commit }, note) {
        let res = await request({
            url: url.deleteNoteConfirm.replace(':noteId', note.id),
            method: 'DELETE'
        });
        commit('updateTrashNotes', note);
        return res;
    }
}

export default { state, getters, mutations, actions }