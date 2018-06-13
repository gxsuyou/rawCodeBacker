import React from "react";
import {Modal,Button,Select,Input,Upload,Radio,Icon,Message,} from "antd";
import fetchs from "../../utils/request";
import config from "../../common/config";
import qiniu from "../../utils/_qiniu";
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
    data:[]
  }
   handleOk=()=>{

   }
   handleCancel = () => {
     this.setState({
       visible: false,
       // radioValue:1,
       // gameName:""
     });
     //this.props.propHandBox(false);
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
       subjectId:e.subjectId
     })
   }
   addGame=()=>{
     // console.log(this.state.gameName,this.state.subjectId);
     if(this.state.gameName===""){
       Message.error("游戏名字必须填写");
       return false;
     }

     fetchs(`${config.url_adminGame}/addSubjectGame?game_name=${this.state.gameName}&subjectId=${this.state.subjectId}`).then((res)=>{
       //console.log(res);
       res.data.state?Message.success("上传成功"):Message.error("上传失败");


     })
   }
  render(){
    const options = this.state.data.map(d => <Option key={d.value}>{d.text}</Option>);

    return(
     <Modal
      title="添加游戏"
      visible={this.state.visible}
      onOk={this.handleOk}
      onCancel={this.handleCancel}
      okText="提交"
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
      </Select>
      <Button onClick={this.addGame} style={{marginLeft:20}}>添加游戏</Button>
     </Modal>
    )
  }
}

export default AddGameBox;
