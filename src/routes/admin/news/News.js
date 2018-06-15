import React from "react";
import {Input,Table,Button,Modal,Message} from "antd";
import fetchs from "../../../utils/request.js";
import config from "../../../common/config";
import styles from "./News.scss";
import AddBox from "../../../components/newsBox/AddBox";
import EditorBox from "../../../components/newsBox/EditorBox";
class News extends React.Component{
  state={
    columns:[{
      title: '序号',
      dataIndex:'key',
    },{
      title:"文章ID",
      dataIndex:"chapterId"
    },{
      title: '标题',
      dataIndex:'title'
    },{
      title:"浏览数",
      dataIndex:"browse"
    },{
      title:"点赞数",
      dataIndex:"agree"
    },{
      title:"评论数",
      dataIndex:"comment"
    },{
      title: '上传用户',
      dataIndex:'user'
    },{
      title:"操作",
      dataIndex:"action",
      render:(text,record)=>(
        <span className={styles.button}>
          <Button onClick={this.essenceHand.bind(this,record.chapterId,record.up)}>{record.essenceName}</Button>
          <Button onClick={this.showEditorBox.bind(this,record.chapterId)}>编辑</Button>
          <Button onClick={this.deleteNews.bind(this,record.chapterId)}>删除</Button>
        </span>
      )
    }],
    data:[],
    pagination:{},
    current:1,
    loadding:false,
    addBoxVisible:false,
    editorBoxVison:false,
    editorBoxId:""
  }

showEditorBox(id){
  this.setState({
    editorBoxVison:true,
    editorBoxId:id
  });
}

  componentDidMount=()=>{
    this.fetchsNews(1);
    config.setCookie("path","news",0.05);
  }

  handleTableChange=(pagination,filters,sorter)=>{

    this.setState({
      current:pagination.current
    });
    this.fetchsNews(pagination.current);
    //console.log(this.state.current);
  }

 deleteNews(id){
  // /adminNews/?id
   fetchs(`${config.url_adminNews}/deleteNewsById?id=${id}`).then((res)=>{
     if(res.data.state){
       Message.success("删除成功");
       this.fetchsNews(this.state.current);
     }else{
       Message.error("删除失败");
     }
   })
 }
 essenceHand(id,up){
   var _up;
   up==1?_up=0:_up=1;
   //return false;
   fetchs(`${config.url_adminNews}/upNews?id=${id}&up=${_up}`).then((res)=>{
      if(res.data.state){
        Message.success("修改成功");
        this.fetchsNews(this.state.current);
      }else{
        Message.error("修改失败");
      }
   });
 }

  fetchsNews=(p)=>{
    this.setState({
      loading:true
    })
    fetchs(`${config.url_adminNews}/getNewsByPage?p=${p}`).then((res)=>{
      console.log(res.data);
      var i=1,up;
      var c=[];

      res.data.result.forEach((item)=>{
        item.up?up="取消":up="置顶";
        c.push({
          key:i++,
          user:item.admin_comment,
          game:item.game_name,
          title:item.title,
          essenceName:up,
          essence:item.essence,
          chapterId:item.id,
          browse:item.browse,
          agree:item.agree,
          comment:item.comment,
          up:item.up
        });
        const pagination ={...this.state.pagination};
        pagination.total=(res.data.totalPage)*10;
        pagination.current=res.data.nowPage;
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
       addBoxVisible:e,
       editorBoxVison:e
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
         <EditorBox visible={this.state.editorBoxVison}
         id={this.state.editorBoxId}
         handBox={this.handBox.bind(this)}
         current={this.state.current}
         fetchsNews={this.fetchsNews}
         />
      </div>
    )
  }
}

export default News;
