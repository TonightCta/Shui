<template lang="html">
  <div class="editRight">
    <div class="editMenu">
      <el-tabs v-model="editActive" :stretch="true">
        <el-tab-pane label="属性" name="first">
          <ul class="editAttrMenu">
            <li>
              工具条标题
              <br>
              <br>
              <el-input type="primary" v-model="test" size="small"></el-input>
            </li>
            <li>
              工具条选项
              <br>
              <br>
              <p>
                 <el-checkbox v-model="test"></el-checkbox>
                 <img src="../../assets/成员.png" alt="">
                 <el-input type="primary" v-model="test" size="small" style="width:140px;marginLeft:40px;"></el-input>
                 <span>编辑</span>
                 <span>删除</span>
              </p>
            </li>
            <li>
              <el-button icon="el-icon-plus" size="mini" style="width:100%;color:#0588ff;" @click="addMenu=true">添加菜单</el-button>
            </li>
          </ul>
        </el-tab-pane>
        <el-tab-pane label="样式" name="second">
          样式
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="editPanel" v-if="isEditPanel">
      <el-tabs v-model="editActive" :stretch="true" @tab-click="goTransition">
        <el-tab-pane label="属性" name="first">
          <ul class="editAttr" ref="editAttr">
            <li>
              标题
              <br>
              <br>
              <el-input type="primary" size="mini" v-model="panelStyleC.title"></el-input>
            </li>
            <li>
              组件属性
              <br>
              <br>
              &nbsp;&nbsp;<el-checkbox v-model="panelStyleC.hideTitle">标题隐藏</el-checkbox>
              <el-checkbox v-model="panelStyleC.hideBtn">关闭按钮隐藏</el-checkbox>
            </li>
            <li>
              组件状态
              <br>
              <br>
              &nbsp;&nbsp;<el-checkbox v-model="panelStyleC.hidePanel">隐藏</el-checkbox>
            </li>
            <li>
              层级
              <br>
              <br>
              <el-input type="primary" size="mini" v-model="panelStyleC.zIndex"></el-input>
            </li>
            <li>
              组件刷新
              <br>
              <br>
              &nbsp;&nbsp;<el-checkbox v-model="panelStyleC.refreshPan">每次刷新时间</el-checkbox>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<el-select size="mini" style="width:140px;" v-model="panelStyleC.refreshTime" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </li>
            <li>
              面板页面
              <br>
              <br>
              &nbsp;&nbsp;<el-input type="primary" size="mini" style="width:170px;" v-model="panelStyleC.test1"></el-input><span>编辑</span>
              <br>
              <br>
              &nbsp;&nbsp;<el-input type="primary" size="mini" style="width:170px;" v-model="panelStyleC.test1"></el-input><span>编辑</span><span style="color:#666;">删除</span>
              <p style="textAlign:center;">
                <el-button icon="el-icon-plus" size="mini" style="width:95%;">添加面板页面</el-button>
              </p>
            </li>
            <li>
              <el-button>重置</el-button>
              <el-button type="primary" @click="savePanelStyle">保存</el-button>
            </li>
          </ul>
        </el-tab-pane>
        <el-tab-pane label="样式" name="second">
          <ul ref="editList" class="editList">
            <li>
              尺寸
              <br>
              <br>
              宽&nbsp;&nbsp;<el-input type="primary" style="width:110px" size="mini" v-model="panelStyleC.width">
                <template slot="append">PX</template>
              </el-input>
              &nbsp;
              <!-- <span style="width:30px;display:inline-block;"></span> -->
              高&nbsp;&nbsp;<el-input type="primary" style="width:110px;" size="mini" v-model="panelStyleC.height">
                <template slot="append">PX</template>
              </el-input>
            </li>
            <li>
              位置
              <br>
              <br>
              <el-select v-model="panPosition" @change="choicePosi" style="width:280px;" size="mini" placeholder="请选择">
                <el-option
                  v-for="item in posiList"
                  :key="item.value"
                  :label="item.value"
                  :value="item.type">
                </el-option>
              </el-select>
              <br>
              <br>
              X&nbsp;&nbsp;<el-input type="primary" style="width:100px;" size="mini" v-model="panelStyleC.left"></el-input>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              Y&nbsp;&nbsp;<el-input type="primary" style="width:100px;" size="mini" v-model="panelStyleC.top"></el-input>
            </li>
            <li>
              <div class="">
                背景颜色
                <el-color-picker class="bgPicker" size="mini" :predefine="predefineColors" show-alpha v-model="panelStyleC.background"></el-color-picker>
              </div>
              <div class="">
                标题背景颜色
                <el-color-picker class="bgPicker" size="mini" :predefine="predefineColors" show-alpha v-model="panelStyleC.titleBg"></el-color-picker>
              </div>
            </li>
            <li>
              标题颜色
              <br>
              <br>
              <el-color-picker class="bgPicker" size="mini" :predefine="predefineColors" show-alpha v-model="panelStyleC.textColor"></el-color-picker>
            </li>
            <!--  -->
            <li>
              <el-button @click="resetStyle">重置</el-button>
              <el-button type="primary" @click="savePanelStyle">保存</el-button>
            </li>
          </ul>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 添加菜单 -->
    <div class="" style="textAlign:left;">
      <el-dialog
        title="添加菜单"
        :visible.sync="addMenu"
        width="30%">
        <div class="addMenuBox">
          <ul>
            <li>
              菜单名称
              <br>
              <br>
              <el-input type="primary" v-model="test" size="small"></el-input>
            </li>
            <li>
              菜单图标
              <br>
              <br>
              <p>
                <span>
                  <img src="../../assets/成员.png" alt="" @click="chioceIcon=true">
                  <br>
                  未选状态
                </span>
                <span>
                  <img src="../../assets/管理员.png" alt="" @click="chioceIcon=true">
                  <br>
                  已选状态
                </span>
              </p>
            </li>
            <li>
              菜单事件
              <br>
              <p>
                <el-switch
                  v-model="test"
                  active-color="#13ce66"
                  inactive-color="#C0CCDA">
                </el-switch>
                <el-input style="marginLeft:10px;" type="primary" v-model="test" size="small"></el-input>
                <span style="color:#0588ff;marginLeft:10px;">编辑</span>
                <span style="marginLeft:10px;">删除</span>
                <br>
                <span class="backMsg">鼠标点击时:定位到&nbsp;&nbsp;<span style="color:#0588ff;">坐标</span></span>
              </p>
            </li>
            <li class="needCenter">
              <el-button icon="el-icon-plus" size="small" style="width:80%">添加事件</el-button>
            </li>
            <li class="needCenter">
              <el-button type="primary" size="medium">添加</el-button>
            </li>
          </ul>
        </div>
      </el-dialog>
    </div>
    <div class="" style="textAlign:left;">
      <el-dialog
        title="选择图标"
        :visible.sync="chioceIcon"
        width="30%">
        <div class="chioceIcon">
          <p style="marginTop:-30px;">菜单图标</p>
          <ul>
            <li v-for="(icon,indexIc) in iconList" :key="indexIc">
              <img :src="icon" alt="">
            </li>
            <li>
              <i class="el-icon-plus"></i>
            </li>
          </ul>
          <p>菜单图标</p>
          <ul>
            <li v-for="(icon,indexIc) in iconList" :key="indexIc">
              <img :src="icon" alt="">
            </li>
            <li>
              <i class="el-icon-plus"></i>
            </li>
          </ul>
          <p class="turnBtn">
            <el-button type="primary" size="small">添加</el-button>
          </p>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      panelStyleC:{
        width:300,
        height:200,
        background:'rgba(255,255,255,.7)',
        titleBg:'rgba(255,255,255,.8)',
        textColor:'rgba(0,0,0,1)',
        title:'面板',
        left:70,
        top:10,
        panIndex:0,//面板下标
        hideTitle:false,//隐藏标题
        hideBtn:false,//隐藏按钮
        hidePanel:false,//隐藏按钮
        zIndex:9999,//样式层级
        refreshPan:false,//面板是否刷新
        refreshTime:null,//面板刷新时间
        test1:null,
      },
      isEditPanel:false,//编辑开关
      predefineColors: [//预设颜色
          '#ff4500',
          '#ff8c00',
          '#ffd700',
          '#90ee90',
          '#00ced1',
          '#1e90ff',
          '#c71585',
          'rgba(255, 69, 0, 0.68)',
          'rgb(255, 120, 0)',
          'hsv(51, 100, 98)',
          'hsva(120, 40, 94, 0.5)',
          'hsl(181, 100%, 37%)',
          'hsla(209, 100%, 56%, 0.73)',
          '#c7158577'
      ],
      panPosition:'基于界面定位-左上角',//面板位置
      posiList:[
        {
          value:'基于界面定位-左上角',
          type:1,
        },
        {
          value:'基于界面定位-居中靠上',
          type:2,
        },
        {
          value:'基于界面定位-右上角',
          type:3,
        },
        {
          value:'基于界面定位-居中靠左',
          type:4,
        },
        {
          value:'基于界面定位-垂直水平居中',
          type:5,
        },
        {
          value:'基于界面定位-居中靠右',
          type:6,
        },
        {
          value:'基于界面定位-左下角',
          type:7,
        },
        {
          value:'基于界面定位-居中靠下',
          type:8,
        },
        {
          value:'基于界面定位-右下角',
          type:9,
        },
      ],
      editActive:'first',//默认选中标签
      options: [{
         value: '选项1',
         label: '黄金糕'
       }, {
         value: '选项2',
         label: '双皮奶'
       }, {
         value: '选项3',
         label: '蚵仔煎'
       }, {
         value: '选项4',
         label: '龙须面'
       }, {
         value: '选项5',
         label: '北京烤鸭'
       }],
      test:null,
      addMenu:false,//添加菜单
      chioceIcon:false,//选择图标
      iconList:[
        require('../../assets/成员.png'),
        require('../../assets/管理员.png'),
        require('../../assets/a.png'),
        require('../../assets/b.png'),
        require('../../assets/logo1.png'),
        require('../../assets/map.jpg'),
        require('../../assets/test.jpeg'),
      ],
    }
  },
  methods:{
    resetStyle(){//样式重置
      this.panelStyleC.width='300';
      this.panelStyleC.height='500';
      this.panelStyleC.background='rgba(255,255,255,.7)';
      this.panelStyleC.titleBg='rgba(255,255,255,.8)';
      this.panelStyleC.title='面板';
      this.panelStyleC.textColor='rgba(0,0,0,1)';
    },
    savePanelStyle(){//保存面板样式
      this.$emit('changePanS',this.panelStyleC)
    },
    showEditList(){//显示过渡样式
      this.isEditPanel=true;
      setTimeout(()=>{
        for(let i in this.$refs.editAttr.children){
          if(this.$refs.editAttr.children[i].style){
            this.$refs.editAttr.children[i].style.transform='translateY(0)'
          }
        }
      },10)
    },
    goTransition(){
      setTimeout(()=>{
        for(let i in this.$refs.editList.children){
          if(this.$refs.editList.children[i].style){
            this.$refs.editList.children[i].style.transform='translateY(0)'
          }
        }
      },10)
    },
    hideEditList(){//隐藏编辑列表
      this.$refs.editList.style.opacity='0';
      setTimeout(()=>{
        this.isEditPanel=false;
      },500)
    },
    editPanContent(){//编辑面板内容
      this.$router.push({
        path:'/drag',
        query:{
          pageId:this.$route.query.pageId
        }
      })
    },
    getPanIndex(index){//接收当前面板信息
      this.panelStyleC=index;
    },
    choicePosi(v){//选择面板位置
      let _this=this;
      switch (v){
        case 1:
          _this.panelStyleC.left=70;
          _this.panelStyleC.top=10;
        break;
        case 2:
          _this.panelStyleC.left=460;
          _this.panelStyleC.top=10;
        break;
        case 3:
          _this.panelStyleC.left=900;
          _this.panelStyleC.top=10;
        break;
        case 4:
          _this.panelStyleC.left=70;
          _this.panelStyleC.top=350;
        break;
        case 5:
          _this.panelStyleC.left=460;
          _this.panelStyleC.top=350;
        break;
        case 6:
          _this.panelStyleC.left=900;
          _this.panelStyleC.top=350;
        break;
        case 7:
          _this.panelStyleC.left=70;
          _this.panelStyleC.top=750;
        break;
        case 8:
          _this.panelStyleC.left=460;
          _this.panelStyleC.top=750;
        break;
        case 9:
          _this.panelStyleC.left=900;
          _this.panelStyleC.top=750;
        break;
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.editRight{
  width: 18%;
  height: 877px;
  border-left: 1px solid #ccc;
  box-shadow: 0px 0px 10px 5px #999;
  // z-index: 2800;
  .editMenu{
    width: 90%;
    height: 877px;
    margin:0 auto;
    .el-tabs__content{
      height: 877px;
    }
    ul{
      list-style: none;
      padding: 0;
      li{
        text-align: left;
        padding-bottom: 10px;
        margin-bottom: 10px;
      }
    }
    .editAttrMenu{
      li:nth-child(2){
        p{
          position: relative;
          img{
            width: 30px;
            height: 30px;
            position: absolute;
            top:50%;
            margin-top: -15px;
            left: 20px;
            cursor:pointer;
          }
          span{
            font-size: 14px;
            color:#0588ff;
            margin-left: 10px;
          }
          span:last-child{
            color:#666;
          }
        }
      }
    }
  }
  .editPanel{
    width: 90%;
    height: 877px;
    margin:0 auto;
    .el-tabs__content{
      height: 877px;
    }
    .editList{
      list-style: none;
      padding: 0;
      margin-top: -5px;
      li{
        border-bottom: 1px solid #ccc;
        margin-bottom: 20px;
        text-align: left;
        position: relative;
        transition: .5s all;
        padding-bottom: 20px;
      }
      li:first-child{
        transform: translateY(100px);
      }
      li:nth-child(2){
        transform: translateY(120px);
      }
      li:nth-child(3){
        transform: translateY(160px);
        display: flex;
        div{
          width: 50%;
          height: 70px;
          position: relative;
          text-align: left;
          .bgPicker{
            position: absolute;
            top:60%;
            left: 40%;
          }
        }
      }
      li:nth-child(4){
        transform: translateY(220px);
        .bgPicker{
          margin-left:60px;
        }
      }
      li:last-child{
        text-align: center;
        margin-top: 20px;
        transform: translateY(300px);
        border:none;
      }
      .el-input{
        width: 300px;
      }
    }
    .editAttr{
      list-style: none;
      padding: 0;
      margin-top: -5px;
      li{
        border-bottom: 1px solid #ccc;
        margin-bottom: 20px;
        text-align: left;
        position: relative;
        transition: .5s all;
        padding-bottom: 20px;
        transition: .5s all;
        span{
          font-size: 14px;
          margin-left: 10px;
          cursor:pointer;
          color:#0588ff;
        }
      }
      li:first-child{
        transform: translateY(100px);
      }
      li:nth-child(2){
        transform: translateY(120px);
      }
      li:nth-child(3){
        transform: translateY(160px);
      }
      li:nth-child(4){
        transform: translateY(220px);
      }
      li:nth-child(5){
        transform: translateY(300px);
      }
      li:nth-child(6){
        transform: translateY(420px);
      }
      li:last-child{
        border:0;
        text-align: center;
        transform: translateY(540px);
      }
    }
  }
  .addMenuBox{
    margin-top: -30px;
    ul{
      list-style: none;
      margin:0;
      padding: 0;
      .el-input{
        width: 60%;
      }
      li{
        margin-top: 15px;
      }
      li:nth-child(2){
        p{
          display: flex;
          span{
            margin-left: 20px;
            cursor:pointer;
          }
        }
      }
      li:nth-child(3){
        p{
          box-sizing: border-box;
          padding-left: 10px;
          .backMsg{
            display: inline-block;
            padding-left: 55px;
            line-height: 30px;
          }
        }
      }
      .needCenter{
        text-align: center;
      }
      li:last-child{
        .el-button{
          width: 150px;
        }
      }
    }
  }
  .chioceIcon{
    ul{
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-wrap: wrap;
      li{
        width: 50px;
        height: 50px;
        border-radius: 5px;
        border:1px solid #ccc;
        line-height: 50px;
        text-align: center;
        font-size: 30px;
        cursor:pointer;
        margin-right: 20px;
        margin-top: 10px;
        img{
          width: 98%;
          height: 98%;
        }
      }
    }
    .turnBtn{
      width: 100%;
      text-align: center;
      margin-top: 40px;
      .el-button{
        width: 100px;
      }
    }
  }
}
</style>
