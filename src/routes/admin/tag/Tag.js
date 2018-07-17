import React from "react";
import {Input,Table,Button,Modal,Message} from "antd";
import styles from "./Tag.scss";
import fetchs from "../../../utils/request.js";
import config from "../../../common/config";
import AddBox from "../../../components/tagBox/AddBox.js";
import AddGameBox from "../../../components/tagBox/AddGameBox";

class Tag extends React.Component{
  state={
    columns:[
      {
        title:'序列',
        dataIndex:'key',
        key:'key'
      },{
        title:'ID',
        dataIndex:'id',
        key:'id'
      },{
        title:'标题',
        dataIndex:'title',
        key:'title'
      },{
        title:'描述',
        dataIndex:'describle',
        key:'describle'
      },{
        title:'激活状态',
        dataIndex:'activationState',
        key:'activationState'
      },{
        title:'图片地址',
        dataIndex:'imgSrcAddress',
        key:'imgSrcAddress',
        render:(text,record)=>(
          <span>
          <a href={record.imgSrcAddress} target="_blank">
            {record.imgSrcAddress}
          </a>
          </span>
        )
      },{
        title:'系统',
        dataIndex:'sys',
        key:'sys'
      },{
        title:"操作",
        dataIndex:'action',
        key:'action',
        render:(text,record)=>(
         <span className={styles.button}>
          <Button onClick={()=>{this.setState({editorBoxVison:true,editorBoxId:record.id,editorBoxOs:record.os})}}>添加游戏</Button>
          <Button type="danger" onClick={this.deleteTag.bind(this,record.id)}>删除</Button>
         </span>
        )
      }
    ],
    data:[],
    pagination:{
      total:1,
      current:1
    },
    loadding:false,
    addBoxVision:false,
    editorBoxVison:false,
    editorBoxId:"",
    editorBoxOs:2,
    current:1
  }
  componentWillMount(){
    this.fetchsTag(1);
    config.setCookie("path","tag",0.05);
  }
  deleteTag(id){
   fetchs(`${config.url_adminGame}/deleteSubject?subjectId=${id}`).then((res)=>{
     if(res.data.state==1){
       this.fetchsTag(this.state.current);
     }else{
       Message.error("删除失败");
     }
   })
  }

  propHandBox(e){
    this.setState({
      addBoxVision:e,
      editorBoxVison:e
    });
  }
  fetchsTag(p){
    this.setState({
      loading:true
    });
    fetchs(`${config.url_adminGame}/getSubject?p=${p}`).then((res)=>{
      var i=0;
      const c=[];
      var active,sys;
      res.data.result.forEach((item)=>{
        item.active?active="激活":active="未激活";
        item.sys==2?sys="android":sys="ios";
         c.push({
           key:i++,
           id:item.id,
           title:item.title,
           describle:item.detail,
           activationState:active,
           imgSrcAddress:`http://img.oneyouxi.com.cn/${item.img}`,
           sys:sys,
           os:item.sys
         });
      });
      const pagination ={...this.state.pagination};
      pagination.total=(res.data.totalPage)*10;
      pagination.current=res.data.nowPage;
      this.setState({
        loading:false,
        data:c,
        pagination
      });
    })
  }
  handleTableChange(e){
    this.setState({
      current:e.current
    });
    this.fetchs_chapter(e.current);
  }
  render(){
    return (
      <div className={styles.table}>
        <div className={styles.tableOperations}>
         <Button onClick={()=>{
           this.setState({
             addBoxVision:true
           });
         }} type="primary">添加</Button>
        </div>
        <Table
        columns={this.state.columns}
        dataSource={this.state.data}
        pagination={this.state.pagination}
        loading={this.state.loading}
        onChange={this.handleTableChange.bind(this)}
        />
        <AddBox
          visible={this.state.addBoxVision}
          propHandBox={this.propHandBox.bind(this)}
          fetchTag={this.fetchsTag.bind(this)}
        />
        <AddGameBox
          visible={this.state.editorBoxVison}
          propHandBox={this.propHandBox.bind(this)}
          current={this.state.current}
          subjectId={this.state.editorBoxId}
          os={this.state.editorBoxOs}
        />
      </div>
    )
  }
}

export default Tag;
