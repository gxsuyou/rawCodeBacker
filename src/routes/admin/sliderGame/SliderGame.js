import React from "react";
import {Select,Table,Button,Input,Message,Radio} from 'antd';
import styles from "./SliderGame.scss";
import fetchs from "../../../utils/request.js";
import config from "../../../common/config";
import AddBox from "../../../components/sliderGameBox/AddBox";
const Search =Input.Search;
const Option = Select.Option;

class SliderGame extends React.Component{
  state={
    visible:false,
    loading:false,
    addBoxVision:false,
    editorBoxVison:false,
    editorBoxRecommendType:1,
    editorGameId:"",
    editorActivityId:"",
    editorActivityName:"",
    editorActivityTitle:"",
    editorActivitySort:"",
    editorActivityStatus:"",
    editorActivityImgSrc:"",
    current:1,
    os:"2",
    columns:[
      {title:'序号',
      dataIndex:'key',
      key:'key',
     },{
       title:'游戏名称',
       dataIndex:'gameName',
     },{
       title:'系统',
       dataIndex:'os'
     },{
       title:"操作",
       key:'action',
       render:(text,record)=>(
        <span className={styles.button}>
         <Button onClick={this.deleteGame.bind(this,record.key,record.id)} type="danger">删除</Button>
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
  config.setCookie("path","SliderGame",0.05);
 }
 handleTableChange(e){
   this.setState({
     current:e.current
   });
   this.fetchs_chapter(e.current);
 }
  fetchs_chapter(p){
    this.setState({
      loading:true,
      mainData:[]
    });
    fetchs(`${config.url_adminNews}/getSlideGame?p=${p}&sys=${this.state.os}`)
    .then((res)=>{
      var i =1;
      var os;
      res.data.result.forEach((item)=>{
        item.sys==2?os='android':os='ios';
        this.state.mainData.push({
          key:i++,
          gameName:item.game_name,
          id:item.id,
          os:os
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
  showModal = (v) => {
    this.setState({
      visible: true,
    });
  }
  addGameModel(){
    this.setState({
      addBoxVision:true
    })
  }
  deleteGame(key,id){
   fetchs(`${config.url_adminNews}/deleteSlideGameById?id=${id}`).then((res)=>{
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
  osRenderChange=(e)=>{
    this.setState({
      os:e.target.value,
      current:1,
    });
    setTimeout(()=>{
      this.fetchs_chapter(1);
    },300);
  }
  render(){
    return(
      <div className={styles.table}>
       <div className={styles.tableOperations}>
         <Radio.Group
            style={{marginRight:20}}
            defaultValue="2"
            buttonStyle="solid"
            value={this.state.os}
            onChange={this.osRenderChange}
         >
            <Radio.Button value="2">Android</Radio.Button>
            <Radio.Button value="1">Ios</Radio.Button>
         </Radio.Group>
        <Button onClick={()=>{
          this.setState({addBoxVision:true})}
        } type="primary">添加</Button>
       </div>
       <Table
       columns={this.state.columns}
       dataSource={this.state.mainData}
       pagination={this.state.pagination}
       onChange={this.handleTableChange.bind(this)}
       loading={this.state.loading}
       defaultCurrent={2}
       />
        <AddBox visible={this.state.addBoxVision} propHandBox={this.propHandBox.bind(this)}
        propsFetchs={this.fetchs_chapter.bind(this)}
        />
        {
        // <EditorBox
        //   visible={this.state.editorBoxVison}
        //   current={this.state.current}
        //   gameId={this.state.editorGameId}
        //   activityId={this.state.editorActivityId}
        //   type={this.state.editorBoxRecommendType}
        //   activityName={this.state.editorActivityName}
        //   activityTitle={this.state.editorActivityTitle}
        //   activitySort={this.state.editorActivitySort}
        //   activityStatus={this.state.editorActivityStatus}
        //   activityImgSrc={this.state.editorActivityImgSrc}
        //   propHandBox={this.propHandBox.bind(this)}
        //   propsFetchs={this.fetchs_chapter.bind(this)
        //   }
        // />
        }
      </div>
    )
  }
}

export default SliderGame;
