import React,  { Component } from 'react';
import { connect } from 'react-redux'
import Order from '../../components/Order/Order'
import axios from '../../axios-orders'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import * as actions from '../../store/actions/index'
import Spinner from '../../components/UI/Spinner/Spinner'
class Orders extends Component {
    componentDidMount() {
        this.props.onFetchOrders(this.props.token,this.props.userId)  
    }
    render() {
        let order = <Spinner />
        if (this.props.loading) {
            order = this.props.orders.map(order => (
                <Order 
                    ingredients={order.ingredients} 
                    price={order.price} 
                    key={order.id} />  
            ))
        }
        return (
            <div>
                {order}
            </div>  
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onFetchOrders: (token, userId) => dispatch(actions.fetchOrders(token,userId)),
        onTryAutoSignUp: () => dispatch(actions.authCheckState())
    }
}

const mapStateToProps = state => {
   return {
    orders: state.order.orders,
    loading: state.order.loading,
    token: state.auth.token,
    userId: state.auth.userId
   }
}
export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(Orders, axios));