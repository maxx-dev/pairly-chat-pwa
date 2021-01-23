import ReactDOM from "react-dom";
import React, {Component} from "react";
const Product = props => {
    const plus = () => {
        // Call props.onVote to increase the vote count for this product
        props.onVote('+',props.index);
    };
    const minus = () => {
        // Call props.onVote to decrease the vote count for this product
        props.onVote('-',props.index);
    };
    return (
        <li>
            <span>{props.product.name}</span> - <span>votes: {props.product.votes}</span>
            <button onClick={plus}>+</button>
            <button onClick={minus}>-</button>
        </li>
    );
};

const GroceryApp = (props) => {
    let [products, setProducts] = React.useState(props.products);
    const onVote = (dir, index) => {
        console.log('onVote',dir,index);
        if (dir === '+')
        {
            products[index].votes++;
            setProducts([...products]);
        }
        if (dir === '-')
        {
            products[index].votes--;
            setProducts([...products]);
        }
    };

    let productsSorted = products.sort( (a,b) => {
        return b.votes - a.votes
    });
    return (
        <ul>
            {/* Render an array of products, which should call onVote when + or - is clicked */}
            {productsSorted.map( (product, index) => {
                return <Product key={index} product={product} index={index} onVote={onVote}></Product>
            }) }
        </ul>
    );
}

document.body.innerHTML = "<div id='root'></div>";

ReactDOM.render(<GroceryApp
    products={[
        { name: "Oranges", votes: 0 },
        { name: "Bananas", votes: 0 }
    ]}
/>, document.getElementById('root'));

let plusButton = document.querySelector("ul > li > button");
if(plusButton) {
    plusButton.click();
}
console.log(document.getElementById('root').outerHTML)