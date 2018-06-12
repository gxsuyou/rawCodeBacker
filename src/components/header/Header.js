import React from "react";
import {Menu,Icon,Popover,Button} from 'antd';
import styles from "./Header.scss";
import {connect} from "dva";
import config from "../../common/config";
const { SubMenu } = Menu;
class AdminHeader extends React.Component{
  loginOut(){

    this.props.dispatch({
      type:"adminIndex/loginToggle",
      user:"",
      loginTrue:false
    });//退出
    // console.log(config);
    // return false;
    config.delCookie("user","",-1);
    config.delCookie("pwd","",-1);
    config.delCookie("uid","",-1);

    window.location="/#/";
  }
  render(){
    return (
        <div className={styles.rightWarpper}>
            <div>
             <Icon type="user"/>
             <span className={styles.names}>{this.props.adminIndex.user}</span>
            </div>
            <Button onClick={this.loginOut.bind(this)} className={styles.outPut}>注销</Button>
        </div>
    )
  }
}

export default connect(({adminIndex})=>({
  adminIndex
}))(AdminHeader);
