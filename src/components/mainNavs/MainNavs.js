import React from "react";
import {Menu,Icon,Button} from 'antd';
import styles from "./mainNavs.scss";
import {Link} from "dva/router";
const SubMenu=Menu.SubMenu;
class MainNavs extends React.Component{
  state={
    collapsed:false
  }
  toggle=()=>{
    this.setState({
     collapsed: !this.state.collapsed,
   });
  }
  render(){
    return(
       <Menu
        defaultSelectedKeys={[1]}
        defaultOpenKeys={['sub1','sub2','sub3']}
        mode="inline"
        inlineCollapsed={this.state.collapsed}
        style={{border:"none"}}
       >
          <SubMenu key="sub1" title={<span><Icon type="setting" /><span>游戏管理</span></span>}>
           <Menu.Item key="1">
            <Link to="/admin/game">游戏</Link>
           </Menu.Item>
           <Menu.Item key="2">
             <Link to="/admin/recommend">
             推荐位</Link>
           </Menu.Item>
           <Menu.Item key="3">
            <Link to="/admin/tag">专题</Link>
            </Menu.Item>
           <Menu.Item key="4">
            <Link to="/admin/title">
             标签
            </Link>
           </Menu.Item>
         </SubMenu>
         <SubMenu key="sub2" title={<span><Icon type="setting" /><span>咨询管理</span></span>}>
          <Menu.Item key="5">Option 5</Menu.Item>
          <Menu.Item key="6">Option 6</Menu.Item>
          <Menu.Item key="7">Option 7</Menu.Item>
          <Menu.Item key="8">Option 8</Menu.Item>
        </SubMenu>
        <SubMenu key="sub3" title={<span><Icon type="setting" /><span>Navigation Three</span></span>}>
          <Menu.Item key="9">Option 9</Menu.Item>
          <Menu.Item key="10">Option 10</Menu.Item>
          <Menu.Item key="11">Option 11</Menu.Item>
          <Menu.Item key="12">Option 12</Menu.Item>
        </SubMenu>
       </Menu>
    )
  }
}

export default MainNavs;
