const url = {
    register: '/auth/register',
    checkLogin: '/auth',
    logout: '/auth/logout',
    login: '/auth/login',
    getNotebooks: '/notebooks',
    createNotebooks: '/notebooks',
    modifyNotebooks: '/notebooks/:notebookId',
    deleteNotebooks: '/notebooks/:notebookId',
    createNote: '/notes/to/:notebookId',
    getNote: '/notes/from/:notebookId',
    deleteNote: '/notes/:noteId',
    modifyNote: '/notes/:noteId',
    deleteNoteConfirm: '/notes/:noteId/confirm',
    revertNote: '/notes/:noteId/revert',
    getTrashNote: '/notes/trash'
}
export default url