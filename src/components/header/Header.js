import React from "react";
import {Menu,Icon,Popover,Button} from 'antd';
import styles from "./Header.scss";
import {connect} from "dva";
const { SubMenu } = Menu;
class AdminHeader extends React.Component{
  loginOut(){
    //退出
    this.props.dispatch({
      type:"adminIndex/loginToggle",
      user:"",
      loginTrue:false
    })
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
