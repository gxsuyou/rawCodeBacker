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
          <Menu.Item key="5">资讯</Menu.Item>
          <Menu.Item key="6">头部游戏设置</Menu.Item>
          <Menu.Item key="7">横向游戏设置</Menu.Item>
        </SubMenu>
        <SubMenu key="sub3" title={<span><Icon type="setting" /><span>H5游戏管理</span></span>}>
          <Menu.Item key="8">H5</Menu.Item>
        </SubMenu>
        <SubMenu key="sub4" title={<span><Icon type="setting" /><span>攻略管理</span></span>}>
          <Menu.Item key="9">攻略</Menu.Item>
        </SubMenu>
        <SubMenu key="sub5" title={<span><Icon type="setting" /><span>渠道管理</span></span>}>
        </SubMenu>
        <SubMenu key="sub5" title={<span><Icon type="setting" /><span>超级管理</span></span>}>
        </SubMenu>
       </Menu>
    )
  }
}

export default MainNavs;
