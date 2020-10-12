<template>
  <div>
    <el-header style="text-align: right; font-size: 12px">
      <Header/>
    </el-header>
    <el-tabs class="pro-list" v-model="activeName" type="border-card" @tab-click="handleClick">
        <el-tab-pane label="项目管理" name="first">
            <div class="operation-head">
                <el-input
                    class="search-input"
                    placeholder="请输入搜索内容"
                    prefix-icon="el-icon-search"
                    v-model="searchCont"
                    @input="searchKeyup">
                </el-input>
                <!-- <el-select v-model="searchCont" filterable placeholder="请输入搜索关键词">
                    <el-option
                    v-for="(item, index) in items"
                    :key="index"
                    :label="item.name"
                    :value="item.name">
                    </el-option>
                </el-select> -->
                <el-button type="primary" @click="addDialog">新增项目</el-button>
            </div>
            <div class="list-body">
                <ul>
                    <!-- <li v-for="(item, index) in items"> -->
                    <li v-for="(item, index) in items" :key="index">
                        <div @click="goToWorkbench(item)" @mouseenter="showOperation($event)" @mouseleave="hideOperation">
                            <el-card shadow="hover" class="pro">
                                <div class="img">
                                <img class="img1" src="@/assets/test.jpeg"/>
                                </div>
                                <p>{{ item.name }}</p>
                                <div class="operation" id="operation1">
                                    <!-- <el-button class="btn">项目管理</el-button> -->
                                    <el-button size="small" class="btn1" type="primary" round>项目管理</el-button>
                                    <el-button @click.stop="deleteProj(item.id)" size="mini" class="btn2" type="danger" icon="el-icon-delete" circle></el-button>
                                    <el-button @click.stop="showEditPro(item.id, item.name)" size="mini" class="btn2" type="primary" icon="el-icon-edit" circle></el-button>
                                </div>
                            </el-card>
                        </div>
                    </li>
                </ul>
            </div>
        </el-tab-pane>
        <el-tab-pane label="场景管理" name="second">建设中......</el-tab-pane>
    </el-tabs>
    <!-- 新增弹窗 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="400px">
        <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="项目名称:">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="closeDialog">取 消</el-button>
            <el-button v-if="dialogTitle === '创建新项目'" type="primary" @click="addProject">提 交</el-button>
            <el-button v-else type="primary" @click="editPro">提 交</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import Header from '@/components/common/Header'
