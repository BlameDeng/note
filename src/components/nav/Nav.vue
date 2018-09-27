<template>
    <!-- 导航区 -->
    <div class="nav">
        <div class="add">
            <n-icon name="add" class="icon" @click="showAddPop = true" style="cursor:pointer;"></n-icon>
            <span @click="showAddPop = true">新建文档</span>
            <!-- 新建文档弹框 -->
            <div class="add-pop" v-show="showAddPop">
                <p ref="note" @click="onAddNote">新建笔记</p>
                <p ref="notebook" @click="onAddBook">新建文件夹</p>
            </div>
        </div>
        <div class="recent" :class="{active:selectedTab==='recent'}" @click="onClickTab($event,'recent')">
            <n-icon name="new" class="icon"></n-icon>
            <span>最新文档</span>
        </div>



        <!-- <div class="books" :class="{active:selectedTab==='books'}" @click="onClickTab($event,'books')">
            <p @click="retractBooks = !retractBooks" :class="{active:!retractBooks}" ref="booksTri"></p>
            <n-icon name="wenjianjia" class="icon"></n-icon>
            <span>我的文件夹</span>
        </div> -->




        <!-- 展示文件夹列表 
        <n-scrollbar height="400px" v-if="allNotebooks&&allNotebooks.length&&!retractBooks">
            <div>
                <div class="book" v-for="(book,index) in allNotebooks" :key="`book${book.id}`" :class="{active:selectedBook&&book.id===selectedBook.id}" @click="onClickBook($event,index,book)" @click.right="onClickBook($event,index,book)">
                    <template v-if="book!==renameBook">
                        <n-icon name="wenjian" class="icon"></n-icon>
                        <span>{{book.title}}</span>
                        <p @click.stop="onClickBook($event,index,book)" ref="bookTri"></p>
                         文件夹弹框
                        <div class="book-pop" :ref="`bookPop${index}`" v-show="showBookPop&&selectedBook.id===book.id">
                            <p ref="addNote" @click="onAddNote">新建笔记</p>
                            <p ref="rename" @click="onClickRenameBook(book)">重命名</p>
                            <p ref="cancle" @click="onClickDeleteBook(book)">删除</p>
                        </div>
                    </template>
                    文件夹重命名框
                    <template v-else>
                        <n-icon name="wenjian" class="icon"></n-icon>
                        <input type="text" v-model="newBookTitle" v-select @blur="onRenameBook(book)">
                    </template>
                </div>
            </div>
        </n-scrollbar>
         新建文件夹命名框
        <div class="book" v-if="showNewBook">
            <n-icon name="wenjian" class="icon"></n-icon>
            <input type="text" v-model="newName" @blur="onAddNotebook" v-select>
        </div>
        <div class="trash" :class="{active:selectedTab==='trash'}" @click="onClickTab($event,'trash')">
            <n-icon name="trash" class="icon"></n-icon>
            <span>回收站</span>
            <p></p>
        </div> -->
    </div>
</template>
<script src='./Nav.js'></script>

<style lang="scss" scoped src='./Nav.scss'></style>