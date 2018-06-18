import React from "react";
import {Modal,Button,Select,Input,Upload,Radio,Icon,Message} from "antd";
import fetchs from "../../utils/request";
import config from "../../common/config";
import qiniu from "../../utils/_qiniu";


class AddBox extends React.Component{
  state={
    visible:false,
    data:[],
    title:"",
    detail:"",
    active:"",
    gameUrl:"",
    gameIntro:"",
    fileList_icon:[],
    fileList_headGame:[]
  }
  handleOk=()=>{
    if(this.state.title==""){
       Message.error("标题不能为空");
       return false;
    }

    if(this.state.gameUrl==""){
       Message.error("游戏网址不能为空");
       return false;
    }

    if(this.state.gameIntro==""){
       Message.error("游戏介绍不能为空");
       return false;
    }

    this.upload();
  }

  upload(fileList){
    if(this.state.fileList_icon.length!==1){
      Message.error("icon只放置一张图");
      return false;
    }

    if(this.state.fileList_headGame.length!==1){
      Message.error("专题只放置一张图");
      return false;
    }

    const key =`h5/${this.state.title}`;
     Promise.all([
       this._qin(this.state.fileList_headGame[0],`${key}/title_img`),
       this._qin(this.state.fileList_icon[0],`${key}/icon`)
     ]).then((res_1)=>{
        const key_head=res_1[0].key;
        const key_icon=res_1[1].key;
        this.alreadyUpload(key_head,key_icon);
     });
  }

  _qin(item,key){
   return new Promise((resolve,reject)=>{
    fetchs(`${config.url_admin}/getUptokenByMsg?scope=oneyouxiimg&key=${key}`).then((res)=>{
      if(res.data.state){
         qiniu.upload({
           file:item,
           key:key,
           token:res.data.upToken,
           error:function () {
                 Message.error('上传失败');
           },
           success:(res)=>{
              resolve(res);
           }
         });
       }
     });
   })

  }

 alreadyUpload(key_head,key_icon){
   fetchs(`${config.url_adminH5}/addH5?icon=${key_icon}&title_img=${key_head}&name=${this.state.title}&url=${this.state.gameUrl}&recommend=${this.state.gameIntro}`).then((res_2)=>{
      Message.success("上传成功");
      this.setState({
        visible:false,
        title:"",
        detail:"",
        active:"",
        fileList_icon:[]
      });
      // this.props.propHandBox(false);
      this.handleCancel();
      this.props.fetchH5(1);
    });
 }


  handleCancel=()=>{
    this.setState({
      visible:false,
      data:[],
      title:"",
      detail:"",
      active:"",
      gameUrl:"",
      gameIntro:"",
      fileList_icon:[],
      fileList_headGame:[]
    });
    this.props.propHandBox(false);
  }
  UNSAFE_componentWillReceiveProps(e){
    this.setState({visible:e.visible});
  }
   render(){
     const props_icon={
       onRemove:(file)=>{
         this.setState(({ fileList_icon }) => {
           const index = fileList_icon.indexOf(file);
           const newFileList = fileList_icon.slice();
           newFileList.splice(index, 1);
           return {
             fileList_icon: newFileList,
           };
         });
       },
       beforeUpload: (file) => {
         this.setState(({ fileList_icon }) => ({
           fileList_icon: [...fileList_icon, file],
         }));
         return false;
       },
       fileList:this.state.fileList_icon
     }
     const props_headGame={
       onRemove:(file)=>{
         this.setState(({ fileList_headGame }) => {
           const index = fileList_headGame.indexOf(file);
           const newFileList = fileList_headGame.slice();
           newFileList.splice(index, 1);
           return {
             fileList_headGame: newFileList,
           };
         });
       },
       beforeUpload: (file) => {
         this.setState(({ fileList_headGame }) => ({
           fileList_headGame:[...fileList_headGame,file],
         }));
         return false;
       },
       fileList:this.state.fileList_headGame
     }
     return (
       <Modal
        title="添加H5游戏"
        visible={this.state.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        loading={this.state.loading}
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
       addonBefore="游戏网址"
       value={this.state.gameUrl}
       placeholder="输入游戏网址"
       onChange={(e)=>{this.setState({gameUrl:e.target.value})}}
       style={{width:400,display:"block",marginTop:15}}
       />
       <Input
       addonBefore="游戏介绍"
       value={this.state.gameIntro}
       placeholder="请输入游戏介绍"
       onChange={(e)=>{this.setState({gameIntro:e.target.value})}}
       style={{width:400,display:"block",marginTop:15}}
       />
      </Input.Group>
       <Upload
       {...props_icon}
       >
        <Button style={{marginTop:15}}>
          <Icon type="upload"/> 游戏icon(单张)
        </Button>
       </Upload>
       <Upload
       {...props_headGame}
       >
        <Button style={{marginTop:15}}>
          <Icon type="upload"/> 游戏头图(单张，295*(高)*768(宽))
        </Button>
       </Upload>
       </Modal>
     )
   }
}

export default AddBox;
