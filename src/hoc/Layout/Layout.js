import React, { Component } from 'react'
import {connect} from 'react-redux'
import classes from './Layout.module.css'
import Toolbar from '../../components/Navigation/Toolbar/Toolbar.js';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer.js'

class Layout extends Component {
    state = {
      showSideDrawer: false  
    }

    sideDrawerClosedHandler = () => {
        this.setState({showSideDrawer:false})
    }
    sideDrawerToggleHandler = () => {
        this.setState((prevState) => {
            return {showSideDrawer: !this.state.showSideDrawer}
        })
    }
    render () {
         return (
            <>
                <Toolbar 
                    drawerToggleClicked={this.sideDrawerToggleHandler} 
                    isAuth={this.props.isAuthenticated}/> 
                <SideDrawer  
                    isAuth={this.props.isAuthenticated} 
                    open={this.state.showSideDrawer} 
                    closed={this.sideDrawerClosedHandler} />
                <div> Sidebar / Backdrop</div>
                <main className={classes.Content}>
                    {this.props.children}
                </main>
            </>
         )
    }
};


const mapStateToProps = (state) => {
    return {
        isAuthenticated: state.auth.token !== null
    }
}
export default connect(mapStateToProps)(Layout);