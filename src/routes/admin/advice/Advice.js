import React from 'react';
import {Input,Button,Table,Message} from 'antd';
import styles from "./Advice.scss";
import config from "../../../common/config";
import fetchs from "../../../utils/request";
import ShowBox from '../../../components/adviceBox/showBox'
class Advice extends React.Component{
  state={
    data:[],
    pagination:{},
    loading:false,
    adviceVisibleBox:false,
    adviceIdBox:null,
    columns:[
      {
        title:'序列',
        dataIndex:'key',
        key:'key'
      },{
        title:"昵称",
        dataIndex:'nickName',
        key:'nickName'
      },{
        title:'内容',
        dataIndex:'content',
        key:'content',
        render:(text,recored)=>(
          <span>
            {
              recored.content.length>50?(
              <span>{`${recored.content.substring(0,50)}...`}</span>
              ):(<span>{recored.content}</span>)
            }
          </span>
        )
      },{
        title:"操作",
        dataIndex:'action',
        key:'action',
        render:(text,recored)=>(
          <span className={styles.button}>
            <Button
             onClick={()=>{
               this.setState({
                 adviceVisibleBox:true,
                 adviceIdBox:recored.id
               })
             }}
            >
             查看详情
            </Button>
            <Button type='danger'
            onClick={this.delete.bind(this,recored.id)}
            >
             删除
            </Button>
          </span>
        )
      }
    ]
  }

  componentWillMount(){
    this.fetch(1);
    config.setCookie("path","advice",0.05);
  }
  /*
  删除按钮
   @params(id)文章的id
  */
  delete=function(v){
    fetchs(`${config.url_admin}/delFeedBack?id=${v}`).then((res)=>{
      if(res.data.state){
        Message.success("删除成功");
        this.fetch(this.state.pagination.current);
      }else{
        Message.success("删除失败")
      }
    });
  }
  /*
   翻页
   @params(e) 当前文章页数
  */
  handleTableChange(e){
    this.fetch(e.current);
  }
  fetch=(p)=>{
     this.setState({
       loading:true
     });
     fetchs(`${config.url_admin}/getFeedBack?p=${p}`).
     then((res)=>{
       var i=1;
       var c=[];
       res.data.result.forEach((item)=>{
          c.push({
            key:i++,
            nickName:item.nick_name,
            content:item.detail,
            id:item.id
          })
       });
       const pagination={...this.state.pagination};
       pagination.total=(res.data.totalPage)*10;
       pagination.current=p;
       this.setState({
         data:c,
         loading:false,
         pagination
       });
     });
  }
  render(){
    return (
      <div className={styles.table}>
        <Table
         columns={this.state.columns}
         pagination={this.state.pagination}
         loading={this.state.loading}
         dataSource={this.state.data}
         onChange={this.handleTableChange.bind(this)}
        >
        </Table>
        <ShowBox
         visible={this.state.adviceVisibleBox}
         id={this.state.adviceIdBox}
        />
      </div>
    )
  }
}

export default Advice;
