import React from "react";
import {connect} from 'dva';
import {Table,Button,Layout} from "antd";
import {Route} from "dva/router";
import AdminHeader from "../../components/header/Header";
import MainNavs from
"../../components/mainNavs/MainNavs";
import styles from "./Index.scss";
//右边模块
import Game from "./game/Game";
import Recommend from "./recommend/Recommend.js";
import Tag from "./tag/Tag";
import Title from "./title/Title";
const { Header, Footer, Sider, Content } = Layout;

class AdminIndex extends React.Component{
  componentWillMount(){
    console.log(this.props.adminIndex.login);
    if(this.props.adminIndex.login){

    }else{
      window.location="/#/";
    }
  }
  render(){
    return (
      <Layout style={{ minHeight:'100vh'}}>
       <Sider className={styles.navs}>
         <div className={styles.logo}></div>
         <MainNavs/>
       </Sider>
       <Layout>
        <Header className={styles.header}><AdminHeader/></Header>
        <Content className={styles.contents}>
          <Route path="/admin/game" component={Game} />
          <Route path="/admin/recommend"
          component={Recommend}
          />
          <Route path="/admin/tag"
          component={Tag}
           />
          <Route path="/admin/title"
           component={Title}
          />
        </Content>
       </Layout>
      </Layout>
    )
  }
}



export default connect(({adminIndex})=>({
   adminIndex
}))(AdminIndex);

// return false;
// export default Products;
