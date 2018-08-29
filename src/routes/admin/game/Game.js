import React from "react";
import {Table,Button,Modal,Input,message,Radio} from 'antd';
import styles from "./Game.scss";
import config from "../../../common/config.js";
import fetchs from "../../../utils/request.js";/*弹窗组件*/
import TagBox from "../../../components/gameBox/TagBox";
import AddBox from "../../../components/gameBox/AddBox";
import UploadBox from "../../../components/gameBox/UploadBox";/*弹窗组件结束*/
const {TextArea}=Input;
const Search =Input.Search;
const confirm = Modal.confirm;
class Game extends React.Component{
  state={
      checkAll:true,
      loading:false,
      os:"2",
      rowType:"null",
      pagination:{},
      currentPagination:1,
      editorMessageVisible:false,
      editorMessageGameName:"",
      editorMessageUp:"",
      editorMessageCompanyName:"",
      editorMessageVision:"",
      editorMessageDownloadNum:"",
      editorMessageIndexPriority:"",
      editorMessageHotPriority:"",
      editorMessageGameSize:"",
      editorMessageId:"",
      editorMessageGameStrategy:"",
      editorMessageBrief:"",
      editorMessageSys:2,
      editorMessageIosDownHref:"",
      editorMessagelotBrief:"",
      editorMessageGameDetail:"",
      editorMessagePackagename:"",
      //tagBox
      tagBoxVision:false,
      //addBox
      addBoxVision:false,
      //UploadBox
      uploadBoxVision:false,
      titleData:[{
        title: '序号',
        dataIndex:'key',
      },{
        title: '游戏名',
        dataIndex:'game_name'
      },{
        title: '游戏ID',
        dataIndex:"id"
      },{
        title:'包名',
        dataIndex:'packagename'
      },{
        title: '上架状态',
        dataIndex:"up",
      },{
        title:'系统',
        dataIndex:"sys"
      },{
        title:"添加时间",
        dataIndex:"addTime"
      },{
        title:"游戏详情",
        render:(text,record)=>(
          <div style={{lineHeight:0.5}}>
           <p style={{lineHeight:1.2}}>
           游戏公司:
           {record.game_company}
           </p>
           <p>
             版本:{record.game_version}
           </p>
           <p>
            大小:{record.size}
           </p>
          </div>
        )
      },{
        title:"下载数",
        dataIndex:"gameInstallNum"
      },{
        title:"热门榜",
        dataIndex:"sortIndex"
      },{
        title:"下载榜",
        dataIndex:"sortHot"
      },{
        title:"攻略顶部的游戏推荐",
        dataIndex:"strategyGame"
      },{
        title:"管理员",
        dataIndex:"admin"
      },{
        title:"是否上传安装包",
        dataIndex:"package"
      },{
        title:"操作",
        dataIndex:"action",
        render:(text,record)=>(
          <span className={styles.button}>
           <Button  onClick={this.showModalEditorMessage.bind(this,record.id,record.game_name,record.company,record.version,record.updowm,record.size,record.sortIndex,record.sortHot,record.gameInstallNum,record.strategyGame,record.gameRecommend,record.gameDownLoaderHref,
           record.sys,record.gameDetail,record.packagename)}>编辑信息</Button>
           <Button  onClick={this.UploadVision.bind(this,record.id)}>上传数据</Button>
           <Button onClick={this.tagBoxVision.bind(this,record.id)}>标签</Button>
           <Button onClick={this.showDeleteConfirm.bind(this,record.key,record.id)} type="danger">删除</Button>
          </span>
        )
      }],
      MainData:[]
  }

  /* 跳出弹框 */
  showDeleteConfirm(key,id){
    confirm({
      title:'游戏',
      content:'您确认删除这条游戏吗？',
      okText:'删除',
      okType:'danger',
      cancelText:'取消',
      onOk:()=>{
        this.deleteData(key,id);
      },
      onCancel(){
        console.log('Cancel');
      },
    });
  }




  UploadVision(id){
    this.setState({
      uploadBoxVision:true,
      editorMessageId:id
    })
  }

  tagBoxVision(id){
    this.setState({
      editorMessageId:id,
      tagBoxVision:true
    })
  }

