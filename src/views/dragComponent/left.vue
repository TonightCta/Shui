<template>
    <!--使用draggable组件-->
    <div class="left">
      <div class="comptype-switch">
        <el-radio-group v-model="activeName" @change="handleChange">
          <el-radio-button label="基础组件"></el-radio-button>
          <el-radio-button label="复合组件"></el-radio-button>
        </el-radio-group>
      </div>
      <draggable class="draggable1"
       v-model="list"
       v-bind="{group: {name: 'component', pull: 'clone', put: false}}"
       :move="checkMove"
       @end="onEnd">
        <div class="item" v-for="(item, index) in list" :key="index + 'a'">
            {{item.name}}
        </div>
      </draggable>
    </div>
</template>
<script>
// 导入draggable组件
import draggable from 'vuedraggable'
export default {
  name: 'LeftComponent',
  // 注册draggable组件
  components: {
    draggable
  },
  data () {
    return {
      activeName: '基础组件',
      list: [],
      // 定义要被拖拽对象的数组 属性最多三层，多了深拷贝会很麻烦，且容易出错
      componentList: [
        {
          name: '输入框',
          type: 'input',
          attr: {
            type: 'text',
            size: '',
            value: '',
            label: '输入框：',
            placeholder: '请输入'
          }
        },
        {
          name: '按钮',
          type: 'button',
          attr: {
            name: '按钮',
            width: 100,
            butType: 'primary',
            size: '',
            position: 'right'
          }
        },
        {
          name: '单选框',
          type: 'radio',
          attr: {
            label: '单选框：',
            radio: '备选项1',
            options: [
              {value: '备选项1', id: 1},
              {value: '备选项2', id: 2},
              {value: '备选项3', id: 3}
            ]
          }
        },
        {
          name: '下拉选择器',
          type: 'select',
          attr: {
            label: '选择器：',
            selValue: '',
            options: [
              {value: '选项1', label: 1},
              {value: '选项2', label: 2},
              {value: '选项3', label: 3}
            ]
          }
        },
        {
          name: '多选框',
          type: 'checkbox',
          attr: {
            label: '复选框：',
            checkList: ['复选框1'],
            options: [
              {value: '复选框1', id: 1},
              {value: '复选框2', id: 2},
              {value: '复选框3', id: 3}
            ]
          }
        }
      ],
      combCompList: [
        {
          name: '导航',
          type: 'nav',
          attr: {
            defaultActive: '选项一',
            width: 150,
            fontSize: 15,
            items: [
              {value: '选项一', id: 1, icon: 'el-icon-setting', event: 'test'},
              {value: '选项二', id: 2, icon: 'el-icon-setting'},
              {value: '选项三', id: 3, icon: 'el-icon-setting'}
            ]
          }
        }
      ]
    }
  },
  mounted () {
    this.list = this.componentList
  },
  methods: {
    // 开始拖拽事件
    onStart (e) {
    },
    // 拖拽结束事件
    onEnd (e) {
      this.$emit('end', e)
    },
    // 切换组件类型
    handleChange (val) {
      if (val === '复合组件') {
        this.list = this.combCompList
      } else if (val === '基础组件') {
        this.list = this.componentList
      }
    },
    // 不允许左边组件上下移动
    checkMove (evt) {
      // console.log('evt', evt)
      let classObj = evt.to.className
      if (evt.draggedContext.element.id === '') { // 元素没有id不能拖拽
        return false
      } else if (classObj.indexOf('draggable1') > -1) {
        return false
      }
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.left{
  .comptype-switch{
    width: 100%;
    margin-top: 20px;
  }
}
// .left{
// /*定义要拖拽元素的样式*/
//   .item{
//     border: solid 1px #eee;
//     width: 45%;
//     line-height: 20px;
//     font-size: 13px;
//     padding: 5px;
//     float: left;
//     box-sizing: border-box;
//     margin: 5px;
//     background: #e3f4fd;
//     border-radius: 2px;
//   }
//   .item:hover{
//     background-color: #409eff;
//     cursor: move;
//   }
//   /* .item+.item{
//     border-top:none ;
//   } */

//     width: 30%;
//     height: 100%;
//     border: 1px solid #ccc;
//     box-sizing: border-box;
//     float: left;
// }
// .draggable1{
//   width: 100%;
//   height: 100%;
//   padding: 10px;
//   float: left;
//   box-sizing: border-box;
// }
</style>
