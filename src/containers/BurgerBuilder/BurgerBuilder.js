import React, { Component } from 'react'
import { connect } from 'react-redux'
import Burger from '../../components/Burger/Burger.js'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal.js'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary.js'
import axios from '../../axios-orders.js'
import Spinner from '../../components/UI/Spinner/Spinner'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler.js'
import * as actionTypes from '../../store/actions'

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
}

class BurgerBuilder extends Component {
    state = {
        totalPrice: 4,
        purchasable: false,
        purchasing: false,
        loading:false,
        error: false
    }
    componentDidMount () {
        // axios.get('/ingredients.json')
        // .then(response => {
        //     this.setState({ingredients: response.data})
        // })
        // .catch(error => {
        //     this.setState({error: true})
        // })
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
    this.setState({purchasable: sum > 0})
    }

    purchaseHandler = () => {
        this.setState({purchasing: true})
    }

    purchasCancelHandler = () =>
    {
        this.setState({purchasing: false})
    }

    purchasContinueHandler = () => {
 
        const queryParams = [];
        for(let i in this.state.ingredients) {
            queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]))
        }
        
        queryParams.push('price=' + this.state.totalPrice)
        const queryString = queryParams.join('&')
        this.props.history.push({
            pathname: '/checkout',
            search: '?' + queryString
        })
    }
    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type]
        const updatedCount = oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState({totalPrice:newPrice,ingredients:updatedIngredients});
        this.updatePurchaseState(updatedIngredients)
    }
    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type]
        if (oldCount <= 0){
            return;
        }
        const updatedCount = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceAddition;
        this.setState({totalPrice:newPrice,ingredients:updatedIngredients});
        this.updatePurchaseState(updatedIngredients)
    };
    render () {
        const disabledInfo = {
            ...this.props.ings
        }
        for (let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        let orderSummary = null
        let burger = this.state.error ? <p style={{testAlign: 'center'}}>Ingredients Can't be loaded!</p> : <Spinner></Spinner>
        if (this.props.ings) {
            burger = (
                <>
                    <Burger ingredients={this.props.ings}></Burger>
                    <BuildControls 
                    ingredientAdded={this.props.onIngredientAdded(ctrl.type)} 
                    ingredientRemove={this.props.onIngredientRemove(ctrl.type)}
                    disabled={disabledInfo}
                    price={this.state.totalPrice}
                    purchasable={this.state.purchasable}
                    ordered={this.purchaseHandler}
                    />
                </>
            )
            orderSummary =  <OrderSummary 
                ingredients={this.props.ings} 
                price={this.state.totalPrice}
                purchaseCancelled={this.purchaseCancelHandler}
                purchaseContinued={this.purchasContinueHandler}/>;

        }
        if (this.state.loading) {
            orderSummary = <Spinner></Spinner>
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
        ing: state.ingredients
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch({type:actionTypes.ADD_INGREDIENT,ingredientName:ingName}),
        onIngredientRemove: (ingName) => dispatch({type:actionTypes.REMOVE_INGREDIENT,ingredientName:ingName})
    }
}

export default connect(mapStateToProps ,mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));