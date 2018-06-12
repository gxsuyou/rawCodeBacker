import React from "react";
import {Input,Table,Button,Modal} from "antd";
import styles from "./Tag.scss";
import fetchs from "../../../utils/request.js";
import config from "../../../common/config";
import AddBox from "../../../components/tagBox/AddBox.js";
class tag extends React.Component{
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
        key:'imgSrcAddress'
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
          <Button>编辑</Button>
          <Button type="danger">添加游戏</Button>
         </span>
        )
      }
    ],
    data:[],
    pagination:{},
    loadding:false,
    addBoxVision:false
  }
  UNSAFE_componentWillMount(){
    this.fetchsTag();
  }
  fetchsTag(){
    this.setState({
      loading:true
    });
    fetchs(`${config.url_adminGame}/getSubject`).then((res)=>{
      var i=0;
      const c=[];
      var active,sys;

      res.data.result.forEach((item)=>{
        item.active?active="激活":active="未激活";
        item.sys==2?sys="android":"ios";
         c.push({
           key:i++,
           id:item.id,
           title:item.title,
           describle:item.detail,
           activationState:active,
           imgSrcAddress:item.img,
           sys:sys
         });
      });
      const pagination ={...this.state.pagination};
      pagination.total=(res.data.totalPage)*10;
      this.setState({
        loading:false,
        data:c,
        pagination
      });
    })
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
        />
        <AddBox  visible={this.state.addBoxVision}/>
      </div>
    )
  }
}

export default tag;