  /*删除接口*/
  deleteData(key,id){
     fetchs(`${config.url_admin}/deleteGame?id=${id}`).then(res=>{
       if(res.data.state==1){
         const c=[...this.state.MainData];
         c.splice(key-1,1);
         this.setState({
           MainData:c
         });
         this.fetch(this.state.currentPagination);
       }else{
         message.error("删除失败");
       }
     });
  }

  componentDidMount(){
    config.setCookie("path","game",0.05);
  }

  /* 打开编辑弹框初始化数据 */
  showModalEditorMessage(id,gameName,company,version,activation,size,sort,sort2,gameInstallNum,strategyGame,gameRecommend,gameDownLoaderHref,sys,gameDetail,packagename){
    console.log(packagename)
    if(sys=="ios"){
      sys=1;
    }else{
      sys=2;
    }
    if(String(gameRecommend)=="null"){
      gameRecommend="";
    }
    if(gameDetail==null){
      gameDetail="";
    }
    if(packagename==null){
      packagename="";
    }
    var gameDetail=gameDetail.replace(/<br>/g,'\n');
     this.setState({
       editorMessageId:id,
       editorMessageVisible:true,
       editorMessageGameName:gameName,
       editorMessageCompanyName:company,
       editorMessageVision:version,
       editorMessageUp:activation,
       editorMessageIndexPriority:sort,
       editorMessageHotPriority:sort2,
       editorMessageGameSize:size,
       editorMessageDownloadNum:gameInstallNum,
       editorMessageGameStrategy:strategyGame,
       editorMessageBrief:gameRecommend,
       editorMessageIosDownHref:gameDownLoaderHref,
       editorMessageSys:sys,
       editorMessageGameDetail:gameDetail,
       tagBoxVision:false,
       editorMessagePackagename:packagename
     });
  }
  handleOk(){
  const loadNum=this.state.editorMessageDownloadNum,
  up=this.state.editorMessageUp,
  IndexPriority=this.state.editorMessageIndexPriority,
  HotPriority=this.state.editorMessageHotPriority,
  GameSize=this.state.editorMessageGameSize,
  GameName=this.state.editorMessageGameName,
  MessageVision=this.state.editorMessageVision,
  brief=this.state.editorMessageBrief,
  gameDetail=this.state.editorMessageGameDetail.replace(/\n/g,"<br>"),
  packagename=this.state.editorMessagePackagename;

 if(
     MessageVision===""||
     GameName===""||
     GameSize===""||
     HotPriority===""||
     IndexPriority===""||
     up===""||
     loadNum===""||
     brief===""
   ){
   message.error("不能留空!");
   return false;
 }

  if(
  Object.is(Number(loadNum),NaN)!=false||
  Object.is(Number(up),NaN)!=false||
  Object.is(Number(IndexPriority),NaN)!=false||
  Object.is(Number(HotPriority),NaN)!=false
    ){
      message.error("必须输入数字!");
      return false;
    }
    fetchs(`${config.url_adminGame}/SetGameMsg`,{
    method:"POST",
    headers: {
      'Content-Type':'application/x-www-form-urlencoded' // 指定提交方式为表单提交
    },
    body:`name=${this.state.editorMessageGameName}&activation=${this.state.editorMessageUp}&company=${this.state.editorMessageCompanyName}&version=${this.state.editorMessageVision}&download_num=${this.state.editorMessageDownloadNum}&sort=${this.state.editorMessageIndexPriority}&sort2=${this.state.editorMessageHotPriority}&size=${this.state.editorMessageGameSize}&id=${this.state.editorMessageId}&strategy_head=${this.state.editorMessageGameStrategy}&game_recommend=${brief}&gameDownloadIos=${this.state.editorMessageIosDownHref}&game_detail=${gameDetail}&gamePackagename=${packagename}`}).then((res)=>{
      if(res.data.state){
         this.setState({
           editorMessageVisible:false,
         });
         this.fetch(this.state.currentPagination);
      }else{
        message.error("网络错误,请稍后提交!");
      }
    })
  }
  /* 修改编辑弹框里的内容  */
  EditorMessageOnChange(choices,e){
    this.setState({
      [`editorMessage${choices}`]:e.target.value
    });
  }
  addGameModel(){
    this.setState({
      addBoxVision:true
    });
  }
  handleTableChange=(pagination,filters,sorter)=>{
    this.setState({
      currentPagination:pagination.current
    })
    this.fetch(pagination.current);
  }

