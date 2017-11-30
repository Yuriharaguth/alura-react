import React, { Component } from 'react';
import $ from 'jquery';
import BotaoSubmitCustomizado from './components/BotaoSubmitCustomizado';
import ImputCustomizado from './components/InputCustomizado';
import Pubsub from 'pubsub-js';

class FormularioDoAutor extends Component {

    constructor() {
        super();
        this.state = { nome:'', email:'', senha:''};
        this.enviaForm = this.enviaForm.bind(this);
        this.setEmail = this.setEmail.bind(this);
        this.setName = this.setName.bind(this);
        this.setSenha = this.setSenha.bind(this);
    }

    enviaForm(evento) {
        evento.preventDefault();
        $.ajax({
          url:"https:cdc-react.herokuapp.com/api/autores",
          contentType:'application/json',
          dataType: 'json',
          type:'post',
          data: JSON.stringify({nome:this.state.nome,email:this.state.email,senha:this.state.senha}),
          success: function(novaListagem) {
            Pubsub.publish('atualiza-lista-autores',novaListagem);
          },
          error: function(resposta) {
            console.log("Error");
          }
        });
    }
    

      setSenha(evento) {
        this.setState({senha: evento.target.value})
      }
    
      setEmail(evento) {
        this.setState({email: evento.target.value})
      }
    
      setName(evento) {
        this.setState({nome: evento.target.value})
      }

    render() {
        return (
            <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="post">
                    <ImputCustomizado id="nome" type="text" name="nome" value={this.state.nome} 
                    onChange={this.setNome} label="Nome"/>                                              
                    <ImputCustomizado id="email" type="email" name="email" value={this.state.email} 
                    onChange={this.setEmail} label="Email"/>                                              
                    <ImputCustomizado id="senha" type="password" name="senha" value={this.state.senha}
                    onChange={this.setSenha} label="Senha"/> 

                    <BotaoSubmitCustomizado label="Gravar"/>
                </form>             
            </div>
        );
    }
}

class TabelaAutores extends Component {

    render() {
        return (
            <div>            
                <table className="pure-table">
                <thead>
                    <tr>
                    <th>Nome</th>
                    <th>email</th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.lista.map(function name(autor) {
                    return (
                        <tr key={autor.id}>
                        <td>{autor.nome}</td>
                        <td>{autor.email}</td>
                        </tr>
                    );
                    })}
                </tbody>
                </table> 
            </div>  
        )
    }

}

export default class AutorBox extends Component {

    constructor() {
        super();
        this.state = {lista :[]};
    }
    
    componentDidMount() {
        $.ajax({
          url:"https:cdc-react.herokuapp.com/api/autores",
          dataType: 'json',
          success: function(resposta) {
            this.setState({lista:resposta});
          }.bind(this)
        });

        Pubsub.subscribe('atualiza-lista-autores', function(topico, novaListagem) {
            this.setState({lista:novaLista});
        }.bind(this));
    }

    atualizaListagem(novaLista) {
        this.setState({lista:novaLista})
    }

    render() {
        return (
            <div className="content" id="content">
                <FormularioDoAutor />
                <TabelaAutores lista={this.state.lista}/>
            </div>
        );
    }
}
