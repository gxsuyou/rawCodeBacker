import react from "react";
import {Modal,Button} from "antd";
class AddToGameBox extends react.Component{
  state={
    visible:false
  }
  onModal(){
    this.setState({
      visible:true
    })
  }
  render(){
    return(
      <div>
        <Button onClick={this.onModal.bind(this)} />
        <Modal
        onOK={this.onModal.bind(this)}
        onCancel={()=>{console.log(1)}}
        visible={this.state.visible}
        >
          <p>thank</p>
        </Modal>
      </div>
    )
  }
}

export default AddToGameBox;
