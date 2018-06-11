import React from "react";
import {Modal,Button} from "antd";


class AddBox extends React.Component{
  state={
    visible:false
  }
  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }
  handleOk = (e) => {
    this.setState({
      visible: false,
    });
  }
  componentWillReceiveProps(e){
    this.setState({
      visible:e.addBoxVisible
    });
  }
   render(){
     return(
       <Modal
          title="Basic Modal"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          pagination={2}
          loading={this.state.loading}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Modal>
     )
   }
}
