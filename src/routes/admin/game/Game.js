import React from "react";
import {Table,List,Avatar,Card} from 'antd';
import styles from "./Game.scss";
import fetch from "../../../utils/request.js";
import config from "../../../common/config.js";
class Game extends  React.Component{
  state={
      titleData:[{
        title: '序号',
        dataIndex:'key',
      },{
        title: '游戏名',
        dataIndex:'game_name'
      },{
        title: '游戏ID',
        dataIndex:"id"
      },{
        title: '上架状态',
        dataIndex:"up",
      },{
        title:'系统',
        dataIndex:"sys"
      },{
        title:"添加时间",
        dataIndex:"addTime"
      },{
        title:"游戏详情",
        dataIndex:"gameDetail"
      },{
        title:"下载数",
        dataIndex:"gameInstallNum"
      },{
        title:"首页排序",
        dataIndex:"sortIndex"
      },{
        title:"热玩排序",
        dataIndex:"sortHot"
      },{
        title:"管理员",
        dataIndex:"admin"
      },{
        title:"操作",
        dataIndex:""
      }],
      MainData:[]
  }
  componentWillMount(){
    return false;
    fetch(config.url_getAdminGame)
    .then((res)=>{
      var i=1;
      var c=[]
      var up,sys;
      res.data.result.forEach((item)=>{
        item.activation?up="是":up="否";
        item.sys==2?sys="Android":sys="ios";
        c.push({
          key:i++,
          game_name:item.game_name,
          id:item.id,
          up:up,
          sys:sys,
          addTime:item.add_time,
          gameDetail:`游戏公司:${item.game_company} 版本:${item.game_version} 大小:${item.game_download_num}`,
          gameInstallNum:item.game_install_num,
          sortIndex:item.sort,
          sortHot:item.sort2,
          admin:item.admin
        });

      });
      this.setState({
        MainData:c
      })

    })
  }

  render(){
    return(
     <Table
      className={styles.table}
      columns={this.state.titleData}
      dataSource={this.state.MainData}
      indentSize={20}
      align={"center"}
      />
    )
  }
}

export default Game;
