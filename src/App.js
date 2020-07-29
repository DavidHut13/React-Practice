import React, { Component } from 'react';
import { Route, withRouter, Redirect } from 'react-router-dom'
import Layout from  './hoc/Layout/Layout.js'
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder.js'
// import Checkout from './containers/Checkout/Checkout'
// import Orders from './containers/Orders/Orders'
// import Auth from './containers/Auth/Auth'
import Logout from './containers/Auth/Logout/Logout'
import {connect} from 'react-redux'
import * as actions from './store/actions/index'
import asyncComponent from './hoc/asyncComponent/asyncComponent'

const asyncCheckout = asyncComponent(() => {
  return import('./containers/Checkout/Checkout')
});
const asyncOrders = asyncComponent(() => {
  return import('./containers/Orders/Orders')
});
const asyncAuth = asyncComponent(() => {
  return import('./containers/Auth/Auth')
});

class App extends Component {
  componentDidMount(){
    this.props.onTryAutoSignUp()
  }

  render() {
    let routes = (
      <div>
        <Route path="/auth" component={asyncAuth}/>
        <Route path="/" exact component={BurgerBuilder} />
        <Redirect to="/" />
      </div>
    );
    if (this.props.isAuthenticated) {
      routes = (
        <div>
        <Route path="/checkout" component={asyncCheckout}/>
        <Route path="/orders"  component={ asyncOrders } />
        <Route path="/logout" exact component={Logout} />
        <Route path="/auth" component={asyncAuth}/>
        <Route path="/" exact component={BurgerBuilder} />
      </div>
      )
    }
    return (
      <div>
        <Layout>
          {routes}
        </Layout>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null
  }
}

const mapDispatchToPRops = dispatch => {
  return {
    onTryAutoSignUp: () => dispatch(actions.authCheckState())
  }
}
export default withRouter(connect(mapStateToProps,mapDispatchToPRops)(App));