import { mapGetters } from 'vuex'
import store from '@/store'
import Cookie from 'js-cookie'
export default {
  name: 'Button',
  components: {
    Header
  },
  data () {
    return {
      activeName: 'first',
      items: [],
      dialogVisible: false,
      form: {
        id: '',
        name: ''
      },
      dialogTitle: '创建新项目',
      searchCont: ''
    }
  },
  beforeCreate () {
    if (!Cookie.get('bimToken')) {
      this.$router.push('/login')
    }
  },
  created () {
    if (this.$route.query.token) {
      // console.log(this.$route.query.token)
      let token = this.$route.query.token
      store.dispatch('SetToken', token)
      store.dispatch('GetUserInfo', token)
      store.dispatch('FindAll', token).then(res => {
        this.items = res.data.obj
      })
    } else {
      store.dispatch('FindAll', this.token).then(res => {
        this.items = res.data.obj
      })
    }
  },
  computed: {
    ...mapGetters(['token'])
  },
  methods: {
    handleClick (tab, event) {
      console.log(tab, event)
    },
    showOperation (e) {
    //   console.log(e.currentTarget.firstElementChild.lastElementChild)
      e.currentTarget.firstElementChild.lastElementChild.lastElementChild.style.display = 'block'
    },
    hideOperation (e) {
      e.currentTarget.firstElementChild.lastElementChild.lastElementChild.style.display = 'none'
    },
    addDialog () { // 点击新增项目
      this.dialogTitle = '创建新项目'
      this.form.name = ''
      this.dialogVisible = true
    },
    // 新增应用
    addProject () {
      this.dialogVisible = false
      store.dispatch('AddApply', {token: this.token, name: this.form.name}).then(res => {
        store.dispatch('FindAll', this.token).then(res2 => {
          this.items = res2.data.obj
        })
      })
      this.form = {id: '', name: ''}
      // const obj = {
      //   name: this.form.name
      // }
      // $.ajax({url: 'http://192.168.199.111:8080/sx_bim/bimApply/addApply',
      //   data: qs.stringify(obj),
      //   dataType: 'json',
      //   type: 'post',
      //   headers: {'bimToken': this.token},
      //   success: function (result) {
      //     store.dispatch('FindAll', this.token).then(res2 => {
      //       this.items = res2.data.obj
      //     })
      //     this.form = {}
      //   }})
    },
    // 删除应用
    delProject (id) {
      this.dialogVisible = false
      store.dispatch('DelApply', {token: this.token, id: id}).then(res => {
        store.dispatch('FindAll', this.token).then(res2 => {
          this.items = res2.data.obj
        })
      })
    },
    goToWorkbench (item) { // 跳转到工作台
      store.dispatch('SetCurrentApply', item).then(res => {
      })
      this.$router.push('/workbench')
    },
    // 弹出编辑项目
    showEditPro (id, name) {
      this.dialogTitle = '编辑项目'
      this.form.id = id
      this.form.name = name
      this.dialogVisible = true
    },
    // 弹出编辑项目
    editPro (id, name) {
      store.dispatch('EditApply', {token: this.token, id: this.form.id, name: this.form.name}).then(res => {
        store.dispatch('FindAll', this.token).then(res2 => {
          this.items = res2.data.obj
        })
      })
      this.dialogVisible = false
    },
    // 关闭弹窗
    closeDialog () {
      this.dialogVisible = false
      this.form.name = ''
      this.dialogTitle = ''
    },
    // 删除项目
    deleteProj (id) {
      this.$confirm('确认删除？')
        .then(_ => {
          this.delProject(id)
          // let [...arr] = this.items
          // arr.splice(index, 1)
          // this.items = arr
        })
    },
    // 搜索功能
    searchKeyup (value) {
      store.dispatch('FindApplyByName', {token: this.token, name: value}).then(res => {
        this.items = res.obj
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.pro-list{
    border: none !important;
    box-shadow: none !important;
    .operation-head{
        max-width: 1200px;
        min-width: 1000px;
        width: 80%;
        text-align: right;
        margin: 0 auto;
        .search-input{
            width: 200px;
        }
    }
    .el-tabs__item{
        height: 60px;
        line-height: 60px;
    }
    .list-body{
        max-width: 1200px;
        min-width: 1000px;
        width: 80%;
        margin: 0 auto;
        ul{
            list-style:none;
            display: flex;
            width: 100%;
            align-content:space-around;
            align-items:center;
            flex-flow:row wrap;
            box-sizing: border-box;
            padding-left: 0;
            justify-content: flex-start;
            align-content:flex-start;
            li{
                margin: 10px;
                width: 18%;
                margin-left: 1%;
                margin-right: 1%;
            }
        }
    }
    .el-row--flex{
        margin-bottom: 20px;
    }
    .pro{
        position: relative;
        .el-card__body{
            .img{
            .img1{
                    width: 50%;
                    margin: 0 auto;
                }
            }
            .operation{
                width: 100%;
                height: 40px;
                position: absolute;
                bottom: 0;
                left: 0;
                background-color : rgba(0,0,0,0.2);
                display: none;
                .btn1{
                    float: left;
                    left: 10px;
                    position: relative;
                    top: 4px;
                }
                .btn2{
                    float: right;
                    right: 10px;
                    position: relative;
                    top: 5px;
                }
            }
        }
    }
}
</style>
