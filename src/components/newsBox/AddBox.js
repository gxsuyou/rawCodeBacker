import React from "react";
import {Modal,Button,Select,Input,Upload,Icon,Message} from "antd";
import fetchs from "../../utils/request";
import config from "../../common/config";
import qiniu from "../../utils/_qiniu";
import styles from "./AddBox.scss";
import Editor from 'react-umeditor';
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
    optionData:[],
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
    if(this.state.gameName==""){
      Message.error("游戏名不能为空");
      return false;
    }
    if(this.state.title==""){
      Message.error("标题不能为空");
      return false;
    }
    if(this.state.fileList.length!==1){
      Message.error("文章头图是一张图");
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
            //console.log("上传成功");
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
                     toggleInput:true
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

  getQiniuUploader(){
  		return {
  			url:'http://up-z2.qiniup.com/strategy/',
  			type:'qiniu',
  			name:"file",
  			request:"image_src",//图片src需要的路径
  			qiniu:{
  				app:{
  					Bucket:"oneyouxiimg",
  					AK:"Uusbv77fI10iNTVF3n7EZWbksckUrKYwUpAype4i",
  					SK:"dEDgtx_QEJxfs2GltCUVgDIqyqiR6tKjStQEnBVq"
  				},
          domain:"http://img.oneyouxi.com.cn",
          genKey(options){
              return "strategy/"+options.file.type + "-" + options.file.size + "-" + options.file.lastModifiedDate.valueOf() + "-" + new Date().valueOf() + "-" + options.file.name;
          }
  			}
  		}
  	}
  handleCancel=()=>{
    this.setState({
      visible:false,
      //fileList:[],
      optionData:[],
      // title:"",
      // chapterData:"",
      // gameName:"",
      // content:""
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
  getIcons(){
        var icons = [
            "source | undo redo | bold italic underline strikethrough fontborder emphasis | ",
            "paragraph fontfamily fontsize | superscript subscript | ",
            "forecolor backcolor | removeformat | insertorderedlist insertunorderedlist | selectall | ",
            "cleardoc  | indent outdent | justifyleft justifycenter justifyright | touppercase tolowercase | ",
            "horizontal date time  | image emotion spechars | inserttable"
        ]
        return icons;
}
  render(){
    const options = this.state.optionData.map(d => <Option key={d.value}>{d.text}</Option>);
    var icons=this.getIcons();
    let form_data = this.state.form_data;
    let uploader = this.getQiniuUploader();
    let plugins = {
      image:{
        uploader:uploader
      }
    }
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
        <Upload
        {...props}
        >
         <Button style={{marginTop:5}}>
           <Icon type="upload"/> 上传文章头图
           (单张,295(高)*768(宽))
         </Button>
        </Upload>
      </Input.Group>
      <Editor
      className={styles.editorBox}
      ref="editor"
      plugins={plugins}
      value={this.state.content}
      onChange={(e)=>{
        this.setState({
          content:e
        });
      }}
       icon={icons}/>
      </Modal>
    )
  }
}
export default AddBox;
