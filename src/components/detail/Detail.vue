<template>
    <!-- 详情区 -->
    <div class="detail" ref="detail">
        <div class="search">
            <n-icon name="search" class="icon"></n-icon>
            <input type="text" placeholder="搜索...">
        </div>
        <div class="widget">
            <!-- 展示文件夹列表 -->
            <n-scrollbar v-show="currentTab==='books'&&!currentBook" :slider="{background:'#409EFF',opacity:0.3}">
                <div>
                    <div class="book" v-for="book in allBooks" :key="book.id" v-if="allBooks&&allBooks.length" :class="{active:currentBook===book}" @click="onClickBook(book)">
                        <div class="icon-wrapper">
                            <n-icon name="wenjian" class="icon"></n-icon>
                            <span>{{book.title}}</span>
                            <n-icon name="trash" class="icon" @click.stop="onDeleteBook(book)" title="删除文件夹"></n-icon>
                        </div>
                        <span>{{formatDate(book.createdAt)}}</span> 
                    </div>
                </div>
            </n-scrollbar>
            <!-- 展示选中的文件夹中的笔记 -->
            <n-scrollbar v-show="currentTab==='books'&&currentBook" :slider="{background:'#409EFF',opacity:0.3}" ref="noteScrollbar">
                <div>
                    
                    <div class="book" v-for="note in notes" :key="note.id" v-if="notes&&notes.length" :class="{active:currentNote===note}" @click="onClickNote(note)">
                        <div class="icon-wrapper">
                            <n-icon name="note" class="icon"></n-icon>
                            <span>{{note.title}}</span>
                            <n-icon name="trash" class="icon" title="放入回收站" @click.stop="onDeleteNote(note)"></n-icon>
                        </div>
                        <p>{{note.content}}</p>
                        <span>{{formatDate(note.createdAt)}}</span>
                    </div>
                    <div class="no-note" v-if="notes&&notes.length===0">
                        <p>没有找到文件</p>
                        <el-button plain class="el-btn">新建笔记</el-button>
                    </div>
                </div>
            </n-scrollbar>
            <!-- 展示回收站中的笔记 -->
            <div>
                <!-- 批量操作 -->
                <div class="batch" v-show="currentTab==='trash'">
                    <div class="icon-wrapper">
                        <n-icon name="piliang" class="icon"></n-icon>
                        <span @click="batchType=true" v-show="!batchType">批量操作</span>
                        <span @click="batchType=false" v-show="batchType">取消批量选择</span>
                    </div>
                    <div class="option">
                        <span class="info">回收站中的笔记最多可保存30天哦~~</span>
                    </div>
                    <div class="option" v-show="batchType">
                        <span @click="onBatchDelete">批量删除</span>
                        <span @click="onBatchRevert">批量恢复</span>
                        <span @click="selectAll" v-if="batchNotes!==trashNotes">全选</span>
                        <span @click="cancleAll" v-else>取消</span>
                    </div>
                </div>

                <!-- 笔记列表 -->
                <n-scrollbar v-show="currentTab==='trash'" :slider="{background:'#409EFF',opacity:0.3}">
                    <div class="scroll-wrapper">
                        <div class="book" v-for="note in trashNotes" :key="note.id" v-if="trashNotes&&trashNotes.length" 
                        :class="{['batch-type']:batchNotes.indexOf(note)>-1}" @click="onClickTrashNote(note)">
                            <div class="icon-wrapper">
                                <n-icon name="note" class="icon"></n-icon>
                                <span>{{note.title}}</span>
                                <n-icon name="revert" class="icon revert" title="恢复到原文件夹" @click="onRevert(note)"></n-icon>
                                <n-icon name="trash" class="icon" title="彻底删除" @click="onDeleteConfirm(note)"></n-icon>
                            </div>
                            <p>{{note.content}}</p>
                            <span>{{formatDate(note.createdAt)}}</span>
                        </div>
                    </div>
                </n-scrollbar>


            </div>


        </div>
    </div>

</template>
<script src='./Detail.js'></script>

<style lang="scss" scoped src='./Detail.scss'></style>