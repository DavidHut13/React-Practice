import React, { Component } from 'react'
import { connect } from 'react-redux'
import Burger from '../../components/Burger/Burger.js'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal.js'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary.js'
import Spinner from '../../components/UI/Spinner/Spinner'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler.js'
import * as actions from '../../store/actions/index.js'
import axios from '../../axios-orders.js'


class BurgerBuilder extends Component {
    state = {
        totalPrice: 4,
        purchasing: false,
    }
    componentDidMount () {
        this.props.onInitIngredients()
    }
    updatePurchaseState = (updatedIngredients) => {
      const ingredients = {
          ...updatedIngredients
      };
      const sum = Object.keys(ingredients)
        .map(igKey => {
            return ingredients[igKey]
        })
        .reduce((sum, el) => {
            return sum + el;
        }, 0)
        return sum > 0
    }

    purchaseHandler = () => {
        this.setState({purchasing: true})
    }

    purchasCancelHandler = () =>
    {
        this.setState({purchasing: false})
    }

    purchasContinueHandler = () => {
        this.props.onInitPurchase()
        this.props.history.push('/checkout')  
    }
    render () {
        const disabledInfo = {
            ...this.props.ings
        }
        for (let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        let orderSummary = null
        let burger = this.props.error ? <p style={{testAlign: 'center'}}>Ingredients Can't be loaded!</p> : <Spinner></Spinner>
        if (this.props.ings) {
            burger = (
                <>
                    <Burger ingredients={this.props.ings}></Burger>
                    <BuildControls 
                    ingredientAdded={this.props.onIngredientAdded} 
                    ingredientRemoved={this.props.onIngredientRemove}
                    disabled={disabledInfo}
                    price={this.props.price}
                    purchasable={this.updatePurchaseState(this.props.ings)}
                    ordered={this.purchaseHandler}
                    />
                </>
            )
            orderSummary =  <OrderSummary 
                ingredients={this.props.ings} 
                price={this.props.price}
                purchaseCancelled={this.purchaseCancelHandler}
                purchaseContinued={this.purchasContinueHandler}/>;

        }   
        return (
            <>
            <Modal show={this.state.purchasing} modalClosed={this.purchasCancelHandler}>
              {orderSummary}
            </Modal>
            {burger}
            </>
        );
    }

}

const mapStateToProps = state => {
    return {
        ings:  state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
        onIngredientRemove: (ingName) => dispatch(actions.removeIngredient(ingName)),
        onInitIngredients: () => dispatch(actions.initIngredients()),
        onInitPurchase: () => dispatch(actions.purchaseInit())
    }
}

export default connect(mapStateToProps ,mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));