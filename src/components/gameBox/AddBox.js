import react from "react";
import {Modal,Checkbox,Input,Select
,Tabs,Message,Radio,Divider} from "antd";
import config from "../../common/config";
import fetchs from "../../utils/request";
import styles from "./AddBox.scss";
const Option =Select.Option;
const TabPane = Tabs.TabPane;
const {TextArea}=Input;
const RadioGroup = Radio.Group;
class AddBox extends react.Component{
  state={
    visible:false,
    gameName:"",
    gameVersion:"",
    gameCompany:"",
    gameRecommend:"",
    gamePackagename:"",
    type:"alone",
    sys:"2",
    tabsValue:"",
    brief:"",
    sysDownInput:true,
    iosDownHref:null,
    plainOptions_alone:[
      {
        label:"射击",
        value:"1",
        key:"1"
      },{
        label:"经营养成",
        value:"2",
        key:"2"
      },{
        label:"棋牌",
        value:"3",
        key:"3"
      },{
        label:"策略",
        value:"4",
        key:"4"
      },{
        label:"动作",
        value:"5",
        key:"5"
      },{
        label:"角色扮演",
        value:"6",
        key:"6"
      },{
        label:"益智",
        value:"7",
        key:"7"
      },{
        label:"休闲",
        value:"8",
        key:"8"
      },{
        label:"模拟",
        value:"18",
        key:"18"
      },{
        label:"街机",
        value:"19",
        key:"19"
      },{
        label:"竞技",
        value:"20",
        key:"20"
      },{
        label:"音乐",
        value:"21",
        key:"21"
      },{
        label:"其他游戏",
        value:"9",
        key:"9"
      }
    ],
    plainOptions_application:[{
        label:"网上购物",
        value:"10",
        key:"10"
      },{
        label:"影音图像",
        value:"11",
        key:"11"
      },{
        label:"实用工具",
        value:"12",
        key:"12"
      },{
        label:"商务办公",
        value:"13",
        key:"13"
      },{
        label:"社交通讯",
        value:"14",
        key:"14"
      },{
        label:"生活服务",
        value:"15",
        key:"15"
      },{
        label:"运动健康",
        value:"16",
        key:"16"
      },{
        label:"资讯阅读",
        value:"17",
        key:"17"
      },{
        label:"金融理财",
        value:"22",
        key:"22"
      },{
        label:"学习教育",
        value:"23",
        key:"23"
      },{
        label:"交通导航",
        value:"24",
        key:"24"
      }],
    defaultOption:[],
    strategyTopGame:0,
  }
  componentWillReceiveProps(p){
    this.setState({
      visible:p.addBoxVision
    });
  }
  onCancel(){
    this.setState({
      visible:false
    });
    this.props.handleAddBoxChange(false);
  }
  onOk(){
    let brief=this.state.brief.replace(/\n/g,"<br>");

    // console.log(brief);
    if(this.state.gameName===""){
      Message.error("游戏名不能为空");
      return false;
    }

    if(this.state.defaultOption.length===0){
      Message.error("分类不能为空");
      return false;
    }

   const cls=this.state.defaultOption.join(",");
   const uid=config.getCookie("uid");
   fetchs(`${config.url_adminGame}/addGameMsg`,{
     method:"POST",
     headers:{
     'Content-Type':'application/x-www-form-urlencoded' // 指定提交方式为表单提交
     },
     body:`gameName=${this.state.gameName}&gameVersion=${this.state.gameVersion}&gamePackagename=${this.state.gamePackagename}&gameRecommend=${this.state.gameRecommend}&type=${this.state.type}&cls=${cls}&gameCompany=${this.state.gameCompany}&sys=${this.state.sys}&admin=${uid}&gameDetail=${brief}&strategy_head=${this.state.strategyTopGame}&gameDownloadIos=${this.state.iosDownHref}`}).then((res)=>{
     if(res.data.state===1){
        this.setState({
          visible:false,
          gameName:"",
          gameVersion:"",
          gameCompany:"",
          gameRecommend:"",
          gamePackagename:"",
          type:"alone",
          sys:"2",
          brief:""
       });
      this.state.defaultOption.splice(0,this.state.defaultOption.length);
       this.props.handleAddBoxChange(false);
       //更新页表
       this.props.fetch(1);
       Message.error(res.data.info);
     }else{
       Message.error(res.data.info);
     }
   });
  }
  onChange(c){
     this.setState({
       [`defaultOption`]:c
     });
  }
  tabsType(activeKey){
    this.setState({
      type:activeKey
    });
  }
  render(){
    return (
      <Modal
      title="添加游戏"
      visible={this.state.visible}
      onCancel={this.onCancel.bind(this)}
      onOk={this.onOk.bind(this)}
      okText="提交"
      cancelText="取消">
       <Input.Group className={styles.InputGroup}>
         <Input addonBefore="游戏名" placeholder="游戏名字" value={this.state.gameName} onChange={(e)=>{this.setState({gameName:e.target.value})}} />
         <Input addonBefore="游戏版本号" placeholder="游戏版本号"
         value={this.state.gameVersion} onChange={(e)=>{this.setState({gameVersion:e.target.value})}} />
         <Input addonBefore="游戏公司" placeholder="游戏公司"
         value={this.state.gameCompany}
         onChange={(e)=>{this.setState({gameCompany:e.target.value})}}
          />
         <Input addonBefore="游戏简介" placeholder="游戏简介(10到15个字)"
         value={this.state.gameRecommend} onChange={(e)=>{this.setState({gameRecommend:e.target.value})}} />
         <Input.Group compact>
         <Select
         value={this.state.sys}
         onChange={(value)=>{
           if(value==1){
             this.setState({
               sys:value,
               sysDownInput:false
             });
           }else{
             this.setState({
               sys:value,
               sysDownInput:true
             });
           }
         }}>
           <Option value="2">android</Option>
           <Option value="1">ios</Option>
         </Select>
         <Input  style={{ width: '70%' }} placeholder="输入游戏安装后的包名"
          value={this.state.gamePackagename}
          onChange={(e)=>{this.setState({gamePackagename :e.target.value})}}
         />
         </Input.Group>
         <Input  addonBefore="ios下载链接"
          placeholder="填写appStore下载链接(非必填)"
          disabled={this.state.sysDownInput}
          value={this.state.iosDownHref}
          onChange={(e)=>{this.setState({iosDownHref :e.target.value})}}
         />
         <TextArea
         style={{marginTop:5}}
         placeholder="输入游戏简介"
         autosize={{ minRows: 4, maxRows: 6 }}
         value={this.state.brief}
         onChange={(e)=>{
           this.setState({
             brief:e.target.value
           });
         }}/>
       </Input.Group>
       <RadioGroup
       onChange={(e)=>{
         this.setState({
           strategyTopGame:e.target.value
         });
       }}
       value={this.state.strategyTopGame}>
        <Divider orientation="left">攻略顶部的游戏推荐</Divider>
        <Radio value={0}>取消</Radio>
        <Radio value={1}>推荐</Radio>
      </RadioGroup>
       <Tabs className={styles.tab} defaultActiveKey="alone" onChange={this.tabsType.bind(this)}>
         <TabPane tab="游戏" key="alone">
           <Checkbox.Group
             options={this.state.plainOptions_alone}
             onChange={this.onChange.bind(this)}
           ></Checkbox.Group>
         </TabPane>
         <TabPane tab="应用" key="application">
         <Checkbox.Group
          options={this.state.plainOptions_application}
          onChange={this.onChange.bind(this)}
         >
         </Checkbox.Group>
         </TabPane>
       </Tabs>
      </Modal>
    )
  }
}

export default AddBox;
