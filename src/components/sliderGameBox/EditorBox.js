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
    activityName:"",
    active:"",//激活状态
    gameName:"",
    title:"",
    row:"",
    gameId:"",
    activityId:"",
    imgSrc:"",
    fileList:[],
    tabsValue:"ediMes"
  }
  handleOk=()=>{
    //uplImg

    if(this.state.activityName===""){
      Message.error("活动名不能为空");
      return false;
    }

    if(this.state.title===""){
      Message.error("标题不能为空");
      return false;
    }

    if(this.state.row===""){
      Message.error("排序不能为空");
      return false;
    }

    if(this.state.active===""){
      Message.error("激活状态不能为空");
      return false;
    }
    // console.log(this.state.type);

    //console.log(this.state.tabsValue);
    if(this.state.tabsValue=="uplImg"){
      this.indexUpload(this.state.fileList);
    }else{
      this.editor();
    }

    return false;
    switch(this.state.type){
      case 1:

      //this.indexUpload(this.state.fileList);
      break;
    }
  }

  editor(){
    fetchs(`${config.url_adminGame}/setGameActive?id=${this.state.activityId}&name=${this.state.activityName}&title=${this.state.title}&sort=${this.state.row}&active_img=${this.state.imgSrc}&active=${this.state.active}&game_id=${this.state.gameId}&type=${this.state.type}`).then((res_2)=>{
      if(res_2.data.state){
        Message.success("上传成功");
        this.setState({
           visible:false,
           activityName:"",
           active:"",//激活状态
           gameName:"",
           title:"",
           row:"",
           fileList:[]
        });
        this.props.propHandBox(false);
        this.props.propsFetchs(this.state.current);
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

            this.setState({
               visible:false,
               activityName:"",
               active:"",//激活状态
               gameName:"",
               title:"",
               row:"",
               fileList:[]
            });
            this.props.propHandBox(false);
            this.props.propsFetchs(this.state.current);
          }
        });

      }
    });


  });

  }

  handleCancel=()=>{
    this.setState({
      visible:false,
      fileList:[]
    });
    this.props.propHandBox(false);
  }
  UNSAFE_componentWillReceiveProps(e){

   switch (e.type) {
     case "首页轮播推荐位":
       var type=1;
       break;
   }
   var active;
   e.activityStatus==="激活"?active=1:active=0;

    this.setState({
      visible:e.visible,
      current:e.current,
      typeName:e.type,
      gameId:e.gameId,
      type:type,
      activityId:e.activityId,
      title:e.activityTitle,
      activityName:e.activityName,
      row:e.activitySort,
      active:active,
      imgSrc:e.activityImgSrc
    });
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
    return(
      <Modal
       title={this.state.typeName}
       visible={this.state.visible}
       onOk={this.handleOk}
       onCancel={this.handleCancel}
       okText="提交"
       cancelText="取消"
      >
      <Tabs defaultActiveKey="ediMes"
      onChange={(e)=>{
        this.setState({
          tabsValue:e
        });
      }}>
          <TabPane tab="编辑信息" key="ediMes"
          >  <Input.Group

            >
             <Input
             addonBefore="活动名字"
             value={this.state.activityName}
             placeholder="输入活动名字"
             onChange={(e)=>{this.setState({activityName:e.target.value})}}
             style={{width:400,display:"block",marginTop:10}}
             />

             <Input
             addonBefore="标题"
             value={this.state.title}
             placeholder="输入标题"
             onChange={(e)=>{this.setState({title:e.target.value})}}
             style={{width:400,display:"block",marginTop:15}}
             />

             <Input
             addonBefore="排序"
             value={this.state.row}
             placeholder="输入排序(必须为数字)"
             onChange={(e)=>{this.setState({row:e.target.value})}}
             style={{width:400,display:"block",marginTop:15}}
             />

             <Input
             addonBefore="激活状态"
             value={this.state.active}
             placeholder="激活状态，1激活，0不激活(必须为数字)"
             onChange={(e)=>{this.setState({active:e.target.value})}}
             style={{width:400,display:"block",marginTop:15,marginButtom:10}}
             />

            </Input.Group>
            </TabPane>
          <TabPane tab="上传图片" key="uplImg">
          <Upload
          {...props}
          >
           <Button style={{marginTop:15,marginButtom:15}}>
             <Icon type="upload"/> 上传图片
           </Button>
          </Upload>
          </TabPane>
        </Tabs>
      </Modal>
    )
  }
}
export default EditorBox;
