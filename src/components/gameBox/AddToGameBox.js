import react from "react";
import {Modal,Button} from "antd";
class TagBox extends react.Component{
  state={
    visible:this.props.tagBoxVision
  }
  onModal(){
    console.log(1)
  }
  componentWillReceiveProps(){
    this.setState({
      visible:this.props.tagBoxVision
    });
  }
  render(){
    return(
      <div>
        <Button onClick={this.onModal.bind(this)}> ok</Button>
        <Modal
        onOk={this.onModal.bind(this)}
        onCancel={()=>{this.setState({visible:false})}}
        visible={this.state.visible}
        >
          <p>thank</p>
        </Modal>
      </div>
    )
  }
}

export default TagBox;
