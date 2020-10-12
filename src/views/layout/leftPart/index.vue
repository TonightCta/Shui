<template>
    <div class="main-left">
    <div class="cont">
    <div class="top">
        <span>数据源管理</span>
        <div class="add">
        <!-- <i class="el-icon-search" style="margin-right: 15px"></i> -->
        <el-input
          class="node-search"
          placeholder="搜索"
          prefix-icon="el-icon-search"
          size="mini"
          v-model="filterDataText">
        </el-input>
        <el-tooltip class="item" effect="dark" content="添加数据源" placement="top">
            <i class="el-icon-document-add" style="margin-right: 15px" @click="showAddDSource"></i>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="添加分类" placement="top">
            <i class="el-icon-folder-add" style="margin-right: 15px" @click="addClassify('dataSource')"></i>
        </el-tooltip>
        </div>
    </div>
    <div class="data">
        <el-tree
        :data="dataSourceTree"
        :props="treeprop"
        node-key="id"
        ref="dataTree"
        default-expand-all
        :expand-on-click-node="false"
        @node-drag-start="handleDragStart"
        @node-drag-enter="handleDragEnter"
        @node-drag-leave="handleDragLeave"
        @node-drag-over="handleDragOver"
        @node-drag-end="handleDragEnd"
        @node-drop="handleDrop"
        draggable
        :allow-drop="allowDrop"
        :allow-drag="allowDrag"
        :filter-node-method="filterNode">
          <span class="custom-tree-node" slot-scope="{ node }">
            <i v-if="node.data.attributes.type === 'classify'" class="el-icon-folder-opened" :style="{color: '#e6ca3c'}"></i>
            <span>{{ node.label }}</span>
            <span class="edit">
              <i class="el-icon-edit" @click="editSource(node.data)"></i>
            </span>
            <span class="delete">
              <i class="el-icon-delete" @click="delData(node.data)"></i>
            </span>
          </span>
        </el-tree>
    </div>
    </div>
    <div class="cont cont2">
    <div class="top">
        <span>页面</span>
        <div class="add">
        <!-- <i class="el-icon-search" style="margin-right: 15px"></i> -->
        <el-input
          class="node-search"
          placeholder="搜索"
          prefix-icon="el-icon-search"
          size="mini"
          v-model="filterPageText">
        </el-input>
        <el-tooltip class="item" effect="dark" content="创建新页面" placement="top">
            <i class="el-icon-document-add" style="margin-right: 15px" @click="showAddPage"></i>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="添加分类" placement="top">
            <i class="el-icon-folder-add" style="margin-right: 15px" @click="addClassify('web')"></i>
        </el-tooltip>
        </div>
    </div>
    <div class="data">
        <el-tree
        :data="webTree"
        :props="treeprop"
        node-key="id"
        highlight-current
        ref="webTree"
        default-expand-all
        :expand-on-click-node="false"
        @node-click="getPageId"
        @node-drag-start="handleDragStart"
        @node-drag-enter="handleDragEnter"
        @node-drag-leave="handleDragLeave"
        @node-drag-over="handleDragOver"
        @node-drag-end="handleDragEnd"
        @node-drop="handleDrop"
        draggable
        :allow-drop="allowDrop"
        :allow-drag="allowDrag"
        :filter-node-method="filterNode">
         <!-- @click="getPageId(node.data)" -->
        <span class="custom-tree-node" slot-scope="{ node }">
          <i v-if="node.data.attributes.type === 'classify'" class="el-icon-folder-opened" :style="{color: '#e6ca3c'}"></i>
          <span>{{ node.label }}</span>
          <span class="edit">
            <i class="el-icon-edit" @click.stop="editSource(node.data)"></i>
          </span>
          <span class="delete">
            <i class="el-icon-delete" @click.stop="delData(node.data)"></i>
          </span>
        </span>
        </el-tree>
    </div>
    </div>
    <AddDataSource :visible="addDSource" @closeDialog="addDSource = false"
    @updateClassify="updateClassify" :editData="editSourceData" :title="dataSoureTitle"/>
    <AddCategory :visible="addCate" @closeDialog="addCate = false" :type="classifyType"
    @updateClassify="updateClassify" :id="classifyId" :title="classifyTitle"
    :classifyName="classifyName"/>
    <AddNewPage :visible="addPage" :title="dataPageTitle" @closeDialog="addPage = false"
    :editData="editPageData" @updateClassify="updateClassify" @clickPagedata="clickPagedata"/>
    <Dialog/>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import AddDataSource from './AddDataSource'
