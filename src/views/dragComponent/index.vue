<template>
  <div class="drappage">
    <Left @start="onStart" @end="onEnd"/>
    <div class="right">
      <div class="options">
        <el-drawer
          title="已有组件列表"
          :visible.sync="drawer"
          direction="rtl">
          <div class="exist-list">
            <div class="exist-panel" v-for="(item, index) in existList" :key="index">
              {{item.name}}
              <i class="el-icon-delete" @click="delPanel(item)"></i>
              <i class="el-icon-edit" @click="editPanel(item)"></i>
            </div>
          </div>
        </el-drawer>
        <el-button @click="showExistList">展开已有列表</el-button>
        <el-button @click="initPanel" type="primary">新增面板</el-button>
      </div>
      <!-- <div>{{drag?'拖拽中':'拖拽停止'}}</div> -->
      <div class="panel-name">
        <span class="label">当前编辑的panel名称：</span>
        <el-input placeholder="请输入当前编辑的面板名称" v-model="panelName"></el-input>
      </div>
      <div class="benchmark">
        <draggable class="draggable2"
         v-model="componentList"
         group="component"
         @start="onStart"
         @end="onEnd"
         :style="{
          width: panel.width + 'px',
          height: panel.height + 'px',
          top: panel.top + 'px',
          fontSize: panel.fontSize + 'px',
          backgroundColor: panel.backgroundColor,
          left: panel.left + 'px'}">
          <transition-group>
              <div v-for="(item, index) in componentList"
              :key="index + 'a'"
              :class="{item2: true, selected: index === componentIndex, isHide: item.type === 'panel'}"
              :style="{textAlign: item.attr&&item.attr.position || 'left'}"
              @click.stop="editComponent(item,index)">
                  <div v-if="item.type === 'container'" class="container">
                    <p>请将组件拖入</p>
                  </div>
                  <el-button :icon="item.attr.icon"
                   :type="item.attr.butType"
                   :size="item.attr.size"
                   :style="{width: item.attr.width + 'px'}"
                   v-if="item.type === 'button'">
                   {{item.attr.name}}
                   </el-button>
                  <div v-if="item.type === 'input'">
                      <span class="label">{{item.attr.label}}</span>
                      <el-input :placeholder="item.attr.placeholder"
                      v-model="item.attr.value"
                      :size="item.attr.size"
                      :type="item.attr.type"
                      class="cont">
                      </el-input>
                  </div>
                  <div v-if="item.type === 'radio'">
                    <span class="label">{{item.attr.label}}</span>
                    <el-radio-group v-model="item.attr.radio" class="cont" style="lineHeight:50px;">
                      <el-radio v-for="(option, index2) in item.attr.options" :key="index2 + 'radio'" :label="option.value">{{option.value}}</el-radio>
                    </el-radio-group>
                  </div>
                  <div v-if="item.type === 'checkbox'">
                    <span class="label" style="lineHeight:40px;">{{item.attr.label}}</span>
                    <el-checkbox-group v-model="item.attr.checkList" class="cont" style="lineHeight:40px;">
                      <el-checkbox v-for="(option, index2) in item.attr.options" :key="index2 + 'checkbox'" :label="option.value"></el-checkbox>
                    </el-checkbox-group>
                  </div>
                  <div v-if="item.type==='select'">
                    <span class="label" style="lineHeight:40px;">{{item.attr.label}}</span>
                    <el-select v-model="item.attr.selValue" placeholder="请选择">
                       <el-option
                         v-for="item in item.attr.options"
                         :key="item.label"
                         :label="item.value"
                         :value="item.value">
                       </el-option>
                     </el-select>
                  </div>
                  <div v-if="item.type === 'nav'" class="nav"
                  :style="{width: item.attr.width + 'px',
                  fontSize: item.attr.fontSize + 'px'}">
                    <ul>
                      <li v-for="(iteml, index2) in item.attr.items"
                        :key="index2 + 'nav'"
                        :class="{active: iteml.value === item.attr.defaultActive}">
                        <div class="li-cont">
                        <i :class="iteml.icon"></i>
                        {{iteml.value}}
                        </div>
                      </li>
                    </ul>
                  </div>
              </div>
          </transition-group>
        </draggable>
        <el-button @click="submitPanel" class="submit-panel" type="primary">提交面板</el-button>
        <el-button @click="ShowSetPanel" class="submit-panel">设置面板大小</el-button>
      </div>
    </div>
    <CompAttr :component="component"
    :editAttr="editAttr"
    @updateCompAttr="updateCompAttr"
    @delComp="delComp"/>
    <Dialog/>
    <SetPanel
    :setPanelVisible="setPanelVisible"
    :panelForm="panel"
    @setPanel="setPanel"
    :type="panelTypeList"
    @close="setPanelVisible = false"/>
  </div>
