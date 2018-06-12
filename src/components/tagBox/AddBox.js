import React from "react";
import {Modal,Button,Select,Radio,Input,Upload,Icon,Message} from "antd";
import fetchs from "../../utils/request";
import config from "../../common/config";
// import styles from "./AddBox.scss";
import qiniu from "../../utils/_qiniu";


class AddBox extends React.Component{
  state={
    visible:false,
    data: [],
    // radioValue:1,
    // activityName:"",
    // active:"",//激活状态
    // gameName:"",
    // title:"",
    // row:""
  }
  handleOk=()=>{

  }
  handleCancel=()=>{
    this.setState({visible:false});
  }
  UNSAFE_componentWillReceiveProps(e){
    this.setState({visible:e.visible});
  }
   render(){
     return (
       <Modal
        title="添加游戏"
        visible={this.state.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        loading={this.state.loading}
        okText="提交"
        cancelText="取消"
       >
        <p>dede</p>
       </Modal>
     )
   }
}

export default AddBox;
