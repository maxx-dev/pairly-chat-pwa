import React, { Component } from 'react';
import SVGIcons from "../SVGIcons";

export default class Options extends Component {

    constructor(props){
        super();
        this.state = {
        };
        this.root = React.createRef();
    }

    componentDidMount()
    {
        window.helper.forceReflow(this.root.current);
        this.root.current.style.transform = 'translate3d(0,-60px,0)';
    }


    onClickOption (option)
    {
        if (this.props.onChooseOption) this.props.onChooseOption(option);
    }

    onFileChange (e)
    {
        //console.log('onFileChange',e);
         if (this.props.onFileChange) this.props.onFileChange(e)
    }

    renderOption (option)
    {
        return  <div onClick={this.onClickOption.bind(this,option)} key={option.key} className="option">
            {/*<div className="icon">
                <SVGIcons type={option.icon}/>
            </div>*/}
            <div className="title">{option.title}</div>
            {option.key === 'DOCUMENT' ? <input onChange={this.onFileChange.bind(this)} type="file" multiple/> : false}
        </div>
    }

    render() {
        const { options } = this.props;
        return <div ref={this.root} className="options">
                {options.map(this.renderOption.bind(this))}
            {/*<div className="option">
                    <div className="title">Abort</div>
                </div>*/}
            </div>

    };
}
