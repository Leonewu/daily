import React from "react";
import {
  Switch,
  Route,
} from "react-router-dom";
import Home from './page/Home';
// import Page1 from './page/Page1';
// import Page2 from './page/Page2';
// import Page3 from './page/Page3';
import lodabale from '@loadable/component';

export default function Routes() {
  return (
    <Switch>
      <Route path="/page1" component={lodabale(() => import('./page/Page1'))}>
        {/* <Page1 /> */}
      </Route>
      <Route path="/page2" component={lodabale(() => import('./page/Page2'))}>
        {/* <Page2 /> */}
      </Route>
      <Route path="/page3" component={lodabale(() => import('./page/Page3'))}>
        {/* <Page3 /> */}
      </Route>
      <Route path="/">
        <Home />
      </Route>
    </Switch>
  )
}