<template>
  <div class="panel"
  :style="panelStyle">
    <div v-for="(item, index) in panel.attr_json"
    :key="index + 'a'">
        <div v-if="item.type === 'container'" class="container">
            <p>请将组件拖入</p>
        </div>
        <p :style="{textAlign:item.attr.position}">
          <el-button :icon="item.attr.icon" :type="item.attr.butType" :size="item.attr.size"  v-if="item.type === 'button'">{{item.attr.name}}</el-button>
        </p>
        <div v-if="item.type === 'input'" class="inputcomp">
            <span class="label" style="">{{item.attr.label}}</span>
            <el-input :placeholder="item.attr.placeholder"
            v-model="item.attr.value"
            :size="item.attr.size"
            style="width:300px;"
            :type="item.attr.type">
            </el-input>
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
        <div v-if="item.type === 'radio'">
            <span>{{item.attr.label}}</span>
            <el-radio-group v-model="item.attr.radio">
            <el-radio v-for="(option, index2) in item.attr.options" :key="index2 + 'radio'" :label="option.value">{{option.value}}</el-radio>
            </el-radio-group>
        </div>
        <div v-if="item.type === 'checkbox'">
            <span>{{item.attr.label}}</span>
            <el-checkbox-group v-model="item.attr.checkList">
              <el-checkbox v-for="(option, index2) in item.attr.options" :key="index2 + 'checkbox'" :label="option.value"></el-checkbox>
            </el-checkbox-group>
        </div>
        <div v-if="item.type === 'nav'" class="nav"
        :style="{width: item.attr.width + 'px',
        fontSize: item.attr.fontSize + 'px'}">
          <ul>
            <li v-for="(iteml, index2) in item.attr.items"
                :key="index2 + 'nav'"
                :class="{active: iteml.value === item.attr.defaultActive}"
                @click="events(iteml.event)">
                <div class="li-cont">
                <i :class="iteml.icon"></i>
                {{iteml.value}}
                </div>
            </li>
          </ul>
        </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['panelItem'],
  // 注册draggable组件
  data () {
    return {
      panel: {},
      panelStyle: {}
    }
  },
  created () {
    let obj = {...this.panelItem}
    this.panel = obj
    this.panel.panel_json = JSON.parse(obj.panel_json)
    this.panel.attr_json = JSON.parse(obj.attr_json)
    let style = this.panel.panel_json
    if (style.type === 'normal') {
      this.panelStyle = {
        width: style.width + 'px',
        height: style.height + 'px',
        fontSize: style.fontSize + 'px',
        backgroundColor: style.backgroundColor,
        left: style.left + 'px',
        top: 60 + Number(style.top) + 'px',
        padding: '10px'
      }
    } else {
      this.panelStyle = {
        fontSize: style.fontSize + 'px',
        left: style.left + 'px',
        top: 60 + Number(style.top) + 'px'
      }
    }
  },
  methods: {
    events (funName) {
      this[funName]()
    },
    // 事件
    test () {
      alert('test')
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.panel{
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 4px;
  text-align: left;
  box-sizing: border-box;
  border: 1px solid #dfdfdf;
  z-index: 999;
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
  .label{
    display: inline-block;
    min-width: 70px;
  }
}
</style>
