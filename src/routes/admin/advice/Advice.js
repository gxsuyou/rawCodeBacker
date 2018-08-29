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
    selectedRowKeys:[],
    batchDelete:[],
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
            onClick={()=>{
              this.delete(recored.id);
            }}
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
  delete=function(v,p=this.state.pagination.current){
    fetchs(`${config.url_admin}/delFeedBack?id=${v}`).then((res)=>{
      if(res.data.state){
        Message.success("删除成功");
        console.log(this.state.data.length);
        this.fetch(p);
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
    this.setState({
      selectedRowKeys:[]
    })
    this.fetch(e.current);
  }
  propHandBox=function(v){
    this.setState({
      adviceVisibleBox:v
    });
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
         pagination,
         selectedRowKeys:[]
       });
     });
  }


 batchDetete=()=>{
   if(this.state.batchDelete.length==this.state.data.length){
     var fullCutPage=1;
     if(this.state.pagination.current!=1){
        fullCutPage=this.state.pagination.current-1;
     }
       this.state.batchDelete.forEach((item)=>{
         this.delete(item.id,fullCutPage)
       })


   }else{

     if(this.state.batchDelete.length>0){
       this.state.batchDelete.forEach((item)=>{
         this.delete(item.id)
       })
     }

   }
   // console.log(this.state.pagination)
   // return ;

 }

  render(){
    const {  selectedRowKeys } = this.state;
    const rowSelection = {
      onChange: (selectedRowKeys,selectedRows) => {
        this.setState({
          selectedRowKeys,
          batchDelete:selectedRows
        });
      },
      selectedRowKeys
    };


    return (
      <div className={styles.table}>
        <div className={styles.tableOperations}>
          <Button onClick={this.batchDetete} type="danger">批量删除</Button>
        </div>
        <Table
         columns={this.state.columns}
         pagination={this.state.pagination}
         loading={this.state.loading}
         dataSource={this.state.data}
         onChange={this.handleTableChange.bind(this)}
         rowSelection={rowSelection}
        >
        </Table>
        <ShowBox
         visible={this.state.adviceVisibleBox}
         id={this.state.adviceIdBox}
         propHandBox={this.propHandBox.bind(this)}
        />
      </div>
    )
  }
}

export default Advice;
