import React from "react";
import {Menu,Icon,Button} from 'antd';
const SubMenu=Menu.SubMenu;
class MainNavs extends React.Component{
  state={
    collapsed:false
  }
  render(){
    return(
      <div style={{width:256}}>
       <Menu
        defaultSelectedKeys={[1]}
        defaultOpenKeys={['sub1']}
        mode="inline"
        theme="dark"
        inlineCollapsed={this.state.collapsed}
       >

       </Menu>
      </div>
    )
  }
}

export default MainNavs;