import AddCategory from './AddCategory'
import AddNewPage from './AddNewPage'
import { findTreeByApplyId, findPageTreeByApplyId, updateClassifyParentId, updateClassifyId,
  updateSourceClassifyId, delSource, delClassify, delPage } from '@/api/applySouce'
import Dialog from '@/components/common/Dialog'
import store from '@/store'
export default {
  name: 'Leftpart',
  components: {
    AddDataSource,
    AddCategory,
    AddNewPage,
    Dialog
  },
  data () {
    return {
      addDSource: false, // 是否弹出增加数据源
      addCate: false, // 是否弹出增加分类
      addPage: false, // 是否弹出新增页面
      classifyType: '', // 添加的分类类型
      classifyId: '', // 分类的ID
      classifyName: '',
      classifyTitle: '新增分类',
      dataPageTitle: '添加页面',
      editSourceData: {}, // 编辑数据源时传给子组件弹窗的form数据
      editPageData: {}, // 编辑页面时传给子组件弹窗的form数据
      dataSoureTitle: '添加数据源',
      treeprop: {
        label: 'text'
      },
      dataSourceTree: [], // 数据源tree
      webTree: [], // 页面tree
      filterDataText: '',
      filterPageText: ''
    }
  },
  created () {
    this.findTreeByApplyId('dataSource')
    this.findPageTreeByApplyId('web')
  },
  computed: {
    ...mapGetters(['username', 'token', 'bimapplyId', 'bimapplyName', 'pageId'])
  },
  watch: {
    pageId (v) {
      // 等新数据重新渲染好再设置节点高亮
      setTimeout(() => {
        this.$refs.webTree.setCurrentKey(v)
      }, 200)
    },
    filterPageText (val) {
      this.$refs.webTree.filter(val)
    },
    filterDataText (val) {
      this.$refs.dataTree.filter(val)
    }
  },
  mounted () {
  },
  methods: {
    filterNode (value, data) {
      if (!value) {
        return true
      }
      return data.text.indexOf(value) !== -1
    },
    handleDragStart (node, ev) {
      // console.log('drag start', node)
    },
    handleDragEnter (draggingNode, dropNode, ev) {
      // console.log('tree drag enter: ', draggingNode.label, dropNode.label)
    },
    handleDragLeave (draggingNode, dropNode, ev) {
      // console.log('tree drag leave: ', dropNode.label)
    },
    handleDragOver (draggingNode, dropNode, ev) {
      // console.log('tree drag over: ', dropNode.label)
    },
    // 拖拽结束
    handleDragEnd (draggingNode, dropNode, dropType, ev) {
      console.log('tree drag end: ', draggingNode, dropNode, dropType)
      // 如果是数据源拖拽
      if (draggingNode.data.attributes.type === 'dataSource') {
        updateSourceClassifyId(this.token,
          {id: draggingNode.data.id, classify_id: dropNode.data.attributes.id}).then(res => {
          if (res.data.success) {
            // alert('数据源拖拽成功')
          }
        }).catch(er => {
          console.log(er)
        })
      // 如果是分类拖拽
      } else if (draggingNode.data.attributes.type === 'classify') {
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
      } else if (draggingNode.data.attributes.type === 'web') {
        updateClassifyId(this.token,
          {id: draggingNode.data.id, classify_id: dropNode.data.attributes.id}).then(res => {
          if (res.data.success) {
            // alert('页面拖拽成功')
          }
        }).catch(er => {
          console.log(er)
        })
      }
    },
    handleDrop (draggingNode, dropNode, dropType, ev) {
      // console.log('tree drop: ', dropNode.label, dropType)
    },
    // 判断目标节点能否被放着
    allowDrop (draggingNode, dropNode, type) {
      if (dropNode.data.attributes.type === 'dataSource' || dropNode.data.attributes.type === 'web') {
        // 要增加一个提示，数据只能拖入分类 即dropNode.attributes.type === 'classify'
        return false
      }
      return true
    },
    // 节点是否允许拖拽
    allowDrag (draggingNode) {
      return true
    },
    // 根据Applyid查询数据源
    findTreeByApplyId (str) {
      findTreeByApplyId(this.token, this.bimapplyId, str).then(res => {
        this.dataSourceTree = res.data
      }).catch(er => {
        console.log('error:' + er)
      })
    },
    // 根据Applyid查询页面
    findPageTreeByApplyId (str) {
      findPageTreeByApplyId(this.token, this.bimapplyId, str).then(res => {
        this.webTree = res.data
      }).catch(er => {
        console.log('error:' + er)
      })
    },
    // 数据Key值转换
    convDFormats (obj) {
      Object.keys(obj).map((key) => {
        if (key === 'text') {
          obj['label'] = obj[key]
          delete obj[key]
        }
        if (key === 'children') {
          this.convDFormats(obj[key])
        }
      })
      // console.log('hahahhahah==' + JSON.stringify(obj))
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
                  if (obj.attributes.classify_type === 'web') {
                    this.findPageTreeByApplyId('web')
                  } else {
                    this.findTreeByApplyId('dataSource')
                  }
                }
              })
            })
        } else {
          store.dispatch('OpenTipsDialog', '该分类下有数据源，不能删除')
        }
      } else if (obj.attributes.type === 'web') {
        this.$confirm('确认删除？')
          .then(_ => {
            delPage(this.token, obj.id).then(res => {
              if (res.data.success) {
                store.dispatch('OpenTipsDialog', '删除数据源成功')
                this.findPageTreeByApplyId('web')
              }
            })
          })
      } else if (obj.attributes.type === 'dataSource') {
        this.$confirm('确认删除？')
          .then(_ => {
            delSource(this.token, obj.id).then(res => {
              if (res.data.success) {
                store.dispatch('OpenTipsDialog', '删除数据源成功')
                this.findTreeByApplyId('dataSource')
              }
            })
          })
      }
    },
    // 编辑数据源及分类
    editSource (obj) {
      // alert(obj.text)
      // 如果是编辑分类
      if (obj.attributes.type === 'classify') {
        this.classifyName = obj.text
        this.classifyTitle = '编辑分类'
        this.addCate = true
        this.classifyId = obj.id
        this.classifyType = obj.attributes.classify_type
      }
      // 如果是编辑数据源
      if (obj.attributes.type === 'dataSource') {
        // console.log(obj)
        this.addDSource = true
        this.editSourceData = obj.attributes
        this.dataSoureTitle = '编辑数据源'
        this.classifyType = 'dataSource'
      }
      // 如果是编辑页面
      if (obj.attributes.type === 'web') {
        // console.log(obj)
        this.addPage = true
        this.editPageData = obj.attributes
        this.dataPageTitle = '编辑页面'
        this.classifyType = 'web'
      }
    },
    // 弹出新增分类
    addClassify (val) {
      this.classifyType = val
      this.classifyName = ''
      this.classifyTitle = '新增分类'
      this.addCate = true
    },
    // 弹出新增数据源
    showAddDSource () {
      this.addDSource = true
      this.dataSoureTitle = '添加数据源'
      this.classifyType = 'dataSource'
      this.editSourceData = {}
    },
    // 弹出新增页面
    showAddPage () {
      this.addPage = true
      this.dataPageTitle = '添加页面'
      this.classifyType = 'web'
      this.editPageData = {}
    },
    // 更新树形结构数据
    updateClassify () {
      if (this.classifyType === 'web') {
        this.findPageTreeByApplyId('web')
      }
      if (this.classifyType === 'dataSource') {
        this.findTreeByApplyId('dataSource')
      }
    },
    // 点击页面存储全局页面ID
    getPageId (obj) {
      // console.log(obj.id)
      this.$refs.webTree.setCurrentKey(obj.id)
      if (obj.attributes.type === 'web') {
        store.commit('SET_PAGEID', obj.id)
        store.commit('SET_PAGENAME', obj.text)
        this.$emit('clickPagedata') // 传递给父组件，点击了页面树节点
      }
    },
    clickPagedata () {
      this.$emit('clickPagedata')
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.main-left{
    min-width: 280px;
    height: 100%;
    overflow-y: auto;
    float: left;
    border-right: 1px solid #B3C0D1;
    box-sizing: border-box;
    .cont2{
    border-top: 1px solid #B3C0D1;
    margin-top: 30px;
    }
    .top{
    width: 100%;
    height: 60px;
    border-bottom: 1px solid #B3C0D1;
    padding-left: 20px;
    box-sizing: border-box;
    background: #F5F7FA;
    span{
        float: left;
        font-size: 15px;
        font-weight: bold;
        margin-top: 20px;
    }
    .add{
        float: right;
        margin-top: 20px;
        .node-search{
          width: 110px;
          top: -2px;
          .el-input__inner{
            border: none;
            background: none;
          }
          span{
            margin-top: 0;
          }
        }
    }
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
}
</style>
