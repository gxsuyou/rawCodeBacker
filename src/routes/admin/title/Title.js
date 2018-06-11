import React from "react";
import {Table,Input,Button} from 'antd';
import styles from './Title.scss';
const data = [{
  key: '1',
  title: 'John Brown',
}, {
  key: '2',
  title: 'Jim Green',
}, {
  key: '3',
  title: 'Joe Black',
}];
class Title extends React.Component{
  state={
    columns:[
      {title:'序号',
      dataIndex:'key',
      key:'key'
      },{
      title:'标签',
      dataIndex:'title',
      key:'title'
    },{
      title:'操作',
      key:'action',
      render:(text,record)=>(
        <span className={styles.button}>
         <Button>修改</Button>
         <Button type="danger">推荐</Button>
        </span>
      )
    }
    ]
  }
  render(){
    return (
      <div className={styles.table}>
        <Table
          columns={this.state.columns}
          dataSource={data}
        />
      </div>
    )
  }
}
export default Title;
