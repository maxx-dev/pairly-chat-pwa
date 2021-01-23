import ReactDOM from "react-dom";
import React, {Component} from "react";
class ImageGallery extends React.Component {

    constructor(props) {
        super(props);
        this.state = {links:props.links}
    }

    onRemove(index)
    {
        this.state.links.splice(index,1);
        this.setState({links:this.state.links})
    }

    render ()
    {
       return <div>
            {this.state.links.map( (link,index) => {
                return <div key={"image"+index} className="image">
                    <img src={link}/>
                    <button onClick={this.onRemove.bind(this,index)} className="remove">X</button>
                </div>
            })}
        </div>;
    }
}

document.body.innerHTML = "<div id='root'> </div>";

const rootElement = document.getElementById("root");
const links = ["https://goo.gl/kjzfbE", "https://goo.gl/d2JncW"];
ReactDOM.render(<ImageGallery links={ links } />,
    rootElement);
document.querySelectorAll('.remove')[0].click();
console.log(rootElement.innerHTML);