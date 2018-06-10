import React from "react";
import {Table,List,Card,Button,Modal,Input,Divider,message} from 'antd';
import styles from "./Game.scss";
import config from "../../../common/config.js";
import fetchs from "../../../utils/request.js";
//盒子
import TagBox from "../../../components/gameBox/TagBox";
import AddBox from "../../../components/gameBox/AddBox";
import UploadBox from "../../../components/gameBox/UploadBox";
const Search =Input.Search;
class Game extends React.Component{
  state={
      checkAll:true,
      loading:false,
      pagination:{},
      currentPagination:1,
      editorMessageVisible:false,
      editorMessageGameName:"",
      editorMessageUp:"",
      editorMessageCompanyName:"",
      editorMessageVision:"",
      editorMessageDownloadNum:"",
      editorMessageIndexPriority:"",
      editorMessageHotPriority:"",
      editorMessageGameSize:"",
      editorMessageId:"",
      //tagBox
      tagBoxVision:false,
      //addBox
      addBoxVision:false,
      //UploadBox
      uploadBoxVision:false,
      titleData:[{
        title: '序号',
        dataIndex:'key',
      },{
        title: '游戏名',
        dataIndex:'game_name'
      },{
        title: '游戏ID',
        dataIndex:"id"
      },{
        title: '上架状态',
        dataIndex:"up",
      },{
        title:'系统',
        dataIndex:"sys"
      },{
        title:"添加时间",
        dataIndex:"addTime"
      },{
        title:"游戏详情",
        dataIndex:"gameDetail"
      },{
        title:"下载数",
        dataIndex:"gameInstallNum"
      },{
        title:"首页排序",
        dataIndex:"sortIndex"
      },{
        title:"热玩排序",
        dataIndex:"sortHot"
      },{
        title:"管理员",
        dataIndex:"admin"
      },{
        title:"操作",
        dataIndex:"action",
        render:(text,record)=>(
          <span className={styles.button}>
           <Button  onClick={this.showModalEditorMessage.bind(this,record.id,record.game_name)}>编辑信息</Button>
           <Button  onClick={this.UploadVision.bind(this,record.id)}>上传数据</Button>
           <Button onClick={this.tagBoxVision.bind(this,record.id)}>标签</Button>
           <Button onClick={this.deleteData.bind(this,record.key,record.id)} type="danger" >删除</Button>
          </span>
        )
      }],
      MainData:[]
  }
  UploadVision(id){
    this.setState({
      uploadBoxVision:true,
      editorMessageId:id
    })
  }

  tagBoxVision(id){
    this.setState({
      editorMessageId:id,
      tagBoxVision:true
    })
  }

  /*删除接口*/
  deleteData(key,id){
     fetchs(`${config.url_admin}/deleteGame?id=${id}`).
     then(res=>{
       console.log(res.data.state);
       if(res.data.state==1){
         const c=[...this.state.MainData];
         c.splice(key-1,1);
         this.setState({
           MainData:c
         });
         this.fetch(this.state.currentPagination);
       }else{
         message.error("删除失败");
       }
     });
  }

  /* 打开编辑弹框初始化数据 */
  showModalEditorMessage(id,gameName){
     this.setState({
       editorMessageId:id,
       editorMessageVisible:true,
       editorMessageGameName:gameName,
       tagBoxVision:false
     });
  }
  handleOk(){
  const loadNum=this.state.editorMessageDownloadNum,
  up=this.state.editorMessageUp,
  IndexPriority=this.state.editorMessageIndexPriority,
  HotPriority=this.state.editorMessageHotPriority,
  GameSize=this.state.editorMessageGameSize,
  GameName=this.state.editorMessageGameName,
  MessageVision=this.state.editorMessageVision;
 if(
     MessageVision===""||
     GameName===""||
     GameSize===""||
     HotPriority===""||
     IndexPriority===""||
     up===""||
     loadNum===""
   ){
   message.error("不能留空!");
   return false;
 }

  if(
  Object.is(Number(loadNum),NaN)!=false||
  Object.is(Number(up),NaN)!=false||
  Object.is(Number(IndexPriority),NaN)!=false||
  Object.is(Number(HotPriority),NaN)!=false||
  Object.is(Number(GameSize),NaN)!=false
    ){
      message.error("必须输入数字!");
      return false;
    }

    fetchs(`${config.url_adminGame}/SetGameMsg`,{
    method:"POST",
    headers: {
      'Content-Type':'application/x-www-form-urlencoded' // 指定提交方式为表单提交
    },
    body:`name=${  this.state.editorMessageGameName}&activation=${this.state.editorMessageUp}&company=${this.state.editorMessageCompanyName}&version=${this.state.editorMessageVision}&download_num=${this.state.editorMessageDownloadNum}&sort=${this.state.editorMessageIndexPriority}&sort2=${this.state.editorMessageHotPriority}&size=${this.state.editorMessageGameSize}&id=${this.state.editorMessageId}`
     })
    .then((res)=>{
      if(res.data.state){
         this.setState({
           editorMessageVisible:false,
           editorMessageUp:"",
           editorMessageCompanyName:"",
           editorMessageVision:"",
           editorMessageDownloadNum:"",
           editorMessageIndexPriority:"",
           editorMessageHotPriority:"",
           editorMessageGameSize:"",
           editorMessageId:""
         });
         this.fetch(this.state.currentPagination);
      }else{
        message.error("网络错误,请稍后提交!");
      }
    })
  }
  /* 修改编辑弹框里的内容  */
  EditorMessageOnChange(choices,e){
    this.setState({
      [`editorMessage${choices}`]:e.target.value
    });
  }
  addGameModel(){
    this.setState({
      addBoxVision:true
    });
  }
  handleTableChange=(pagination,filters,sorter)=>{
    this.setState({
      currentPagination:pagination.current
    })
    this.fetch(pagination.current);
  }