</template>
<script>
// 导入draggable组件
import draggable from 'vuedraggable'
import Left from './Left'
import CompAttr from './CompAttr'
import { addModuleNav, editModuleNav, findModuleNavByPageId, delModuleNav } from '@/api/pagePanel'
import store from '@/store'
import Dialog from '@/components/common/Dialog'
import SetPanel from './SetPanel'
import { isType } from '@/utils/common'
const panelTypeList = [
  {label: '常用', value: 'normal'},
  {label: '导航', value: 'nav'}
]
export default {
  // 注册draggable组件
  components: {
    draggable,
    Left,
    CompAttr,
    Dialog,
    SetPanel
  },
  data () {
    return {
      pageId: '',
      existList: [], // 当前页面已经存在的面板列表
      panelId: '', // 当前编辑的版面Id
      panelName: '', // 当前面板名称
      drawer: false, // 是否展示已有列表
      drag: false,
      editAttr: false, // 点击编辑
      setPanelVisible: false, // 是否弹出版面大小编辑框
      panel: {
        width: '500', // 面板宽
        top: '0', // 面板离顶部的间距
        left: '100', // 面板离左边间距
        height: '600', // 面板高
        fontSize: '14', // 面板内容里面的字体大小
        type: 'normal', // normal,常用的 nav, 导航
        backgroundColor: '#fff'
      },
      panelTypeList: panelTypeList,
      // 定义要被拖拽对象的数组
      componentList: [
        {id: 'container', type: 'container'}
      ],
      component: {}, // 当前点击的组件
      componentIndex: '' // 当前点击的组件index
    }
  },
  created () {
    let id = this.$route.query.pageId
    if (id) {
      this.pageId = id
    } else {
      this.$router.push('/login')
    }
    this.findModule(id)
  },
  watch: {
  },
  methods: {
    // 获取当前页面的组件列表
    findModule (id) {
      let that = this
      findModuleNavByPageId(id).then(res => {
        if (res.data.success) {
          that.existList = res.data.obj
        }
      }).catch(er => {
        console.log(er)
      })
    },
    // 展开已有列表
    showExistList () {
      this.drawer = true
    },
    // 开始拖拽事件
    onStart (e) {
      this.drag = true
      // console.log('start:', this.componentList, e)
    },
    // 拖拽结束事件
    onEnd (e) {
      let that = this
      that.drag = false
      // console.log('end:', that.componentList)
      // 注意深浅拷贝问题
      let lastChild = JSON.parse(JSON.stringify({...that.componentList[that.componentList.length - 1]}))
      if (that.componentList.length === 2) {
        that.componentList.forEach((el, index) => {
          if (el.id === 'container') {
            that.componentList.splice(index, 1)
          }
        })
        setTimeout(() => {
          that.componentList[that.componentList.length - 1] = lastChild
        }, 100)
      } else {
        that.componentList[that.componentList.length - 1] = lastChild
      }
    },
    // 点击选中要编辑的组件
    editComponent (item, index) {
      if (item.type === 'container') {
        return
      }
      this.component = item
      // console.log(this.component, index, this.componentList)
      this.componentList[index] = item // 防止刚拖拽过来的组件vue监听不到，以至于修改不被响应，渲染不及时（注意：vue中{__ob__: Observer}）
      this.componentIndex = index
      this.editAttr = !this.editAttr
    },
    // 删除组件
    delComp () {
      let that = this
      that.componentList.splice(that.componentIndex, 1)
      if (that.componentList.length === 0) {
        that.componentList.push(
          {id: 'container', type: 'container'}
        )
      }
    },
    // 改变组件
    updateCompAttr (attrList) {
      let that = this
      let obj = {...that.componentList[that.componentIndex].attr}
      attrList.forEach(el => {
        if (isType(el.value) === 'Object') { // 如果值为对象
          obj[el.key] = {...el.value}
        } else if (isType(el.value) === 'Array') { // 如果值为数组
          if (isType(el.value[0]) === 'Object') { // 如果值为对象数组
            let list = []
            el.value.forEach(el2 => {
              list.push({...el2})
            })
            obj[el.key] = list
          } else { // 如果值普通数组
            obj[el.key] = [...el.value]
          }
        } else { // 如果值为普通值
          obj[el.key] = el.value
        }
      })
      that.componentList[that.componentIndex].attr = obj
    },
    // 保存面板
    submitPanel () {
      let list = this.componentList
      let that = this
      if (that.panelId === '') {
        addModuleNav(that.pageId, that.panelName, JSON.stringify(that.panel), JSON.stringify(list)).then(res => {
          if (res.data.success) {
            store.dispatch('OpenTipsDialog', res.data.msg)
            that.findModule(that.pageId)
          }
        }).catch(er => {
          console.log(er)
        })
      } else {
        editModuleNav(that.panelId, that.panelName, JSON.stringify(that.panel), JSON.stringify(list)).then(res => {
          if (res.data.success) {
            store.dispatch('OpenTipsDialog', res.data.msg)
            that.findModule(that.pageId)
          }
        }).catch(er => {
          console.log(er)
        })
      }
    },
    // 编辑面板
    editPanel (item) {
      this.componentList = JSON.parse(item.attr_json)
      this.panel = JSON.parse(item.panel_json)
      this.panelId = item.id
      this.panelName = item.name
      this.drawer = false
      this.component = {}
      this.editAttr = !this.editAttr
    },
    // 显示设置面板大小弹窗
    ShowSetPanel () {
      this.setPanelVisible = true
    },
    setPanel (obj) {
      this.panel = {...obj}
    },
    // 删除版面
    delPanel (item) {
      let that = this
      that.$confirm('确认删除此版面？').then(_ => {
        if (that.panelId === item.id) {
          that.initPanel()
        }
        delModuleNav(item.id).then(res => {
          if (res.data.success) {
            store.dispatch('OpenTipsDialog', '删除成功！')
            that.findModule(that.pageId)
          }
        }).catch(er => {
          console.log(er)
        })
      })
    },
    // 初始化面板
    initPanel () {
      this.componentList = [{id: 'container', type: 'container'}]
      this.panelId = ''
      this.panelName = ''
      this.panel = {
        width: '500', // 面板宽
        top: '0', // 面板离顶部的间距
        left: '100', // 面板离左边间距
        height: '600', // 面板高
        fontSize: '14', // 面板内容里面的字体大小
        type: 'normal', // normal,常用的 nav, 导航
        backgroundColor: '#fff'
      }
      this.componentIndex = ''
      this.component = {}
      this.editAttr = !this.editAttr
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.drappage{
  width: 100%;
  height: 100%;
  .left{
    width: 25%;
    height: 100%;
    border-right: 1px solid #ccc;
    box-sizing: border-box;
    float: left;
  /*定义要拖拽元素的样式*/
    /* .item+.item{
      border-top:none ;
    } */
    .draggable1{
      width: 100%;
      height: 100%;
      padding: 10px;
      float: left;
      box-sizing: border-box;
    }
  }
  .right{
    width: 50%;
    height: 100%;
    border-right: 1px solid #ccc;
    box-sizing: border-box;
    float: left;
    .options{
      width: 100%;
      position: relative;
      top: 10px;
      right: 20px;
      text-align: right;
      .el-drawer__header{
        text-align: left;
      }
      .exist-list{
        width: 100%;
        float: left;
        text-align: left;
        .exist-panel{
          width: 80%;
          line-height: 40px;
          border-bottom: 1px solid #dfdfdf;
          cursor: pointer;
          box-sizing: border-box;
          margin: 0 auto;
          margin-bottom: 10px;
          font-size: 14px;
          i{
            float: right;
            line-height: 40px;
            margin-left: 10px;
          }
          .el-icon-delete{
            color: #f56c6c;
          }
          .el-icon-edit{
            color: #409EFF;
          }
        }
      }
    }
    .panel-name{
      width: 100%;
      text-align: center;
      position: relative;
      top: 40px;
      .label{
        min-width: 70px;
        line-height: 40px;
      }
      .el-input{
        width: 200px;
      }
    }
    .benchmark{
      width: 100%;
      position: relative;
      top: 60px;
      border-top: 1px solid #409EFF;
      border-left: 1px solid #409EFF;
      .draggable2{
        padding: 20px;
        text-align: left;
        box-sizing: border-box;
        border: 1px solid #dfdfdf;
        top: 0;
        left: 20%;
        border-radius: 4px;
        font-size: 14px;
        .selected{
          background: #e3f4fd;
        }
        .item2{
          margin-bottom: 10px;
          padding: 5px;
          width: 100%;
          box-sizing: border-box;
          .label{
            min-width: 70px;
            float: left;
            line-height: 40px;
          }
          .cont{
            width: calc(100% - 60px);
            min-height: 40px;
          }
          .title{
            position: absolute;
            top: 10px;
            right: 10px;
            margin: 0;
            font-weight: bold;
          }
          .el-input{
            width: 300px;
          }
          .nav{
            width: 150px;
            position: relative;
            border: 1px solid #ccc;
            background: #fff;
            box-sizing: border-box;
            text-align: left;
            font-size: 15px;
            ul{
              padding: 0;
              margin: 0;
              li{
                list-style-type: none;
                min-height: 50px;
                line-height: 50px;
                &:hover{
                  background: #6bb4ff;
                }
                i{
                  margin-right: 5px;
                }
                .li-cont{
                  width: 80%;
                  margin: 0 auto;
                  border-bottom: 1px solid #dfdfdf;
                  box-sizing: border-box;
                  &:hover{
                    border-bottom: 1px solid #6bb4ff;
                  }
                }
                &:last-child .li-cont{
                  border-bottom: none;
                }
              }
              .active{
                background: #6bb4ff;
                .li-cont{
                    border-bottom: none;
                }
              }
            }
          }
        }
        .isHide{
          display: none;
        }
        position: relative;
        .container{
          width: 100%;
          height: 40px;
          text-align: center;
          position: absolute;
        }
      }
      .submit-panel{
        position: relative;
        top: 60px;
      }
    }
  }
  .item{
    border: solid 1px #eee;
    width: 45%;
    line-height: 20px;
    font-size: 13px;
    padding: 5px;
    float: left;
    box-sizing: border-box;
    margin: 5px;
    background: #e3f4fd;
    border-radius: 2px;
  }
  .item:hover{
    background-color: #409eff;
    cursor: move;
  }
}
</style>
