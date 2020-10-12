<template>
  <div class="data-con">
    <div class="data-top">
        <p>{{dataConfigName}}</p>
        <i class="el-icon-circle-close" @click="closeDataManage"></i>
    </div>
    <div class="coordinate">
        <p>坐标类型:</p>
        <el-radio-group v-model="coordinate" size="small">
            <el-radio-button label="点坐标" ></el-radio-button>
            <el-radio-button label="面坐标"></el-radio-button>
            <el-radio-button label="线坐标"></el-radio-button>
            <el-radio-button label="场景坐标"></el-radio-button>
        </el-radio-group>
    </div>
    <div class="data-cont" id="dataCont">
        <el-tabs type="border-card" stretch v-model="activeName">
            <el-tab-pane label="样式" name="first">
                <div class="tab-pane">
                <el-form ref="styleform" :model="styleform" label-width="80px">
                    <el-form-item label="基础样式:">
                        <el-radio-group v-model="styleform.point_way" size="mini">
                            <el-radio border label="1" >常规点</el-radio>
                            <el-radio border label="2">热力图</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="符号类型:">
                        <el-radio-group v-model="styleform.point_type" size="mini">
                            <el-radio border label="image">图片</el-radio>
                            <el-radio border label="vector">矢量图</el-radio>
                            <el-radio border label="model">模型</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="选择图片:">
                        <!-- <el-radio-group v-model="styleform.img" size="mini">
                            <el-radio border label="图标" ></el-radio>
                            <el-radio border label="渐变"></el-radio>
                        </el-radio-group> -->
                        <el-select class="width1" v-model="styleform.point_url" placeholder="请选择图标" size="mini">
                            <el-option label="消防栓图片" value="http://static.3dmomoda.com/textures/20072016eqp6w1e5fcpny4qpihgh3x2w.png"></el-option>
                            <el-option label="常规图标" value="https://www.thingjs.com/static/image/train_station.png"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="形状大小:">
                        <el-input v-model="styleform.point_size" size="mini"></el-input>
                    </el-form-item>
                    <el-form-item label="离地高度:">
                        <el-input v-model="styleform.point_height" size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="旋转速度:">
                        <el-input v-model="styleform.rotateSpeed" size="small"></el-input>
                    </el-form-item>
                </el-form>
                </div>
            </el-tab-pane>
            <el-tab-pane label="弹窗" name="second">
                <div class="tab-pane">
                <el-form ref="popupForm" :model="popupForm" label-width="80px">
                    <el-form-item label="打开方式:">
                        <el-radio-group v-model="popupForm.tc_type" size="mini">
                            <el-radio border label="0">无</el-radio>
                            <el-radio border label="1">点击</el-radio>
                            <el-radio border label="2">悬浮</el-radio>
                            <el-radio border label="3">常显</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="显示字段:">
                      <div v-for="(item, index) in dataFieldList" :key="index">
                        <el-checkbox
                          :style="{width: '80%'}"
                          :label="item.show_name"
                          :value="item.is_show===1"
                          border @change="e => updateFeildShowHide(e, item, index)" size="mini">
                        <!-- <span @click="showEventDialog = true">事件</span> -->
                        </el-checkbox>
                        <span :style="{fontSize: '13px', color: '#409EFF'}" @click="openEvent(item)">事件</span>
                      </div>
                    </el-form-item>
                </el-form>
                </div>
            </el-tab-pane>
            <el-tab-pane label="数据" name="third">
                <div class="tab-pane">
                    <el-form :model="form">
                        <el-form-item label="数据源名称" :label-width="formLabelWidth">
                            <el-input v-model="form.name" autocomplete="off" placeholder="请输入页面名称"></el-input>
                        </el-form-item>
                        <el-form-item label="坐标类型" :label-width="formLabelWidth" class="textLeft">
                            <el-radio-group v-model="form.data_type" size="mini">
                                <el-radio-button label="1">点坐标</el-radio-button>
                                <el-radio-button label="3">面坐标</el-radio-button>
                                <el-radio-button label="2">线坐标</el-radio-button>
                                <el-radio-button label="4">场景坐标</el-radio-button>
                            </el-radio-group>
                        </el-form-item >
                        <el-form-item label="数据源" :label-width="formLabelWidth">
                            <el-select v-model="form.source_id" placeholder="请选择数据源"
                            class="select1"
                            @change="sourceChange"
                            @focus="findTreeByApplyId">
                            <el-option
                            v-for="item in sourceList"
                            :label="item.text"
                            :value="item.id"
                            :key="item.id">
                            </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item v-if="form.source_id!==''" label="数据表" :label-width="formLabelWidth">
                            <el-autocomplete
                            class="inline-input"
                            v-model="form.data_table"
                            :fetch-suggestions="querySearch"
                            placeholder="请选择数据表"
                            @select="item => tableChange(item.value)">
                            </el-autocomplete>
                        </el-form-item>
                        <el-form-item v-if="form.source_id!==''" label="数据联动" :label-width="formLabelWidth">
                            <div class="show-field">
                                <p v-for="(item, index) in dataFieldList" :key="index">
                                    {{item.show_name}}
                                </p>
                            </div>
                            <el-button type="primary" plain class="add-btn" size="mini">
                            <span @click="showEidtField=true">编辑字段</span>
                            </el-button>
                        </el-form-item>
                        <el-form-item v-if="form.source_id!==''" label="经纬度" :label-width="formLabelWidth" class="textLeft">
                            <div class="latitude">
                                <span>经度=</span>
                                <el-select v-model="form.longitude" placeholder="请选择字段" class="table-field" size="mini">
                                    <el-option v-for="(item, index) in dataTableList"
                                    :label="item.COLUMN_NAME"
                                    :value="item.COLUMN_NAME"
                                    :key="index">
                                    </el-option>
                                </el-select>
                            </div>
                            <div class="latitude">
                                <span>纬度=</span>
                                <el-select v-model="form.latitude" placeholder="请选择字段" class="table-field" size="mini">
                                    <el-option v-for="(item, index) in dataTableList"
                                    :label="item.COLUMN_NAME"
                                    :value="item.COLUMN_NAME"
                                    :key="index">
                                    </el-option>
                                </el-select>
                            </div>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialogfooter">
                    <el-button class="width1" type="primary" @click="submit">保  存</el-button>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
    <EditDataField :visible="showEidtField" @closeDialog="showEidtField = false"
    :currentDatabaseId="currentDatabaseId" :dataTableName="dataTableName" :fieldList="dataFieldList"/>
    <EventDialog :visible="showEventDialog" @closeDialog="showEventDialog = false"
    :currentDatabaseId="currentDatabaseId" :dataTableName="dataTableName" :tableFieldId="tableFieldId"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { addMapDataPoint, findMapDataConfigDetail, editMapDataPoint,
  findTreeByApplyId, getDataBaseTable, getDataBaseTableField, editMapDataCofig,
  updateFeildShowHide } from '@/api/applySouce'
