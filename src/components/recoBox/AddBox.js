import React from "react";
import {Modal,Button,Select,Radio,Input,Upload,Icon,Message} from "antd";
import fetchs from "../../utils/request";
import config from "../../common/config";
import styles from "./AddBox.scss";
import z from "../../utils/_qiniu";
const Option=Select.Option;



function fake(n,callback){
  const data=[];
  fetchs(`${config.url_adminGame}/activeSearch?name=${n}`).then((res)=>{
    res.data.result.forEach((item)=>{
      data.push({
        value:item.game_name,
        text:item.game_name,
        id:item.id
      });
      callback(data);
    });
  });
}

class AddBox extends React.Component{
  state={
    visible:false,
    data: [],
    fileList:[],
    radioValue:1,
    activityName:"",
    active:"",//激活状态
    gameName:"",
    title:"",
    row:"",
    inputToggle:false
  }
  handleCancel = (e) => {
    this.setState({
      visible: false,
      radioValue:1,
      gameName:""
    });
    this.props.propHandBox(false);
  }
  handleOk = () => {

    if(this.state.gameName==""){
      Message.error("游戏名不能为空");
      return false;
    }else{
      fetchs(`${config.url_adminGame}/hasGame?name=${this.state.gameName}`).then((res)=>{
        if(res.data.state==0){
          Message.error("游戏名不存在");
          return false;
        }
      });
    }

    if(this.state.radioValue==5||this.state.radioValue==6){
      this.restUpload();
      return false;
    }


     if(this.state.activityName==""){
       Message.error("活动名不能为空");
       return false;
     }

    if(this.state.title==""){
       Message.error("标题不能为空");
       return false;
    }

    if(this.state.row==""){
       Message.error("排序不能为空");
       return false;
    }

     switch(this.state.radioValue){
       case 1:
         this.indexUpload(this.state.fileList);
       break;
       case 4:
         this.indexUpload(this.state.fileList);
       break;
    }
  }

 restUpload(){
   fetchs(`${config.url_adminGame}/addGameActive?type=${this.state.radioValue}&game_name=${this.state.gameName}`).then((res)=>{
     Message.success("上传成功");
     this.setState({
        visible:false,
        radioValue:1,
        activityName:"",
        active:"",//激活状态
        gameName:"",
        title:"",
        row:"",
        data:[]
     });
     this.props.propHandBox(false);
     this.props.propsFetchs(1);
   })
 }



 indexUpload(fileList){
   if(fileList.length!==1){
     Message.error("首页轮播推荐位只放置一张图");
     return false;
   }
  const id=this.state.data[0].id;
  const key =`activity/activityType${this.state.radioValue}/gameId${id}`;
  fetchs(`${config.url_admin}/getUptokenByMsg?scope=oneyouxiimg&key=${key}`).then((res)=>{
    if(res.data.state){
      z.upload({
        file:fileList[0],
        key:key,
        token:res.data.upToken,
        error:function(){
              Message.error('上传失败');
        },
        success:(res_1)=>{
          fetchs(`${config.url_adminGame}/addGameActive?game_name=${this.state.gameName}&title=${this.state.title}&sort=${this.state.row}&active_img=${res_1.key}&active=${this.state.active}&type=${this.state.radioValue}&name=${this.state.activityName}`).then((res_3)=>{
            if(res_3.data.state){
              Message.success("上传成功");
              this.setState({
                 visible:false,
                 radioValue:1,
                 activityName:"",
                 active:"",//激活状态
                 gameName:"",
                 title:"",
                 row:"",
                 data:[]
              });
              this.props.propHandBox(false);
              this.props.propsFetchs(1);
            }
          });

        }
      });


    }
  });


 }




  UNSAFE_componentWillReceiveProps(e){
    this.setState({
      visible:e.visible
    });
  }
  autoSelectBox(value){
    this.setState({ gameName:value });
    if(value===""){
      return false;
    }
    fake(value,(data)=> this.setState({ data }));
  }
  focusGetData(){
    const c=[];
    fetchs(`${config.url_adminGame}/activeSearch`).then((res)=>{
      res.data.result.forEach((item)=>{
          c.push({
            value:item.game_name,
            text:item.game_name,
            id:item.id
          });
      });
      this.setState({
        data:c
      });
    });
  }

  radioChange(e){
      this.setState({radioValue:e.target.value});
      if(e.target.value==5||e.target.value==6){
        this.setState({
          inputToggle:true
        });
      }else{
        this.setState({
          inputToggle:false
        });
      }
  }
   render(){
     const options = this.state.data.map(d => <Option key={d.value}>{d.text}</Option>);
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
          title="添加推荐位"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          loading={this.state.loading}
          okText="提交"
          cancelText="取消">
          <Select
             mode="combobox"
             value={this.state.gameName}
             placeholder={"输入游戏名称进行查询"}
             style={{width:400,marginTop:5}}
             defaultActiveFirstOption={false}
             showArrow={false}
             filterOption={false}
             onChange={this.autoSelectBox.bind(this)}
             onFocus={this.focusGetData.bind(this)}
          >
           {options}
         </Select>
         <Radio.Group onChange={this.radioChange.bind(this)} value={this.state.radioValue}
         style={{marginTop:18,lineHeight:2}}>
            <Radio value={1}>首页轮播推荐位(一张图)</Radio>
            <Radio value={4}>首页推荐位(一张图)</Radio>
            <Radio value={5}>首页推荐游戏(两张图)</Radio>
            <Radio value={6}>首页推荐游戏(竖排10张图)</Radio>
         </Radio.Group>
         <Input.Group
          className={styles.InputGroup}
         >
          <Input
          addonBefore="活动名字"
          value={this.state.activityName}
          disabled={this.state.inputToggle}
          placeholder="输入活动名字"
          onChange={(e)=>{this.setState({activityName:e.target.value})}}
          style={{width:400,display:"block"}}
          />

          <Input
          addonBefore="标题"
          value={this.state.title}
          placeholder="输入标题"
          onChange={(e)=>{this.setState({title:e.target.value})}}
          style={{width:400,display:"block",marginTop:15}}
          disabled={this.state.inputToggle}
          />

          <Input
          addonBefore="排序"
          value={this.state.row}
          placeholder="输入排序(必须为数字)"
          onChange={(e)=>{this.setState({row:e.target.value})}}
          style={{width:400,display:"block",marginTop:15}}
          disabled={this.state.inputToggle}
          />

          <Input
          addonBefore="激活状态"
          value={this.state.active}
          placeholder="激活状态，1激活，0不激活(必须为数字)"
          onChange={(e)=>{this.setState({active:e.target.value})}}
          style={{width:400,display:"block",marginTop:15}}
          disabled={this.state.inputToggle}
          />
         </Input.Group>
         <Upload
         {...props}
         >
          <Button style={{marginTop:15}}
            disabled={this.state.inputToggle}
          >
            <Icon type="upload"/> 上传图片
          </Button>
         </Upload>
        </Modal>
     )
   }
}

export default AddBox;
