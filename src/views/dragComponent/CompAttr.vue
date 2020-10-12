<template>
    <!--使用draggable组件-->
    <div class="comp-attr">
        <router-link to="/workbench" tag="i" class="el-icon-close goBack"></router-link>
        <p style="marginTop:30px;">编辑组件属性</p>
        <div v-if="attrList.length > 0" class="cont">
          <div v-for="(item, index) in attrList" :key="index" class="attr-item">
            <span>{{item.label}}</span>
            <el-input v-if="item.type==='input'" v-model="item.value"></el-input>
            <el-select v-if="item.type==='select'" v-model="item.value">
              <el-option
                v-for="(item2, selectIndex) in item.options"
                :key="selectIndex + 'select'"
                :label="item2.label"
                :value="item2.value">
              </el-option>
            </el-select>
            <el-checkbox-group v-if="item.type==='checkbox'" v-model="item.value">
              <el-checkbox
                v-for="(item2, checkboxIndex) in item.options"
                :key="checkboxIndex + 'checkbox'"
                :label="item2.value"
                :value="item2.value">
              </el-checkbox>
            </el-checkbox-group>
            <!-- 备选项编辑 -->
            <div v-if="item.type==='options'">
              <div class="option" v-for="(option, optionIndex) in item.value" :key="optionIndex + 'options'">
                <div class="option-item"><span>内容：</span><el-input v-model="option.value"></el-input></div>
                <div class="option-item" v-if="option.event"><span>事件：</span><el-input v-model="option.event"></el-input></div>
                <div class="option-item" v-if="component.type === 'nav'"><span>icon：</span>
                  <el-select v-model="option.icon" size="mini">
                    <el-option
                      v-for="icon in iconList"
                      :key="icon.value"
                      :label="icon.label"
                      :value="icon.value">
                    </el-option>
                  </el-select>
                </div>
                <i class="el-icon-circle-close del" @click="delOption(index, optionIndex)"></i>
              </div>
              <el-button size="mini" @click="addOption(index)">新增选项</el-button>
            </div>
          </div>
          <el-button class="submit" type="primary" @click="submit">保 存</el-button>
          <el-button class="submit" type="danger" @click="deletComp">删除组件</el-button>
        </div>
    </div>