  componentWillMount(){
    this.fetch(1);
  }
  handleTagBoxChange(e){
    this.setState({
        tagBoxVision:e,
        addBoxVision:e,
        uploadBoxVision:e
    })
  }
  fetch(p){
    this.setState({ loading: true });
    fetchs(`${config.url_getAdminGame}?p=${p}`)
    .then((res)=>{
      var i=1;
      var c=[]
      var up,sys;
      res.data.result.forEach((item)=>{
        item.activation?up="是":up="否";
        item.sys==2?sys="Android":sys="ios";
        c.push({
          key:i++,
          game_name:item.game_name,
          id:item.id,
          up:up,
          sys:sys,
          addTime:item.add_time,
          gameDetail:`游戏公司:${item.game_company} 版本:${item.game_version} 大小:${item.game_download_num}`,
          gameInstallNum:item.game_install_num,
          sortIndex:item.sort,
          sortHot:item.sort2,
          admin:item.admin
        });
      });
     const pagination ={...this.state.pagination};
     pagination.total=(res.data.totalPage)*10;
      this.setState({
        loading:false,
        MainData:c,
        pagination
      })
    })
  }
  searchName(e){
    if(e==""){
      //message.error("选择框不能为空");
      this.fetch(1);
      return false;
    }
    fetchs(`${config.url_admin}/searchGameByMsg?type=game_name&msg=${e}`)
    .then((res)=>{
        this.setState({
          MainData:[]
        });
        var i=1;
        var up,sys;
        res.data.game.forEach((item)=>{
          item.activation?up="是":up="否";
          item.sys==2?sys="Android":sys="ios";
           this.state.MainData.push({
             key:i++,
             game_name:item.game_name,
             id:item.id,
             up:up,
             sys:sys,
             gameDetail:`游戏公司:${item.game_company} 版本:${item.game_version} 大小:${item.game_download_num}`,
             gameInstallNum:item.game_install_num,
             sortIndex:item.sort,
             sortHot:item.sort2,
             admin:item.admin
           })
        });
        const pagination ={...this.state.pagination};
        pagination.total=1*10;

        this.setState({
          MainData:this.state.MainData,
          pagination
        });

    })
  }
  render(){
    return(
     <div className={styles.table}>
     <div className={styles.tableOperations}>
     <Search
     addonBefore="游戏名"
     style={{width:350,marginRight:20}}
     placeholder="输入游戏名称"
     onSearch={this.searchName.bind(this)}
       />
      <Button onClick={this.addGameModel.bind(this)} type="primary">添加</Button>
     </div>
     <Table
      columns={this.state.titleData}
      dataSource={this.state.MainData}
      indentSize={20}
      pagination={this.state.pagination}
      loading={this.state.loading}
      onChange={this.handleTableChange}
      />
      <Modal
        title="编辑信息"
        visible={this.state.editorMessageVisible}
        onOk={this.handleOk.bind(this)}
        onCancel={()=>{this.setState({editorMessageVisible:false})}}
        okText="提交"
        cancelText="取消"
      >
       <Input.Group className={styles.InputGroup}>
         <Input addonBefore="游戏名" onChange={this.EditorMessageOnChange.bind(this,"GameName")}  value={this.state.editorMessageGameName}/>
         <Input addonBefore="上架" onChange={this.EditorMessageOnChange.bind(this,"Up")}
         value={this.state.editorMessageUp}
         placeholder="输入是否上架，1上架，0下架" />
         <Input addonBefore="游戏公司" onChange={this.EditorMessageOnChange.bind(this,"CompanyName")}
         value={this.state.editorMessageCompanyName}
         placeholder="请输入游戏公司"  />
         <Input addonBefore="游戏版本"  onChange={this.EditorMessageOnChange.bind(this,"Vision")}
          value={this.state.editorMessageVision}
           placeholder="输入游戏版本号"/>
         <Input addonBefore="游戏下载数" onChange={this.EditorMessageOnChange.bind(this,"DownloadNum")}
         value={this.state.editorMessageDownloadNum}
         placeholder="请输入游戏下载数"/>
         <Input addonBefore="首页优先级" onChange={this.EditorMessageOnChange.bind(this,"IndexPriority")}
        value={this.state.editorMessageIndexPriority}
          placeholder="请输入首页优先级" />
         <Input addonBefore="热玩优先级" onChange={this.EditorMessageOnChange.bind(this,"HotPriority")}
         value={this.state.editorMessageHotPriority}
         placeholder="请输入热玩优先级" />
         <Input addonBefore="游戏大小" onChange={this.EditorMessageOnChange.bind(this,"GameSize")}
         value={this.state.editorMessageGameSize}
         placeholder="输入游戏大小" />
       </Input.Group>
      </Modal>
      <TagBox tagBoxVision={this.state.tagBoxVision} id={this.state.editorMessageId} handleTagBoxChange={this.handleTagBoxChange.bind(this)}/>
      {
        /*添加的文本框*/
      }
      <AddBox addBoxVision={this.state.addBoxVision} handleAddBoxChange={this.handleTagBoxChange.bind(this)} fetch={this.fetch.bind(this)}/>
      <UploadBox
      id={this.state.editorMessageId} uploadBoxVision={this.state.uploadBoxVision} handleUploadBoxChange={this.handleTagBoxChange.bind(this)}
      />
     </div>
    )
  }
}

export default Game;
