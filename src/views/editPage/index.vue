<template lang="html">
  <div class="editContent">
    <div class="editHeader">
      <router-link tag="span" to="/workbench" class="backBtn">
        <i class="el-icon-back"></i>
        返回上级
      </router-link>
    </div>
    <div class="contentMes">
      <Left @showDra="showDraP" @hideDra="hideDraP" @addTurn="addSucc"/>
      <div class="amap">
        <div id="editMap">

        </div>
        <div class="testMask" v-if="isaddDom">
          <draggable
            :style="{
              width:'100%',
              height:'100%'
              }"
            group="component"
            v-model="componentList"
            class="draggable2"
          >

          </draggable>
        </div>
        <!-- 菜单 -->
        <div class="menuBox" ref="menuBox" v-if="menuBox">
          <ul class="defaultList">
            <li v-for="(menu,indexMe) in menuList" :key="indexMe">
              <i :class="menu.icon"></i>
              {{menu.text}}
            </li>
          </ul>
          <ul  class="defaultList secondList" style="width:90px;">
            <li v-for="(menu,indexMe) in menuList" :key="indexMe">
              <i :class="menu.icon"></i>
              {{menu.text}}
            </li>
          </ul>
        </div>
        <!-- 面板   -->
        <div class="panelBox" ref="panelBox" v-for="(panel,indexPan) in panelList" :key="indexPan" v-if="isSucc">
          <div :style="{
            width:panel.panelStyle.width+'px',
            height:panel.panelStyle.height+'px',
            left:panel.panelStyle.left+'px',
            top:panel.panelStyle.top+'px',
            background:panel.panelStyle.background,
            position:'absolute'
            }" @click="checkPanEd(indexPan)">
            <p class="panelBoxTitle" :style="{background:panel.panelStyle.titleBg,color:panel.panelStyle.textColor}">
              {{panel.panelStyle.title}}
              <i class="el-icon-close" @click.stop="closePanel(indexPan)"></i>
            </p>
          </div>
        </div>

      </div>
      <Right ref="editChild" @changePanS="getEditStyle"/>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import Left from './left'
import Right from './right'
export default {
  data(){
    return{
      isaddDom:false,
      componentList:[],
      isSucc:false,//拖拽是否生效
      panelList:[],
      address:null,
      menuBox:false,//菜单盒子
      menuList:[
        {
          icon:'el-icon-edit',
          text:'首页'
        },
        {
          icon:'el-icon-s-tools',
          text:'运行管理'
        }
      ]
    }
  },
  components:{Left,Right,draggable},
  mounted(){
    this.initMap()
  },
  methods:{
    initMap(){//初始化地图
      let map= new AMap.Map('editMap',{
        zoom:13,
        center:[118.122752,24.46743],
        viewMode:'3D',
        resizeEnable:true
      });
      // 同时引入工具条插件，比例尺插件和鹰眼插件
      AMap.plugin([
          'AMap.ToolBar',
          'AMap.Scale',
      ], function(){
          // 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
          map.addControl(new AMap.ToolBar());

          // 在图面添加比例尺控件，展示地图在当前层级和纬度下的比例尺
          map.addControl(new AMap.Scale());
      });
    },
    showDraP(v){//显示面板
      this.isaddDom=v;
    },
    hideDraP(v){//隐藏可拖拽区域
      this.isaddDom=v;
    },
    addSucc(v){//拖拽成功
      let _this=this;
      if(v.type=='panel'){
        _this.isSucc=true;
        setTimeout(()=>{
          _this.$refs.editChild.showEditList()
        },300)
        if(_this.panelList.length>0){
          let data={
            panelStyle:{//面板可编辑样式
              width:300,
              height:200,
              background:'rgba(255,255,255,.7)',
              titleBg:'rgba(255,255,255,.8)',
              textColor:'rgba(0,0,0,1)',
              left:Number(_this.panelList[_this.panelList.length-1].panelStyle.left)+20,
              top:Number(_this.panelList[_this.panelList.length-1].panelStyle.top)+20,
              title:'面板',
              panIndex:_this.panelList.length,
            }
          };
          _this.panelList.push(data);
        }else{
          let data={
            panelStyle:{//面板可编辑样式
              width:300,
              height:200,
              background:'rgba(255,255,255,.7)',
              titleBg:'rgba(255,255,255,.8)',
              textColor:'rgba(0,0,0,1)',
              left:70,
              top:10,
              title:'面板',
              panIndex:0,
            }
          };
          _this.panelList.push(data);
        }
      }else if(v.type=='menu'){
        _this.menuBox=true;
      }
    },
    closePanel(index){//关闭面板
      if(this.panelList.length<=1){
        this.$refs.editChild.hideEditList()
        this.panelList.splice(index,1)
        this.isSucc=false;
      }else{
        this.panelList.splice(index,1)
        this.$refs.editChild.getPanIndex(this.panelList[this.panelList.length-1].panelStyle);
      }
    },
    getEditStyle(v){//修改面板样式
      this.panelList[v.panIndex].panelStyle=v;
    },
    checkPanEd(index){//选择当前面板
      this.$refs.editChild.getPanIndex(this.panelList[index].panelStyle);
    }
  }
}
</script>

