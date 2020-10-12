<template>
    <el-dialog class="editfield-dialog" title="编辑字段"
    :visible.sync="dialogFormVisible"
    :before-close="handleClose">
        <el-form>
            <el-form-item label="数据联动" :label-width="formLabelWidth">
            <div class="data-linkage" v-for="(item, index) in datafieldList" :key="index">
              <el-checkbox :value="item.is_title===1" label="标题" size="mini"
               @change="e => isTitleChange(e, item, index)"></el-checkbox>
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
        </el-form>
        <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
        </div>
    </el-dialog>
</template>
<script>
import { mapGetters } from 'vuex'
import { getDataBaseTableField, editMapDataFeild } from '@/api/applySouce'
import store from '@/store'
export default {
  name: 'AddCategory',
  props: ['visible', 'currentDatabaseId', 'dataTableName', 'fieldList'],
  data () {
    return {
      formLabelWidth: '90px',
      // 判断父组件传过来的fieldList是否有值，如果没有要初始化
      datafieldList: this.fieldList.length > 0 ? this.fieldList : [{
        show_name: '',
        corr_field: '',
        unit: '',
        is_title: 0
      }],
      dataTableList: []
    }
  },
  computed: {
    dialogFormVisible: {
      get () {
        return this.visible
      }
    },
    ...mapGetters(['token', 'dataConfigId'])
  },
  watch: {
    dataTableName (v) {
      this.tableChange(v)
    },
    fieldList: {
      deep: true,
      handler (v) {
        this.datafieldList = v
      }
    }
  },
  mounted () {
  },
  methods: {
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
    // 根据选择的数据表获取字段
    tableChange (v) {
      this.dataTableList = []
      getDataBaseTableField(this.token, this.currentDatabaseId, v).then(res => {
        if (res.data.success) {
          this.dataTableList = res.data.obj
        }
      }).catch(er => {
        console.log(er)
      })
    },
    // 删除字段
    delCorrFild (index) {
      this.datafieldList.splice(index, 1)
    },
    // 添加显示字段
    addCorrFiled () {
      this.datafieldList.push({
        show_name: '',
        corr_field: '',
        unit: '',
        is_title: 1
      })
    },
    // 提交编辑
    submit () {
      let arrStr = JSON.stringify(this.datafieldList)
      editMapDataFeild(this.token, {id: this.dataConfigId, data_field: arrStr}).then(res => {
        if (res.data.success) {
          this.close()
          store.dispatch('OpenTipsDialog', res.data.msg)
        }
      }).catch(er => er)
    },
    // 点击checkbox
    isTitleChange (e, item, index) {
      let isTitle = 1
      if (e) {
        isTitle = 1
      } else {
        isTitle = 0
      }
      this.datafieldList[index].is_title = isTitle
    }
  }
}
</script>
<style ref="stylesheet/scss" lang="scss" >
.editfield-dialog{
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
    .table-field{
    width: 110px !important;
    }
    .table-field2{
      width: 60px !important;
    }
  }
</style>
