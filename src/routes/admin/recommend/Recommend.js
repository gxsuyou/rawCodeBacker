import React from "react";
import {Select,Table,Button,Input} from 'antd';
import styles from "./Recommend.scss";
import fetchs from "../../../utils/request.js";
import config from "../../../common/config";
import AddBox from "../../../components/recoBox/AddBox";
const Search =Input.Search;
const Option = Select.Option;

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
       dataIndex:"row",
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

 UNSAFE_componentWillMount(){
   this.setState({
     loading:true
   })

   fetchs(`${config.url_admin}/active?start=0`)
   .then((res)=>{
     console.log(res.data);
     var i =1;
     res.data.result.forEach((item)=>{
       this.state.mainData.push({
         key:i++,
         id:item.game_id,
         imgSrc:item.active_img,
         title:item.title,
         recommendType:item.type
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
        <AddBox />
      </div>
    )
  }
}

export default Recommend;
