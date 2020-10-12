<template>
    <el-dialog class="dialog1 addnewpage" :title="title"
    :visible.sync="dialogFormVisible"
    :before-close="handleClose">
        <el-form :model="form">
          <el-form-item label="页面名称" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off" placeholder="请输入页面名称"></el-input>
          </el-form-item>
          <el-form-item label="是否为首页" :label-width="formLabelWidth">
            <el-radio-group v-model="form.is_index">
              <el-radio :label="0">否</el-radio>
              <el-radio :label="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="页面类型" :label-width="formLabelWidth">
            <el-select v-model="form.page_type" placeholder="请选择页面类型">
              <el-option
                v-for="(item, index) in options"
                :key="index"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="form.page_type === '2'" label="页面URL" :label-width="formLabelWidth">
            <el-input v-model="form.page_url" autocomplete="off" placeholder="请输入页面URL"></el-input>
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
import { addPage, editPage } from '@/api/applySouce'
import store from '@/store'
export default {
  name: 'AddNewPage',
  props: ['visible', 'title', 'editData'],
  data () {
    return {
      formLabelWidth: '120px',
      form: {
        apply_id: '',
        name: '',
        is_index: 0,
        page_type: '1',
        page_url: ''
      },
      options: [
        {
          value: '1',
          label: '地图'
        },
        {
          value: '2',
          label: '园区'
        }
      ]
    }
  },
  computed: {
    dialogFormVisible: {
      get () {
        return this.visible
      }
    },
    ...mapGetters(['token', 'bimapplyId'])
  },
  watch: {
    editData: { // 此值为props传递过来的值
      deep: true,
      handler (v) {
        if (JSON.stringify(v) !== '{}') {
          this.form = v
          if (v.page_type) {
            this.form.page_type = String(v.page_type)
          }
        }
      }
    },
    title (v) {
      if (v === '添加页面') {
        this.form = {
          apply_id: '',
          name: '',
          page_type: '1',
          is_index: 0,
          page_url: ''
        }
      }
    }
  },
  mounted () {
    // console.log('90-90-9890:' + this.dialogFormVisible)
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
    submit () {
      if (this.title === '编辑页面') {
        this.editPage()
      } else {
        this.addPage()
      }
    },
    // 添加页面
    addPage () {
      this.form.apply_id = this.bimapplyId
      addPage(this.token, this.form).then(res => {
        if (res.data.success) {
          this.$emit('updateClassify')
          store.commit('SET_PAGEID', res.data.obj.id)
          store.commit('SET_PAGENAME', res.data.obj.name)
          this.$emit('clickPagedata')
        }
        store.dispatch('OpenTipsDialog', res.data.msg).then(() => {
          this.close()
        })
      }).catch(er => {
        console.log(er)
      })
    },
    // 编辑页面
    editPage () {
      let obj = {
        id: this.form.id,
        name: this.form.name,
        is_index: this.form.is_index,
        page_type: this.form.page_type,
        page_url: this.form.page_url
      }
      editPage(this.token, obj).then(res => {
        if (res.data.success) {
          this.$emit('updateClassify')
        }
        store.dispatch('OpenTipsDialog', res.data.msg).then(() => {
          this.close()
        })
      }).catch(er => {
        console.log(er)
      })
    }
  }
}
</script>
<style ref="stylesheet/scss" lang="scss" >
.addnewpage{
  .el-form-item__content{
    text-align: left;
  }
}
</style>
