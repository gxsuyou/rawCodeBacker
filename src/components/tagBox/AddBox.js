import React from "react";
import {Modal,Button,Select,Input,Upload,Radio,Icon,Message} from "antd";
import fetchs from "../../utils/request";
import config from "../../common/config";
import qiniu from "../../utils/_qiniu";


class AddBox extends React.Component{
  state={
    visible:false,
    data: [],
    radioValue:2,
    title:"",
    detail:"",
    active:"",
    fileList:[]
  }
  handleOk=()=>{
    if(this.state.title==""){
       Message.error("标题不能为空");
       return false;
    }

    if(this.state.detail==""){
       Message.error("介绍不能为空");
       return false;
    }

    if(this.state.active==""){
       Message.error("标题不能为空");
       return false;
    }

    switch(this.state.radioValue){
      case 2:
       this.androidUpload(this.state.fileList);
      break;
    }
  }

  androidUpload(fileList){
    if(fileList.length!==1){
      Message.error("专题只放置一张图");
      return false;
    }

    const key =`subject/${this.state.title}`;
    fetchs(`${config.url_admin}/getUptokenByMsg?scope=oneyouxiimg&key=${key}`).then((res)=>{
     if(res.data.state){
        qiniu.upload({
          file:fileList[0],
          key:key,
          token:res.data.upToken,
          error:function () {
                Message.error('上传失败');
          },
          success:(res_1)=>{
            fetchs(`${config.url_adminGame}/addSubject?img=${res_1.key}&title=${this.state.title}&detail=${this.state.detail}&active=${this.state.active}&sys=${this.state.radioValue}`).then((res_2)=>{
               Message.success("上传成功");
               this.setState({
                 visible:false,
                 title:"",
                 detail:"",
                 active:"",
                 radioValue:2,
                 fileList:[]
               });
               this.props.propHandBox(false);
               this.props.fetchTag(1);
            })
          }
        });
      }
    });
  }


  handleCancel=()=>{
    this.setState({
      visible:false,
      title:"",
      detail:"",
      active:"",
      radioValue:2,
      fileList:[]
    });
    this.props.propHandBox(false);
  }
  UNSAFE_componentWillReceiveProps(e){
    this.setState({visible:e.visible});
  }
   render(){
     const props={
       onRemove:(file)=>{
         this.setState(({ fileList }) => {
           const index = fileList.indexOf(file);
           const newFileList = fileList.slice();
           newFileList.splice(index, 1);
           return {
             fileList: newFileList,
           };
         });
       },
       beforeUpload: (file) => {
         this.setState(({ fileList }) => ({
           fileList: [...fileList, file],
         }));
         return false;
       },
       fileList:this.state.fileList
     }
     return (
       <Modal
        title="添加游戏"
        visible={this.state.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        loading={this.state.loading}
        okText="提交"
        cancelText="取消"
       >
       <Radio.Group onChange={(e)=>{this.setState({radioValue:e.target.value})}} value={this.state.radioValue}
       style={{marginTop:0,lineHeight:2}}>
          <Radio value={2}>安卓</Radio>
          {
          // <Radio value={4}>首页推荐位(一张图)</Radio>
          // <Radio value={5}>首页推荐游戏(两张图)</Radio>
          // <Radio value={6}>首页推荐游戏(竖排10张图)</Radio>
          }


       </Radio.Group>
       <Input.Group>

       <Input
       addonBefore="标题"
       value={this.state.title}
       placeholder="输入标题"
       onChange={(e)=>{this.setState({title:e.target.value})}}
       style={{width:400,display:"block",marginTop:15}}
       />

       <Input
       addonBefore="介绍"
       value={this.state.detail}
       placeholder="请输入介绍"
       onChange={(e)=>{this.setState({detail:e.target.value})}}
       style={{width:400,display:"block",marginTop:15}}
       />

       <Input
       addonBefore="激活状态"
       value={this.state.active}
       placeholder="激活状态，1激活，0不激活(必须为数字)"
       onChange={(e)=>{this.setState({active:e.target.value})}}
       style={{width:400,display:"block",marginTop:15}}
       />
      </Input.Group>
       <Upload
       {...props}
       >
        <Button style={{marginTop:15}}>
          <Icon type="upload"/> 上传图片
        </Button>
       </Upload>
       </Modal>
     )
   }
}

export default AddBox;
