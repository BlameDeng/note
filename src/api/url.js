const url = {
    register: '/auth/register',
    checkLogin: '/auth',
    logout: '/auth/logout',
    login: '/auth/login',
    getNotebooks: '/notebooks',
    createNotebooks: '/notebooks',
    renameNotebooks: '/notebooks/:notebookId',
    deleteNotebooks: '/notebooks/:notebookId',
    createNote: '/notes/to/:notebookId',
    getNotes: '/notes/from/:notebookId',
    deleteNote: '/notes/:noteId',
    patchNote: '/notes/:noteId',
    deleteNoteConfirm: '/notes/:noteId/confirm',
    revertNote: '/notes/:noteId/revert',
    getTrashNotes: '/notes/trash'
}
export default url