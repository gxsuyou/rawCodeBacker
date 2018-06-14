import React from "react";
import {Menu,Icon} from 'antd';
import styles from "./mainNavs.scss";
import {Link} from "dva/router";
const SubMenu=Menu.SubMenu;
class MainNavs extends React.Component{
  state={
    collapsed:false,
    current:"1"
  }
  toggle=()=>{
    this.setState({
     collapsed: !this.state.collapsed,
   });
  }
  handleClick = (e)=>{
    this.setState({
      current: e.key,
    });
  }
  UNSAFE_componentWillMount() {
      const hash=window.location.hash;
      if(hash.indexOf("game")!=-1){
        this.setState({
          current:"1"
        });
      }else if(hash.indexOf("recommend")!=-1){
        this.setState({
          current:"2"
        });
      }else if(hash.indexOf("tag")!=-1){
        this.setState({
          current:"3"
        });
      }else if(hash.indexOf("title")!=-1){
        this.setState({
          current:"4"
        });
      }else if(hash.indexOf("HeadBox")!=-1){
        this.setState({
          current:"6"
        });
      }else if(hash.indexOf("SliderGame")!=-1){
        this.setState({
          current:"7"
        });
      }

    }
  render(){
    return(
       <Menu
        defaultOpenKeys={['sub1','sub2','sub3','sub4']}
        mode="inline"
        inlineCollapsed={this.state.collapsed}
        style={{border:"none"}}
        selectedKeys={[this.state.current]}
        onClick={this.handleClick}
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
          <Menu.Item key="6">
             <Link to="/admin/HeadBox">
              头部游戏设置
            </Link>
          </Menu.Item>
          <Menu.Item key="7">
            <Link to="/admin/SliderGame">
              横向游戏设置
            </Link>
          </Menu.Item>
        </SubMenu>
        <SubMenu key="sub3" title={<span><Icon type="setting" />
        <span>
        H5游戏管理</span>
        </span>
      }>
          <Menu.Item key="8">
          <Link to="/admin/h5">
             H5
          </Link>
          </Menu.Item>
        </SubMenu>
        <SubMenu key="sub4" title={<span><Icon type="setting" /><span>攻略管理</span></span>}>
          <Menu.Item key="9">
            <Link to="/admin/Strategy">
             攻略
           </Link>
          </Menu.Item>
        </SubMenu>
        <SubMenu key="sub5" title={<span><Icon type="setting"/><span>超级管理</span></span>}>
        </SubMenu>
       </Menu>
    )
  }
}

export default MainNavs;
