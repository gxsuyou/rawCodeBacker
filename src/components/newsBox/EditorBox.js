import React from "react";
import {Modal,Message,Icon,Upload,Input,Button,Tabs} from "antd";
import qiniu from "../../utils/_qiniu";
import config from "../../common/config";
import fetchs from "../../utils/request";
const TabPane = Tabs.TabPane;


class EditorBox extends React.Component{
  state={
    visible:false,
    current:1,
    typeName:"首页轮播推荐位",
    type:"",
    agress:"",//点赞数
    title:"",
    browse:"",
    gameId:"",
    activityId:"",
    imgSrc:"",
    comment:"",
    date:"",
    id:"",
    current:1
  }
  handleOk=()=>{

    if(this.state.title===""){
      Message.error("标题不能为空");
      return false;
    }

    if(this.state.browse===""){
      Message.error("浏览数不能为空");
      return false;
    }

    if(this.state.agress===""){
      Message.error("点赞数不能为空");
      return false;
    }

    if(this.state.comment===""){
      Message.error("评论数不能为空");
      return false;
    }

    if(this.state.date===""){
      Message.error("发表时间不能为空");
      return false;
    }
    // console.log(this.state.current);
    // return false;
    this.editor();
  }

  editor(){
    fetchs(`${config.url_adminNews}/setNewsById`,{
      method:"POST",
      headers: {
      'Content-Type':'application/x-www-form-urlencoded'
      },
      body:`id=${this.state.id}&title=${this.state.title}&browse=${this.state.browse}&agree=${this.state.agress}&comment=${this.state.comment}`
    }).then((res_2)=>{
      if(res_2.data.state){
        Message.success("上传成功");
        this.handleCancel();
        this.props.fetchsNews(this.state.current);
      }
    });
  }

  indexUpload(fileList){
   if(fileList.length!=1){
    Message.error("首页轮播推荐位只放置一张图");
    return false;
   }
   const key =`activity/activityType${this.state.type}/gameId${this.state.gameId}`;

  fetchs(`${config.url_admin}/getUptokenByMsg?scope=oneyouxiimg&key=${key}`).then((res)=>{
    qiniu.upload({
      file:fileList[0],
      key:key,
      token:res.data.upToken,
      error:function () {
            Message.error('上传失败');
      },
      success:(res_1)=>{
        fetchs(`${config.url_adminGame}/setGameActive?id=${this.state.activityId}&name=${this.state.activityName}&title=${this.state.title}&sort=${this.state.row}&active_img=${res_1.key}&active=${this.state.active}&game_id=${this.state.gameId}&type=${this.state.type}`).then((res_2)=>{
          if(res_2.data.state){
            Message.success("上传成功");
            this.handleCancel();
            this.props.fetchsNews(this.state.current);
          }
        });

      }
    });


  });

  }

  handleCancel=()=>{
    this.setState({
      visible:false,
    });
    this.props.handBox(false);
  }
  UNSAFE_componentWillReceiveProps(e){
    if(e.visible==false){
      return false;
    }
    this.setState({
      visible:e.visible,
      current:e.current,
      id:e.id
    });
   this.initData(e.id);
  }


   initData(id){
    fetchs(`${config.url_adminNews}/getNewsByMsg?id=${id}`).then((res)=>{
      console.log(res.data);
      this.setState({
        title:res.data[0].title,
        browse:res.data[0].browse,
        agress:res.data[0].agree,
        comment:res.data[0].comment,
        date:res.data[0].add_time
      });

    });

   }

  render(){
    return(
      <Modal
       title="编辑文章"
       visible={this.state.visible}
       onOk={this.handleOk}
       onCancel={this.handleCancel}
       okText="提交"
       cancelText="取消"
      >
     <Input.Group>
             <Input
             addonBefore="标题"
             value={this.state.title}
             placeholder="输入标题"
             onChange={(e)=>{this.setState({title:e.target.value})}}
             style={{width:400,display:"block",marginTop:15}}
             />

             <Input
             addonBefore="浏览数"
             value={this.state.browse}
             placeholder="输入浏览数(必须为数字)"
             onChange={(e)=>{this.setState({browse:e.target.value})}}
             style={{width:400,display:"block",marginTop:15}}
             />

             <Input
             addonBefore="点赞数"
             value={this.state.agress}
             placeholder="请输入点赞数(必须为数字)"
             onChange={(e)=>{this.setState({agress:e.target.value})}}
             style={{width:400,display:"block",marginTop:15,marginButtom:10}}
             />
             <Input
             addonBefore="评论数"
             value={this.state.comment}
             placeholder="请输入评论数(必须为数字)"
             onChange={(e)=>{this.setState({comment:e.target.value})}}
             style={{width:400,display:"block",marginTop:15,marginButtom:10}}
             />
             <Input
             addonBefore="发表日期"
             value={this.state.date}
             placeholder="请输入发表日期"
             onChange={(e)=>{this.setState({date:e.target.value})}}
             style={{width:400,display:"block",marginTop:15,marginButtom:10}}
             />

            </Input.Group>
      </Modal>
    )
  }
}
export default EditorBox;
