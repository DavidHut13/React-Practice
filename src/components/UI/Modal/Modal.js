import React, { Component } from 'react';
import classes from './Modal.module.css'
import Backdrop from '../Backdrop/Backdrop.js' 


class Modal extends Component{
    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.show !== this.props.show) {
            return true;
        }
        else {
            return false;
        }
    }
    componentWillUpdate() {
        console.log('[Modal] DidUpdate')
    }
    render () {
        return (
            <>
                <Backdrop show={this.props.show} clicked={this.props.modalClosed}></Backdrop>
                <div className={classes.Modal}
                style={{
                    transform: this.props.show ? 'translateY(0)' : 'translateY(-100vh)',
                    opacity: this.props.show ? '1': '0'
                }}>
                    {this.props.children}
                </div>
            </>
        );
    }
}

export default Modal