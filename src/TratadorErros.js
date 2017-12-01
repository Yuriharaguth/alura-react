import Pubsub from 'pubsub-js';

export default class TratadorErros {
    publicaErros(erros) {
        for(var i=0;i<erros.error.length;i++){
            var erro = erros.errors[1];
            Pubsub.publish("erro-validacao", erro);
        }
    }
}