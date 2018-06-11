import react from "react";
import {Modal,Button,Divider,Checkbox,Table,Message} from "antd";
import config from "../../common/config";
import fetchs from "../../utils/request";
class TagBox extends react.Component{
  state={
    visible:this.props.tagBoxVision,
    plainOptions:[],
    defaultOption:[],
    plainOptions2:[],
    defaultOption2:[],
    title:"",
    id:""
  }
  onModal(){
    const idArray=[];
    this.state.defaultOption.forEach((choicesName)=>{
      this.state.plainOptions.forEach((item)=>{
        if(item.value===choicesName){
          idArray.push(item.key);
        }
      });
    });
    const newSet=new Set(idArray);
    const completeArray=[...newSet];
    const g=completeArray.join()
    /* 标签二 */
    const idArray2=[];

    this.state.defaultOption2.forEach((choicesName)=>{
      this.state.plainOptions2.forEach((item)=>{
        if(item.value===choicesName){
          idArray2.push(item.key);
        }
      });
    });
    const newSet2=new Set(idArray2);
    const completeArray2=[...newSet2];
    const g2=completeArray2.join();

    fetchs(`${config.url_adminGame}/setClsAndTag?id=${this.state.id}&cls_ids=${g}&tag_ids=${g2}`)
    .then((res)=>{
        if(res.data.state){
           this.setState({
              visible:false,
           });
           this.props.handleTagBoxChange(false);
        }else{
          Message.error("网络错误,请重新尝试!");
        }
    })

  }
  onChange(checkedValues) {
     this.setState({
        defaultOption:checkedValues
     })
  }
  onChange2(checkedValues){
    this.setState({
       defaultOption2:checkedValues
    })
  }


  componentWillReceiveProps(p){
    if(p.tagBoxVision===false){
      return false;
    }
    this.state.plainOptions.splice(0,this.state.plainOptions.length);
    this.state.defaultOption.splice(0,this.state.plainOptions2.length);
    this.state.plainOptions2.splice(0,this.state.plainOptions.length);
    this.state.defaultOption2.splice(0,this.state.plainOptions2.length);

    fetchs(`${config.url_adminGame}/gameAdminDetail?id=${p.id}`)
    .then((res)=>{

      /* 标签一 */
      this.state.plainOptions=[];
      for(let i=1;i<res.data.cls.length;i++){
          if(res.data.cls[i].checked){
            this.state.defaultOption.push(res.data.cls[i].cls_name);
          }
          this.state.plainOptions.push({
            label:res.data.cls[i].cls_name,
            value:res.data.cls[i].cls_name,
            key:res.data.cls[i].id
          });
      }

     /* 标签二 */

     this.state.plainOptions2=[];

     for(let i=0;i<res.data.tag.length;i++){
       if(res.data.tag[i].checked){
         this.state.defaultOption2.push(res.data.tag[i].name);
       }
       this.state.plainOptions2.push({
         label:res.data.tag[i].name,
         value:res.data.tag[i].name,
         key:res.data.tag[i].id
       });

     }


      this.setState({
        visible:p.tagBoxVision,
        title:res.data.cls[0].cls_name,
        id:p.id
      });

    });

  }

  onCancel(){
    this.setState({
      visible:false,
    });
    this.props.handleTagBoxChange(false);
  }
  render(){
    return(
      <Modal
      onOk={this.onModal.bind(this)}
      onCancel={this.onCancel.bind(this)}
      visible={this.state.visible}
      okText="提交"
      cancelText="取消"
      >
      {/* 标签一 */ }
      <Divider styles={{marginTop:10}} orientation="left">{this.state.title}</Divider>
      <Checkbox.Group options={this.state.plainOptions} defaultValue={this.state.defaultOption} onChange={this.onChange.bind(this)} styles={{marginTop:10}}></Checkbox.Group>
      {/* 标签二 */}
     <Divider styles={{marginTop:10}} orientation="left">标签</Divider>
      <Checkbox.Group
      options={this.state.plainOptions2}
      defaultValue={this.state.defaultOption2}
      onChange={this.onChange2.bind(this)}
      ></Checkbox.Group>
      </Modal>
    )
  }
}

export default TagBox;
