import React from "react";
import {Modal,Message,Icon,Upload,Input} from "antd";

class EditorBox extends React.Component{
  state={
    visible:false,
    current:1,
    typeName:"首页轮播推荐位",
    type:""
  }
  handleOk=()=>{
    console.log(this.state.type);
  }
  handleCancel=()=>{
    this.setState({
      visible:false,
    });
    this.props.propHandBox(false);
  }
  UNSAFE_componentWillReceiveProps(e){

   switch (e.type) {
     case "首页轮播推荐位":
       var type=1;
       break;
   }

    this.setState({
      visible:e.visible,
      current:e.current,
      typeName:e.type,
      type:type
    });
  }
  render(){
    return(
      <Modal
       title={this.state.typeName}
       visible={this.state.visible}
       onOk={this.handleOk}
       onCancel={this.handleCancel}
       okText="提交"
       cancelText="取消"
      >
        <p>1111</p>
      </Modal>
    )
  }
}
export default EditorBox;
