import React from "react";
import {Input,Table,Button,Modal} from "antd";
import styles from "./Tag.scss";
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
class tag extends React.Component{
  state={
    columns:[
      {
        title:'序列',
        dataIndex:'key',
        key:'key'
      },{
        title:'ID',
        dataIndex:'id',
        key:'id'
      },{
        title:'标题',
        dataIndex:'title',
        key:'title'
      },{
        title:'描述',
        dataIndex:'describle',
        key:'describle'
      },{
        title:'激活状态',
        dataIndex:'activationState',
        key:'activationState'
      },{
        title:'图片地址',
        dataIndex:'imgSrcAddress',
        key:'imgSrcAddress'
      },{
        title:'系统',
        dataIndex:'sys',
        key:'sys'
      },{
        title:"操作",
        dataIndex:'action',
        key:'action',
        render:(text,record)=>(
         <span className={styles.button}>
          <Button>编辑</Button>
          <Button type="danger">添加游戏</Button>
         </span>
        )
      }
    ]
  }
  render(){
    return (
      <div className={styles.table}>
        <div className={styles.tableOperations}>
         <Button type="primary">添加</Button>
        </div>
        <Table
        columns={this.state.columns}
        dataSource={data}
        />
      </div>
    )
  }
}

export default tag;