  UNSAFE_componentWillMount(){
    this.fetch(1);
  }
  handleTagBoxChange(e){
    this.setState({
        tagBoxVision:e,
        addBoxVision:e,
        uploadBoxVision:e
    })
  }
  fetch(p){
    this.setState({ loading: true });
    fetchs(`${config.url_getAdminGame}?p=${p}&sys=${this.state.os}&sortType=${this.state.rowType}`)
    .then((res)=>{
      var i=1;
      var c=[]
      var up,sys;
      var packageornot;
      res.data.result.forEach((item)=>{
        if(item.game_size==null){
          var size=0;
        }else{
          size=item.game_size;
        }
        if(item.game_company==null){
          var company="无";
        }else{
           company=item.game_company;
        }
        if(item.sys==2){
          //是否安卓安装包
          item.game_download_andriod==null?packageornot="否":packageornot="是";
        }else{
          item.game_download_ios2==null?packageornot="否":packageornot="是";
        }

        item.activation?up="是":up="否";
        item.sys==2?sys="Android":sys="ios";
        c.push({
          key:i++,
          game_name:item.game_name,
          id:item.id,
          up:up,
          sys:sys,
          addTime:item.add_time,
          gameInstallNum:item.game_download_num,
          sortIndex:item.sort,
          sortHot:item.sort2,
          admin:item.comment,
          company:company,
          version:item.game_version,
          updowm:item.activation,
          strategyGame:item.strategy_head,
          size:size,
          game_company:item.game_company,
          game_version:item.game_version,
          gameRecommend:item.game_recommend,
          gameDownLoaderHref:item.game_download_ios,
          gameDetail:item.game_detail,
          packagename:item.game_packagename,
          package:packageornot
        });
      });
     const pagination ={...this.state.pagination};
     pagination.total=(res.data.totalPage)*10;
     pagination.current=p;
      this.setState({
        loading:false,
        MainData:c,
        pagination
      })
    })
  }
  searchName(e){
    if(e==""){
      this.fetch(1);
      return false;
    }
    fetchs(`${config.url_adminGame}/searchGameByMsg?type=game_name&msg=${e}`)
    .then((res)=>{
        this.setState({
          MainData:[]
        });
        var i=1;
        var up,sys,packageornot;
        res.data.forEach((item)=>{
          item.activation?up="是":up="否";
          item.sys==2?sys="Android":sys="ios";
          if(item.game_size==null){
            var size=0;
          }else{
            size=item.game_size;
          }
          if(item.game_company==null){
            var company="无";
          }else{
             company=item.game_company;
          }

          if(item.sys==2){
            //是否安卓安装包
            item.game_download_andriod==null?packageornot="否":packageornot="是";
          }else{
            item.game_download_ios2==null?packageornot="否":packageornot="是";
          }


           this.state.MainData.push({
             key:i++,
             game_name:item.game_name,
             id:item.id,
             up:up,
             sys:sys,
             addTime:item.add_time,
             gameInstallNum:item.game_download_num,
             sortIndex:item.sort,
             sortHot:item.sort2,
             admin:item.comment,
             company:company,
             version:item.game_version,
             updowm:item.activation,
             strategyGame:item.strategy_head,
             size:size,
             game_company:item.game_company,
             game_version:item.game_version,
             gameRecommend:item.game_recommend,
             gameDownLoaderHref:item.game_download_ios,
             gameDetail:item.game_detail,
             packagename:item.game_packagename,
             package:packageornot
           })
        });
        const pagination ={...this.state.pagination};
        pagination.total=1*10;

        this.setState({
          MainData:this.state.MainData,
          pagination
        });
    })
  }
  osRenderChange=(e)=>{
    this.setState({
      os:e.target.value,
      currentPagination:1,
    });
    setTimeout(()=>{
      this.fetch(1);
    },300);
  }
    /* 热门排行
    @params选择不同参数
   */
  gameRow(e,p=1){
    fetchs(`${config.url_adminGame}/gameAdmin?p=${p}&sys=${this.state.os}&sortType=${e.target.value}`).then((res)=>{
      var i=1;
      var c=[]
      var up,sys,packageornot;
      res.data.result.forEach((item)=>{
        if(item.game_size==null){
          var size=0;
        }else{
          size=item.game_size;
        }
        if(item.game_company==null){
          var company="无";
        }else{
           company=item.game_company;
        }
        if(item.sys==2){
          //是否安卓安装包
          item.game_download_andriod==null?packageornot="否":packageornot="是";
        }else{
          item.game_download_ios2==null?packageornot="否":packageornot="是";
        }
        item.activation?up="是":up="否";
        item.sys==2?sys="Android":sys="ios";
        c.push({
          key:i++,
          game_name:item.game_name,
          id:item.id,
          up:up,
          sys:sys,
          addTime:item.add_time,
          gameInstallNum:item.game_download_num,
          sortIndex:item.sort,
          sortHot:item.sort2,
          admin:item.comment,
          company:company,
          version:item.game_version,
          updowm:item.activation,
          strategyGame:item.strategy_head,
          size:size,
          game_company:item.game_company,
          game_version:item.game_version,
          gameRecommend:item.game_recommend,
          gameDownLoaderHref:item.game_download_ios,
          gameDetail:item.game_detail,
          packagename:item.game_packagename,
          package:packageornot
        });
      });
     const pagination ={...this.state.pagination};
     pagination.total=(res.data.totalPage)*10;
     pagination.current=p;
      this.setState({
        loading:false,
        MainData:c,
        pagination,
        rowType:e.target.value
      })
    })
  }

