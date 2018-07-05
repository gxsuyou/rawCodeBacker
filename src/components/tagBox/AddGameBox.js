import React from "react";
import {Modal,Button,Select,Message,Table} from "antd";
import fetchs from "../../utils/request";
import config from "../../common/config";
import styles from "./AddGameBox.scss";
const Option=Select.Option;


function fake(n,callback){
  const data=[];
  fetchs(`${config.url_adminGame}/activeSearch?name=${n}`).then((res)=>{
    res.data.result.forEach((item)=>{
      data.push({
        value:item.game_name,
        text:item.game_name,
        id:item.id
      });
      callback(data);
    });
  });
}

class AddGameBox extends React.Component{
  state={
    visible:false,
    current:"",
    gameName:"",
    subjectId:"",
    data:[],
    os:2,
    mainData:[],
    columns:[
      {
        title:"序号",
        dataIndex:'key',
        key:'key'
      },{
        title:'标题',
        dataIndex:'title',
          key:'title'
      },{
        title:'游戏名',
        dataIndex:'gameName',
          key:'gameName'
      },{
        title:"操作",
        key:'action',
        render:(text,record)=>{
          return (
            <span>
              <Button type="danger" onClick={this.deleteGame.bind(this,record.id)}
              >删除</Button>
            </span>
          )
        }
      }
    ]
  }
   deleteGame(id){
     fetchs(`${config.url_adminGame}/deleteSubjectGame?id=${id}`).then((res)=>{
       if(res.data.state){
         Message.success("删除成功");
         this.getSubject(this.state.subjectId)
       }else{
         Message.error("删除失败");
       }
     });
   }
   handleCancel = () => {
     this.setState({
       visible: false,
       gameName:"",
       data:[],
       mainData:[]
     });
     this.props.propHandBox(false);
   }
   autoSelectBox(value){
     this.setState({ gameName:value });
     if(value===""){
       return false;
     }
     fake(value,(data)=> this.setState({ data }));
   }
   focusGetData(){
     const c=[];
     fetchs(`${config.url_adminGame}/activeSearch`).then((res)=>{
       res.data.result.forEach((item)=>{
           c.push({
             value:item.game_name,
             text:item.game_name,
             id:item.id
           });
       });
       this.setState({
         data:c
       });
     });
   }


   UNSAFE_componentWillReceiveProps(e){
     this.setState({
       visible:e.visible,
       current:e.current,
       subjectId:e.subjectId,
       os:e.os
     });
     if(e.subjectId){
         this.getSubject(e.subjectId);
      }
   }
  getSubject(subjectId){
    var i=1;
    var c=[];
    fetchs(`${config.url_adminGame}/getSubjectGame?id=${subjectId}`).then((res)=>{
       res.data.game.forEach((item)=>{
         c.push({
           key:i++,
           title:item.title,
           gameName:item.game_name,
           id:item.relationId
         })
       });
       this.setState({
         mainData:c
       });
    });
  }

   addGame=()=>{
     if(this.state.gameName===""){
       Message.error("游戏名字必须填写");
       return false;
     }

     fetchs(`${config.url_adminGame}/addSubjectGame?game_name=${this.state.gameName}&subjectId=${this.state.subjectId}&sys=${this.state.os}`).then((res)=>{

       if(res.data.state){
         Message.success("上传成功");
         this.getSubject(this.state.subjectId)
       }else{
         Message.error("上传失败")
       }

     })
   }



  render(){
    const options = this.state.data.map(d => <Option key={d.value}>{d.text}</Option>);

    return(
     <Modal
      title="添加游戏"
      visible={this.state.visible}
      onOk={this.handleCancel}
      onCancel={this.handleCancel}
      okText="确认"
      cancelText="取消"
     >
     <Select
          mode="combobox"
          value={this.state.gameName}
          placeholder={"输入游戏名称进行添加"}
          style={{width:320,marginTop:5}}
          defaultActiveFirstOption={false}
          showArrow={false}
          filterOption={false}
          onChange={this.autoSelectBox.bind(this)}
          onFocus={this.focusGetData.bind(this)}
      >
        {options}
      </Select >
      <Button onClick={this.addGame} style={{marginLeft:20}}>添加游戏</Button>
      <Table
      className={styles.table}
      columns={this.state.columns}
      dataSource={this.state.mainData}
      pagination={true}
      size={"small"}
      style={{marginTop:20}}
      />
     </Modal>
    )
  }
}

export default AddGameBox;
