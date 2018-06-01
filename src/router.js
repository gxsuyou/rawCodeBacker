import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import IndexPage from './routes/IndexPage';
import AdminIndex from "./routes/admin/Index";

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route  path="/" exact component={IndexPage} />
        <Route  path="/admin" component={AdminIndex} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
