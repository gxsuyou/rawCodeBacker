import React from "react";
import {Select,Table,Icon,Modal,Button,Input} from 'antd';
import styles from "./Recommend.scss";
const Search =Input.Search;
const Option = Select.Option;
const data = [{
  key: '1',
  name: 'John Brown',
  age: 32,
  address: 'New York No. 1 Lake Park',
}, {
  key: '2',
  name: 'Jim Green',
  age: 42,
  address: 'London No. 1 Lake Park',
}, {
  key: '3',
  name: 'Joe Black',
  age: 32,
  address: 'Sidney No. 1 Lake Park',
}];

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
    columns:[
      {title:'序号',
      dataIndex:'key',
      key:'key',
      // render:text=><a href="javascript:;">
      //  {text}</a>
     },{
       title:'ID',
       dataIndex:'id',
       key:'id'
     },{
       title:'活动名',
       dataIndex:'active',
       key:'active'
     },{
       title:'标题',
       dataIndex:'title',
       key:'key'
     },{
       title:'排列',
       dataIndex:"row",
       key:'row'
     },{
       title:'活动图片地址',
       dataIndex:'imgSrc',
       key:'imgSrc'
     },{
       title:'状态',
       dataIndex:'status',
       key:'status'
     },{
       title:'推荐位类型',
       dataIndex:'recommendType',
       key:'recommendType'
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
    ]
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
  addGameModel(){

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
       columns={this.state.columns} dataSource={data} />
       <Modal
          title="Basic Modal"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Modal>
      </div>
    )
  }
}

export default Recommend;
