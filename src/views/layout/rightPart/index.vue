<template>
  <div class="map" id="map">
    <div class="navbar">
    <el-row>
        <el-col :span="8">
        <span class="span1"><span>当前页面：</span>{{pageName}}</span>
        </el-col>
        <el-col :span="10">
        <el-radio-group v-model="radio2" class="radios">
            <el-radio-button label="页面设计"></el-radio-button>
            <el-radio-button label="数据权限"></el-radio-button>
        </el-radio-group>
        </el-col>
        <el-col :span="6" class="btns">
        <el-button>预览</el-button>
        </el-col>
    </el-row>
    </div>
    <div class="map-img" id="mapImg">
        <p v-if="pageId === ''">请点击页面获取地图</p>
        <img v-else src="@/assets/map.jpg"/>
      <!-- <iframe v-else :src="iframUrl" frameborder="0"></iframe> -->
    </div>
    <div class="main-right" id="mainRight">
      <div class="top" id="tabPane">
        <el-tabs v-model="activeName" @tab-click="handleClick" stretch v-if="pageId != ''">
          <el-tab-pane label="基础设置" name="first">
              <!-- <el-button>编辑组件</el-button> -->
              <div class="map-seting">
                <p>底图设置</p>
                <el-form ref="mapsetForm" :model="mapsetForm" label-width="80px">
                    <el-form-item label="页面名称:">
                    <el-input disabled v-model="mapsetForm.name" placeholder="请输入页面名称"></el-input>
                    </el-form-item>
                    <el-form-item label="背景地图:" class="el-form-item1">
                    <el-radio-group v-model="mapsetForm.map_type" @change="val => mapTypeChange(val, 'change')" size="mini">
                        <el-radio-button
                         v-for="item in mapTypeList"
                         :key="item.id"
                         :label="item.id">
                         {{item.name}}
                         </el-radio-button>
                    </el-radio-group>
                    </el-form-item>
                    <el-form-item label="">
                    <el-select v-model="mapsetForm.map_url" placeholder="请选择地图类型设置">
                        <el-option
                          v-for="item in mapTypeConfigList"
                         :label="item.name"
                         :value="item.map_url"
                         :key="item.map_url">
                         </el-option>
                    </el-select>
                    </el-form-item>
                    <el-form-item label="美化滤镜">
                      <colorPicker v-model="mapsetForm.map_color" @change="handleChangeColor"/>
                    </el-form-item>
                    <el-form-item label="雾效大气:">
                    <el-switch inactive-text="雾效" v-model="mapsetForm.map_wx"></el-switch>
                    <el-switch class="el-switch2" inactive-text="大气" v-model="mapsetForm.map_dq"></el-switch>
                    </el-form-item>
                      <p>视角设置</p>
                    <el-form-item label="经度:">
                      <el-input v-model="mapsetForm.map_longitude"></el-input>
                    </el-form-item>
                    <el-form-item label="纬度:">
                      <el-input v-model="mapsetForm.map_latitude"></el-input>
                    </el-form-item>
                    <el-form-item label="高度:">
                      <el-input v-model="mapsetForm.map_highly"></el-input>
                    </el-form-item>
                    <el-form-item label="俯仰角度:" >
                      <el-input v-model="mapsetForm.map_maxPitch"></el-input>
                    </el-form-item>
                    <el-form-item label="飞入时间:">
                      <el-input v-model="mapsetForm.map_time"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialogfooter">
                <el-button class="mapset" type="primary" @click="submit">保  存</el-button>
                </div>
              </div>
          </el-tab-pane>
          <el-tab-pane label="数据管理" name="second">
              <div class="cont">
                <div class="top">
                    <span>数据管理</span>
                    <div class="add">
                    <!-- <i class="el-icon-search" style="margin-right: 15px"></i> -->
                    <el-tooltip class="item" effect="dark" content="添加数据" placement="top">
                        <i class="el-icon-document-add" style="margin-right: 15px" @click="adddatas = true"></i>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="添加分类" placement="top">
                        <i class="el-icon-folder-add" style="margin-right: 15px" @click="showAddClassify"></i>
                    </el-tooltip>
                    </div>
                </div>
                <div class="data">
                    <el-tree
                    :data="dataConfigTree"
                    :props="treeprop"
                    node-key="id"
                    highlight-current
                    ref="dataConfigTree"
                    default-expand-all
                    :expand-on-click-node="false"
                    @node-click="clickNode"
                    @node-drag-start="handleDragStart"
                    @node-drag-enter="handleDragEnter"
                    @node-drag-leave="handleDragLeave"
                    @node-drag-over="handleDragOver"
                    @node-drag-end="handleDragEnd"
                    @node-drop="handleDrop"
                    draggable
                    :allow-drop="allowDrop"
                    :allow-drag="allowDrag">
                    <span class="custom-tree-node" slot-scope="{ node }">
                      <i v-if="node.data.attributes.type === 'classify'" class="el-icon-folder-opened" :style="{color: '#e6ca3c'}"></i>
                      <span>{{ node.label }}</span>
                      <span class="edit">
                        <i class="el-icon-edit" @click.stop="editConfig(node.data)"></i>
                      </span>
                      <span class="delete">
                        <i class="el-icon-delete" @click.stop="delData(node.data)"></i>
                      </span>
                    </span>
                    </el-tree>
                </div>
              </div>
          </el-tab-pane>
        </el-tabs>
        <p v-else>暂无数据</p>
        <!-- 数据管理 自定义弹窗 -->
        <div class="data-manage" id="dataManage">
        <DataManage @closeDataManage="closeDataManage" :dataActiveName="dataActiveName" :visible="dataManageVisible"/>
        </div>
      </div>
    </div>
    <!-- <AddCategory :visible="addCate" @closeDialog="addCate = false"/> -->
    <AddCategory :visible="addCate" @closeDialog="addCate = false" :type="classifyType"
    @updateClassify="findMapDataConfigTree(pageId)" :id="classifyId" :title="classifyTitle"
    :classifyName="classifyName"/>
    <AddData :visible="adddatas" @closeDialog="adddatas = false"
    @updateClassify="findMapDataConfigTree(pageId)"/>
    <Dialog/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import DataManage from './DataManage'
