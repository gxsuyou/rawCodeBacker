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
    gameName:""
  }
  UNSAFE_componentWillReceiveProps(e){
    this.setState({
      visible:e.visible,
    });
  }
  handleOk=()=>{
  //  console.log(this.state.content,this.state.title);
    //if()
    console.log(this.state.gameName);
    if(this.state.gameName==""){
      Message.error("用户名为空");
      return false;
    }
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
         // key:`strategy/${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}-${new Date().getHours()}-${new Date().getMinutes()}`,
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
      fileList:[],
      optionData:[],
      title:"",
      chapterData:"",
      gameName:""
    });
    this.props.handBox(false);
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
