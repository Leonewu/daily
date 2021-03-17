import React, { Suspense, lazy } from "react";
import {
  Switch,
  Route,
} from "react-router-dom";
import Home from './page/Home';
// import Page1 from './page/Page1';
// import Page2 from './page/Page2';
// import Page3 from './page/Page3';
const Page1 = lazy(() => import(/* webpackChunkName: "page1" */'./page/Page1'));
const Page2 = lazy(() => import(/* webpackChunkName: "page2" */'./page/Page2'));
const Page3 = lazy(() => import(/* webpackChunkName: "page3" */'./page/Page3'));

export default function Routes() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Route path="/page1">
          <Page1 />
        </Route>
        <Route path="/page2">
          <Page2 />
        </Route>
        <Route path="/page3">
          <Page3 />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Suspense>
  )
}