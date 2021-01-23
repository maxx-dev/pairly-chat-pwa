import React, { useState, useEffect } from 'react'; // no imports allowed in testdome?
import ReactDOM from "react-dom";
const List = (props) => {

    const [items,setItems] = useState(props.items); // hooks not working in Testdome???
    let onClick = (clickedItem) => {
        console.log('onClick',clickedItem);
        let itemsFiltered = items.filter(item => item !== clickedItem);
        itemsFiltered.unshift(clickedItem);
        setItems([...itemsFiltered])
    };
    return items.map( (item,index) => {

        return <li onClick={onClick.bind(this,item,index)} key={index}>{item}</li>
    });
}

document.body.innerHTML = "<div id='root'> </div>";

const rootElement = document.getElementById("root");
ReactDOM.render(<List items={["A", "B", "C"]} />, rootElement);

let listItem = document.querySelectorAll("li")[1];
if(listItem) {
    listItem.click();
}
setTimeout(() => console.log(document.getElementById("root").innerHTML));