</template>
<script>
// 导入draggable组件
import draggable from 'vuedraggable'
export default {
  name: 'CompAttr',
  // 注册draggable组件
  components: {
    draggable
  },
  props: ['component', 'editAttr'],
  data () {
    return {
      // 定义要被拖拽对象的数组
      attrList: [],
      form: {},
      sizeOptions: [
        {label: '常规', value: ''},
        {label: '中等', value: 'medium'},
        {label: '小型', value: 'small'},
        {label: '超小', value: 'mini'}
      ],
      iconList: [
        {label: 'setting', value: 'el-icon-setting'},
        {label: 'data', value: 'el-icon-s-data'},
        {label: 'share', value: 'el-icon-share'},
        {label: 'data-line', value: 'el-icon-data-line'},
        {label: 'school', value: 'el-icon-school'},
        {label: 'house', value: 'el-icon-house'},
        {label: 'office-building', value: 'el-icon-office-building'},
        {label: 'guide', value: 'el-icon-guide'},
        {label: 'position', value: 'el-icon-position'},
        {label: 'location-information', value: 'el-icon-location-information'},
        {label: 'place', value: 'el-icon-place'}
      ]
    }
  },
  watch: {
    editAttr (v) {
      let that = this
      that.attrList = []
      if (JSON.stringify(that.component) === '{}') {
        return
      }
      let keyArr = Object.keys(that.component.attr)
      if (that.component.type === 'input') {
        keyArr.forEach(key => {
          let obj = {
            value: that.component.attr[key],
            key: key
          }
          if (key === 'value') {
            obj.label = '默认值:'
            obj.type = 'input'
          }
          if (key === 'label') {
            obj.label = '输入框label:'
            obj.type = 'input'
          }
          if (key === 'placeholder') {
            obj.label = '输入框提示:'
            obj.type = 'input'
          }
          if (key === 'size') {
            obj.label = '输入框大小:'
            obj.type = 'select'
            obj.options = that.sizeOptions
          }
          if (key === 'type') {
            obj.label = '输入框类型:'
            obj.type = 'select'
            obj.options = [
              {label: '文本', value: 'text'},
              {label: '文本域', value: 'textarea'}
            ]
          }
          that.attrList.push(obj)
        })
      }
      if (that.component.type === 'button') {
        keyArr.forEach(key => {
          let obj = {
            value: that.component.attr[key],
            key: key
          }
          if (key === 'name') {
            obj.label = '按钮名称:'
            obj.type = 'input'
          }
          if (key === 'butType') {
            obj.label = '按钮类型:'
            obj.type = 'select'
            obj.options = [
              {label: '默认按钮', value: ''},
              {label: '主要按钮', value: 'primary'},
              {label: '成功按钮', value: 'success'},
              {label: '信息按钮', value: 'info'},
              {label: '警告按钮', value: 'warning'},
              {label: '危险按钮', value: 'danger'}
            ]
          }
          if (key === 'position') {
            obj.label = '按钮位置:'
            obj.type = 'select'
            obj.options = [
              {label: '左边', value: 'left'},
              {label: '中间', value: 'center'},
              {label: '右边', value: 'right'}
            ]
          }
          if (key === 'size') {
            obj.label = '按钮大小:'
            obj.type = 'select'
            obj.options = that.sizeOptions
          }
          if (key === 'width') {
            obj.label = '按钮宽度:'
            obj.type = 'input'
          }
          that.attrList.push(obj)
        })
      }
      if (that.component.type === 'radio') {
        // 深拷贝对象数组
        let arr = JSON.parse(JSON.stringify(that.component.attr['options']))
        keyArr.forEach(key => {
          let obj = {
            value: that.component.attr[key],
            key: key
          }
          if (key === 'label') {
            obj.label = '输入框label:'
            obj.type = 'input'
          }
          if (key === 'radio') {
            obj.label = '单选框默认值:'
            obj.type = 'select'
            obj.options = arr
          }
          if (key === 'options') {
            obj.label = '编辑备选项:'
            obj.type = 'options'
            obj.value = arr
          }
          that.attrList.push(obj)
        })
      }
      if (that.component.type === 'checkbox') {
        // 深拷贝对象数组
        let arr = JSON.parse(JSON.stringify(that.component.attr['options']))
        keyArr.forEach(key => {
          let obj = {
            value: that.component.attr[key],
            key: key
          }
          if (key === 'label') {
            obj.label = '输入框label:'
            obj.type = 'input'
          }
          if (key === 'checkList') {
            obj.label = '复选框默认值:'
            obj.type = 'checkbox'
            obj.options = arr
            obj.value = [...that.component.attr[key]]
          }
          if (key === 'options') {
            obj.label = '编辑备选项:'
            obj.type = 'options'
            obj.value = arr
          }
          that.attrList.push(obj)
        })
      }
      if (that.component.type === 'nav') {
        // 深拷贝对象数组
        let arr = JSON.parse(JSON.stringify(that.component.attr['items']))
        keyArr.forEach(key => {
          let obj = {
            value: that.component.attr[key],
            key: key
          }
          if (key === 'defaultActive') {
            obj.label = '默认选中项:'
            obj.type = 'select'
            obj.options = arr
          }
          if (key === 'width') {
            obj.label = '导航宽度:'
            obj.type = 'input'
          }
          if (key === 'fontSize') {
            obj.label = '字体大小:'
            obj.type = 'input'
          }
          if (key === 'items') {
            obj.label = '编辑备选项:'
            obj.type = 'options'
            obj.value = arr
          }
          that.attrList.push(obj)
        })
      }
      if (that.component.type === 'select') {
        let arr = JSON.parse(JSON.stringify(that.component.attr['options']))
        keyArr.forEach(key => {
          let obj = {
            value: that.component.attr[key],
            key: key
          }
          if (key === 'label') {
            obj.label = '输入框label:'
            obj.type = 'input'
          }
          if (key === 'options') {
            obj.label = '编辑可选项:'
            obj.type = 'options'
            obj.value = arr
          }
          that.attrList.push(obj)
        })
      }
    }
  },
  methods: {
    // 保存编辑的属性
    submit () {
      let that = this
      that.attrList.forEach(el => {
        // 这里可直接修改父组件传递过来的component，但是不建议这样做，容易造成数据定位困难
        // that.component.attr[el.key] = el.value
      })
      this.$emit('updateCompAttr', that.attrList)
    },
    // 删除组件
    deletComp () {
      this.$emit('delComp')
      this.attrList = []
    },
    // 删除备选项
    delOption (index, optionIndex) {
      let that = this
      that.attrList[index].value.splice(optionIndex, 1)
      // console.log(that.attrList[index], that.attrList[index].value)
    },
    // 新增备选项
    addOption (index) {
      let that = this
      let obj = {
        value: '',
        id: that.attrList[index].value.length
      }
      if (that.component.type === 'nav') {
        obj.icon = 'el-icon-setting'
      }
      that.attrList[index].value.push(
        obj
      )
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.comp-attr{
  width: 25%;
  height: 100%;
  border-right: 1px solid #ccc;
  box-sizing: border-box;
  float: left;
  .goBack{
    font-size: 30px;
    position: absolute;
    font-weight: bold;
    right:15px;
    cursor:pointer;
    top:5px;
  }
  .cont{
    width: 100%;
    .attr-item{
      width: 100%;
      border: solid 1px #eee;
      line-height: 20px;
      font-size: 13px;
      padding: 5px;
      float: left;
      box-sizing: border-box;
      margin: 5px;
      background: #e3f4fd;
      border-radius: 2px;
    }
    .submit{
      width: 80%;
      margin-top: 20px;
    }
    .el-button+.el-button{
      margin-left: 0;
    }
    .option{
      width: 100%;
      margin-bottom: 5px;
      position: relative;
      .option-item{
        width: 100%;
        position: relative;
      }
      .del{
        color: crimson;
        position: absolute;
        right: 10px;
        top: 14px
      }
      .el-input{
        width: 70%;
        box-sizing: border-box;
      }
      .el-select{
        width: 70%;
        margin-top: 2px;
        box-sizing: border-box;
        .el-input{
          width: 100%;
        }
      }
    }
  }
}
</style>
