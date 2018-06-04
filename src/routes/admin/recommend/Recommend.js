import React from "react";
import {Table,Icon,Divider,Modal,Button} from 'antd';
import styles from "./Recommend.scss";

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

class Recommend extends React.Component{
  state={
    visible:false,
    columns:[
      {title:'Name',
      dataIndex:'name',
      key:'name',
      render:text=><a href="javascript:;">
       {text}</a>
     },{
       title:'Age',
       dataIndex:'age',
       key:'age'
     },{
       title:'Address',
       dataIndex:'address',
       key:'address'
     },{
       title:"Action",
       key:'action',
       render:(text,record)=>(
        <span>
         <Button onClick={this.showModal.bind(this,record.age)} >
           {record.name}-{record.age}
         </Button>
         <Divider  type="vertical"/>
         <a href={"javascript:"}>Delete</a>
         <Divider  type="vertical" className="ant-dropdown-link"/>
         more actions <Icon type="down"/>
         <a href="javascript:;">
         </a>
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
  render(){
    return(
      <div>
       <Table className={styles.table} columns={this.state.columns} dataSource={data} />
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
