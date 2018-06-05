import React from "react";
import {Table,List,Card,Button,Modal,Input,Checkbox,Divider} from 'antd';
import styles from "./Game.scss";
import fetch from "../../../utils/request.js";
import config from "../../../common/config.js";
import fetchs from "../../../utils/request.js";
class Game extends React.Component{
  state={
      editorMessageVisible:false,
      editorMessageGameName:"",
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
           <Button >标签</Button>
           <Button type="danger" >删除</Button>
          </span>
        )
      }],
      MainData:[]
  }
  showModalEditorMessage(id,gameName){

   fetchs(`${config.url_adminGame}/gameAdminDetail?id=${id}`)
   .then((res)=>{
     console.log(1);
   })
    this.setState({
      editorMessageVisible:true,
      editorMessageGameName:gameName
    })
  }
  EditorMessageHandleOk(v){
    console.log(v);
  }
  EditorMessageOnChange(choices,e){

  }
  addGameModel(){
    console.log(this.state.MainData);
  }
  componentWillMount(){
    return false;
    fetch(config.url_getAdminGame)
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
      this.setState({
        MainData:c
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
      />
      <Modal
       title="编辑信息"
       visible={this.state.editorMessageVisible}
       onCancel={()=>{this.setState({editorMessageVisible:false})}}
        onOK={this.EditorMessageHandleOk}
        okText="提交"
        cancelText="取消"
      >
       <Input.Group className={styles.InputGroup}>
         <Input addonBefore="游戏名" onChange={this.EditorMessageOnChange.bind(this,"gameName")}  value={this.state.editorMessageGameName}/>
         <Input addonBefore="上架" onChange={this.EditorMessageOnChange.bind(this,"up")} placeholder="输入是否上架，1上架，0下架" />
         <Input addonBefore="游戏公司"  placeholder="请输入游戏公司"  />
         <Input addonBefore="游戏版本"  placeholder="输入游戏版本号"/>
         <Input addonBefore="游戏下载数"  placeholder="请输入游戏下载数"/>
         <Input addonBefore="首页优先级" placeholder="请输入首页优先级" />
         <Input addonBefore="热玩优先级" placeholder="请输入热玩优先级" />
         <Input addonBefore="游戏大小"  placeholder="输入游戏大小" />
        <Checkbox.Group styles={{marginTop:10}}>
          <Divider orientation="left">网游</Divider>
            <Checkbox checked={true}
            disabled={false} value="A">A</Checkbox>
            <Checkbox checked={true} value="B">B</Checkbox>
            <Checkbox value="C">C</Checkbox>
            <Checkbox value="D">D</Checkbox>
        </Checkbox.Group>
       </Input.Group>
      </Modal>
     </div>
    )
  }
}

export default Game;