   format = function (s, c) {
     return s.replace(/{(\w+)}/g,
         function (m, p) {
             return c[p];
         });
 }
  base64 = function (s) {
      return window.btoa(unescape(encodeURIComponent(s)));
  }

  /* 导出excel */
  outputExcel=()=>{
    var uri = 'data:application/vnd.ms-excel;base64,';
    var template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"' +
           'xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>'
           + '<x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets>'
           + '</x:ExcelWorkbook></xml><![endif]-->' +
           ' <style type="text/css">' +
           'table td {' +
           'border: 1px solid #000000;' +
           'width: 500px;' +
           'height: 30px;' +
           ' text-align: center;' +
           'background-color: #4f891e;' +
           'color: #ffffff;' +
           ' }' +
           '</style>' +
           '</head><body><table class="excelTable">{table}</body></html>';
        var td="";
        fetchs(`${config.url_adminGame}/allGame?sys=${this.state.os}`).then((res)=>{
          res.data.forEach((item)=>{
            td+=`<tr><td style='width:500px'>${item.game_name}</td></tr>`
          });
          var ta=`<table cellspacing='0' cellpadding='0' border='1' id='tableToExcel'><tbody>${td}</tbody></table>`
           var ctx = {table:ta};
           window.location.href =uri+this.base64(this.format(template,ctx))
        })
  }
  render(){
    return(
     <div className={styles.table}>
      { /* 顶部操作start */}
     <div className={styles.tableOperations}>
       <Button onClick={this.outputExcel} type="primary">导出游戏excel</Button>
       <Radio.Group
          buttonStyle="solid"
          defaultValue="null"
          value={this.state.rowType}
          onChange={this.gameRow.bind(this)}
          style={{marginRight:20}}
       >
         <Radio.Button value="sort">热门榜</Radio.Button>
         <Radio.Button value="sort2">下载榜</Radio.Button>
         <Radio.Button value="sort3" disabled>one榜</Radio.Button>
         <Radio.Button value="null" >查看全部</Radio.Button>
       </Radio.Group>
       <Search
        addonBefore="游戏名"
        style={{width:350,marginRight:20}}
        placeholder="输入游戏名称"
        onSearch={this.searchName.bind(this)}/>
      <Radio.Group
         style={{marginRight:20}}
         defaultValue="2"
         buttonStyle="solid"
         value={this.state.os}
         onChange={this.osRenderChange}
      >
         <Radio.Button value="2">Android</Radio.Button>
         <Radio.Button value="1">Ios</Radio.Button>
      </Radio.Group>
      <Button onClick={this.addGameModel.bind(this)} type="primary">添加</Button>

     </div>
    { /* 顶部操作end */}
     <Table
      columns={this.state.titleData}
      dataSource={this.state.MainData}
      indentSize={20}
      pagination={this.state.pagination}
      loading={this.state.loading}
      onChange={this.handleTableChange}
      />
      <Modal
        title="编辑信息"
        visible={this.state.editorMessageVisible}
        onOk={this.handleOk.bind(this)}
        onCancel={()=>{this.setState({editorMessageVisible:false})}}
        okText="提交"
        cancelText="取消"
      >
       <Input.Group className={styles.InputGroup}>
         <Input addonBefore="游戏名" onChange={this.EditorMessageOnChange.bind(this,"GameName")}  value={this.state.editorMessageGameName}/>
         <Input addonBefore="上架" onChange={this.EditorMessageOnChange.bind(this,"Up")}
         value={this.state.editorMessageUp}
         placeholder="输入是否上架，1上架，0下架" />
         <Input addonBefore="游戏公司" onChange={this.EditorMessageOnChange.bind(this,"CompanyName")}
         value={this.state.editorMessageCompanyName}
         placeholder="请输入游戏公司"  />
         <Input addonBefore="游戏版本"  onChange={this.EditorMessageOnChange.bind(this,"Vision")}
          value={this.state.editorMessageVision}
           placeholder="输入游戏版本号"/>
         <Input addonBefore="游戏下载数" onChange={this.EditorMessageOnChange.bind(this,"DownloadNum")}
         value={this.state.editorMessageDownloadNum}
         placeholder="请输入热门榜优先级"/>
         <Input addonBefore="热门榜优先级" onChange={this.EditorMessageOnChange.bind(this,"IndexPriority")}
        value={this.state.editorMessageIndexPriority}
          placeholder="请输入下载版优先级" />
         <Input addonBefore="下载版优先级" onChange={this.EditorMessageOnChange.bind(this,"HotPriority")}
         value={this.state.editorMessageHotPriority}
         placeholder="请输入热玩优先级" />
         <Input addonBefore="游戏大小" onChange={this.EditorMessageOnChange.bind(this,"GameSize")}
         value={this.state.editorMessageGameSize}
         placeholder="输入游戏大小" />

         <Input addonBefore="包名" onChange={this.EditorMessageOnChange.bind(this,"Packagename")}
         value={this.state.editorMessagePackagename}
         placeholder="输入包名" />


         <Input addonBefore="游戏10字简介" onChange={this.EditorMessageOnChange.bind(this,"Brief")}
         value={this.state.editorMessageBrief}
         placeholder="游戏10字简介" />

          {
            this.state.editorMessageSys==1?(
              <Input addonBefore="ios下载链接"
              onChange={this.EditorMessageOnChange.bind(this,"IosDownHref")}
              value={this.state.editorMessageIosDownHref}
              placeholder="填写appStore下载链接(非必填)"
              />
            ):(
              null
            )
          }
         <Input
           value={this.state.editorMessageGameStrategy}
           onChange={this.EditorMessageOnChange.bind(this,"GameStrategy")}
           addonBefore="攻略顶部的游戏推荐"
           placeholder="推荐为1不推荐为0"
         />
       </Input.Group>
       <TextArea
       style={{marginTop:5}}
       placeholder="输入游戏简介"
       autosize={{ minRows: 4, maxRows: 6 }}
       value={this.state.editorMessageGameDetail}
       onChange={this.EditorMessageOnChange.bind(this,"GameDetail")}
       />
      </Modal>
      <TagBox tagBoxVision={this.state.tagBoxVision} id={this.state.editorMessageId} handleTagBoxChange={this.handleTagBoxChange.bind(this)}/>
      { /*添加的文本框*/}
      <AddBox addBoxVision={this.state.addBoxVision} handleAddBoxChange={this.handleTagBoxChange.bind(this)} fetch={this.fetch.bind(this)}/>
      <UploadBox
      id={this.state.editorMessageId} uploadBoxVision={this.state.uploadBoxVision} handleUploadBoxChange={this.handleTagBoxChange.bind(this)}
      />
     </div>
    )
  }
}

export default Game;
