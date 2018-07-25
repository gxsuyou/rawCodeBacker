import React from "react";
import {Modal,Button,Select,Radio,Input,Upload,Icon,Message} from "antd";
import fetchs from "../../utils/request";
import config from "../../common/config";
import styles from "./AddBox.scss";
import z from "../../utils/_qiniu";
const Option=Select.Option;



function fake(n,os,callback){
  const data=[];
  fetchs(`${config.url_adminGame}/activeSearch?name=${n}&sys=${os}`).then((res)=>{
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

class AddBox extends React.Component{
  state={
    visible:false,
    gameName:"",
    data:[],
    radioValue:2
  }
  handleCancel = (e) => {
    this.setState({
      visible: false,
      gameName:"",
      data:[]
    });
    this.props.propHandBox(false);
  }
  handleOk = () => {
    if(this.state.gameName==""){
      Message.error("游戏名不能为空");
      return false;
    }else{
      fetchs(`${config.url_adminGame}/hasGame?name=${this.state.gameName}`).then((res)=>{
        if(res.data.state==0){
          Message.error("游戏名不存在");
          return false;
        }
      });
    }
    fetchs(`${config.url_adminNews}/addSlideGame?game_id=${this.state.data[0].id}`).then((res)=>{
      if(res.data.state){
        Message.success("添加成功");
        this.setState({
          visible: false,
          gameName:"",
          data:[]
        });
        this.props.propHandBox(false);
        this.props.propsFetchs(1);
      }else{
        Message.error("添加失败");
      }
    });
  }

  componentWillReceiveProps(e){
    this.setState({
      visible:e.visible
    });
  }
  autoSelectBox(value){
    this.setState({ gameName:value });
    if(value===""){
      return false;
    }
    fake(value,this.state.radioValue,(data)=> this.setState({ data }));
  }
  focusGetData(){
    const c=[];
    fetchs(`${config.url_adminGame}/activeSearch?sys=${this.state.radioValue}`).then((res)=>{
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
   render(){
     const options = this.state.data.map(d => <Option key={d.value}>{d.text}</Option>);
     return(
       <Modal
          title="添加推荐位"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          loading={this.state.loading}
          okText="提交"
          cancelText="取消"
        >
        <Radio.Group
        onChange={(e)=>{
          this.setState({
            radioValue:e.target.value,
            gameName:""
          })
        }}
         value={this.state.radioValue}
         style={{marginBottom:10}}
        >
          <Radio value={2}>android</Radio>
          <Radio value={1}>ios</Radio>
        </Radio.Group>
          <Select
             mode="combobox"
             value={this.state.gameName}
             placeholder={"输入游戏名称进行查询"}
             style={{width:400,marginTop:5}}
             defaultActiveFirstOption={false}
             showArrow={false}
             filterOption={false}
             onChange={this.autoSelectBox.bind(this)}
             onFocus={this.focusGetData.bind(this)}
          >
           {options}
          </Select>
        </Modal>
     )
   }
}

export default AddBox;
