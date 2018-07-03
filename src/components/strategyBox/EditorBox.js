import React from "react";
import {Modal,Message,Icon,Upload,Input,Button,Tabs} from "antd";
import qiniu from "../../utils/_qiniu";
import config from "../../common/config";
import fetchs from "../../utils/request";
import E from 'wangeditor';
import styles from "./AddBox.scss";
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
    id:"",
    current:1,
    toggleEditor:false,
    editor:null,
    content:"",
    initContent:"",
    gameName:"",
  }
  handleOk=()=>{
    if(this.state.title===""){
      Message.error("标题不能为空");
      return false;
    }

    if(this.state.content===""){
      Message.error("发表内容不能为空");
      return false;
    }
    this.editor();
  }

  editor(){
    var content=this.state.content.replace(/&nbsp;/g,"<span> </span>");
    content=content.replace(/&quot;/g,"");
    fetchs(`${config.url_adminStrategy}/setStrategy`,{
      method:"POST",
      headers: {
      'Content-Type':'application/x-www-form-urlencoded'
      },
      body:`id=${this.state.id}&title=${this.state.title}&detail=${content}`
    }).then((res_2)=>{
      if(res_2.data.state){
        Message.success("上传成功");
        this.handleCancel();
        this.props.fetchsStrategy(this.state.current);
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
    fetchs(`${config.url_adminStrategy}/setStrategy?id=${id}`).then((res)=>{
      if(res.data.state){
      this.setState({
        gameName:res.data.result.game_name,
        title:res.data.result.title,
        content:res.data.result.detail,
        initContent:res.data.result.detail
      });
      if(this.state.editor!==null){
        this.state.editor.txt.clear();
        this.state.editor.txt.html(res.data.result.detail);
      }
    }else{
      Message.success("查询失败，请稍后重试。");
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
     },800);

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
              addonBefore="游戏名"
              value={this.state.gameName}
              placeholder="输入游戏名"
              onChange={(e)=>{this.setState({gameName:e.target.value})}}
              style={{width:400,display:"block",marginTop:15}}
              disabled={true}
            />
             <Input
             addonBefore="标题"
             value={this.state.title}
             placeholder="输入标题"
             onChange={(e)=>{this.setState({title:e.target.value})}}
             style={{width:400,display:"block",marginTop:15,float:"left"}}
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
