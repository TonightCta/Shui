<template>
  <div class="main-page">
      <el-container id="bench" ref="bench">
            <el-header style="text-align: right; font-size: 12px">
              <Header/>
            </el-header>
            <el-main class="main-cont">
                <Leftpart @clickPagedata="clickPageData"/>
                <Rightpart :clickPageData="clickPage"/>
            </el-main>
        </el-container>
  </div>
</template>

<script>
import Navbar from '@/views/layout/Navbar'
import Header from '@/components/common/Header'
import Leftpart from '@/views/layout/leftPart/index'
import Rightpart from '@/views/layout/rightPart/indexTest'
import { mapGetters } from 'vuex'
import Cookie from 'js-cookie'
export default {
  name: 'MainPage',
  components: {
    Navbar,
    Header,
    Leftpart,
    Rightpart
  },
  data () {
    return {
      clickPage: false
    }
  },
  beforeCreate () {
    if (!Cookie.get('bimToken')) {
      this.$router.push('/login')
    }
  },
  mounted () {
    document.getElementById('bench').style.height = document.body.offsetHeight + 'px'
    document.getElementById('mainRight').style.height = (document.body.offsetHeight - 120) + 'px'
    document.getElementById('mapImg').style.height = (document.body.offsetHeight - 120) + 'px'
    document.getElementById('tabPane').style.height = (document.body.offsetHeight - 120) + 'px'
    document.getElementById('dataManage').style.height = (document.body.offsetHeight - 120) + 'px'
    document.getElementById('map').style.width = (document.body.offsetWidth - 280) + 'px'
    document.getElementById('mapImg').style.width = (document.body.offsetWidth - 280 - 300) + 'px'
  },
  computed: {
    ...mapGetters(['username'])
  },
  methods: {
    // 点击页面树节点
    clickPageData () {
      this.clickPage = !this.clickPage
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.main-page{
    width: 100%;
    background-color: #fff;
    overflow: hidden;
    .el-container{
        .el-menu{
            border-right: none;;
        }
    }
    .el-header {
        background-color: #B3C0D1;
        color: #333;
        line-height: 60px;
    }
    .el-aside {
        width: auto !important;
        color: #333;
        background: #fff;
        border-right: 1px solid #B3C0D1;
    }
    .main-cont{
      padding: 0;
      overflow: hidden;
    }
    .dialog1{
      .el-form-item__content{
        width: 300px;
        .el-select{
          width: 100%;
        }
      }
    }
    .el-dialog{
      width: 500px;
      margin-top: 8vh !important;
    }
    .el-tree-node__label{
      font-size: 13px;
    }
    .el-tree-node:focus > .el-tree-node__content {
      background-color: rgb(158, 213, 250) !important;
    }
    .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
      background-color: rgb(158, 213, 250) !important;
    }
}
.data-manage{
  width: 400px;
  // overflow: scroll;
  background: #fff;
  position: absolute;
  top: 121px;
  right: 300px;
  display: none;
  // z-index: 9;
  // border: 1px solid #B3C0D1;
}
</style>
