<template>
    <el-dialog class="dialog1 add-date" title="添加数据"
    :visible.sync="dialogFormVisible"
    :before-close="handleClose">
        <el-form :model="form">
          <el-form-item label="数据源名称" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off" placeholder="请输入页面名称"></el-input>
          </el-form-item>
          <el-form-item label="坐标类型" :label-width="formLabelWidth" class="textLeft">
            <el-radio-group v-model="form.data_type" size="small">
                <el-radio-button label="1">点坐标</el-radio-button>
                <el-radio-button label="3">面坐标</el-radio-button>
                <el-radio-button label="2">线坐标</el-radio-button>
                <el-radio-button label="4">场景坐标</el-radio-button>
            </el-radio-group>
          </el-form-item >
          <el-form-item label="数据源" :label-width="formLabelWidth">
            <el-select v-model="form.source_id" placeholder="请选择数据源"
            @change="sourceChange" @focus="findTreeByApplyId">
              <el-option
              v-for="item in sourceList"
              :label="item.text"
              :value="item.id"
              :key="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="form.source_id!==''" label="数据表" :label-width="formLabelWidth">
            <!-- <el-select v-model="form.data_table" placeholder="请选择数据表" @change="tableChange">
              <el-option v-for="(item, index) in dataBaseList"
               :label="item.TABLE_NAME"
               :value="item.TABLE_NAME"
               :key="index">
               </el-option>
            </el-select> -->
            <el-autocomplete
              class="inline-input"
              v-model="form.data_table"
              :fetch-suggestions="querySearch"
              placeholder="请选择数据表"
              @select="tableChange">
            </el-autocomplete>
          </el-form-item>
          <el-form-item v-if="form.source_id!==''" label="数据联动" :label-width="formLabelWidth">
            <div class="data-linkage" v-for="(item, index) in form.data_field" :key="index">
              <el-checkbox v-model="item.is_title" label="标题" size="mini"></el-checkbox>
              <el-input v-model="item.show_name" placeholder="显示名称" class="table-field" size="mini"></el-input>
              <el-select v-model="item.corr_field" placeholder="请选择字段" class="table-field" size="mini">
                <el-option v-for="(item, index) in dataTableList"
                :label="item.COLUMN_NAME"
                :value="item.COLUMN_NAME"
                :key="index">
                </el-option>
              </el-select>
              <el-input v-model="item.unit" placeholder="单位" class="table-field2" size="mini"></el-input>
              <i class="el-icon-circle-close" @click="delCorrFild(index)"></i>
            </div>
            <el-button type="primary" plain class="add-btn" size="mini" @click="addCorrFiled">
              <i class="el-icon-circle-plus-outline"></i>
              <span>显示字段</span>
            </el-button>
          </el-form-item>
           <el-form-item v-if="form.source_id!==''" label="经纬度" :label-width="formLabelWidth" class="textLeft">
              <span> 经度=</span>
              <el-select v-model="form.longitude" placeholder="请选择字段" class="table-field" size="mini">
                <el-option v-for="(item, index) in dataTableList"
                :label="item.COLUMN_NAME"
                :value="item.COLUMN_NAME"
                :key="index">
                </el-option>
              </el-select>
              <span :style="{marginLeft: '10px'}">纬度=</span>
              <el-select v-model="form.latitude" placeholder="请选择字段" class="table-field" size="mini">
                <el-option v-for="(item, index) in dataTableList"
                :label="item.COLUMN_NAME"
                :value="item.COLUMN_NAME"
                :key="index">
                </el-option>
              </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
        </div>
    </el-dialog>
</template>
<script>
import { mapGetters } from 'vuex'
import { findTreeByApplyId, getDataBaseTable, getDataBaseTableField, addMapDataCofig } from '@/api/applySouce'
import store from '@/store'
export default {
  name: 'AddData',
  props: ['visible'],
  data () {
    return {
      formLabelWidth: '100px',
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
      dataTableList: [] // 字段列表
    }
  },
  computed: {
    dialogFormVisible: {
      get () {
        return this.visible
      }
    },
    ...mapGetters(['token', 'bimapplyId', 'pageId'])
  },
  watch: {
    // visible (v) {
    //   if (v) {
    //     this.findTreeByApplyId()
    //   }
    // }
  },
  mounted () {
  },
  created () {
    // this.findTreeByApplyId()
  },
  methods: {
    close () {
      this.$emit('closeDialog')
      this.form = {
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
      }
    },
    handleClose () {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.close()
        })
        .catch(er => {
          console.log(er)
        })
    },
    // 获取数据源数据
    findTreeByApplyId () {
      findTreeByApplyId(this.token, this.bimapplyId, 'dataSource').then(res => {
        if (res.data.length > 0) {
          this.sourceList = []
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
    tableChange (item) {
      this.dataTableList = []
      getDataBaseTableField(this.token, this.currentDatabaseId, item.value).then(res => {
        if (res.data.success) {
          this.dataTableList = res.data.obj
        }
      }).catch(er => {
        console.log(er)
      })
    },
    // 提交表单
    submit () {
      this.addMapDataCofig()
    },
    // 新增
    addMapDataCofig () {
      let arrStr = JSON.stringify(this.form.data_field)
      let obj = {
        apply_id: this.bimapplyId,
        page_id: this.pageId,
        data_field: arrStr,
        name: this.form.name,
        source_id: this.form.source_id,
        data_type: this.form.data_type,
        data_table: this.form.data_table,
        longitude: this.form.longitude,
        latitude: this.form.latitude
      }
      addMapDataCofig(this.token, obj).then(res => {
        if (res.data.success) {
          this.close()
          this.$emit('updateClassify')
          store.dispatch('OpenTipsDialog', res.data.msg)
        }
      }).catch(er => {
        console.log(er)
      })
    },
    // 添加显示字段
    addCorrFiled () {
      this.form.data_field.push({
        show_name: '',
        corr_field: '',
        unit: '',
        is_title: false
      })
    },
    // 删除字段
    delCorrFild (index) {
      this.form.data_field.splice(index, 1)
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
    }
  }
}
</script>
<style ref="stylesheet/scss" lang="scss" >
.add-date{
  .el-dialog{
    width: 550px;
  }
  .el-form-item__content {
    width: 370px !important;
  }
  .table-field{
    width: 110px !important;
  }
  .table-field2{
    width: 60px !important;
  }
  .data-linkage{
    text-align: left;
    margin-right: 5px;
    .el-checkbox{
      .el-checkbox__label{
        padding-left: 2px;
        font-size: 13px;
      }
    }
  }
  .add-btn{
    width: 100%;
  }
  .textLeft{
    text-align: left;
  }
}
</style>
