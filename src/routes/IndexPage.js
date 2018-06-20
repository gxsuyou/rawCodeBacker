import React from 'react';
import { connect } from 'dva';
import styles from './IndexPage.scss';
import {Button,Form,Input,Icon,message} from "antd";
import config from "../common/config.js";
import fetch from "../utils/request.js";
const FormItem = Form.Item;
message.config({
  maxCount:1,
})

class IndexPage extends React.Component{
  constructor(){
    super();
    this.state={
      user:"",
      pwd:""
    }
  }
;
 componentDidMount(){

    if(config.getCookie("user")!=null&&config.getCookie("pwd")!=null){
      this.fetch_login(config.getCookie("user"),config.getCookie("pwd"));
    }
 }
  login(){
   if(this.state.user===""||this.state.pwd===""){
     message.error("用户名或密码不能为空");
     return false;
   }
    this.fetch_login(this.state.user,this.state.pwd);
  }
fetch_login(user,pwd){
  fetch(config.url_login,
    {method:"POST",
    headers: {
    'Content-Type':'application/x-www-form-urlencoded' // 指定提交方式为表单提交
    },
    body:`name=${user}&pwd=${pwd}`
 }).then((res)=>{
     if(res.data.state){
       //登录成功
       window.location="/#/admin/game";
       this.props.dispatch({
         type:"adminIndex/loginToggle",
         user:user,
         loginTrue:true
       });
       config.setCookie("user",user,0.5);
       config.setCookie("pwd",pwd,0.5);
       config.setCookie("uid",res.data.user[0].id);
       config.setCookie("nickName",res.data.user[0].nike_name);
     }else{
       message.error('用户名或密码错误');
     }
  })
  .catch((res)=>{
    message.error('网络错误，请重试!');
  })

}
  render(){
    const { getFieldDecorator } = this.props.form;
    return(
     <div className={styles.form}>
       <div className={styles.logo}>
         <div className={styles.welcome}></div>
       </div>
       <Form>
          <FormItem>
            {
              getFieldDecorator('username',{
                rules:[
                ]
              })(
             <Input onChange={(e)=>{this.setState({user:e.target.value})}} prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}   placeholder="用户名" />
              )
            }
          </FormItem>
          <FormItem>
           {
             getFieldDecorator('password',{

             })(
               <Input onChange={(e)=>{this.setState({pwd:e.target.value})}} prefix={<Icon type="lock" style={{color:'rgba(0,0,0,.25)'}}/>}  type="password" placeholder="密码" />
             )
           }
          </FormItem>
          <FormItem>
             <Button onClick={this.login.bind(this,"ol")} style={{width:"100%",lineHeight:"30px",height:"35px",cursor:"pointer"}} type="primary" htmlType="submit" className="login-form-button">
                 登 录
             </Button>
          </FormItem>
       </Form>
     </div>
    )
  }
}


const WrapIndexPage = Form.create()(IndexPage)
export default connect(({adminIndex})=>({
  adminIndex
}))(WrapIndexPage);
