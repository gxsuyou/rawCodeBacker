import React from "react";
import {Modal,Upload,Button,Icon,Tabs,Message} from "antd";
import fetchs from "../../utils/request";
import config from "../../common/config";
import styles from "./UploadBox.scss";
var qiniu =require("qiniu-js");
const TabPane=Tabs.TabPane;
class UploadBox extends React.Component{
  state={
    visible:false,
    uploading: false,
    fileList_icon: [],
    fileList_main:[],
    fileList_cut:[],
    fileList_package:[],
    id:"",
    tabActive:"imgUpload",
    iconShow:null,
    titleImgShow:null,
    cutImgListShow:[]
  }
  onCancel(){
    this.setState({
      visible:false,
      fileList_icon:[],
      fileList_main:[],
      fileList_cut:[],
      fileList_package:[],
      m:false
    });
    this.props.handleUploadBoxChange(false);
  }
  uploadQiniu(options){
    var file=options.file||null,
    key=options.key||null,
    token=options.token||null,
    next=options.next||null,
    error=options.error||null,
    success=options.success||null,
    putExtra={
      fname:"",
      params:{},
      mimeType:null
    },
    config={
      useCdnDomain:true,
      region:'z2',
      disableStatisticsReport:false
    },
    subObject={
      next:next,
      error:error,
      complete:success
    },
    observable = qiniu.upload(file, key, token, putExtra, config),
    subscription = observable.subscribe(subObject);
  }
  uploadIcon(id){
    return new Promise((resolve,reject)=>{

          fetchs(`${config.url_admin}/getUptokenByMsg?scope=oneyouxiimg&key=game/gameId${this.state.id}/icon`,).then((res)=>{
              // if(res.data.state){
                 this.uploadQiniu({
                   file:this.state.fileList_icon[0],
                   key:`game/gameId${this.state.id}/icon`,
                   token:res.data.upToken,
                   success:function(res_1){


                     if(res_1.key){
                        fetchs(`${config.url_adminGame}/updateGameIcon?id=${id}&url=${res_1.key}`).then((res_2)=>{
                            if(res_2.data.state){
                              resolve();
                            }else{
                              reject();
                              Message.error('上传失败!');
                            }
                        });

                     }


                   }

                 });
               //}


            });


    });
  }
  uploadMain(id){
    return new Promise((resolve,reject)=>{

         fetchs(`${config.url_admin}/getUptokenByMsg?scope=oneyouxiimg&key=game/gameId${this.state.id}/titleImg`).then((res)=>{
             // if(res.data.state){
                this.uploadQiniu({
                  file:this.state.fileList_main[0],
                  key:`game/gameId${this.state.id}/titleImg`,
                  token:res.data.upToken,
                  success:function(res_1){

                      if(res_1.key){
                        fetchs(`${config.url_adminGame}/updateGameTitleImg?id=${id}&url=${res_1.key}`).then((res_2)=>{
                              if(res_2.data.state){
                                resolve();
                              }else{
                                reject();
                                Message.error('上传失败!');
                              }
                        });


                      }else{

                      }
                  }
                });

          });
    });
  }
  uploadCut(id,file,i){
    fetchs(`${config.url_admin}/getUptokenByMsg?scope=oneyouxiimg&key=game/gameId${id}/list${i}`).then((res)=>{
       this.uploadQiniu({
         file:file,
         key:`game/gameId${id}/list${i}`,
         token:res.data.upToken,
         success:function(res_1){
             if(res_1.key){
                 fetchs(`${config.url_adminGame}/addGameImg?id=${id}&url=${res_1.key}`).then((res_2)=>{
                   if(res_2.data.state){


                   }
                 });
             }
         }
       });
    });
  }
  uploadPackage(id){
    return new Promise((resolve,reject)=>{
      fetchs(`${config.url_admin}/getUptokenByMsg?scope=oneyouxiapk&key=game/gameId${id}.apk`).then((res)=>{
          if(res.data.state){

            this.uploadQiniu({
              file:this.state.fileList_package[0],
              key:'game/gameId'+id+".apk",
              token:res.data.upToken,
              success:function(res_1){

                 if(res_1.key){
                   const size=(res_1.fsize/1024/1024).toFixed(1);
                   fetchs(`${config.url_adminGame}/updateDownloadAndroid?id=${id}&url=${res_1.key}&size=${size}`).then((res_2)=>{
                         if(res_2.data.state){
                           Message.success('上传成功!');
                           resolve();
                         }else{
                           Message.error('上传失败!');
                           reject();
                         }
                   });
                 }

              }
            });
          }else{
            Message.error("上传错误,请稍后重试!");
          }
      });
    });

  }
  handleUpload(){
    if(this.state.tabActive=="imgUpload"){
       if(this.state.fileList_icon.length!==1){
         Message.error("icon只能选取1张图");
         return false;
       }

       if(this.state.fileList_main.length!==1){
          Message.error("游戏头图只能选取一张");
          return false;
       }

      if(this.state.fileList_cut.length<3){
        Message.error("游戏截图不能小于三张");
        return false;
      }

      if(this.state.fileList_cut.length>8){
        Message.error("游戏截图不能大于8张");
        return false;
      }


      Promise.all([
        this.uploadIcon(this.state.id),
        this.uploadMain(this.state.id)
      ]).then(()=>{
        fetchs(`${config.url_adminGame}/deleteGameImg?id=${this.state.id}`).then((res)=>{
          if(res.data.state){
            var i=0;
            this.state.fileList_cut.forEach((item)=>{
              this.uploadCut(this.state.id,item,i++);
            });
            Message.success("图片上传成功");
            this.setState({
              visible:false,
              fileList_icon:[],
              fileList_main:[],
              fileList_cut:[]
            });
            this.props.handleUploadBoxChange(false);
            console.log("重要"+this.state.fileList_icon)
          }
        });
      }).catch(()=>{
        Message.error("上传错误!");
      })


    }else{
      if(this.state.fileList_package.length!==1){
        Message.error("只能上传一个安装包");
        return false;
      }
     this.uploadPackage(this.state.id).then(()=>{

       this.setState({
         visible:false,
         fileList_package:[]
       });
       this.props.handleUploadBoxChange(false);

     });
    }
  }
  UNSAFE_componentWillReceiveProps(p){
    this.setState({
      visible:p.uploadBoxVision,
      id:p.id,
    });

    if(p.uploadBoxVision){
      fetchs(`${config.url_adminGame}/GameMsgDetail?id=${p.id}`).then((res)=>{
        this.setState({
          iconShow:res.data[0].icon,
          titleImgShow:res.data[0].game_title_img,
          cutImgListShow:res.data[0].imgList
        })
      });
    }
  }
  onRemove_icon(file){
    this.setState(({ fileList_icon }) => {
      const newFileList = fileList_icon.slice();
      newFileList.splice(-1, 1);
      return {
        fileList_icon: newFileList,
      };
    });
  }
  render(){
    const props_icon = {
      onRemove:this.onRemove_icon.bind(this),
      beforeUpload: (file) => {
        this.setState(({fileList_icon})=>({
          fileList_icon: [...fileList_icon, file]
        }));
        return false;
      },
      listType:'text',
      fileList:this.state.fileList_icon
    };
    const props_main = {
      onRemove: (file) => {
        //删除时候触发
        this.setState(({ fileList_main }) => {
          const index = fileList_main.indexOf(file);
          const newFileList = fileList_main.slice();
          newFileList.splice(index, 1);
          return {
            fileList_main: newFileList,
          };
        });
      },
      beforeUpload: (file) => {
        this.setState(({ fileList_main }) => ({
          fileList_main: [...fileList_main, file],
        }));
        return false;
      },
      fileList:this.state.fileList_main,
      listType:'text',
    };
    const props_cut={
      onRemove:(file)=>{
        this.setState(({ fileList_cut }) => {
          const index = fileList_cut.indexOf(file);
          const newFileList = fileList_cut.slice();
          newFileList.splice(index, 1);
          return {
            fileList_cut: newFileList,
          };
        });
      },
      beforeUpload: (file) => {
        this.setState(({ fileList_cut }) => ({
          fileList_cut: [...fileList_cut, file],
        }));
        return false;
      },
      fileList:this.state.fileList_cut,
      listType:'text'
    }
    const props_package={
      onRemove:(file)=>{
        this.setState(({ fileList_package }) => {
          const index = fileList_package.indexOf(file);
          const newFileList = fileList_package.slice();
          newFileList.splice(index, 1);
          return {
            fileList_package: newFileList,
          };
        });
      },
      beforeUpload: (file) => {
        this.setState(({ fileList_package }) => ({
          fileList_package: [...fileList_package, file],
        }));
        return false;
      },
      fileList:this.state.fileList_package
    }
    return(
       <Modal
       title="上传数据"
       visible={this.state.visible}
       onOk={this.handleUpload.bind(this)}
       onCancel={this.onCancel.bind(this)}
       okText="提交"
       cancelText="取消"
       >
       <Tabs
        className={styles.tabs}
        onChange={(e)=>this.setState({tabActive:e})}
        defaultActiveKey="imgUpload"
       >
        <TabPane
          style={{marginTop:10}}
          tab="游戏图片上传"
          key="imgUpload"
        >
          <Upload {...props_icon}>
             <Button>
               <Icon type="upload"/> 游戏icon(单张,192*192以上)
             </Button>
           </Upload>
             {
              this.state.iconShow===null?(
                 null
               ):(
                 <div>
                  <img style={{width:80,marginBottom:5}} src={`${config.qiniu_img}${this.state.iconShow}`}/>
                </div>
               )
             }
           <Upload {...props_main}>
             <Button>
               <Icon type="upload"/> 游戏头图(单张,1280*720以上)
             </Button>
           </Upload>
             {
               this.state.titleImgShow===null?(
                 null
               ):(
                 <div>
                  <img style={{width:180,marginBottom:5}} src={`${config.qiniu_img}${this.state.titleImgShow}`}/>
                </div>
               )
             }
           <Upload {...props_cut}  multiple={true}>
            <Button>
              <Icon type="upload"/> 游戏截图(最少3张,最多8张横竖图不限制)
            </Button>
           </Upload>
           <div style={{display:"flex",overflowY:"scroll"}}>
           {
             this.state.cutImgListShow.map((item,index)=>
             <div><img
              style={{width:120,marginRight:5,marginLeft:5}}
              src={`${config.qiniu_img}${item.img_src}`} /></div>)
           }
           </div>
        </TabPane>
        <TabPane
        tab="游戏包上传"
        key="packPageUpload"
        >
          <Upload {...props_package}>
           <Button>
             <Icon type="upload"/> 游戏包上传(iOS正式包不需要传；Android后缀名为.apk)
           </Button>
          </Upload>
        </TabPane>
       </Tabs>
       </Modal>
    )
  }
}
export default UploadBox;
