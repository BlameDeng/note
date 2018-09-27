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
        state.currentBook = payload.book;
    },
    addBook(state, payload) {
        state.allBooks.push(payload.book);
    },
    filterBook(state, payload) {
        state.allBooks = state.allBooks.filter((book) => book.id !== payload.id);
    },
    updateBook(state, payload) {
        state.allBooks.map(book => {
            if (book.id === payload.book.id) {
                book.title = payload.book.title;
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
        commit('addBook', { book: res.data });
        return res;
    },
    async deleteBook({ commit }, { bookId }) {
        let res = await request({ url: url.deleteNotebooks.replace(':notebookId', bookId), method: 'DELETE' });
        return res;
    },
    async renameBook({ commit }, { title, bookId }) {
        let res = await request({
            url: url.renameBook.replace(':notebookId', bookId),
            method: 'PATCH',
            data: { title }
        });
        return res;
    }
}

export default { state, getters, mutations, actions }