import React from "react"
import {Modal,Button,Input,message} from "antd"
import fetchs from "../../utils/request"
import config from "../../common/config"
const {TextArea}=Input;
class SendAdviseBox extends React.Component{
  state={
      visible:false,
      id:null,
      page:1,
      sendAdviceContent:""
  }

  componentWillReceiveProps(e){
    if(e.visible){
      this.setState({
        visible:e.visible,
        id:e.id,
        page:e.page,
        sendAdviceContent:""
      })
    }
  }
  cancel=()=>{
    this.setState({
      visible:false
    })
    this.props.propHandBox(false)
  }
  Ok=()=>{
   if(this.state.sendAdviceContent==""){
     message.error("不能留空!");
     return false;
   }
   fetch(`${config.url_admin}/getUserFeedback`,{method:"POST",
   headers:{'Content-Type':'application/x-www-form-urlencoded' // 指定提交方式为表单提交
   },
   body:`id=${this.state.id}&detail=${this.state.sendAdviceContent}`}).then((res)=>{
       // console.log(res.data)
        // if(res.data.state==1){
          this.setState({
            visible:false
          })
          this.props.propHandBox(false,this.state.page)
        // }
   })
  }
  render(){
    return(
      <Modal
        title="发送意见反馈"
        visible={this.state.visible}
        onCancel={this.cancel}
        onOk={this.Ok}
        width={540}
        okText="确定"
        cancelText="取消"
      >
       <TextArea
       style={{marginTop:5}}
       placeholder="请输入反馈消息给用户"
       autosize={{ minRows: 8, maxRows: 10 }}
       value={this.state.sendAdviceContent}
       onChange={(e)=>{
          this.setState({
            sendAdviceContent:e.target.value
          })
       }}
       />
      </Modal>
    )
  }
}

export default SendAdviseBox
