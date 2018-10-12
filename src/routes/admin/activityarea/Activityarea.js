import React from "react";
import {Select,Table,Button,Input,Message,Radio} from 'antd';
import styles from "./Activityarea.scss";
import fetchs from "../../../utils/request.js";
import config from "../../../common/config";
import AddBox from "../../../components/activityBox/AddBox";
import EditorBox from "../../../components/activityBox/EditorBox";
const Search =Input.Search;
const Option = Select.Option;

class Activityarea extends React.Component{
  state={
    visible:false,
    loading:false,
    os:"2",
    addBoxVision:false,
    editorBoxVison:false,
    editorGameId:1,
    editorGameName:"",
    current:1,
    columns:[
      {title:'序号',
      dataIndex:'key',
      key:'key',
     },{
       title:'ID',
       dataIndex:'game_id',
     },{
       title:'游戏名',
       dataIndex:'gameName',
     },{
       title:'icon图片地址',
       dataIndex:'imgSrc',
       render:(text,record)=>(
         <span>
         <a href={record.imgSrc} target="_blank">
           {record.imgSrc}
         </a>
         </span>
       )
     },{
       title:"系统",
       dataIndex:'sys'
     },{
       title:"操作",
       key:'action',
       render:(text,record)=>(
        <span className={styles.button}>
         <Button onClick={()=>{
           this.setState({
             editorBoxVison:true,
             editorBoxRecommendType:record.recommendType,
             editorGameId:record.game_id,
             editorGameName:record.gameName,
           });
         }}>编辑</Button>
         <Button onClick={this.deleteGame.bind(this,record.id)} type="danger">删除</Button>
        </span>
       )
     }
   ],
   mainData:[],
   pagination:{
     total:1,
     current:1
   }
  }


 componentWillMount(){
  this.fetchs_chapter(1);
  config.setCookie("path","activityarea",0.05);
 }
 handleTableChange(e){
   this.setState({
     current:e.current
   });
   this.fetchs_chapter(e.current);
 }
 /* 推荐位渲染开始
 @params p 页数
 */
  fetchs_chapter(p){
    this.setState({
      loading:true,
      mainData:[]
    });

    fetchs(`${config.url_adminGame}/getTicketGame?p=${p}&sys=${this.state.os}`)
    .then((res)=>{
      console.log(res)
      // return false;
      var i =1;
      var sort,title,active,sys;
      res.data.result.forEach((item)=>{

      if(item.name==null){
        active="无";
      }else{
        active=item.name;
      }

     if(item.icon==null){
       var imgSrc="无";
     }else{
       var imgSrc=`http://img.oneyouxi.com.cn/${item.icon}`;
     }

     item.sys==1?sys="ios":sys="android";

        this.state.mainData.push({
          key:i++,
          id:item.id,
          imgSrc:imgSrc,
          img:item.active_img,
          active:active,
          game_id:item.game_id,
          sys:sys,
          gameName:item.game_name
        });

      });
      const pagination={...this.state.pagination};
      pagination.total=res.data.totalPage*10;
      pagination.current=res.data.nowPage;
      this.setState({
        loading:false,
        pagination
      });
    });
  }

    osRenderChange=(e)=>{
      this.setState({
        os:e.target.value,
        current:1
      });
      setTimeout(()=>{
        this.fetchs_chapter(1);
      },300)
    }

  showModal = (v) => {
    console.log(v);
    this.setState({
      visible: true,
    });
  }
  addGameModel(){
    this.setState({
      addBoxVision:true
    })
  }
  deleteGame(game_id){

   fetchs(`${config.url_adminGame}/delTicketGame?id=${game_id}`).then((res)=>{
     if(res.data.state==1){
       this.fetchs_chapter(this.state.current);
     }else{
       Message.error("删除失败");
     }
   });

  }

  propHandBox(e){
    this.setState({
      addBoxVision:e,
      editorBoxVison:e
    });
  }


  render(){
    return(
      <div className={styles.table}>
       <div className={styles.tableOperations}>
       {
        // <Search
        //  addonBefore="活动名"
        //  style={{width:350}}
        //  placeholder="输入活动名"
        //  onSearch={this.searchName.bind(this)}
        //  className={styles.tableOperationsInput} />
         }
        <Radio.Group
         style={{marginLeft:20}}
         defaultValue="2"
         buttonStyle="solid"
         value={this.state.os}
        onChange={this.osRenderChange}
        >
          <Radio.Button value="2">Android</Radio.Button>
          <Radio.Button value="1">Ios</Radio.Button>
        </Radio.Group>
        <Button onClick={()=>{this.setState({addBoxVision:true})}} type="primary">添加</Button>
       </div>
       <Table
       columns={this.state.columns}
       dataSource={this.state.mainData}
       pagination={this.state.pagination}
       onChange={this.handleTableChange.bind(this)}
       loading={this.state.loading}
       />
        <AddBox visible={this.state.addBoxVision} propHandBox={this.propHandBox.bind(this)}
        propsFetchs={this.fetchs_chapter.bind(this)}
        current={this.state.current}
        />
        <EditorBox
          visible={this.state.editorBoxVison}
          current={this.state.current}
          gameId={this.state.editorGameId}
          gameName={this.state.editorGameName}
          propHandBox={this.propHandBox.bind(this)}
          propsFetchs={this.fetchs_chapter.bind(this)
          }
        />
      </div>
    )
  }
}

export default Activityarea;
