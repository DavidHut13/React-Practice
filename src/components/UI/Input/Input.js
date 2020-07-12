import React from 'react';
import classes from './Input.module.css';

const input = (props) => {
    let inputElement = null
    const inputClasses = [classes.InputElement]

    if (props.invalid && props.shouldValidate && props.touched) {
        inputClasses.push(classes.Invalid)
    }


    switch ( props.elementType) {
        case ('input'):
            inputElement = <input onChange={props.onChange} 
                className={inputClasses.join(' ')} 
                {...props.elementConfig} value={props.value} />;
            break;
        case ('textarea'):
            inputElement  = <textarea onChange={props.onChange} 
                className={classes.InputElement} 
                {...props.elementConfig} value={props.value} />;
            break;
        case ('select'):
            inputElement  = (
                <select onChange={props.onChange} 
                    className={classes.InputElement} 
                    value={props.value}>
                    {props.elementConfig.options.map(option => (
                            <option key={option.value} value={option.value}>{option.displayValue}</option>
                        ))}
                </select>
            );
            break;
        default: 
            inputElement  = <input onChange={props.onChange} 
                className={classes.InputElement} 
                {...props.elementConfig} value={props.value} />;
    }

    return (
        <div>
            <label className={classes.Label}>{props.label}</label>
            {inputElement}
        </div>
    );
} 

export default input;