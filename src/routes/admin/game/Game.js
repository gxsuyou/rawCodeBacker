import React from "react";
import {Table,Button,Modal,Input,message,Radio} from 'antd';
import styles from "./Game.scss";
import config from "../../../common/config.js";
import fetchs from "../../../utils/request.js";
/*弹窗组件*/
import TagBox from "../../../components/gameBox/TagBox";
import AddBox from "../../../components/gameBox/AddBox";
import UploadBox from "../../../components/gameBox/UploadBox";
/*弹窗组件结束*/
const {TextArea}=Input;
const Search =Input.Search;
class Game extends React.Component{
  state={
      checkAll:true,
      loading:false,
      os:"2",
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
      editorMessageGameStrategy:"",
      editorMessageBrief:"",
      editorMessageSys:2,
      editorMessageIosDownHref:"",
      editorMessagelotBrief:"",
      editorMessageGameDetail:"",
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
        render:(text,record)=>(
          <div style={{lineHeight:0.5}}>
           <p style={{lineHeight:1.2}}>
           游戏公司:
           {record.game_company}
           </p>
           <p>
             版本:{record.game_version}
           </p>
           <p>
            大小:{record.size}
           </p>
          </div>
        )
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
        title:"攻略顶部的游戏推荐",
        dataIndex:"strategyGame"
      },{
        title:"管理员",
        dataIndex:"admin"
      },{
        title:"操作",
        dataIndex:"action",
        render:(text,record)=>(
          <span className={styles.button}>
           <Button  onClick={this.showModalEditorMessage.bind(this,record.id,record.game_name,record.company,record.version,record.updowm,record.size,record.sortIndex,record.sortHot,record.gameInstallNum,record.strategyGame,record.gameRecommend,record.gameDownLoaderHref,
           record.sys,record.gameDetail)}>编辑信息</Button>
           <Button  onClick={this.UploadVision.bind(this,record.id)}>上传数据</Button>
           <Button onClick={this.tagBoxVision.bind(this,record.id)}>标签</Button>
           <Button onClick={this.deleteData.bind(this,record.key,record.id)} type="danger">删除</Button>
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
     fetchs(`${config.url_admin}/deleteGame?id=${id}`).then(res=>{
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

  componentDidMount(){
    config.setCookie("path","game",0.05);
  }

  /* 打开编辑弹框初始化数据 */
  showModalEditorMessage(id,gameName,company,version,activation,size,sort,sort2,gameInstallNum,strategyGame,gameRecommend,gameDownLoaderHref,sys,gameDetail){

    if(sys=="ios"){
      sys=1;
    }else{
      sys=2;
    }
    if(String(gameRecommend)=="null"){
      gameRecommend="";
    }
     this.setState({
       editorMessageId:id,
       editorMessageVisible:true,
       editorMessageGameName:gameName,
       editorMessageCompanyName:company,
       editorMessageVision:version,
       editorMessageUp:activation,
       editorMessageIndexPriority:sort,
       editorMessageHotPriority:sort2,
       editorMessageGameSize:size,
       editorMessageDownloadNum:gameInstallNum,
       editorMessageGameStrategy:strategyGame,
       editorMessageBrief:gameRecommend,
       editorMessageIosDownHref:gameDownLoaderHref,
       editorMessageSys:sys,
       editorMessageGameDetail:gameDetail,
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
  MessageVision=this.state.editorMessageVision,
  brief=this.state.editorMessageBrief,
  gameDetail=this.state.editorMessageGameDetail;
 if(
     MessageVision===""||
     GameName===""||
     GameSize===""||
     HotPriority===""||
     IndexPriority===""||
     up===""||
     loadNum===""||
     brief===""
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
    body:`name=${this.state.editorMessageGameName}&activation=${this.state.editorMessageUp}&company=${this.state.editorMessageCompanyName}&version=${this.state.editorMessageVision}&download_num=${this.state.editorMessageDownloadNum}&sort=${this.state.editorMessageIndexPriority}&sort2=${this.state.editorMessageHotPriority}&size=${this.state.editorMessageGameSize}&id=${this.state.editorMessageId}&strategy_head=${this.state.editorMessageGameStrategy}&game_recommend=${brief}&gameDownloadIos=${this.state.editorMessageIosDownHref}&game_detail=${gameDetail}`}).then((res)=>{
      if(res.data.state){
         this.setState({
           editorMessageVisible:false,
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

  UNSAFE_componentWillMount(){
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
    fetchs(`${config.url_getAdminGame}?p=${p}&sys=${this.state.os}`)
    .then((res)=>{
      var i=1;
      var c=[]
      var up,sys;

      res.data.result.forEach((item)=>{

        if(item.game_size==null){
          var size=0;
        }else{
          size=item.game_size;
        }
        if(item.game_company==null){
          var company="无";
        }else{
           company=item.game_company;
        }
        item.activation?up="是":up="否";
        item.sys==2?sys="Android":sys="ios";
        c.push({
          key:i++,
          game_name:item.game_name,
          id:item.id,
          up:up,
          sys:sys,
          addTime:item.add_time,
          gameInstallNum:item.game_download_num,
          sortIndex:item.sort,
          sortHot:item.sort2,
          admin:item.comment,
          company:company,
          version:item.game_version,
          updowm:item.activation,
          strategyGame:item.strategy_head,
          size:size,
          game_company:item.game_company,
          game_version:item.game_version,
          gameRecommend:item.game_recommend,
          gameDownLoaderHref:item.game_download_ios,
          gameDetail:item.game_detail
        });
      });
      console.log(this.state.currentPagination)
     const pagination ={...this.state.pagination};
     pagination.total=(res.data.totalPage)*10;
     pagination.current=p;
      this.setState({
        loading:false,
        MainData:c,
        pagination
      })
    })
  }
  searchName(e){
    if(e==""){
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
        res.data.forEach((item)=>{
          item.activation?up="是":up="否";
          item.sys==2?sys="Android":sys="ios";
          if(item.game_size==null){
            var size=0;
          }else{
            size=item.game_size;
          }
          if(item.game_company==null){
            var company="无";
          }else{
             company=item.game_company;
          }
           this.state.MainData.push({
             key:i++,
             game_name:item.game_name,
             id:item.id,
             up:up,
             sys:sys,
             addTime:item.add_time,
             gameInstallNum:item.game_download_num,
             sortIndex:item.sort,
             sortHot:item.sort2,
             admin:item.comment,
             company:company,
             version:item.game_version,
             updowm:item.activation,
             strategyGame:item.strategy_head,
             size:size,
             game_company:item.game_company,
             game_version:item.game_version,
             gameRecommend:item.game_recommend,
             gameDownLoaderHref:item.game_download_ios,
             gameDetail:item.game_detail
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
  osRenderChange=(e)=>{
    this.setState({
      os:e.target.value,
      currentPagination:1,
    });
    setTimeout(()=>{
      this.fetch(1);
    },300);
  }
  render(){
    return(
     <div className={styles.table}>
    { /* 顶部操作start */}
     <div className={styles.tableOperations}>
       <Search
        addonBefore="游戏名"
        style={{width:350,marginRight:20}}
        placeholder="输入游戏名称"
        onSearch={this.searchName.bind(this)}/>
      <Radio.Group
         style={{marginRight:20}}
         defaultValue="2"
         buttonStyle="solid"
         value={this.state.os}
         onChange={this.osRenderChange}
      >
         <Radio.Button value="2">Android</Radio.Button>
         <Radio.Button value="1">Ios</Radio.Button>
      </Radio.Group>
      <Button onClick={this.addGameModel.bind(this)} type="primary">添加</Button>
     </div>
    { /* 顶部操作end */}
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

         <Input addonBefore="游戏10字简介" onChange={this.EditorMessageOnChange.bind(this,"Brief")}
         value={this.state.editorMessageBrief}
         placeholder="游戏10字简介" />

          {
            this.state.editorMessageSys==1?(
              <Input addonBefore="ios下载链接"
              onChange={this.EditorMessageOnChange.bind(this,"IosDownHref")}
              value={this.state.editorMessageIosDownHref}
              placeholder="填写appStore下载链接(非必填)"
              />
            ):(
              null
            )
          }
         <Input
           value={this.state.editorMessageGameStrategy}
           onChange={this.EditorMessageOnChange.bind(this,"GameStrategy")}
           addonBefore="攻略顶部的游戏推荐"
           placeholder="推荐为1不推荐为0"
         />
       </Input.Group>
       <TextArea
       style={{marginTop:5}}
       placeholder="输入游戏简介"
       autosize={{ minRows: 4, maxRows: 6 }}
       value={this.state.editorMessageGameDetail}
       onChange={this.EditorMessageOnChange.bind(this,"GameDetail")}
       />
      </Modal>
      <TagBox tagBoxVision={this.state.tagBoxVision} id={this.state.editorMessageId} handleTagBoxChange={this.handleTagBoxChange.bind(this)}/>
      { /*添加的文本框*/}
      <AddBox addBoxVision={this.state.addBoxVision} handleAddBoxChange={this.handleTagBoxChange.bind(this)} fetch={this.fetch.bind(this)}/>
      <UploadBox
      id={this.state.editorMessageId} uploadBoxVision={this.state.uploadBoxVision} handleUploadBoxChange={this.handleTagBoxChange.bind(this)}
      />
     </div>
    )
  }
}

export default Game;
