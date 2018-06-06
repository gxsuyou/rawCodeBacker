import React from "react";
import {Table,List,Card,Button,Modal,Input,Checkbox,Divider,message} from 'antd';
import styles from "./Game.scss";
import fetch from "../../../utils/request.js";
import config from "../../../common/config.js";
import fetchs from "../../../utils/request.js";
import TagBox from "../../../components/gameBox/AddToGameBox";
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
      //add
      tagBoxVision:false,
      plainOptions:[],
      defaultOption:[],
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
           <Button >上传数据</Button>
           <Button onClick={()=>{this.setState({tagBoxVision:true})}} >标签</Button>
           <Button onClick={this.deleteData.bind(this,record.key,record.id)} type="danger" >删除</Button>
          </span>
        )
      }],
      MainData:[]
  }
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
  showModalEditorMessage(id,gameName){
   // fetchs(`${config.url_adminGame}/gameAdminDetail?id=${id}`)
   // .then((res)=>{
   //    this.state.plainOptions=[];
   //    for(let i=1;i<res.data.cls.length-1;i++){
   //     if(res.data.cls[i].checked){
   //       this.state.defaultOption.push(res.data.cls[i].cls_name);
   //     }
   //     this.state.plainOptions.push({
   //       label:res.data.cls[i].cls_name,
   //       value:res.data.cls[i].cls_name,
   //       key:res.data.cls[i].id
   //     });
   //    }


     this.setState({
       //EditorMessageTitle:res.data.cls[0].cls_name,
       //...this.state,
       editorMessageId:id,
       editorMessageVisible:true,
       editorMessageGameName:gameName,
       tagBoxVision:false,
     });
     console.log(2);
   //})
  }
  handleOk(){
    //console.log(v);
    //console.log(this.state.editorMessageUp,this.state.editorMessageGameName)
    console.log(
      this.state.editorMessageGameName,
      this.state.editorMessageUp,
      this.state.editorMessageVision,
      this.state.editorMessageDownloadNum,
      this.state.editorMessageIndexPriority,
      this.state.editorMessageHotPriority,
      this.state.editorMessageGameSize,
      this.state.editorMessageId
    );


    fetchs(`${config.url_adminGame}/SetGameMsg`,{
    method:"POST",
    headers: {
      'Content-Type':'application/x-www-form-urlencoded' // 指定提交方式为表单提交
    },
    body:`activation=${this.state.editorMessageUp}&company=${this.state.editorMessageCompanyName}&version=${this.state.editorMessageVision}&download_num${this.state.editorMessageDownloadNum}&sort=${this.state.editorMessageIndexPriority}&sort2=${this.state.editorMessageHotPriority}&size=${this.state.editorMessageGameSize}&id=${this.state.editorMessageId}`
  })
  .then((res)=>{
    console.log(res);
  })



  }
  EditorMessageOnChange(choices,e){
    this.setState({
      [`editorMessage${choices}`]:e.target.value
    })

  }
  // onChange(checkedValues) {
  //    console.log('checked = ', checkedValues);
  // }
  addGameModel(){
    console.log(this.state.MainData);
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
  fetch(p){
    this.setState({ loading: true });
    fetch(`${config.url_getAdminGame}?p=${p}`)
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
  render(){
    return(
     <div className={styles.table}>
     <div className={styles.tableOperations}>
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
         <Input addonBefore="上架" onChange={this.EditorMessageOnChange.bind(this,"Up")} placeholder="输入是否上架，1上架，0下架" />
         <Input addonBefore="游戏公司" onChange={this.EditorMessageOnChange.bind(this,"CompanyName")}  placeholder="请输入游戏公司"  />
         <Input addonBefore="游戏版本"  onChange={this.EditorMessageOnChange.bind(this,"Vision")}   placeholder="输入游戏版本号"/>
         <Input addonBefore="游戏下载数" onChange={this.EditorMessageOnChange.bind(this,"DownloadNum")}   placeholder="请输入游戏下载数"/>
         <Input addonBefore="首页优先级" onChange={this.EditorMessageOnChange.bind(this,"IndexPriority")}   placeholder="请输入首页优先级" />
         <Input addonBefore="热玩优先级" onChange={this.EditorMessageOnChange.bind(this,"HotPriority")} placeholder="请输入热玩优先级" />
         <Input addonBefore="游戏大小" onChange={this.EditorMessageOnChange.bind(this,"GameSize")} placeholder="输入游戏大小" />
        {
          //<Divider orientation="left">{this.state.EditorMessageTitle}</Divider>
         //<Checkbox.Group options={this.state.plainOptions} defaultValue={this.state.defaultOption} onChange={this.onChange} styles={{marginTop:10}}></Checkbox.Group>
        }
       </Input.Group>
      </Modal>
      <TagBox tagBoxVision={this.state.tagBoxVision}/>
     </div>
    )
  }
}

export default Game;
