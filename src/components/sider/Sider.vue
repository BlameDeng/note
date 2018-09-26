<template>
    <div class="sider">
        <div class="nav">
            <div class="add">
                <n-icon name="add" class="icon" @click="showAddPop = true" style="cursor:pointer;"></n-icon>
                <span @click="showAddPop = true">新建文档</span>
                <div class="popover" v-show="showAddPop">
                    <p ref="note" @click="onAddNote">新建笔记</p>
                    <p ref="notebook" @click="onClickAddBook">新建文件夹</p>
                </div>
            </div>
            <div class="recent" :class="{active:selectedTab==='recent'}" @click="onClickTab($event,'recent')">
                <n-icon name="new" class="icon"></n-icon>
                <span>最新文档</span>
            </div>
            <div class="books" :class="{active:selectedTab==='books'}" @click="onClickTab($event,'books')">
                <p @click="retractBooks = !retractBooks" :class="{active:!retractBooks}" ref="booksTri"></p>
                <n-icon name="wenjianjia" class="icon"></n-icon>
                <span>我的文件夹</span>
            </div>
            <div class="book" v-for="(book,index) in allNotebooks" :key="book.id" v-if="allNotebooks&&allNotebooks.length&&!retractBooks" :class="{active:selectedBook&&book.id===selectedBook.id}" @click="onClickBook($event,index,book)" @click.right="onClickBook($event,index,book)">
                <template v-if="book!==renameBook">
                    <n-icon name="wenjian" class="icon"></n-icon>
                    <span>{{book.title}}</span>
                    <p @click.stop="onClickBook($event,index,book)" ref="bookTri"></p>
                    <div class="book-pop" :ref="`bookPop${index}`" v-show="showBookPop&&selectedBook.id===book.id">
                        <p ref="addNote" @click="onAddNote">新建笔记</p>
                        <p ref="rename" @click="onClickRenameBook(book)">重命名</p>
                        <p ref="cancle" @click="onClickDeleteBook(book)">删除</p>
                    </div>
                </template>
                <template v-else>
                    <n-icon name="wenjian" class="icon"></n-icon>
                    <input type="text" v-model="newBookTitle" v-select @blur="onRenameBook(book)">
                </template>
            </div>
            <div class="book" v-if="showNewBook">
                <n-icon name="wenjian" class="icon"></n-icon>
                <input type="text" v-model="newName" @blur="onAddNotebook" v-select>
            </div>
            <div class="trash" :class="{active:selectedTab==='trash'}" @click="onClickTab($event,'trash')">
                <n-icon name="trash" class="icon"></n-icon>
                <span>回收站</span>
                <p></p>
            </div>
        </div>
        <div class="detail">
            <div class="search">
                <n-icon name="search" class="icon"></n-icon>
                <input type="text" placeholder="搜索...">
            </div>
            <div class="widget">
                <template v-if="selectedTab==='books'">
                    <div class="book" v-for="(book,index) in allNotebooks" :key="index" v-if="allNotebooks&&allNotebooks.length" @click="onClickBook($event, index, book)">
                        <div class="icon-wrapper">
                            <n-icon name="wenjian" class="icon"></n-icon>
                            <span>{{book.title}}</span>
                            <n-icon name="trash" class="icon" @click="onClickDeleteBook(book)"></n-icon>
                        </div>
                        <span>{{formatDate(book.createdAt)}}</span>
                    </div>
                </template>
                <template v-if="selectedBook">
                    <div class="book" v-for="(note,index) in notes" :key="index" v-if="notes&&notes.length" @click="onClickNote(note)" :class="{active:currentNote&&currentNote.id===note.id}">
                        <div class="icon-wrapper">
                            <n-icon name="note" class="icon"></n-icon>
                            <span>{{note.title}}</span>
                            <n-icon name="trash" class="icon" @click="onDeleteNote(note)"></n-icon>
                        </div>
                        <p>{{note.content}}</p>
                        <span>{{formatDate(note.createdAt)}}</span>
                    </div>
                </template>
                <template v-else-if="selectedTab==='trash'">
                    <div class="batch" v-if="trashNotes&&trashNotes.length">
                        <div class="icon-wrapper">
                            <n-icon name="piliang" class="icon"></n-icon>
                            <span v-show="!batchType" @click="batchType=true">批量操作</span>
                            <span v-show="batchType" @click="batchType=false">取消批量选择</span>
                        </div>
                        <div class="option" v-show="batchType">
                            <span @click="onBatchDelete">批量删除</span>
                            <span @click="onBatchRevert">批量恢复</span>
                            <span @click="selectAll" v-show="showAllSelect">全选</span>
                            <span @click="selectNone" v-show="!showAllSelect">取消</span>
                        </div>
                    </div>
                    <div class="book" v-for="(note,index) in trashNotes" :key="index" v-if="trashNotes&&trashNotes.length" @click="onClickNote(note)" :class="{['batch-type']:batchArr.indexOf(note)>-1}">
                        <div class="icon-wrapper">
                            <n-icon name="note" class="icon"></n-icon>
                            <span>{{note.title}}</span>
                            <n-icon name="revert" class="icon revert" @click="onRevertNote(note)" title="恢复到原文件夹"></n-icon>
                            <n-icon name="trash" class="icon" @click="onDeleteConfirm(note)"></n-icon>
                        </div>
                        <p>{{note.content}}</p>
                        <span>{{formatDate(note.createdAt)}}</span>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>
<script src='./Sider.js'></script>

<style lang="scss" scoped src='./Sider.scss'></style>