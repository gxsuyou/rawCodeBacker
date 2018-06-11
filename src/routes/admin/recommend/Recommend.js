import React from "react";
import {Select,Table,Icon,Modal,Button,Input} from 'antd';
import styles from "./Recommend.scss";
import fetchs from "../../../utils/request.js";
import config from "../../../common/config";
const Search =Input.Search;
const Option = Select.Option;
// const data = [{
//   key: '1',
//   name: 'John Brown',
//   age: 32,
//   address: 'New York No. 1 Lake Park',
// }, {
//   key: '2',
//   name: 'Jim Green',
//   age: 42,
//   address: 'London No. 1 Lake Park',
// }, {
//   key: '3',
//   name: 'Joe Black',
//   age: 32,
//   address: 'Sidney No. 1 Lake Park',
// }];

const selectBefore = (
  <Select defaultValue="名称" style={{ width: 80 }}>
    <Option value="name">名称
    </Option>
    <Option value="title">标题
    </Option>
  </Select>
);

class Recommend extends React.Component{
  state={
    visible:false,
    loading:false,
    columns:[
      {title:'序号',
      dataIndex:'key',
      key:'key',
     },{
       title:'ID',
       dataIndex:'id',
     },{
       title:'活动名',
       dataIndex:'active',
     },{
       title:'标题',
       dataIndex:'title',
     },{
       title:'排列',
       dataIndex:"sort",
     },{
       title:'活动图片地址',
       dataIndex:'imgSrc',
     },{
       title:'状态',
       dataIndex:'status',
     },{
       title:'推荐位类型',
       dataIndex:'recommendType',
     },{
       title:"操作",
       key:'action',
       render:(text,record)=>(
        <span className={styles.button}>
         <Button>编辑</Button>
         <Button type="danger">删除</Button>
        </span>
       )
     }
   ],
   mainData:[],
   pagination:{}
  }

 componentWillMount(){
   this.setState({
     loading:true
   })
   fetchs(`${config.url_admin}/active?start=0`)
   .then((res)=>{
     console.log(res.data);
     var i =1;
     res.data.result.forEach((item)=>{

      if(item.active!=1){
        var status="不激活";
      }else{
        var status="激活";
      }

      if(item.type == '4'){
        var recommendType="首页推荐位"
      }else if(item.type== '1'){
        var recommendType='首页轮播推荐位';
      }else if(item.type == '5'){
       var recommendType='推荐位（横向2个）';
     }else if(item.type == '6'){
       var recommendType='推荐位（竖排10个）';
     }
       this.state.mainData.push({
         key:i++,
         id:item.game_id,
         imgSrc:item.active_img,
         title:item.title,
         status:status,
         sort:item.sort,
         active:item.name,
         recommendType:recommendType
       });

     });
     const pagination={...this.state.pagination};
     pagination.total=res.data.totalPage*10;
     this.setState({
       loading:false,
       pagination
     })
     console.log(this.state.mainData);
   })
 }
  addGameModel(){

  }
  showModal = (v) => {
    console.log(v);
    this.setState({
      visible: true,
    });
  }
  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }
  handleOk = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }
  handleTableChange(e){
      console.log(e);
  }
  render(){
    return(
      <div className={styles.table}>
       <div className={styles.tableOperations}>
        <Search
        addonBefore={selectBefore}
        style={{width:350}}
        placeholder="input search text"
        onSearch={value => console.log(value)}
         className={styles.tableOperationsInput}  />
        <Button onClick={this.addGameModel.bind(this)} type="primary">添加</Button>
       </div>
       <Table
       columns={this.state.columns} dataSource={this.state.mainData}
       pagination={this.state.pagination} onChange={this.handleTableChange}
       />
       {
       // <Modal
       //    title="Basic Modal"
       //    visible={this.state.visible}
       //    onOk={this.handleOk}
       //    onCancel={this.handleCancel}
       //    pagination={2}
       //    loading={this.state.loading}
       //  >
       //    <p>Some contents...</p>
       //    <p>Some contents...</p>
       //    <p>Some contents...</p>
       //  </Modal>
        }
      </div>
    )
  }
}

export default Recommend;
