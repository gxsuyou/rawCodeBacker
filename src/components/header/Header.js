import React from "react";
import {Menu,Icon,Popover,Button,Modal,Input,Message} from 'antd';
import styles from "./Header.scss";
import {connect} from "dva";
import config from "../../common/config";
import fetchs from "../../utils/request";
const { SubMenu } = Menu;
class AdminHeader extends React.Component{
  loginOut(){
    this.props.dispatch({
      type:"adminIndex/loginToggle",
      user:"",
      loginTrue:false
    });//退出
    config.delCookie("user","",-1);
    config.delCookie("pwd","",-1);
    config.delCookie("uid","",-1);
    config.delCookie("nikeName","",-1);
    window.location=`${config.url_back}#/`;
  }
  state={
    visible:false,
    bindAppVisible:false,
    bindAppOnlyId:"",
    bindAppUser:"",
    user:"",
    nickName:"",
    oldPwd:"",
    newPwd:"",
    confPwd:""
  }
  onCancel=()=>{
    this.setState({
      visible:false,
      oldPwd:"",
      newPwd:"",
      confPwd:"",
    });
  }
  componentDidMount(){
    const user=config.getCookie("user");
    var nickName=config.getCookie("nickName");
    if(nickName==null){
      nickName="";
    }
    this.setState({
      user:user,
      nickName:nickName
    });
  }


  bindBox=()=>{
    console.log("init",config.url_1)
    const id=config.getCookie("uid");
    this.setState({
        bindAppVisible:true,
    })
    fetchs(`${config.url_1}users/getBindingInfo?id=${id}`).then((res)=>{

      if(res.data.length!==0){
          this.setState({
            bindAppUser:res.data[0].only_id
          })
      }else{
        this.setState({
          bindAppUser:"无"
        })
      }

    })

  }

  onBindOK=()=>{
    const id=config.getCookie("uid");
    console.log(this.state.bindAppOnlyId,id)
    if(this.state.bindAppOnlyId==""){
      Message.error("不能为空")
      return false;
    }
    fetchs(`${config.url_1}users/getUserBinding?user=${this.state.bindAppOnlyId}&id=${id}`).then((res)=>{
        if(res.data.state){
          Message.success("绑定成功")
          this.setState({
            bindAppVisible:false
          })
        }else{
          Message.error("绑定失败")
        }
    })

  }


  onOK=()=>{
   if(this.state.user===""){
     Message.error("用户名不能为空");
     return false;
   }

   if(this.state.nickName===""){
     Message.error("别名不能为空");
     return false;
   }

   if(this.state.oldPwd===""){
     Message.error("旧密码不能为空");
     return false;
   }

   if(this.state.newPwd===""){
     Message.error("新密码不能为空");
     return false;
   }

   if(this.state.confPwd===""){
     Message.error("确认的新密码不能为空");
     return false;
   }

  if(this.state.confPwd!=this.state.newPwd){
    Message.error("新密码和确认密码不相等");
    return false;
  }

  const uid=config.getCookie("uid");
  fetchs(`${config.url_admin}/setPassword`,{
    method:"POST",
    headers:{
      'Content-Type':'application/x-www-form-urlencoded'
    },
    body:`id=${uid}&pwd=${this.state.confPwd}&oldPwd=${this.state.oldPwd}&nike_name=${this.state.nickName}`
  }).then((res)=>{
    if(res.data.state){
      Message.success("密码修改成功");
      this.setState({
        visible:false,
        nickName:this.state.nickName,
        oldPwd:"",
        newPwd:"",
        confPwd:"",
      });
    }else{
      Message.error("密码修改失败");
    }
  })
  }
  render(){
    return (
        <div className={styles.rightWarpper}>
            <div>
             <Icon type="user"/>
             <span className={styles.names}>{this.props.adminIndex.user}</span>
            </div>
            <Button onClick={this.loginOut.bind(this)} className={styles.outPut}>注销</Button>
            <Button className={styles.outPut_1}
            onClick={()=>{this.setState({
              visible:true
            })}}
            >修改密码</Button>
            <Button className={styles.outPut}
            onClick={
               this.bindBox
            }>
              绑定App账户
            </Button>
          <Modal
           title="绑定App账户"
            visible={this.state.bindAppVisible}
            onCancel={()=>{
              this.setState({
                bindAppVisible:false
              })
            }}
            onOk={this.onBindOK}
            okText="绑定"
            cancelText="取消"
          >
           <Input.Group
           className={styles.InputGroup}
           >
             <Input
             addonBefore="绑定APP的id"
             disabled={true}
             value={this.state.bindAppUser}
              />
              <Input
                addonBefore="APP的id"
                placeholder="输入您App的only_id(只能绑定一次)"
                value={this.state.bindAppOnlyId}
                onChange={(e)=>{
                  this.setState({bindAppOnlyId:e.target.value})
                }}
               />
           </Input.Group>
          </Modal>


          <Modal
           title="密码修改"
           visible={this.state.visible}
           onCancel={this.onCancel}
           onOk={this.onOK}
           okText="修改密码"
           cancelText="取消"
           >
            <Input.Group
            className={styles.InputGroup}
            >
             <Input
               addonBefore="用户名"
               placeholder="输入您的名字"
               disabled={true}
               value={this.state.user}
               onChange={(e)=>{
                 this.setState({user:e.target.value})
               }}/>
             <Input
               addonBefore="别名"
               placeholder="输入您的别名"
               value={this.state.nickName}
               onChange={(e)=>{
                 this.setState({nickName:e.target.value})
               }}/>
             <Input
               addonBefore="旧密码"
               placeholder="输入您的旧密码"
               value={this.state.oldPwd}
               type="password"
               onChange={(e)=>{
                 this.setState({oldPwd:e.target.value})
               }}
             />
             <Input
               addonBefore="新密码"
               placeholder="输入您的新密码"
               value={this.state.newPwd}
               type="password"
               onChange={(e)=>{
                 this.setState({newPwd:e.target.value})
               }}
             />
             <Input
               addonBefore="重复新密码"
               placeholder="重复输入您的新密码"
               value={this.state.confPwd}
               type="password"
               onChange={(e)=>{
                 this.setState({confPwd:e.target.value})
               }}
             />
            </Input.Group>
           </Modal>
        </div>
    )
  }
}

export default connect(({adminIndex})=>({
  adminIndex
}))(AdminHeader);