import store from '@/store'
import EditDataField from './EditDataField'
import EventDialog from './EventDialog'
export default {
  name: 'DataManage',
  props: ['dataActiveName', 'visible'],
  components: {
    EditDataField,
    EventDialog
  },
  data () {
    return {
      formLabelWidth: '90px',
      coordinate: '点坐标',
      showEidtField: false,
      showEventDialog: false, // 事件弹窗
      activeName: 'first',
      isAddStyle: true, // 判断是编辑还是新增样式与弹窗
      styleform: { // 样式表单
        point_way: '1',
        point_type: 'image',
        point_size: '',
        point_url: '',
        point_height: '',
        rotateSpeed: ''
      },
      popupForm: { // 弹窗表单
        tc_type: '0'
      },
      form: {
        name: '',
        source_id: '',
        data_type: '1',
        data_table: '',
        longitude: '',
        latitude: '',
        data_field: [{
          show_name: '',
          corr_field: '',
          unit: '',
          is_title: false
        }]
      },
      sourceList: [], // 数据源表
      dataBaseList: [], // 数据库表
      currentDatabaseId: '', // 当前选择的数据源id
      dataTableName: '', // 当前选择的数据库
      dataTableList: [], // 根据数据库表查询到的字段列表
      dataFieldList: [], // 显示的字段列表
      tableFieldId: '' // 点击的显示字段的id
    }
  },
  computed: {
    ...mapGetters(['token', 'bimapplyId', 'pageId', 'pageName', 'dataConfigId', 'dataConfigName', 'dataType'])
  },
  created () {
    this.findTreeByApplyId()
  },
  watch: {
    dataConfigId (v) {
    //   console.log('v:' + v)
      // this.findMapDataConfigDetail(v)
    },
    dataActiveName (v) {
      this.activeName = v
    },
    visible (v) {
      if (v) {
        this.findMapDataConfigDetail(this.dataConfigId)
      }
    }
  },
  mounted () {
    let nodeObj = document.getElementsByClassName('tab-pane')
    for (let i = 0; i < nodeObj.length; i++) {
      nodeObj[i].style.height = (document.body.offsetHeight - 370) + 'px'
    }
  },
  methods: {
    // 关闭编辑窗口
    closeDataManage () {
      this.$confirm('保存编辑的数据，请点击确定')
        .then(_ => {
          if (this.isAddStyle) {
            this.addMapDataPoint()
          } else {
            this.editMapDataPoint()
          }
        }).catch(e => e)
      this.$emit('closeDataManage')
    },
    // 新增样式与接口
    addMapDataPoint () {
      let obj = {
        data_config_id: this.dataConfigId,
        point_way: this.styleform.point_way,
        point_type: this.styleform.point_type,
        point_size: this.styleform.point_size,
        point_url: this.styleform.point_url,
        point_height: this.styleform.point_height,
        rotateSpeed: this.styleform.rotateSpeed,
        tc_type: this.popupForm.tc_type
      }
      addMapDataPoint(this.token, obj).then(res => {
        if (res.data.success) {
          store.dispatch('OpenTipsDialog', res.data.msg)
        }
      }).catch(er => {
        console.log(er)
      })
    },
    // 编辑样式与弹窗
    editMapDataPoint () {
      let obj = {
        id: this.styleform.id,
        point_way: this.styleform.point_way,
        point_type: this.styleform.point_type,
        point_size: this.styleform.point_size,
        point_url: this.styleform.point_url,
        point_height: this.styleform.point_height,
        rotateSpeed: this.styleform.rotateSpeed,
        tc_type: this.popupForm.tc_type
      }
      editMapDataPoint(this.token, obj).then(res => {
        if (res.data.success) {
          store.dispatch('OpenTipsDialog', res.data.msg)
        }
      }).catch(er => {
        console.log(er)
      })
    },
    // 获取地图数据管理详情
    findMapDataConfigDetail (v) {
      findMapDataConfigDetail(this.token, v, this.dataType).then(res => {
        if (res.data.success) {
          console.log('result:', res.data.obj)
          if (res.data.obj.map_data_point === null) {
            this.isAddStyle = true
            this.styleform = {
              point_way: '1',
              point_type: 'image',
              point_size: '',
              point_url: '',
              point_height: '',
              rotateSpeed: ''
            }
            this.popupForm.tc_type = '0'
          } else {
            this.isAddStyle = false
            this.styleform = res.data.obj.map_data_point
            this.popupForm.tc_type = String(res.data.obj.map_data_point.tc_type)
          }
          this.dataFieldList = res.data.obj.map_data_field
          this.form = res.data.obj.data_config
          this.dataTableName = res.data.obj.data_config.data_table
          this.currentDatabaseId = res.data.obj.data_config.source_id
          // 根据当前的数据源获取对应的数据表
          this.sourceChange(res.data.obj.data_config.source_id)
          // 根据当前的数据表获取对应的字段列表
          this.tableChange(res.data.obj.data_config.data_table)
        }
      }).catch(er => {
        console.log(er)
      })
    },
    // 获取数据源数据
    findTreeByApplyId () {
      this.sourceList = []
      findTreeByApplyId(this.token, this.bimapplyId, 'dataSource').then(res => {
        if (res.data.length > 0) {
          this.getSourceList(res.data)
        }
        // store.dispatch('OpenTipsDialog', res.data.msg)
      }).catch(er => {
        console.log(er)
      })
    },
    // 遍历并获取数据源列表
    getSourceList (val) {
      val.map(item => {
        if (item.attributes.type === 'dataSource') {
          this.sourceList.push({id: item.id, text: item.text})
        } else {
          if (item.children.length > 0) {
            this.getSourceList(item.children)
          }
        }
      })
    },
    // 数据源变化时 获取数据表
    sourceChange (v) {
      this.currentDatabaseId = v
      this.dataBaseList = []
      this.dataTableList = []
      getDataBaseTable(this.token, v).then(res => {
        // console.log(res)
        if (res.data.success) {
          this.dataBaseList = res.data.obj
        }
      }).catch(er => {
        console.log(er)
      })
    },
    // 根据选择的数据表获取字段
    tableChange (v) {
      this.dataTableList = []
      this.dataTableName = v
      getDataBaseTableField(this.token, this.currentDatabaseId, v).then(res => {
        if (res.data.success) {
          this.dataTableList = res.data.obj
        }
      }).catch(er => {
        console.log(er)
      })
    },
    // 提交表单
    submit () {
      this.editMapDataCofig()
    },
    // 编辑数据
    editMapDataCofig () {
      let obj = {
        id: this.form.id,
        page_id: this.form.page_id,
        name: this.form.name,
        data_type: this.form.data_type,
        source_id: this.form.source_id,
        data_table: this.form.data_table,
        longitude: this.form.longitude,
        latitude: this.form.latitude,
        data_field: this.form.data_field
      }
      editMapDataCofig(this.token, obj).then(res => {
        if (res.data.success) {
          store.dispatch('OpenTipsDialog', res.data.msg)
        }
      }).catch(er => {
        console.log(er)
      })
    },
    // 更新字段显隐
    updateFeildShowHide (v, item, index) {
      let isShow = 1
      if (v) {
        isShow = 1
      } else {
        isShow = 0
      }
      this.dataFieldList[index].is_show = isShow
      updateFeildShowHide(this.token, {id: item.id, is_show: isShow})
    },
    // 数据表搜索框
    querySearch (queryString, cb) {
      let list = []
      this.dataBaseList.forEach((val) => {
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
    openEvent (item) {
      // console.log(item)
      this.tableFieldId = item.id
      this.showEventDialog = true
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.data-con{
    width: 100%;
    height: 100%;
    // float: left;
    .data-top{
        width: 100%;
        height: 60px;
        border-bottom: 1px solid #E4E7ED;
        box-sizing: border-box;
        line-height: 60px;
        p{
            width: 70%;
            float: left;
            margin: 0;
            text-align: left;
            padding-left: 20px;
            font-weight: bold;
        }
        i{
            font-size: 18px;
            float: right;
            right: 20px;
            top: 18px;
            position: relative;
        }
    }
    .coordinate{
        margin-top: 20px;
        p{
            text-align: left;
            padding-left: 20px;
        }
    }
    .data-cont{
        margin-top: 20px;
        height: calc(100% - 171px);
        .el-tabs__nav{
            .el-tabs__item{
              height: 45px !important;
              line-height: 45px !important;
            }
        }
        .tab-pane{
            // overflow-y: auto;
            .select1{
              width: 100%;
            }
        }
        .el-form-item__label{
            font-size: 13px;
            text-align: left;
        }
        .el-form-item__content{
            text-align: left;
        }
        .el-radio{
            margin-right: 10px;
            margin-bottom: 5px;
            margin-top: 5px;
        }
        .el-radio.is-bordered+.el-radio.is-bordered{
            margin-left: 0;
        }
        .el-checkbox{
            margin-right: 10px;
            margin-bottom: 0px;
            margin-top: 0px;
        }
        .el-checkbox.is-bordered+.el-checkbox.is-bordered{
            margin-left: 0;
        }
    }
    .show-field{
        width: 100%;
        border: 1px solid #b3d8ff;
        box-sizing: border-box;
        min-height: 40px;
        p{
            margin: 10px 15px;
            line-height: 10px;
        }
    }
    .latitude{
        width: 100%;
        text-align: left;
        span{
          width: 50px;
          display: block;
          float: left;
        }
        .el-select{
          width: calc(100% - 50px);
        }
    }
}
</style>
