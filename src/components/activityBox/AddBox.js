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
    data: [],
    activityName:"",
    active:"",//激活状态
    gameName:"",
    title:"",
    row:"",
    os:2,
    inputToggle:false,
    current:1
  }
  handleCancel=(e)=>{
    this.setState({
      visible: false,
      gameName:"",
      os:2
    });
    this.props.propHandBox(false);
  }
  handleOk = () => {
    console.log(this.state.data)
    if(this.state.data.length>0){
       console.log("选择了")

      // console.log(this.state.data[0].value,this.state.data[0].id,this.state.current)
       fetchs(`${config.url_adminGame}/getAddTicketGame?game_id=${this.state.data[0].id}&game_name=${this.state.data[0].value}`).then((res)=>{
         console.log(res)
         if(res.data.state==1){

           this.handleCancel()
           this.props.propsFetchs(this.state.current);
         }else{
           Message.error("添加失败");
         }
       });

    }

  }

  UNSAFE_componentWillReceiveProps(e){
    this.setState({
      visible:e.visible,
      current:e.current
    });
  }
  autoSelectBox(value){
    this.setState({ gameName:value });
    if(value===""){
      return false;
    }
    fake(value,this.state.os,(data)=> this.setState({ data }));
  }
  focusGetData(){
    const c=[];
    fetchs(`${config.url_adminGame}/activeSearch?sys=${this.state.os}`).then((res)=>{
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
          cancelText="取消">
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
         <Input.Group
          className={styles.InputGroup}
         >
          <Radio.Group onChange={(e)=>{
            this.setState({
              os:e.target.value,
              gameName:"",
              data:[]
            });
          }}
          value={this.state.os}
          style={{lineHeight:2}}
          >
             <Radio value={2}>android</Radio>
             <Radio value={1}>ios</Radio>
          </Radio.Group>
         </Input.Group>
        </Modal>
     )
   }
}

export default AddBox;
