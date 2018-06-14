import React from "react";
import {Input,Table,Button,Modal,Message} from "antd";
import styles from "./H5.scss";
import fetchs from "../../../utils/request.js";
import config from "../../../common/config";
import AddBox from "../../../components/h5Box/AddBox.js";
import AddGameBox from "../../../components/h5Box/AddGameBox";

class H5 extends React.Component{
  state={
    columns:[
      {
        title:'序列',
        dataIndex:'key',
        key:'key'
      },{
        title:'游戏名称',
        dataIndex:'gameName',
        key:'gameName'
      },{
        title:'游戏介绍',
        dataIndex:'recommend',
        key:'recommend'
      },{
        title:'游戏链接',
        dataIndex:'gameLink',
        key:'gameLink',
        render:(text,record)=>(
          <span>
            <a target="_blank" href={record.gameLink}>{record.gameLink}</a>
          </span>
        )
      },{
        title:'优先',
        dataIndex:'priority',
        key:'priority'
      },{
        title:"操作",
        dataIndex:'action',
        key:'action',
        render:(text,record)=>(
         <span className={styles.button}>
         {
          // <Button onClick={()=>{this.setState({editorBoxVison:true,editorBoxId:record.id})}}>添加游戏</Button>
          }
          <Button type="danger" onClick={this.deleteH5.bind(this,record.id,record.gameName)}>删除</Button>
         </span>
        )
      }
    ],
    data:[],
    pagination:{},
    loadding:false,
    addBoxVision:false,
    editorBoxVison:false,
    editorBoxId:"",
    current:1
  }
  componentWillMount(){
    this.fetchsH5(1);
    config.setCookie("path","h5",0.05);
  }
  deleteH5(id,name){
   fetchs(`${config.url_adminH5}/deleteH5?id=${id}&name=${name}`).then((res)=>{
     if(res.data.state==1){
       this.fetchsH5(this.state.current);
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
  fetchsH5(p){
    this.setState({
      loading:true
    });
    fetchs(`${config.url_adminH5}/getH5?p=${p}`).then((res)=>{
      var i=0;
      const c=[];
      var active,sys;
      //console.log(res.data.result[0].name);
      res.data.result.forEach((item)=>{
        item.active?active="激活":active="未激活";
        item.sys==2?sys="android":"ios";
        //console.log(item.name)


         c.push({
           key:i++,
           gameName:item.name,
           id:item.id,
           gameLink:item.url,
           title:item.title,
           recommend:item.commend,
           describle:item.detail,
           activationState:active,
           priority:item.sort,
           imgSrcAddress:`http://img.oneyouxi.com.cn/${item.img}`,
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
  handleTableChange(e){
    this.setState({
      current:e.current
    });
    this.fetchsH5(e.current);
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
          fetchH5={this.fetchsH5.bind(this)}
        />
        <AddGameBox
          visible={this.state.editorBoxVison}
          propHandBox={this.propHandBox.bind(this)}
          current={this.state.current}
          subjectId={this.state.editorBoxId}
        />
      </div>
    )
  }
}

export default H5;
