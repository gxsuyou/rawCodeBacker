import React from "react";
import {connect} from 'dva';
import {Table,Button} from "antd";
import {Route} from "dva/router";
import AdminHeader from "../../components/header/Header";
import MainNavs from
"../../components/mainNavs/MainNavs";

class AdminIndex extends React.Component{
  constructor(){
    super();
    this.state={
      age:666
    }
  }
   changeInfo(id){
    // this.props.dispatch({
    //   type:'products/delete',
    //   id:id
    // });
  }
  render(){
    return (
      <div>
       {
         //this.props.products.age
       }
        <AdminHeader/>
       <MainNavs/>
       {
         //<Button size="small" onClick={this.changeInfo.bind(this,1)}>ooo</Button>
         //<Route path="/admin/game" component={Game}/>
       }
      </div>
    )
  }
}

// const Products=({dispatch,products,match})=>{
//   function constructor(){
//     console.log(1)
//   }
//   function hand(id){
//     dispatch({
//       type:"products/delete",
//       payload:id
//     });
//   }
//     return (
//       <div>
//          <h2>List of admin</h2>
//          {
//           //  <Popconfirm >
//           //  <Button >111</Button>
//           // </Popconfirm>
//            //<Button onClick={hand(id)}>按钮</Button>
//          }
//           <Route path="/game" component={Game} />
//        </div>
//     )
// }


export default connect(({adminIndex})=>({
   adminIndex
}))(AdminIndex);

// return false;
// export default Products;
