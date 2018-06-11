import React from "react";
import {Modal,Button,Select} from "antd";
const Option=Select.Option;

function fake(callback){
  const data=[];
  data.push({
    value:"json",
    text:"json"
  });
  callback(data);
}

class AddBox extends React.Component{
  state={
    visible:false,
    autoBox:[],
    data: [],
    value: ''
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
  UNSAFE_componentWillReceiveProps(e){
    this.setState({
      visible:e.visible
    });
  }
  autoSelectBox(value){
    this.setState({ value });
    fake((data)=> this.setState({ data }));
    //console.log(this.state.data)
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
        >
          <Select
             mode="combobox"
             value={this.state.value}
             placeholder={this.props.placeholder}
            style={{width:200}}
             defaultActiveFirstOption={false}
             showArrow={false}
             filterOption={false}
             onChange={this.autoSelectBox.bind(this)}
          >
           {options}
         </Select>
        </Modal>
     )
   }
}

export default AddBox;
