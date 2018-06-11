import React from "react";
import {Select,Table,Button,Input,Message} from 'antd';
import styles from "./Recommend.scss";
import fetchs from "../../../utils/request.js";
import config from "../../../common/config";
import AddBox from "../../../components/recoBox/AddBox";
const Search =Input.Search;
const Option = Select.Option;


class Recommend extends React.Component{
  state={
    visible:false,
    loading:false,
    addBoxVision:false,
    columns:[
      {title:'序号',
      dataIndex:'key',
      key:'key',
      current:1,
     },{
       title:'ID',
       dataIndex:'id',
     },{
       title:'活动名',
       dataIndex:'active',
     },{
       title:'标题',
       dataIndex:'title',
     },{
       title:'排列',
       dataIndex:"sort",
     },{
       title:'活动图片地址',
       dataIndex:'imgSrc',
     },{
       title:'状态',
       dataIndex:'status',
     },{
       title:'推荐位类型',
       dataIndex:'recommendType',
     },{
       title:"操作",
       key:'action',
       render:(text,record)=>(
        <span className={styles.button}>
         <Button>编辑</Button>
         <Button onClick={this.deleteGame.bind(this,record.key,record.id)} type="danger">删除</Button>
        </span>
       )
     }
   ],
   mainData:[],
   pagination:{}
  }

 componentWillMount(){
  this.fetchs_chapter(1);
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
    fetchs(`${config.url_admin}/active?p=${p}`)
    .then((res)=>{
      var i =1;
      res.data.result.forEach((item)=>{
       if(item.active!=1){
         var status="不激活";
       }else{
         var status="激活";
       }
       if(item.type == '4'){
         var recommendType="首页推荐位"
       }else if(item.type== '1'){
         var recommendType='首页轮播推荐位';
       }else if(item.type == '5'){
        var recommendType='推荐位（横向2个）';
      }else if(item.type == '6'){
        var recommendType='推荐位（竖排10个）';
      }

     if(item.active_img==""){
       var imgSrc="暂无数据";
     }else{
       var imgSrc=`http://img.oneyouxi.com.cn/${item.active_img}`
     }

        this.state.mainData.push({
          key:i++,
          id:item.id,
          imgSrc:imgSrc,
          title:item.title,
          status:status,
          sort:item.sort,
          active:item.name,
          recommendType:recommendType
        });

      });
      const pagination={...this.state.pagination};
      pagination.total=res.data.totalPage*10;
      this.setState({
        loading:false,
        pagination
      });
    });
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
  deleteGame(key,id){
   fetchs(`${config.url_adminGame}/deleteActiveById?activityId=${id}`).then((res)=>{
     if(res.data.state==1){
       this.fetchs_chapter(this.state.current);
     }else{
       Message.error("删除失败");
     }
   });

  }
  searchName(v){
    if(v==""){
      this.fetchs_chapter(1);
      return false;
    }
    fetchs(`${config.url_adminGame}/activeSearch?name=${v}`)
    .then((res)=>{
      var i=1;
      var c=[];
       res.data.game.forEach((item)=>{

         if(item.active!=1){
           var status="不激活";
         }else{
           var status="激活";
         }
         if(item.type == '4'){
           var recommendType="首页推荐位"
         }else if(item.type== '1'){
           var recommendType='首页轮播推荐位';
         }else if(item.type == '5'){
          var recommendType='推荐位（横向2个）';
        }else if(item.type == '6'){
          var recommendType='推荐位（竖排10个）';
        }

       if(item.active_img==""){
         var imgSrc="暂无数据";
       }else{
         var imgSrc=`http://img.oneyouxi.com.cn/${item.active_img}`
       }

           c.push({
            key:i++,
            id:item.id,
            imgSrc:imgSrc,
           title:item.title,
           status:status,
           sort:item.sort,
           active:item.name,
           recommendType:recommendType
           });

       });
       //console.log(c);
      this.setState({
        mainData:c
      })

    })
  }
  render(){
    return(
      <div className={styles.table}>
       <div className={styles.tableOperations}>
        <Search
       addonBefore="活动名"
        style={{width:350}}
        placeholder="输入活动名"
        onSearch={this.searchName.bind(this)}
        className={styles.tableOperationsInput}  />
        <Button onClick={()=>{this.setState({addBoxVision:true})}} type="primary">添加</Button>
       </div>
       <Table
       columns={this.state.columns}
       dataSource={this.state.mainData}
       pagination={this.state.pagination}
       onChange={this.handleTableChange.bind(this)}
       loading={this.state.loading}
       />
        <AddBox visible={this.state.addBoxVision} />
      </div>
    )
  }
}

export default Recommend;
