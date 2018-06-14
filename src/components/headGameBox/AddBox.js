import React from "react";
import {Modal,Button,Select,Radio,Input,Upload,Icon,Message} from "antd";
import fetchs from "../../utils/request";
import config from "../../common/config";
import styles from "./AddBox.scss";
import qiniu from "../../utils/_qiniu";
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
    gameName:"",
    data:[],
    fileList:[]
  }
  handleCancel = (e) => {
    this.setState({
      visible: false,
      gameName:"",
      data:[],
      fileList:[]
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
    this.indexUpload(this.state.fileList);
    // return false;
    // fetchs(`${config.url_adminNews}/addSlideGame?game_id=${this.state.data[0].id}`).then((res)=>{
    //   if(res.data.state){
    //     Message.success("添加成功");
    //     this.setState({
    //       visible: false,
    //       gameName:"",
    //       data:[]
    //     });
    //     this.props.propHandBox(false);
    //     this.props.propsFetchs(1);
    //   }else{
    //     Message.error("添加失败");
    //   }
    // });
  }

  indexUpload(fileList){
    if(fileList.length!==1){
      Message.error("游戏展示图只能放置一张图");
      return false;
    }
    // console.error(this.state.gameName);
    // return false;
  // return false
   const key =`headGame/gameName${this.state.gameName}/gameId${this.state.data[0].id}`;

   fetchs(`${config.url_admin}/getUptokenByMsg?scope=oneyouxiimg&key=${key}`).then((res)=>{
     if(res.data.state){
       qiniu.upload({
         file:fileList[0],
         key:key,
         token:res.data.upToken,
         error:function(){
               Message.error('上传失败');
         },
         success:(res_1)=>{
           fetchs(`${config.url_adminNews}/addHeadGame?game_id=${this.state.data[0].id}&img=${res_1.key}`).then((res_3)=>{
             if(res_3.data.state){
               Message.success("上传成功");
               this.setState({
                  visible:false,
                  gameName:"",
                  data:[],
                  fileList:[]
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
          cancelText="取消"
        >
          <Select
             mode="combobox"
             value={this.state.gameName}
             placeholder={"输入游戏名称进行查询"}
             style={{width:400,marginTop:5}}
             defaultActiveFirstOption={false}
             showArrow={false}
             filterOption={false}
             onChange={this.autoSelectBox.bind(this)}
             onFocus={this.focusGetData.bind(this)}>
           {options}
          </Select>
          <Upload
          {...props}>
           <Button style={{marginTop:15}}>
             <Icon type="upload"/> 游戏展示图(单张，4(宽)比3(高))
           </Button>
          </Upload>
        </Modal>
     )
   }
}

export default AddBox;
