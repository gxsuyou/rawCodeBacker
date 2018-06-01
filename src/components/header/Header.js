import React from "react";
import {Menu,Icon,Popover,Layout,Button} from 'antd';
import styles from "./Header.scss";
const { SubMenu } = Menu;
class AdminHeader extends React.Component{
  render(){
    return (
      <Layout.Header className={styles.header}>
        <div className={styles.rightWarpper}>
            <div>
             <Icon type="user"/>
             <span className={styles.names}>Andy</span>
            </div>
            <Button className={styles.outPut}>注销</Button>
        </div>
      </Layout.Header>
    )
  }
}


// <SubMenu
//   style={{
//     float: 'right',
//   }}
//   title={<span>
//     <Icon type="user" />
//     {
//       //user.username
//     }
//     andy
//   </span>}
// >
// </SubMenu>

export default AdminHeader;
