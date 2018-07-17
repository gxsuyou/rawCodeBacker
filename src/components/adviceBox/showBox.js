import React from 'react';
import {Modal,Button,Divider} from 'antd';
import fetchs from "../../utils/request";
import config from "../../common/config";
class Show extends React.Component{
  state={
    visible:false,
    content:"",
    nickName:"",
    img:[]
  }
  componentWillReceiveProps(e){
    this.setState({visible:e.visible});
    if(e.visible){
       fetchs(`${config.url_admin}/getFeedBackDetail?id=${e.id}`)
       .then((res)=>{
         console.log(res);
         this.setState({
           content:res.data.result.detail,
           nickName:res.data.result.nick_name,
           img:res.data.img
         })
       })
    }
  }
  cancel=()=>{
    this.setState({visible:false,content:"",img:[]});
  }
  render(){
    return (
      <Modal
       title="查询意见反馈"
       visible={this.state.visible}
       onOk={this.cancel}
       onCancel={this.cancel}
       width={540}
       okText="确定"
       cancelText="取消"
      >
      <div style={{fontSize:16}}>用户昵称 : {this.state.nickName}</div>
       <div style={{height:420,marginTop:20,overflowY:"scroll"}}>
        {this.state.content}
        <div style={{marginTop:15}}>
        {
          this.state.img.map(item=>
            <img style={{width:150,height:"auto",marginLeft:6}} src={`${config.qiniu_img}${item.img}`}  />
          )
        }
        </div>
       </div>
      </Modal>
    )
  }
}

export default Show;