import AddCategory from '../leftPart/AddCategory'
import AddData from './AddData'
import { findMapDataConfigTree, delClassify, updateClassifyParentId, findBimMapType, findBimMapTypeConfig,
  findOneByApplyPageId, addMapBase, editMapBase, updateConfigClassifyId, delMapDataCofig } from '@/api/applySouce'
import Dialog from '@/components/common/Dialog'
import store from '@/store'
export default {
  name: 'Rightpart',
  components: {
    DataManage,
    AddCategory,
    AddData,
    Dialog
  },
  data () {
    return {
      iframUrl: '',
      radio2: '页面设计',
      dataManageVisible: false, // 是否显示DataManage组件
      addCate: false, // 新增分类
      adddatas: false, // 新增数据
      classifyTitle: '新增分类', // 分类标题
      classifyId: '',
      classifyType: 'dataConfig',
      classifyName: '',
      mapTypeList: [], // 地图类型列表
      mapTypeConfigList: [], // 地图类型配置列表
      treeprop: {
        label: 'text'
      },
      dataConfigTree: [], // 数据源tree
      isAddMap: true, // 是否新增设置
      activeName: 'first',
      dataActiveName: 'first', // 判断是数据编辑的话，dataManage控件会优先显示数据，而非样式
      mapsetForm: {
        apply_page_id: '',
        name: '',
        map_type: '1',
        map_url: '',
        map_color: '',
        map_wx: false,
        map_dq: false,
        map_longitude: '',
        map_latitude: '',
        map_highly: '',
        map_maxPitch: '', // 不能超过90度
        map_time: ''
      }
    }
  },
  computed: {
    ...mapGetters(['token', 'bimapplyId', 'pageId', 'pageName'])
  },
  watch: {
    pageId (v) {
      this.findMapDataConfigTree(v)
      this.findOneByApplyPageId(v)
      this.mapsetForm.apply_page_id = v
      this.iframUrl = 'http://www.thingjs.com/s/3fdf42fa2886662ff533cb8d?params=105b0f77fd24654d4eebc434e9&apply_page_id=' + this.pageId + '&bq=http://nj.water-mind.com:8203/sx_bim'
    },
    pageName (v) {
      this.mapsetForm.name = v
    }
  },
  created () {
    this.findBimMapType()
  },
  updated () {
    // console.log('pageId', this.pageId)
  },
  methods: {
    handleDragStart (node, ev) {
      console.log('drag start', node)
    },
    handleDragEnter (draggingNode, dropNode, ev) {
      console.log('tree drag enter: ', dropNode.label)
    },
    handleDragLeave (draggingNode, dropNode, ev) {
      console.log('tree drag leave: ', dropNode.label)
    },
    handleDragOver (draggingNode, dropNode, ev) {
      console.log('tree drag over: ', dropNode.label)
    },
    handleDragEnd (draggingNode, dropNode, dropType, ev) {
      console.log('tree drag end: ', draggingNode, dropNode, dropType)
      if (draggingNode.data.attributes.type === 'classify') {
        let parentId = ''
        if (dropType === 'inner') {
          parentId = dropNode.data.id
        } else {
          if (dropNode.data.parent !== null) {
            parentId = dropNode.data.attributes.parent_id
          }
        }
        updateClassifyParentId(this.token, {id: draggingNode.data.id, parent_id: parentId}).then(res => {
          if (res.data.success) {
            // alert('分类拖拽成功')
          }
        }).catch(er => {
          console.log(er)
        })
      } else if (draggingNode.data.attributes.type === 'dataConfig') {
        updateConfigClassifyId(this.token,
          {id: draggingNode.data.id, classify_id: dropNode.data.attributes.id}).then(res => {
          if (res.data.success) {
            // alert('数据拖拽成功')
          }
        }).catch(er => {
          console.log(er)
        })
      // 如果是分类拖拽
      }
    },
    handleDrop (draggingNode, dropNode, dropType, ev) {
      console.log('tree drop: ', dropNode.label, dropType)
    },
    allowDrop (draggingNode, dropNode, type) {
      if (dropNode.data.attributes.type === 'dataConfig') {
        return false
      }
      return true
    },
    allowDrag (draggingNode) {
      return true
    },
    handleClick (tab, event) {
      // console.log(tab, event)
      this.closeDataManage()
    },
    closeDataManage () { // 关闭数据管理编辑
      this.dataManageVisible = false
      document.getElementById('dataManage').style.display = 'none'
      this.dataActiveName = 'first'
    },
    // 点击节点
    clickNode (node) {
      this.$refs.dataConfigTree.setCurrentKey(node.id)
      this.openDataManage(node)
    },
    // 打开数据管理编辑
    openDataManage (node) {
      if (node.attributes.type === 'dataConfig') {
        this.dataManageVisible = true
        store.commit('SET_DATACONFIGID', node.id)
        store.commit('SET_DATACONFIGNAME', node.text)
        store.commit('SET_DATATYPE', node.attributes.data_type)
        document.getElementById('dataManage').style.display = 'block'
        this.dataActiveName = 'first'
      }
    },
    // 获取树形结构数据
    findMapDataConfigTree (v) {
      findMapDataConfigTree(this.token, this.bimapplyId, this.classifyType, v).then(res => {
        // console.log('数据： ' + res.data)
        this.dataConfigTree = res.data
      }).catch(er => {
        console.log(er)
      })
    },
    // 获取基础设置数据
    findOneByApplyPageId (v) {
      findOneByApplyPageId(this.token, v).then(res => {
        // console.log('基础设置： ' + res.data.obj.map_wx)
        if (res.data.success) {
          this.mapsetForm = res.data.obj
          if (res.data.obj.map_color === null) {
            this.mapsetForm.map_color = ''
          }
          this.mapsetForm.map_wx = res.data.obj.map_wx !== 'false'
          this.mapsetForm.map_dq = res.data.obj.map_dq !== 'false'
          this.isAddMap = false
          this.mapTypeChange(this.mapsetForm.map_type, 'get')
        }
      }).catch(er => {
        console.log(er)
      })
    },
    // 显示 新增分类
    showAddClassify () {
      this.addCate = true
      this.classifyTitle = '新增分类'
    },
    // 拾色器获取颜色
    handleChangeColor (val) {
      this.mapsetForm.color = val
    },
    // 显示编辑
    editConfig (obj) {
      if (obj.attributes.type === 'classify') {
        this.classifyName = obj.text
        this.classifyTitle = '编辑分类'
        this.addCate = true
        this.classifyId = obj.id
        this.classifyType = obj.attributes.classify_type
      }
      if (obj.attributes.type === 'dataConfig') {
        this.openDataManage(obj)
        this.dataActiveName = 'third'
      }
    },
    // 删除数据源,页面及分类
    delData (obj) {
      if (obj.attributes.type === 'classify') {
        if (obj.children.length === 0) {
          this.$confirm('确认删除？')
            .then(_ => {
              delClassify(this.token, obj.id).then(res => {
                if (res.data.success) {
                  store.dispatch('OpenTipsDialog', '删除分类文件夹成功')
                  this.findMapDataConfigTree(this.pageId)
                }
              })
            })
        } else {
          store.dispatch('OpenTipsDialog', '该分类下有数据源，不能删除')
        }
      } else if (obj.attributes.type === 'dataConfig') {
        this.$confirm('确认删除？')
          .then(_ => {
            delMapDataCofig(this.token, obj.id).then(res => {
              if (res.data.success) {
                store.dispatch('OpenTipsDialog', '删除数据成功')
                this.findMapDataConfigTree(this.pageId)
              }
            })
          })
      }
    },
    // 查询地图类型
    findBimMapType () {
      findBimMapType(this.token).then(res => {
        if (res.data.success) {
          this.mapTypeList = res.data.obj
        } else {
          store.dispatch('OpenTipsDialog', res.data.obj.message)
        }
        // console.log('地图类型：' + this.mapTypeList[0].name)
      }).catch(er => {
        console.log(er)
      })
    },
    // 切换地图类型
    mapTypeChange (val, way) {
      if (way === 'change') {
        this.mapsetForm.map_url = '' // 切换地图类型的时候先清空设置
      }
      findBimMapTypeConfig(this.token, val).then(res => {
        if (res.data.success) {
          this.mapTypeConfigList = res.data.obj
        }
      }).catch(er => {
        console.log(er)
      })
    },
    // 保存基础设置
    submit () {
      if (this.mapsetForm.map_maxPitch && this.mapsetForm.map_maxPitch > 90) {
        store.dispatch('OpenTipsDialog', '俯仰角度不可超过90')
        return
      }
      if (this.isAddMap) {
        // if (this.validateForm(this.mapsetForm)) {
        //   return
        // }
        // 新增
        addMapBase(this.token, this.mapsetForm).then(res => {
          if (res.data.success) {
            store.dispatch('OpenTipsDialog', res.data.msg)
            // 这个时候如果立即要编辑，就必须获取刚刚新增的数据赋值给this.mapsetForm，并且将this.isAddMap设置为false
            // af33cbb59c524142bdc4f69e54a12835
            findOneByApplyPageId(this.token, this.pageId).then(res2 => {
              this.mapsetForm = res2.data.obj
              this.mapsetForm.map_wx = Boolean(res2.data.obj.map_wx)
              this.mapsetForm.map_dq = Boolean(res2.data.obj.map_dq)
              this.isAddMap = false
            })
          }
        }).catch(er => {
          console.log(er)
        })
      } else {
        // 编辑
        let obj = {
          id: this.mapsetForm.id,
          apply_page_id: this.mapsetForm.apply_page_id,
          name: this.mapsetForm.name,
          map_type: this.mapsetForm.map_type,
          map_url: this.mapsetForm.map_url,
          map_color: this.mapsetForm.map_color,
          map_wx: this.mapsetForm.map_wx,
          map_dq: this.mapsetForm.map_dq,
          map_longitude: this.mapsetForm.map_longitude,
          map_latitude: this.mapsetForm.map_latitude,
          map_highly: this.mapsetForm.map_highly,
          map_maxPitch: this.mapsetForm.map_maxPitch,
          map_time: this.mapsetForm.map_time
        }
        // if (this.validateForm(obj)) {
        //   return
        // }
        editMapBase(this.token, obj).then(res => {
          if (res.data.success) {
            store.dispatch('OpenTipsDialog', res.data.msg)
          }
        }).catch(er => {
          console.log(er)
        })
      }
    },
    // 提交表单之前的验证提示
    validateForm (obj) {
      Object.keys(obj).forEach(key => {
        if (obj[key] === '') {
          store.dispatch('OpenTipsDialog', '请将表单填写完整再提交')
          return false
        }
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.map{
    height: 100%;
    box-sizing: border-box;
    float: left;
    .navbar{
      width: 100%;
      border-bottom: 1px solid #B3C0D1;
      background: #F5F7FA;
      .el-row{
        height: 60px;
        line-height: 60px;
        .span1{
            float: left;
            margin-left: 20px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            span{
              font-size: 13px;
              color: #409eff;
              overflow: hidden;
              white-space:nowrap;
              text-overflow:ellipsis;
            }
         }
      }
      .btns{
              text-align: right;
              padding-right: 20px;
      }
    }
    .map-img{
      float: left;
      img{
        width: 100%;
        height: 100%;
      }
      iframe{
        width: 100%;
        height: 100%;
      }
    }
    .main-right{
    width: 300px;
    float: right;
    border-left: 1px solid #B3C0D1;
    box-sizing: border-box;
    overflow: hidden;
    .top{
        width: 100%;
        box-sizing: border-box;
        overflow: hidden;
        .el-tabs{
          height: 100%;
        }
        .el-tabs__header{
          background: #F5F7FA;
        }
        .el-tabs__nav{
          .el-tabs__item{
              height: 60px;
              line-height: 60px;
          }
        }
        .el-tabs__content{
        padding-right: 10px;
        height: calc(100% - 75px);
        overflow-y: auto;
        overflow-x: hidden;
        }
        .el-form-item{
        margin-bottom: 10px;
        }
        .el-form-item1{
        margin-bottom: 0px;
        }
    }
    .map-seting{
        p{
        text-align: left;
        padding-left: 10px;
        font-weight: bold;
        font-size: 14px;
        }
        .el-form-item__label{
        font-size: 13px;
        }
        .el-form-item__content{
        font-size: 13px;
        }
        .el-switch__label *{
        font-size: 12px;
        }
        .el-switch2{
        margin-left: 10px;
        }
    }
    .cont{
        .top{
        width: 100%;
        height: 30px;
        border-bottom: 1px solid #B3C0D1;
        padding-left: 20px;
        box-sizing: border-box;
        span{
            float: left;
            font-size: 15px;
            font-weight: bold;
            margin-top: 0px;
        }
        .add{
            float: right;
            margin-top: 0px;
        }
        }
    }
    }
    .m-colorPicker[data-v-11842410]{
      float: left;
      margin-top: 10px;
    }
    .m-colorPicker .colorBtn[data-v-11842410]{
      width: 30px;
      height: 30px;
    }
    .m-colorPicker .box.open[data-v-11842410]{
      z-index: 9;
    }
    .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: start;
    font-size: 13px;
    padding-right: 8px;
    .edit{
      position: absolute;
      right: 40px;
      i{
        color: #409eff;
      }
    }
    .delete{
      position: absolute;
      right: 10px;
      i{
        color: #f56c6c;
      }
      .el-button--text{
        color: #f56c6c;
      }
    }
  }
  .dialogfooter{
    // margin-top: 40px;
    text-align: right;
    .mapset{
      margin-top: 40px;
      width: 210px;
    }
  }
  .el-autocomplete{
    width: 100%;
  }
  .el-form-item__content{
    text-align: left;
  }
}
</style>
