import React from "react";
import {connect} from 'dva';
import {Layout} from "antd";
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
import Strategy from "./strategy/Strategy";
import SliderGame from "./sliderGame/SliderGame";
import HeadBox from "./headGame/HeadGame";
import H5 from "./h5/H5";
import News from "./news/News.js";
const { Header, Sider, Content } = Layout;

class AdminIndex extends React.Component{
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
          <Route path="/admin/Strategy"
          component={Strategy}
          />
          <Route path="/admin/SliderGame"
           component={SliderGame}
          />
          <Route path="/admin/HeadBox"
           component={HeadBox}
          />
          <Route path="/admin/h5"
           component={H5}
          />
          <Route path="/admin/news"
           component={News}
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
