import React from "react";
import {
  Modal,
  Message,
  Icon,
  Upload,
  Input,
  Button,
  Tabs,
  InputNumber
} from "antd";
import qiniu from "../../utils/_qiniu";
import config from "../../common/config";
import fetchs from "../../utils/request";
import styles from "./EditorBox.scss"
const TabPane = Tabs.TabPane;


class EditorBox extends React.Component {
  state = {
    visible: false,
    current: 1,
    typeName: "修改抵用券",
    activityName: "",
    gameName: "",
    gameId: "",
    inputToggle: false,
    piaoNum50:1,
    piaoId50:1,
    piaoNum20:1,
    piaoId20:1,
    piaoNum9:1,
    piaoId9:1,
    piaoNum5:1,
    piaoId5:1,
  }
  handleOk = () => {
 var ids=`${this.state.piaoId50},${this.state.piaoId20},${this.state.piaoId9},${this.state.piaoId5}`
 var nums=`${this.state.piaoNum50},${this.state.piaoNum20},${this.state.piaoNum9},${this.state.piaoNum5}`
 // console.log(this.state.gameId)
 // return ;
    fetchs(`${config.url_adminGame}/setTicket`,
      {method:"POST",
      headers: {
      'Content-Type':'application/x-www-form-urlencoded' // 指定提交方式为表单提交
      },
      body:`ids=${ids}&nums=${nums}&game_id=${this.state.gameId}`
   }).then((res)=>{
      // console.log(res)
       if(res.data.state){
         this.setState({
           visible: false,
         });
         this.props.propHandBox(false);
         this.props.propsFetchs(this.state.current);
       }else{
          Message.error("添加失败");
       }

    });

  }


  handleCancel = () => {
    this.setState({
      visible: false,
      fileList: []
    });
    this.props.propHandBox(false);
  }
  UNSAFE_componentWillReceiveProps(e) {


   if(e.visible==false){
     return false;
   }
    this.setState({
      visible: e.visible,
      current: e.current,
      gameId: e.gameId,
      gameName:e.gameName
    });
    fetchs(`${config.url_adminGame}/setTicket?game_id=${e.gameId}`).then((res)=>{
      console.log(res);
      res.data.forEach((item)=>{

           var num=`piaoNum${item.coin}`
           var id=`piaoId${item.coin}`
           console.log(num,item.num)
           this.setState({
             [num]:item.num,
             [id]:item.id
           })
        });
      });

  }


 onChange(value) {
   console.log(value)
  //  console.log(value,v)
  //  var num=`piaoNum${value}`
  // this.setState({
  //   [num]:v+1
  // })
}
  render() {
    return ( <
      Modal title = {
        this.state.typeName
      }
      visible = {
        this.state.visible
      }
      onOk = {
        this.handleOk
      }
      onCancel = {
        this.handleCancel
      }
      okText = "提交"
      cancelText = "取消" >
      <
      Input.Group >
      <
      Input addonBefore = "活动名字"
      value = {
        this.state.gameName
      }
      placeholder = "输入活动名字"
      disabled
      onChange = {
        (e) => {
          this.setState({
            activityName: e.target.value
          })
        }
      }
      style = {
        {
          width: 400,
          display: "block",
          marginTop: 10
        }
      }
      />
      </Input.Group>
      <div className={styles.piaoContents}>
        <div>
          <div className={styles.piao}>
            <div >
             <div>50</div>
             <div>满200元可用</div>
            </div>
            <div>
             【{this.state.gameName}】充值满200元可返还50元
             <div><InputNumber min={0} max={100000} value={this.state.piaoNum50} onChange={(v)=>{
               this.setState({
                 piaoNum50:v
               })
             }} /></div>
            </div>
          </div>
        </div>
        <div>
          <div className={styles.piao}>
            <div >
             <div>20</div>
             <div>满100元可用</div>
            </div>
            <div>
             【{this.state.gameName}】充值满100元可返还20元
             <div><InputNumber min={0} max={100000} value={this.state.piaoNum20} onChange={(v)=>{
               this.setState({
                 piaoNum20:v
               })
             }} /></div>
            </div>
          </div>
        </div>
        <div>
          <div className={styles.piao}>
            <div >
             <div>9</div>
             <div>满50元可用</div>
            </div>
            <div>
             【{this.state.gameName}】充值满50元可返还9元
             <div><InputNumber min={0} max={100000} value={this.state.piaoNum9} onChange={(v)=>{
               this.setState({
                 piaoNum9:v
               })
             }} /></div>
            </div>
          </div>
        </div>
        <div>
          <div className={styles.piao}>
            <div >
             <div>5</div>
             <div>满30元可用</div>
            </div>
            <div>
             【{this.state.gameName}】充值满30元可返还5元
             <div><InputNumber min={0} max={100000} value={this.state.piaoNum5} onChange={(v)=>{
               this.setState({
                 piaoNum5:v
               })
             }} /></div>
            </div>
          </div>
        </div>
      </div>

      </Modal>
    )
  }
}
export default EditorBox;
