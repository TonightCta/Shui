<template lang="html">
  <div class="editLeft">
    <p class="leftTitle">控件</p>
    <draggable
     v-model="leftList"
     v-bind="{group:{name:'component',pull:'clone',put:false}}"
     :move="eiditLeftMove"
     @start="editStart"
     @end="editLeftEnd"
     :remove="test"
     class="draggable1"
      >
        <el-button type="primary" size="small" v-for="(item,indexBtn) in leftList" :key="item.icon" :icon="item.icon">{{item.name}}</el-button>
      </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
export default {
  components:{draggable},
  data(){
    return{
      leftList:[],
      componentList:[
        {
          name:'表单',
          type:'menu',
          icon:'el-icon-c-scale-to-original',
          attr:{
            type:'submit',
          }
        },
        {
          name:'面板',
          type:'panel',
          icon:'el-icon-document-add',
          attr:{
            type:'dom'
          }
        }
      ],
      openDra:true,//打开可拖拽区域
      closeDra:false,//关闭可拖拽区域
      addturnMes:{//拖拽类型信息
        type:null,
        showDomBox:true,
      }
    }
  },
  created(){
    this.leftList=this.componentList;
  },
  methods:{
    eiditLeftMove(evt){
      this.addturnMes.type=evt.draggedContext.element.type;
      this.$emit('addTurn',this.addturnMes)
      let classObj = evt.to.className
      if (evt.draggedContext.element.id === '') { // 元素没有id不能拖拽
        return false
      } else if (classObj.indexOf('draggable1') > -1) {
        return false
      }
    },
    editStart(e){//移动开始
      this.$emit('showDra',this.openDra)
    },
    editLeftEnd (e) {//移动结束

      // console.log(e);
      this.$emit('hideDra',this.closeDra)
      // this.$emit('end', e)
    },
    test(){
      alert(1)
    }
  }
}
</script>

<style lang="scss" scoped>
.editLeft{
  width: 18%;
  height: 878px;
  border-right: 1px solid #ccc;
  box-shadow: 0px 0px 10px 5px #999;
  z-index: 10;
  .leftTitle{
    text-align: left;
    font-size: 16px;
    box-sizing: border-box;
    padding-left: 10px;
  }
}
</style>
