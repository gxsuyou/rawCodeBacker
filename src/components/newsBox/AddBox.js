import React from "react";
import {Modal,Button,Select,Input,Upload,Icon,Message} from "antd";
import fetchs from "../../utils/request";
import config from "../../common/config";
import qiniu from "../../utils/_qiniu";
import styles from "./AddBox.scss";
import E from 'wangeditor';
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
    fileList:[],
    optionData:[
      {
        value:null,
        text:null,
        id:null
      }
    ],
    title:"",
    chapterData:"",
    content:"",
    gameName:"",
    toggleInput:true
  }
  UNSAFE_componentWillReceiveProps(e){
    this.setState({
      visible:e.visible,
    });
  }
  handleOk=()=>{

   console.log(this.state.fileList_icon);


    if(this.state.title==""){
      Message.error("标题不能为空");
      return false;
    }


    if(this.state.fileList.length!==1){
      Message.error("文章只能上传一张图");
      return false;
    }


   if(this.state.content==""){
     Message.error("文章内容不能为空");
     return false;
   }

   if(this.state.toggleInput==false){
     Message.error("正在加载中");
     return false;

   }
   this.setState({
     toggleInput:false
   });


   var key =`News/newsName=${this.state.title}`;
   var uid =config.getCookie('uid');
   fetchs(`${config.url_admin}/getUptokenByMsg?scope=oneyouxiimg&key=${key}`).then((res)=>{
     if(res.data.state){
       qiniu.upload({
          file:this.state.fileList[0],
          key:key,
          token:res.data.upToken,
          error:function(){
                Message.error('上传失败');
          },
          success:(res_1)=>{
            fetchs(`${config.url_adminNews}/addNews`,{
              method:"POST",
              headers: {
              'Content-Type':'application/x-www-form-urlencoded' // 指定提交方式为表单提交
              },
              body:`admin=${uid}&game_id=${this.state.optionData[0].id}&title=${this.state.title}&detail=${this.state.content}&img=${res_1.key}`
          }).then((res)=>{
                 if(res.data.state==1){
                   Message.success("添加文章成功");
                   this.setState({
                     visible:false,
                     fileList:[],
                     optionData:[],
                     title:"",
                     chapterData:"",
                     gameName:"",
                     content:"",
                     toggleInput:true,
                     content:"",
                     fileList_icon:[]
                   });
                   this.props.handBox(false);
                   this.props.fetchsNews(1);
                 }else{
                   this.setState({
                      toggleInput:true
                   });
                   Message.error("添加文章失败");
                 }

            });
          }
       });

    }
   });

  }


  handleCancel=()=>{
    this.setState({
      visible:false,
      optionData:[]
    });
    this.props.handBox(false);
  }
  autoSelectBox(value){
    this.setState({ gameName:value });
    if(value===""){
      return false;
    }
    fake(value,(data)=>this.setState({
      optionData:data
    }));
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
        optionData:c
      });
    });
  }
  initEditor(e){
    if(this.state.toggleEditor){
      return false;
    }
    this.setState({
      toggleEditor:true
    });
    const editor = new E(e);
    editor.customConfig.onchange = html => {
      this.setState({
        content:html
      })
    }
    editor.customConfig.uploadImgServer = config.url_adminStrategy+'/img?title=News&url='+config.url_1;
    editor.create();
  }
  info(){
    Modal.info({
      title:"预览",
      content: (
        <div dangerouslySetInnerHTML={{__html:this.state.content}}>

        </div>
      ),
      onOk() {},
      width:680,
      okText:"确认",
      className:styles.see
    });
  }
  render(){
    const options = this.state.optionData.map(d => <Option key={d.value}>{d.text}</Option>);


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
      title="添加文章"
      visible={this.state.visible}
      onOk={this.handleOk}
      onCancel={this.handleCancel}
      width={780}
      maskClosable={false}
      okText="提交"
      cancelText="取消">
      <Select
         mode="combobox"
         value={this.state.gameName}
         placeholder={"输入游戏名称进行查询(可设置为空)"}
         style={{width:400,marginTop:5}}
         defaultActiveFirstOption={false}
         showArrow={false}
         filterOption={false}
         onChange={this.autoSelectBox.bind(this)}
         onFocus={this.focusGetData.bind(this)}>
       {options}
     </Select>
      <Input.Group className={styles.InputGroup}>
        <Input
        addonBefore="文章标题"
        value={this.state.title}
        placeholder="输入文章标题(不超过20个字)"
        onChange={(e)=>{this.setState({title:e.target.value})}}
        />
      </Input.Group>

      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:15}}>
        <Upload
        {...props}
        >
         <Button>
           <Icon type="upload"/> 上传文章头图
           (单张,295(高)*768(宽))
         </Button>
        </Upload>
        <Button  onClick={this.info.bind(this)}>预览</Button>
      </div>
      <div ref={this.initEditor.bind(this)} style={{textAlign:'left'}} ></div>
      </Modal>
    )
  }
}
export default AddBox;
