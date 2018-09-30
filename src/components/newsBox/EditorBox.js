
import React from "react";
import {Modal,Message,Icon,Upload,Input,Button,Tabs} from "antd";
import qiniu from "../../utils/_qiniu";
import config from "../../common/config";
import fetchs from "../../utils/request";
import E from 'wangeditor';
import styles from "./AddBox.scss";
// var qiniu = require("qiniu-js");
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
    current:1,
    toggleEditor:false,
    editor:null,
    img:null,
    content:"",
    initContent:"",
    fileList_headImg:[]
  }

  deleteImg(){
    fetchs(`${config.url_adminNews}/setNewsImg?id=${this.state.id}`).then((res)=>{

    })
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
     const browse=Number(this.state.browse);
    if(Object.is(browse,NaN)){
      Message.error("浏览数必须为数字");
      return false;
    }

    if(this.state.agress===""){
      Message.error("点赞数不能为空");
      return false;
    }

    const agress=Number(this.state.agress);
    if(Object.is(agress,NaN)){
      Message.error("点赞数必须为数字");
      return false;
    }

    if(this.state.comment===""){
      Message.error("评论数不能为空");
      return false;
    }

    const comment=Number(this.state.comment);
    if(Object.is(comment,NaN)){
      Message.error("评论数必须为数字");
      return false;
    }

    if(this.state.date===""){
      Message.error("发表时间不能为空");
      return false;
    }
    if(this.state.content===""){
      Message.error("发表内容不能为空");
      return false;
    }
   if(this.state.fileList_headImg[0]==undefined){
       this.editor(this.state.img);
   }else{
      this.deleteImg()
      var key =`News/newsName=${new Date().getTime()}`;
      fetchs(`${config.url_admin}/getUptokenByMsg?scope=oneyouxiimg&key=${key}`).then((res)=>{
          if(res.data.state){
              qiniu.upload({
                file:this.state.fileList_headImg[0],
                key:key,
                token:res.data.upToken,
                success:(res_1)=>{
                  this.editor(res_1.key);
                }
              })
          }
      })
   }

  }

  editor(res_1){
    var content=this.state.content.replace(/&nbsp;/g,"<span> </span>");
    content=content.replace(/&gt;/g,">")
    content=content.replace(/&lt;/g,"<");
    content=content.replace(/&quot;/g,"");
    fetchs(`${config.url_adminNews}/setNewsById`,{
      method:"POST",
      headers: {
      'Content-Type':'application/x-www-form-urlencoded'
      },
      body:`id=${this.state.id}&title=${this.state.title}&browse=${this.state.browse}&agree=${this.state.agress}&comment=${this.state.comment}&detail=${content}&img=${res_1}`
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
      fileList_headImg:[]
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

      var content=res.data[0].detail.replace(/<span> <\/span>/g,"&nbsp;");

      this.setState({
        title:res.data[0].title,
        browse:res.data[0].browse,
        agress:res.data[0].agree,
        comment:res.data[0].comment,
        date:res.data[0].add_time,
        initContent:content,
        content:content,
        img:res.data[0].img
      });

      console.log(res.data[0].img)
      if(this.state.editor!==null){
        this.state.editor.txt.clear();
        this.state.editor.txt.html(content);
      }
    });

   }

   initEditor(e){
     if(this.state.toggleEditor){
       return false;
     }
     var editor = new E(e);
     this.setState({
       toggleEditor:true,
       editor:editor
     });

     editor.customConfig.onchange = html => {
       this.setState({
         content:html
       })
     }
     editor.customConfig.uploadImgServer = config.url_adminStrategy+'/img?title=News&url='+config.url_1;
     editor.create();
     setTimeout(()=>{
       editor.txt.html(this.state.initContent);
       this.setState({
         content:this.state.initContent
       })
     },800);

   }
   info(){
     let content =this.state.content.replace(/<span> <\/span>/g,"&nbsp;")
     Modal.info({
       title:"预览",
       content: (
         <div dangerouslySetInnerHTML={{__html:content}}>
         </div>
       ),
       onOk() {},
       width:680,
       okText:"确认",
       className:styles.see
     });
   }

  render(){
    const props={
      onRemove: (file) => {
        //删除时候触发
        this.setState(({ fileList_headImg }) => {
          const index = fileList_headImg.indexOf(file);
          const newFileList = fileList_headImg.slice();
          newFileList.splice(index, 1);
          return {
            fileList_headImg: newFileList,
          }
        })
      },
      beforeUpload: (file) => {
        this.setState(({ fileList_headImg }) => ({
          fileList_headImg: [...fileList_headImg, file],
        }));
        return false;
      },
      fileList:this.state.fileList_headImg,
      listType:'text',
    }
    return(
      <Modal
       title="编辑文章"
       visible={this.state.visible}
       onOk={this.handleOk}
       onCancel={this.handleCancel}
       okText="提交"
       cancelText="取消"
       width={780}
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
             <div style={{display:"flex",marginTop:15}}>
             <Upload {...props}>
               <Button >
                 <Icon type="upload"/> 修改资讯头图
               </Button>
             </Upload>
             {
               this.state.img==null?(
                 null
               ):(
                 <div style={{marginLeft:"20px"}}>
                  <img style={{width:"200px"}} src={`${config.qiniu_img}${this.state.img}`} alt=""/>
                </div>
               )
             }
            </div>
             <Input
             addonBefore="发表日期"
             value={this.state.date}
             placeholder="请输入发表日期"
             onChange={(e)=>{this.setState({date:e.target.value})}}
             style={{width:400,display:"block",marginTop:15,marginButtom:10,float:"left"}}
             />

             <Button
             onClick={this.info.bind(this)}
              style={{float:"right",marginTop:15}}
             >预览</Button>

            </Input.Group>
            <div ref={this.initEditor.bind(this)} style={{textAlign:'left',marginTop:15}}></div>
      </Modal>
    )
  }
}
export default EditorBox;