<style lang="scss" scoped>
.editContent{
  width: 100%;
  height: 100%;
  position: relative;
  padding-top: 60px;
  .editHeader{
    width: 100%;
    height: 60px;
    background: #eee;
    z-index: 100;
    position: absolute;
    top:0;
    left: 0;
    box-shadow: 0px 0px 10px 0 #999;
    text-align: left;
    line-height: 60px;
    box-sizing: border-box;
    padding-left: 20px;
    .backBtn{
      cursor:pointer;
      position: relative;
      padding-left: 30px;
      i{
        font-size: 28px;
        position: absolute;
        top:50%;
        margin-top: -14px;
        left: 0;
      }
    }
  }
  .contentMes{
    width: 100%;
    display: flex;
    .amap{
      width: 64%;
      height: 878px;
      position: relative;
      overflow: hidden;
      #editMap{
        width: 100%;
        height: 100%;
      }
      .testMask{
        position: absolute;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0);
        left: 0;
        top:0;
        z-index: 1000;
      }
      .menuBox{
        position: absolute;
        top:10px;
        left:70px;
        ul{
          list-style: none;
          padding: 0;
          display: flex;
          flex-wrap: wrap;
          border-radius: 10px;
          width: fit-content;
          box-shadow: 0px 0px 10px 0 #999;
          background: white;
          box-sizing: border-box;
          li{
            width: 90px;
            text-align: center;
            line-height: 40px;
            cursor:pointer;
            transition: .5s all;
            box-sizing: border-box;
            border-right:1px solid #ccc;
            font-size: 14px;
          }
          li:first-child{
            border-top-left-radius: 10px;
            border-bottom-left-radius: 10px;
          }
          li:last-child{
            border-top-right-radius: 10px;
            border-bottom-right-radius: 10px;
          }
          li:hover{
            background: #0588ff;
            color:white;
          }
        }
        .secondList{
          li:first-child{
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
            border-bottom-left-radius: 0;
          }
          li:last-child{
            border-bottom-right-radius: 10px;
            border-bottom-left-radius: 10px;
            border-top-right-radius: 0;
          }
        }
      }
      .panelBox{
        // position: relative;
        box-shadow: 0px 0px 10px #666;
        // opacity: 0;
        color:white;
        transition: .5s all;
        .panelBoxTitle{
          line-height: 40px;
          margin:0;
          color:black;
          position: relative;
          text-align: left;
          font-weight: bold;
          box-sizing: border-box;
          padding-left: 20px;
          font-size: 15px;
          i{
            cursor:pointer;
            font-size: 20px;
            position: absolute;
            right:15px;
            top:50%;
            margin-top: -10px;
          }
        }
      }
    }
  }
}
</style>
