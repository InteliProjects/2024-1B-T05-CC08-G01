from src.services.lexico_service import LexicoService
from flask import Blueprint, request, Response, json, jsonify

"""
Classe que atua como controlador para a análise léxica de um código fonte.
Utiliza a classe LexicoService para realizar a análise léxica e retorna os tokens encontrados.
"""
class Lexico_Controller(Blueprint):

    """
    Inicializa o controlador Lexico_Controller com um nome e um import_name.
    Configura o roteamento para o método analise_lexica, que será acionado por requisições POST na raiz ("/").
    """
    def __init__(self, name, import_name):
        super().__init__(name, import_name)

        self.route("/", methods=["POST"])(self.analise_lexica)

    """
    Método responsável por analisar o código fonte recebido na requisição POST.
    Extrai o código fonte do corpo da requisição, cria uma instância de LexicoService com o código,
    obtém os tokens através do método get_tokens() e retorna esses tokens como uma resposta JSON.
    """
    def analise_lexica(self):
        content = request.json
        lexico_service = LexicoService(content['codigo'])
        print("Tokens: ", lexico_service.get_tokens())
        
        return jsonify(lexico_service.get_tokens())
    
lexico_blueprint = Lexico_Controller("lexico", __name__)
