<template>
    <el-dialog class="dialog1 eventDialog"
    :title="title"
    :visible.sync="EventDialogVisible"
    :before-close="handleClose">
    <el-dialog
      width="50%"
      title="数据"
      :visible.sync="innerVisible"
      append-to-body>
      <el-form>
        <el-form-item label="联动表单" :label-width="formLabelWidth">
          <el-autocomplete
            class="inline-input"
            v-model="eventConfig.ld_table"
            :fetch-suggestions="querySearch"
            placeholder="请选择数据表"
            size="small"
            @select="item => tableChange(item.value, '')">
          </el-autocomplete>
        </el-form-item>
        <el-form-item label="数据关系" :label-width="formLabelWidth">
          <el-select v-model="eventConfig.cur_table_field" placeholder="请选择字段" class="table-field" size="mini">
            <el-option v-for="(item, index) in currentDataTableFieldList"
            :label="item.COLUMN_NAME"
            :value="item.COLUMN_NAME"
            :key="index">
            </el-option>
          </el-select>
          <span>值等于</span>
          <el-select v-model="eventConfig.ld_table_field" placeholder="请选择字段" class="table-field" size="mini">
            <el-option v-for="(item, index) in dataTableFieldList"
            :label="item.COLUMN_NAME"
            :value="item.COLUMN_NAME"
            :key="index">
            </el-option>
          </el-select>
          <span>的值时获取</span>
          <el-select v-model="eventConfig.ld_at_field" placeholder="请选择字段" class="table-field" size="mini">
            <el-option v-for="(item, index) in dataTableFieldList"
            :label="item.COLUMN_NAME"
            :value="item.COLUMN_NAME"
            :key="index">
            </el-option>
          </el-select>
          <span>的值</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="innerVisible=false">确 定</el-button>
      </div>
    </el-dialog>
    <div class="top">
      <div class="item"><span class="span1">事件名称：</span><el-input v-model="eventName" class="itemcont"></el-input></div>
      <div class="item"> <span class="span1">事件交互：</span>
        <el-select class="itemcont" v-model="eventVal" placeholder="请选择">
          <el-option
            v-for="item in eventOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="mainpage">
      <div class="box">
        <div class="tit">
          <p>添加事件</p>
        </div>
        <div class="trees">
          <el-tree :data="linkData"
          default-expand-all
          node-key="id"
          highlight-current
          ref="linkDataTree"
          :props="defaultProps"
          @node-click="getEvent">
          </el-tree>
        </div>
      </div>
      <div class="box">
        <div class="tit">
          <p>组织事件</p>
        </div>
        <div class="trees">
          <el-tree :data="caseData"
          default-expand-all
          node-key="index"
          highlight-current
          ref="caseTree"
          :props="defaultProps"
          @node-click="getCase">
          </el-tree>
        </div>
      </div>
      <div class="box">
        <div class="tit">
          <p>配置事件</p>
        </div>
        <div class="conts" v-if="caseData[0].children.length > 0">
          <div class="openposition">
            <span class="label">打开位置</span>
            <el-select class="content" size="small" v-model="eventConfig.open_wz" @change="changeOpenPosition">
              <el-option v-for="(item, index) in openPositionList" :key="index"
              :label="item.label"
              :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="radios">
            <el-radio class="radio1" v-model="eventConfig.configRadio" @change="getRadio" label="1">场景切换</el-radio>
            <el-input placeholder="查找" size="mini" v-model="filterText"></el-input>
            <div class="pagetree">
              <el-tree
              :data="pageTree"
              :props="pageProps"
              node-key="id"
              highlight-current
              ref="eventPageTree"
              default-expand-all
              @node-click="getPage"
              :filter-node-method="filterPageNode">
              <span class="custom-tree-node" slot-scope="{ node }">
                <i v-if="node.data.attributes.type === 'classify'" class="el-icon-folder-opened" :style="{color: '#e6ca3c'}"></i>
                <span>{{ node.label }}</span>
              </span>
              </el-tree>
            </div>
            <el-radio class="radio1" v-model="eventConfig.configRadio" @change="getRadio" label="2">配置数据</el-radio>
            <el-button class="width1" @click="innerVisible=true" size="small">关联数据</el-button>
            <el-radio class="radio1" v-model="eventConfig.configRadio" @change="getRadio" label="3">超链接</el-radio>
            <el-input class="width1" v-model="eventConfig.link_url" placeholder="请输入URL链接" size="small"></el-input>
            <div class="pop" v-if="eventConfig.open_wz === 'pop'">
              <p>弹出属性</p>
              <div class="popitem">
                <span>位置：</span>
                <span>左</span><el-input v-model="eventConfig.left_px" size="mini"></el-input>
                <span>上</span><el-input v-model="eventConfig.top_px" size="mini"></el-input>
              </div>
              <div class="popitem">
                <span>尺寸：</span>
                <span>宽</span><el-input v-model="eventConfig.size_width" size="mini"></el-input>
                <span>高</span><el-input v-model="eventConfig.size_height" size="mini"></el-input>
              </div>
            </div>
            <el-radio v-if="eventConfig.open_wz === 'current'" class="radio1" v-model="eventConfig.configRadio" @change="getRadio" label="4">重新加载当前页面</el-radio>
            <el-radio v-if="eventConfig.open_wz === 'current'" class="radio1" v-model="eventConfig.configRadio" @change="getRadio" label="5">返回上一页</el-radio>
          </div>
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
    <el-button @click="close">取 消</el-button>
    <el-button type="primary" @click="submit">保 存</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { mapGetters } from 'vuex'
