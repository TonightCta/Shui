<template>
    <el-dialog class="dialog1"
    :title="title"
    :visible.sync="dialogFormVisible"
    :before-close="handleClose">
        <el-form :model="form">
            <el-form-item label="分类名称" :label-width="formLabelWidth">
                <el-input v-model="form.name" autocomplete="off"
                 placeholder="请输入分类名称" @input="nameChange"></el-input>
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
import { addClassify, editClassify } from '@/api/applySouce'
import store from '@/store'
export default {
  name: 'AddCategory',
  props: ['visible', 'type', 'id', 'title', 'classifyName'],
  data () {
    return {
      formLabelWidth: '120px',
      form: {
        name: ''
      }
    }
  },
  computed: {
    dialogFormVisible: {
      get () {
        return this.visible
      }
    },
    ...mapGetters(['token', 'bimapplyId', 'bimapplyName', 'pageId'])
  },
  watch: {
    classifyName (v) {
      this.form.name = v
    },
    title (v) {
      if (v === '新增分类') {
        this.form.name = ''
      }
    }
  },
  mounted () {
  },
  updated () {
    // console.log('90-90-9890:' + this.dialogFormVisible)
    // console.log('======', this.type, this.title, this.classifyName)
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
      if (this.title === '编辑分类') {
        this.editClassify()
      } else {
        this.addClassify()
      }
    },
    // 添加分类
    addClassify () {
      addClassify(this.token,
        {
          apply_id: this.bimapplyId,
          classify_name: this.form.name,
          classify_type: this.type,
          page_id: this.pageId
        }).then(res => {
        if (res.data.success) {
          this.$emit('updateClassify')
          this.close()
          this.form = {name: ''}
        }
        store.dispatch('OpenTipsDialog', res.data.msg).then(() => {
        })
      }).catch(er => {
        console.log(er)
      })
    },
    // 编辑数据源及分类
    editClassify () {
      editClassify(this.token, {id: this.id, classify_name: this.form.name}).then(res => {
        if (res.data.success) {
          store.dispatch('OpenTipsDialog', '操作成功')
          this.$emit('updateClassify')
          this.close()
        } else {
          store.dispatch('OpenTipsDialog', '操作失败')
        }
      })
    },
    nameChange (val) {
      // console.log(val)
      this.form.name = val
    }
  }
}
</script>
<style ref="stylesheet/scss" lang="scss" >
</style>
