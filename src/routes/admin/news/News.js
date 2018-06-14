import React from "react";
import {Input,Table,Button,Modal,Message} from "antd";
import fetchs from "../../../utils/request.js";
import config from "../../../common/config";
import styles from "./News.scss";
import AddBox from "../../../components/newsBox/AddBox";
class News extends React.Component{
  state={
    columns:[{
      title: '序号',
      dataIndex:'key',
    },{
      title: '标题',
      dataIndex:'title'
    },{
      title: '游戏',
      dataIndex:'game',
    },{
      title: '上传用户',
      dataIndex:'user'
    },{
      title:"操作",
      dataIndex:"action",
      render:(text,record)=>(
        <span className={styles.button}>
          <Button onClick={this.essenceHand.bind(this,record.id,record.essence)}>{record.essenceName}</Button>
          <Button onClick={this.deleteNews.bind(this,record.id)}>删除</Button>
        </span>
      )
    }],
    data:[],
    pagination:{},
    current:1,
    loadding:false,
    addBoxVisible:false
  }
  UNSAFE_componentWillMount=()=>{
    this.fetchsNews(1);
    config.setCookie("path","News",0.05);
  }

  handleTableChange=(pagination,filters,sorter)=>{
    this.setState({
      current:pagination.current
    });
    this.fetchsNews(pagination.current);
  }

 deleteNews(id){
   fetchs(`${config.url_adminNews}/deleteNews?strategyId=${id}`).then((res)=>{
     if(res.data.state){
       Message.success("删除成功");
       this.fetchsNews(this.state.curcurrent);
     }else{
       Message.error("删除失败");
     }
   })
 }
 essenceHand(id,i){
   fetchs(`${config.url_adminNews}/essence?strategyId=${id}&essence=${i}`).then((res)=>{
      if(res.data.state){
        Message.success("修改成功");
        this.fetchsNews(this.state.curcurrent);
      }else{
        Message.error("修改失败");
      }
   });
 }

  fetchsNews=(p)=>{
    this.setState({
      loading:true
    })
    fetchs(`${config.url_adminStrategy}/getStrategyByMsgPage?msg=&page=${p}`).then((res)=>{
      console.log(res.data);
      var i=1,essence;
      var c=[];

      res.data.result.forEach((item)=>{
        item.essence?essence="精华":essence="取消";
        c.push({
          key:i++,
          user:item.admin_comment,
          game:item.game_name,
          title:item.title,
          essenceName:essence,
          essence:item.essence,
          id:item.id
        });
        const pagination ={...this.state.pagination};
        pagination.total=(res.data.totalPage)*10;
        this.setState({
          data:c,
          loading:false,
          pagination
        });

      });
    });
  }
  handBox(e){
    this.setState({
       addBoxVisible:e
    });
  }
  render(){
    return (
      <div className={styles.table}>
        <div className={styles.tableOperations}>
         <Button onClick={()=>{
           this.setState({
             addBoxVisible:true
           })
         }} type="primary">添加</Button>
        </div>
        <Table
        columns={this.state.columns}
        dataSource={this.state.data}
        pagination={this.state.pagination}
        onChange={this.handleTableChange}
        loading={this.state.loading}
        ></Table>
        <AddBox
        visible={this.state.addBoxVisible}
         handBox={this.handBox.bind(this)}
         fetchsNews={this.fetchsNews}/>
      </div>
    )
  }
}

export default News;
