<template>
    <div class="detail-bar" style="overflow:hidden;">
        <!-- 详情区 -->
        <div class="detail" ref="detail">
            <div class="search">
                <n-icon name="search" class="icon"></n-icon>
                <input type="text" placeholder="搜索...">
            </div>
            <div class="widget">
                <!-- 展示文件夹列表 -->
                <n-scrollbar v-show="selectedTab==='books'" :slider="{background:'#409EFF',opacity:0.3}">
                    <div v-show="selectedTab==='books'">
                        <div class="book" v-for="(book,index) in allNotebooks" :key="`bookwidget${book.id}`" v-if="allNotebooks&&allNotebooks.length" @click="onClickBook($event, index, book)">
                            <div class="icon-wrapper">
                                <n-icon name="wenjian" class="icon"></n-icon>
                                <span>{{book.title}}</span>
                                <n-icon name="trash" class="icon" @click="onClickDeleteBook(book)"></n-icon>
                            </div>
                            <span>{{formatDate(book.createdAt)}}</span>
                        </div>
                    </div>
                </n-scrollbar>
                <!-- 展示选中的文件夹中的笔记 -->
                <n-scrollbar v-if="selectedBook" :slider="{background:'#409EFF',opacity:0.3}">
                    <div v-if="selectedBook" :key="selectedBook.id">
                        <div class="book" v-for="note in notes" :key="`selectnote${note.id}`" v-if="notes&&notes.length" @click="onClickNote(note)" :class="{active:currentNote&&currentNote.id===note.id}">
                            <div class="icon-wrapper">
                                <n-icon name="note" class="icon"></n-icon>
                                <span>{{note.title}}</span>
                                <n-icon name="trash" class="icon" @click="onDeleteNote(note)"></n-icon>
                            </div>
                            <p>{{note.content}}</p>
                            <span>{{formatDate(note.createdAt)}}</span>
                        </div>
                        <div class="no-note" v-if="notes&&notes.length===0&&selectedBook">
                            <p>没有找到文件</p>
                            <el-button plain class="el-btn" @click="onAddNote">新建笔记</el-button>
                        </div>
                    </div>
                </n-scrollbar>
                <!-- 展示回收站中的笔记 -->
                <div v-show="selectedTab==='trash'">
                    <!-- 批量操作 -->
                    <div class="batch" v-if="trashNotes&&trashNotes.length">
                        <div class="icon-wrapper">
                            <n-icon name="piliang" class="icon"></n-icon>
                            <span v-show="!batchType" @click="batchType=true">批量操作</span>
                            <span v-show="batchType" @click="batchType=false">取消批量选择</span>
                        </div>
                        <div class="option" v-show="!batchType">
                            <span class="info">回收站中的笔记最多可保存30天哦~~</span>
                        </div>
                        <div class="option" v-show="batchType">
                            <span @click="onBatchDelete">批量删除</span>
                            <span @click="onBatchRevert">批量恢复</span>
                            <span @click="selectAll" v-show="showAllSelect">全选</span>
                            <span @click="selectNone" v-show="!showAllSelect">取消</span>
                        </div>
                    </div>
                    <!-- 笔记列表 -->
                    <n-scrollbar :slider="{background:'#409EFF',opacity:0.3}">
                        <div class="scroll-wrapper">
                            <div class="book" v-for="note in trashNotes" :key="`trashnote${note.id}`" v-if="trashNotes&&trashNotes.length" @click="onClickNote(note)" :class="{['batch-type']:batchArr.indexOf(note)>-1}">
                                <div class="icon-wrapper">
                                    <n-icon name="note" class="icon"></n-icon>
                                    <span>{{note.title}}</span>
                                    <n-icon name="revert" class="icon revert" @click="onRevertNote(note)" title="恢复到原文件夹"></n-icon>
                                    <n-icon name="trash" class="icon" @click="onDeleteConfirm(note)"></n-icon>
                                </div>
                                <p>{{note.content}}</p>
                                <span>{{formatDate(note.createdAt)}}</span>
                            </div>
                        </div>
                    </n-scrollbar>
                </div>
            </div>
        </div>
    </div>
</template>
<script src='./Detail.js'></script>

<style lang="scss" scoped src='./Detail.scss'></style>