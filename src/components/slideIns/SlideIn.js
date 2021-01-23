import React, { Component } from 'react';
import SVGIcons from "../../SVGIcons";

export default class SlideIn extends Component {

    constructor(props){
        super();
        this.state = {
            key:'ROOT',
            steps:[]
        };

        this.root = React.createRef();
    }

    goBack ()
    {
        this.root.current.addEventListener('transitionend',() => {
            this.props.onClose();
        });
        this.root.current.style.transform = 'translate3d(0,0,0)';
    }

    componentDidMount()
    {
        if (this.root.current)
        {
            let width = this.root.current.getBoundingClientRect().width;
            //console.log('width',width);
            if (this.props.noAnimation) return;
            if (this.props.side === 'right')
            {
                width = width * -1;
            }
            this.root.current.style.transform = 'translate3d('+width+'px,0,0)';
        }
    }

    renderHeader (title)
    {
        return <header><div data-noselect="1" className="headline">
            <div onClick={this.goBack.bind(this)} className="icon">
                <SVGIcons type={"ARROW_RIGHT"}/>
            </div>
            <div className="text">{title}</div>
        </div>

        </header>
    }

    renderStep (key)
    {
        const { depth,steps } = this.state;

        if (key === 'TEST')
        {
            return <div key={key} data-depth="2" className="depthWrapper">
                {this.renderHeader('Blub')}
                <div className="content">
                    {this.renderItem('PUSH','Test 1')}
                    {this.renderItem('PUSH','Test 2')}
                </div>
            </div>
        }
    }

    renderItem (key,text)
    {
        return <div onClick={this.onChangeSetting.bind(this,key)} className="item">
            <div className="icon">
                <SVGIcons type={key}/>
            </div>
            <div className="text">{text}</div>
        </div>
    }

    onChangeSetting (key)
    {
        const { steps } = this.state;
       // steps.push(key);
       this.setState({key,steps:steps});
    }

    render() {
        const { steps } = this.state;
        return false;
    };
}
