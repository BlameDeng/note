<template>
    <!-- 导航区 -->
    <div class="nav">
        <div class="add">
            <n-icon name="add" class="icon" @click="addPop = true" style="cursor:pointer;"></n-icon>
            <span @click="addPop = true">新建文档</span>
            <!-- 新建文档弹框 -->
            <div class="add-pop" v-show="addPop">
                <p ref="note" @click="onAddNote">新建笔记</p>
                <p ref="notebook" @click="onAddBook">新建文件夹</p>
            </div>
        </div>
        <div class="recent" :class="{active:currentTab==='recent'}" @click="onClickTab($event,'recent')">
            <n-icon name="new" class="icon"></n-icon>
            <span>最新文档</span>
        </div>
        <div class="books" :class="{active:currentTab==='books'&&!currentBook}" @click="onClickTab($event,'books')">
            <p class="retract-wrapper">
                <n-icon name="sanjiao" class="icon retract" @click.stop="retract=!retract" :class="{active:!retract}" ref="retract"></n-icon>
            </p>
            <n-icon name="wenjianjia" class="icon"></n-icon>
            <span>我的文件夹</span>
        </div>
        <!-- 展示文件夹列表  -->
        <n-scrollbar height="300px" v-show="currentTab==='books'&&!retract">
            <div>
                <div class="book" v-for="(book,index) in allBooks" :key="book.id" :class="{active:book===currentBook}" @click="onClickBook($event,book)" @click.right="onClickBook($event,book)">
                    <template v-if="true">
                        <n-icon name="wenjian" class="icon"></n-icon>
                        <span>{{book.title}}</span>
                        <p @click.stop="onClickBook($event,index,book)" ref="bookTri">
                            <n-icon name="sanjiao" class="icon"></n-icon>
                        </p>
                    </template>
                    <!-- 文件夹重命名框 -->
                    <template v-else>
                        <n-icon name="wenjian" class="icon"></n-icon>
                        <input type="text" v-select>
                    </template>
                </div>
                <!-- 右键点击文件夹弹框 -->
                <div class="book-pop" ref="bookPop" v-show="bookPop">
                    <p ref="addNote" @click="onAddNote">新建笔记</p>
                    <p ref="rename">重命名</p>
                    <p ref="cancle">删除</p>
                </div>
                <!-- 新建文件夹命名框 -->
                <div class="book" v-if="addBook">
                    <n-icon name="wenjian" class="icon"></n-icon>
                    <input type="text" v-select v-model="bookName">
                </div>
            </div>
        </n-scrollbar>
        <div class="trash" :class="{active:currentTab==='trash'}" @click="onClickTab($event,'trash')">
            <n-icon name="trash" class="icon"></n-icon>
            <span>回收站</span>
        </div>
    </div>
</template>
<script src='./Nav.js'></script>

<style lang="scss" scoped src='./Nav.scss'></style>