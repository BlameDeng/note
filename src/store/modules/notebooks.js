import url from '@/api/url.js'
import request from '@/helpers/request.js'

const state = {
    currentTab: '',
    allBooks: null,
    currentBook: null
}

const getters = {}

const mutations = {
    setAllBooks(state, payload) {
        state.allBooks = payload.allBooks;
    },
    setCurrentTab(state, payload) {
        state.currentTab = payload;
    },
    setCurrentBook(state, payload) {
        state.currentBook = payload;
    },
    addBook(state, payload) {
        state.allBooks.push(payload);
    },
    deleteBook(state, payload) {
        state.allBooks = state.allBooks.filter((book) => book.id !== payload);
    },
    updateBook(state, payload) {
        state.allBooks.map(book => {
            if (book.id === payload.id) {
                book.title = payload.title;
            }
        })
    }
}

const actions = {
    async getBooks({ commit }) {
        let res = await request({ url: url.getNotebooks });
        commit('setAllBooks', { allBooks: res.data });
        return res;
    },
    async createBook({ commit }, { title }) {
        let res = await request({ url: url.createNotebooks, method: 'POST', data: { title } });
        commit('addBook', res.data);
        commit('setCurrentBook', res.data);
        return res;
    },
    async deleteBook({ commit }, bookId) {
        let res = await request({ url: url.deleteNotebooks.replace(':notebookId', bookId), method: 'DELETE' });
        commit('deleteBook', bookId)
        return res;
    },
    async patchBook({ commit }, { title, bookId }) {
        let res = await request({
            url: url.renameNotebooks.replace(':notebookId', bookId),
            method: 'PATCH',
            data: { title }
        });
        commit('updateBook', { id: bookId, title });
        return res;
    }
}

export default { state, getters, mutations, actions }