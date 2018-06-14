import React from "react";
import {Table,Input,Button,Modal,Message} from 'antd';
import styles from './Title.scss';
import config from "../../../common/config";
import fetchs from "../../../utils/request.js";
class Title extends React.Component{
  state={
    columns:[
      {title:'序号',
      dataIndex:'key',
      key:'key'
      },{
      title:'标签',
      dataIndex:'title',
      key:'title'
    },{
      title:'操作',
      key:'action',
      render:(text,record)=>(
        <span className={styles.button}>
         <Button onClick={this.fixTag.bind(this,record.id,record.title)}>修改</Button>
         <Button onClick={this.recOr.bind(this,record.id,record.activeName)}>
            {record.active}
         </Button>
        </span>
      )
    }],
    data:[],
    pagination:{},
    loading:false,
    current:1,
    addBoxVision:false,
    addBoxTitleName:"",
    fixBoxVision:false,
    fixBoxTitleName:"",
    fixBoxId:""
  }
  recOr(id,activeName){
    fetchs(`${config.url_adminGame}/upTag?tagId=${id}&active=${activeName}`).then((res)=>{
        if(res.data.state){
          Message.success("修改推荐成功");
          this.fetchsTitle(this.state.current);
        }
    });
  }
  fixTag(id,title){
    this.setState({
      fixBoxId:id,
      fixBoxTitleName:title,
      fixBoxVision:true
    });
  }

  handleTableChange=(pagination,filters,sorter)=>{
    this.setState({
      current:pagination.current
    })
    this.fetchsTitle(pagination.current);
  }

  componentDidMount(){
     this.fetchsTitle(1);
     config.setCookie("path","title",0.05);
  }
  fetchsTitle(p){
    this.setState({
      loading:true,
    });
    var i=1;
    fetchs(`${config.url_adminGame}/getTag?p=${p}`).then((res)=>{
      const c=[];
      var active;
      res.data.result.forEach((item)=>{
          item.active?active="取消推荐":active="推荐"
          c.push({
            key:i++,
            title:item.name,
            id:item.id,
            active:active,
            activeName:item.active
          });
      });
     const pagination ={...this.state.pagination};
      pagination.total=(res.data.totalPage)*10;
       this.setState({
         loading:false,
         data:c,
         pagination
       });

    });
  }
  addBoxHandleOk(){
    if(this.state.addBoxTitleName===""){
      Message.error("标题不能为空");
      return false;
    }
    fetchs(`${config.url_adminGame}/addTag?&name=${this.state.addBoxTitleName}`).then((res)=>{
     if(res.data.state){
        Message.success("上传成功");
        this.setState({
          addBoxVision:false
        });
        this.fetchsTitle(1);
     }else{
       Message.error("上传失败");
     }
    });
  }
  fixBoxHandleOk(){
   if(this.state.fixBoxTitleName===""){
     Message.error("标签不能为空");
     return false;
   }

    fetchs(`${config.url_adminGame}/editTag?tagId=${this.state.fixBoxId}&name=${this.state.fixBoxTitleName}`).then((res)=>{
       if(res.data.state){
         Message.success("修改成功");
         this.setState({
           fixBoxVision:false,
           fixBoxTitleName:""
         });
         this.fetchsTitle(this.state.current);
       }else{
        Message.error("修改失败");
       }
    });
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
          indentSize={20}
          pagination={this.state.pagination}
          loading={this.state.loading}
          onChange={this.handleTableChange}/>
        <Modal
         title="添加标签"
         visible={this.state.addBoxVision}
         onOk={this.addBoxHandleOk.bind(this)}
         onCancel={()=>{this.setState({addBoxVision:false})}}
         okText="提交"
         cancelText="取消">
          <Input.Group >
             <Input addonBefore="标签名字" onChange={(e)=>{
               this.setState({addBoxTitleName:e.target.value})
             }}
             value={this.state.addBoxTitleName}
             placeholder="输入标签名字"
             styles={{display:"block",width:500}}
             />
          </Input.Group>
        </Modal>
        <Modal
        visible={this.state.fixBoxVision}
        title="修改标签"
        onOk={this.fixBoxHandleOk.bind(this)}
        onCancel={()=>{this.setState({fixBoxVision:false})}}>
        <Input addonBefore="标签名字" onChange={(e)=>{
          this.setState({fixBoxTitleName:e.target.value})
        }}
        value={this.state.fixBoxTitleName}
        placeholder="输入标签名字"
        styles={{display:"block",width:500}}
        />
        </Modal>
      </div>
    )
  }
}
export default Title;
