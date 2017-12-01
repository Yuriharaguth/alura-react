import React, { Component } from 'react';
import Pubsub from 'pubsub-js';

export default class InputCustomizado extends Component{

    constructor() {
        super();
        this.state = {msgErro : ''};
    }

    componentDidMount() {
        Pubsub.subscribe("erro-validacao", function(topico,erro) {
            if (erro.field === this.props.name ){
                this.setState({megErro:erro.defaultMessage})
            }
        }.bind(this));

        Pubsub.subscribe("elimpa-erros", function(topico,objetoVazio) {
            this.setState({megErro:''});
        }.bind(this));
    }

    render() {
        return (
            <div className="pure-control-group">
              <label htmlFor={this.props.id}>{this.props.label}</label> 
              <input id={this.props.id} 
                type={this.props.type} 
                name={this.props.name} 
                value={this.props.value}  
                onChange={this.props.onChange}/>          
                <span className="error">{this.state.msgErro}</span>        
            </div>            
        );
    }
}