import { findPageTreeByApplyId, getDataBaseTableField, getDataBaseTable, addEvent,
  findSelectedEvent, editEvent } from '@/api/applySouce'
import store from '@/store'
export default {
  name: 'EventDialog',
  props: ['visible', 'type', 'id', 'currentDatabaseId', 'dataTableName', 'tableFieldId'],
  components: {},
  data () {
    return {
      showDataRelation: false,
      innerVisible: false,
      formLabelWidth: '120px',
      title: '列表',
      eventName: '', // 事件名称
      eventVal: 'click', // 事件交互方式
      eventId: '',
      eventOptions: [
        {label: '鼠标点击', value: 'click'}
      ],
      filterText: '', // 节点过滤
      // organEventName: '', // 组织事件名称
      organEventIndex: '', // 组织事件ID
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      pageProps: {
        label: 'text'
      },
      linkData: [
        {
          label: '链接',
          children: [
            {
              label: '打开链接',
              id: '1'
            }
          ]
        }
      ],
      caseData: [
        {
          label: 'Case1',
          id: '',
          children: []
        }
      ],
      eventConfig: {
        configRadio: '1', // 右边单选框的值link_type
        open_wz: 'current', // 打开位置open_wz
        page_id: '', // 配置事件中选中的pageId page_id
        ld_table: '', // 联动表单ld_table
        cur_table_field: '', // 当前表单字段cur_table_field
        ld_table_field: '', // 联动表单字段 ld_table_field
        ld_at_field: '', // 联动表单所获取的字段 ld_at_field
        link_type: '', // 链接方式 link_type
        link_url: '', // link_url
        left_px: '', // 位置左
        top_px: '', // 位置右
        size_width: '', // 尺寸： 宽
        size_height: '' // 尺寸： 高
      },
      openPositionList: [
        {label: '当前窗口', value: 'current'},
        {label: '新窗口/新标签', value: 'new'},
        {label: '弹出窗口', value: 'pop'}
      ],
      dataTableList: [],
      pageTree: [], // 页面树形结构的数据
      currentDataTableFieldList: [], // 当前表单字段列表
      dataTableFieldList: [] // 联动表单字段列表
    }
  },
  computed: {
    EventDialogVisible: {
      get () {
        return this.visible
      }
    },
    ...mapGetters(['token', 'bimapplyId', 'bimapplyName', 'pageId', 'dataConfigId'])
  },
  watch: {
    visible (v) {
      if (v) {
        this.findPageTreeByApplyId()
        this.findSelectedEvent()
      }
    },
    innerVisible (v) {
      if (v) {
        this.getDataBaseTable()
        this.tableChange(this.dataTableName, 'current')
        if (this.eventConfig.ld_table && this.eventConfig.ld_table !== '') {
          this.tableChange(this.eventConfig.ld_table, '')
        }
      }
    },
    filterText (val) {
      this.$refs.eventPageTree.filter(val)
    }
  },
  mounted () {
  },
  updated () {
    // console.log('90-90-9890:' + this.dialogFormVisible)
    // console.log('======', this.type, this.title, this.classifyName)
  },
  methods: {
    filterPageNode (value, data) {
      if (!value) {
        return true
      }
      return data.text.indexOf(value) !== -1
    },
    close () {
      this.$emit('closeDialog')
    },
    handleClose () {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.$emit('closeDialog')
        })
        .catch(er => {
          console.log(er)
        })
    },
    // 提交
    submit () {
      if (this.eventName === '') {
        store.dispatch('OpenTipsDialog', '请填写事件名称')
        return
      }
      let objStr = []
      let that = this
      let isSubmit = true // 判断是否提交
      that.caseData[0].children.forEach(el => {
        let obj = {
          open_wz: el.open_wz,
          link_type: el.configRadio,
          souce_id: that.currentDatabaseId
        }
        if (el.configRadio === '1') {
          if (!el.page_id || el.page_id === '') {
            store.dispatch('OpenTipsDialog', '请选择页面')
            isSubmit = false
          }
          obj.page_id = el.page_id
        } else if (el.configRadio === '2') {
          obj.cur_table = el.cur_table
          obj.cur_table_field = el.cur_table_field
          obj.ld_table = el.ld_table
          obj.ld_table_field = el.ld_table_field
          obj.ld_at_field = el.ld_at_field
        } else if (el.configRadio === '3') {
          obj.link_url = el.link_url
        }
        if (el.open_wz === 'pop') {
          obj.left_px = el.left_px
          obj.top_px = el.top_px
          obj.size_width = el.size_width
          obj.size_height = el.size_height
        }
        objStr.push(
          {
            // name: el.organEventName,
            name: el.label,
            event_type: 'link',
            event_config: obj
          }
        )
      })
      if (that.eventName === '') {
        store.dispatch('OpenTipsDialog', '请填写事件名称')
        isSubmit = false
      }
      if (!isSubmit) {
        return
      }
      if (that.eventId === '') { // 判断id是否为空 若为空则新增，否则编辑
        let data = {
          event_bt_id: that.tableFieldId,
          name: that.eventName,
          event_interaction: that.eventVal,
          selected_event_list: JSON.stringify(objStr)
        }
        addEvent(data).then(res => {
          if (res.data.success) {
            store.dispatch('OpenTipsDialog', res.data.msg)
            that.$emit('closeDialog')
          }
        }).catch(er => {
          console.log(er)
        })
      } else {
        let data = {
          id: that.eventId,
          name: that.eventName,
          event_interaction: that.eventVal,
          selected_event_list: JSON.stringify(objStr)
        }
        editEvent(data).then(res => {
          if (res.data.success) {
            store.dispatch('OpenTipsDialog', res.data.msg)
            that.$emit('closeDialog')
          }
        }).catch(er => {
          console.log(er)
        })
      }
    },
    // 获取pagetree
    findPageTreeByApplyId () {
      findPageTreeByApplyId(this.token, this.bimapplyId, 'web').then(res => {
        // console.log(res.data)
        this.pageTree = res.data
      }).catch(er => {
        console.log(er)
      })
    },
    // 根据选择的数据表获取字段
    tableChange (v, str) {
      this.dataTableFieldList = []
      getDataBaseTableField(this.token, this.currentDatabaseId, v).then(res => {
        if (res.data.success) {
          if (str === 'current') {
            this.currentDataTableFieldList = res.data.obj
          } else {
            this.dataTableFieldList = res.data.obj
          }
        }
      }).catch(er => {
        console.log(er)
      })
    },
    // 获取dataTable
    getDataBaseTable () {
      getDataBaseTable(this.token, this.currentDatabaseId).then(res => {
        if (res.data.success) {
          this.dataTableList = res.data.obj
        }
      }).catch(er => {
        console.log(er)
      })
    },
    // 数据表搜索框
    querySearch (queryString, cb) {
      let list = []
      this.dataTableList.forEach((val) => {
        list.push({value: val.TABLE_NAME})
      })
      var restaurants = list
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter (queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    // 点击添加事件树
    getEvent (node) {
      if (node.children) {
        return
      }
      let that = this
      that.$refs.linkDataTree.setCurrentKey(node.id)
      that.caseData[0].children.push(
        {
          label: '在当前窗口打开链接',
          index: that.caseData[0].children.length,
          id: '',
          value: '当前窗口',
          // data: {
          // organEventName: '',
          open_wz: 'current',
          configRadio: '1', // link_type
          link_url: '',
          left_px: '',
          top_px: '',
          size_width: '',
          size_height: '',
          page_id: '',
          souce_id: '',
          cur_table: that.dataTableName,
          cur_table_field: '',
          ld_table: '', // ld_table
          ld_table_field: '',
          ld_at_field: ''
          // }
        }
      )
      setTimeout(() => {
        that.getCase(that.caseData[0].children[that.caseData[0].children.length - 1])
      }, 200)
    },
    // 点击组织事件树结构
    getCase (node) {
      if (node.children) {
        return
      }
      let that = this
      that.$refs.caseTree.setCurrentKey(node.index)
      if (!node.page_id || node.page_id === '') { // 如果当前的数据还没有选择页面，则不设置选中高亮
        that.$refs.eventPageTree.setCurrentKey(null)
      } else {
        that.$refs.eventPageTree.setCurrentKey(node.page_id)
      }
      // console.log('node', node)
      that.organEventIndex = node.index
      // that.caseData[0].children[node.index].organEventName = node.label
      // if (node.id !== '') {
      //   findEventConfig(node.id, node.event_type).then(res => {
      //     if (res.data.success) {
      //       // console.log(res.data.obj)
      //       let resObj = res.data.obj
      //       that.caseData[0].children[node.index].configRadio = resObj.link_type
      //       that.caseData[0].children[node.index].open_wz = resObj.open_wz
      //       if (resObj.link_type === '1') {
      //         that.caseData[0].children[node.index].page_id = resObj.page_id
      //         that.$refs.eventPageTree.setCurrentKey(resObj.page_id)
      //       } else if (resObj.link_type === '2') {
      //         that.caseData[0].children[node.index].cur_table_field = resObj.cur_table_field
      //         that.caseData[0].children[node.index].ld_table = resObj.ld_table
      //         that.caseData[0].children[node.index].ld_table_field = resObj.ld_table_field
      //         that.caseData[0].children[node.index].ld_at_field = resObj.ld_at_field
      //       } else if (resObj.link_type === '3') {
      //         that.caseData[0].children[node.index].link_url = resObj.link_url
      //       }
      //       if (resObj.open_wz === 'pop') {
      //         that.caseData[0].children[node.index].size_height = resObj.size_height
      //         that.caseData[0].children[node.index].size_width = resObj.size_width
      //         that.caseData[0].children[node.index].left_px = resObj.left_px
      //         that.caseData[0].children[node.index].top_px = resObj.top_px
      //       }
      //     }
      //   }).catch(er => {
      //     console.log(er)
      //   })
      // }
      let obj = that.caseData[0].children[node.index]
      that.eventConfig = obj
      // findEventConfig()
    },
    // 获取选中的事件数据
    findSelectedEvent () {
      findSelectedEvent(this.tableFieldId).then(res => {
        if (res.data.success) {
          if (JSON.stringify(res.data.obj) === '{}') { // 判断组织事件列表是否为空
            return
          }
          let that = this
          that.caseData[0].children = []
          that.eventName = res.data.obj.event_obj.name // 事件名称
          that.eventVal = res.data.obj.event_obj.event_interaction // 事件交互方式
          that.eventId = res.data.obj.event_obj.id
          let i = 0
          res.data.obj.selected_event_tree.forEach(el => {
            let detail = el.attributes.config_obj
            that.caseData[0].children.push(
              {
                label: el.text,
                index: i,
                id: el.id,
                event_type: el.attributes.event_type,
                value: detail.open_wz === 'current' ? '当前窗口' : detail.open_wz === 'new' ? '新窗口/新标签' : '弹出窗口',
                // organEventName: el.text,
                open_wz: detail.open_wz,
                configRadio: detail.link_type, // link_type
                link_url: detail.link_url,
                left_px: detail.left_px,
                top_px: detail.top_px,
                size_width: detail.size_width,
                size_height: detail.size_height,
                page_id: detail.page_id,
                souce_id: detail.souce_id,
                cur_table: that.dataTableName,
                cur_table_field: detail.cur_table_field,
                ld_table: detail.ld_table, // ld_table
                ld_table_field: detail.ld_table_field,
                ld_at_field: detail.ld_at_field
              }
            )
            i++
          })
          setTimeout(() => { // 设置显示第一条数据
            that.getCase(that.caseData[0].children[0])
          }, 200)
        }
      }).catch(er => {
        console.log(er)
      })
    },
    getRadio (v) {
      // alert(v)
    },
    // 切换打开位置事件
    changeOpenPosition (val) {
      let that = this
      let str = ''
      if (val === 'current') {
        str = str + '当前窗口'
      } else if (val === 'new') {
        str = str + '新窗口/新标签'
      } else if (val === 'pop') {
        str = str + '弹出窗口'
      }
      if (that.caseData[0].children.length > 0) {
        that.caseData[0].children[that.organEventIndex].label = '在' + str + '打开连接'
        that.caseData[0].children[that.organEventIndex].value = val
      }
    },
    // 获取页面
    getPage (node) {
      if (node.attributes.type === 'classify') {
        this.eventConfig.page_id = ''
      } else {
        this.eventConfig.page_id = node.id
        this.$refs.eventPageTree.setCurrentKey(node.id)
      }
    }
  }
}
</script>
<style ref="stylesheet/scss" lang="scss" >
.eventDialog{
  .el-dialog{
    width: 80%;
    .top{
      width: 100%;
      .item{
        width: 30%;
        box-sizing: border-box;
        float: left;
        .span1{
          width: 80px;
          float: left;
          line-height: 40px;
        }
        .itemcont{
          width: calc(100% - 100px);
          float: left;
        }
      }
    }
    .mainpage{
      width: 100%;
      // background: #f1f1f1;
      height: 600px;
      margin-top: 20px;
      .box{
        width: 32%;
        height: 100%;
        float: left;
        border: 1px solid #c9c9c9;
        margin-left: 2%;
        box-sizing: border-box;
        overflow-y: auto;
        .tit{
          width: 100%;
          text-align: left;
          border-bottom: 1px solid #c9c9c9;
          padding-left: 10px;
          box-sizing: border-box;
        }
        .trees{
          width: 100%;
          padding: 10px;
          box-sizing: border-box;
        }
        .conts{
          width: 100%;
          padding: 10px;
          box-sizing: border-box;
          font-size: 13px;
          .openposition{
            width: 100%;
            float: left;
            .label{
              float: left;
              line-height: 30px;
              margin-right: 10px;
              width: 60px;
            }
            .content{
              float: left;
              width: calc(100% - 70px);
            }
          }
          .radios{
            width: 100%;
            margin-top: 20px;
            float: left;
            .radio1{
              width: 100%;
              text-align: left;
              margin: 10px 0;
            }
            .pagetree{
              width: 100%;
              min-height: 300px;
              border: 1px solid #DCDFE6;
              box-sizing: border-box;
              margin-top: 10px;
            }
            .pop{
              text-align: left;
              .popitem{
                margin-bottom: 10px;
                .el-input{
                  width: 80px;
                  margin: 0 10px;
                }
              }
            }
          }
        }
      }
      .box:first-child{
        margin-left: 0;
      }
    }
  }
}

</style>
