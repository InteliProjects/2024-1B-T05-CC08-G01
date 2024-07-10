from flask import Blueprint, request, Response, json
from src.services.consulta_tratamento_service import Consulta_Tratamento_Service

class Consulta_Tratamento_Controller(Blueprint):
    #rotas para chamar os metodos abaixo, lembrando que tem que colocar antes /api/{nome_da_tabela}, exemplo: /api/consulta_tratamento
    def __init__(self, name, import_name):
        super().__init__(name, import_name)
        self.route("/", methods=["POST"])(self.create_consulta_tratamento)
        self.route("/<string(36):consulta_tratamento_id>", methods=["PUT"])(self.update_consulta_tratamento)
        self.route("/<string(36):consulta_tratamento_id>", methods=["DELETE"])(self.delete_consulta_tratamento)
    
    # Método para criar uma nova consulta_tratamento
    def create_consulta_tratamento(self):
        request_data = request.json
        response_data, status_code = Consulta_Tratamento_Service.create_consulta_tratamento(request_data)
        return Response(
        response=json.dumps(str(response_data)),
        status=status_code,
        mimetype="application/json"
        )
    
    # Método para atualizar uma consulta_tratamento
    def update_consulta_tratamento(self, consulta_tratamento_id):
        request_data = request.json
        response_data, status_code = Consulta_Tratamento_Service.update_consulta_tratamento(consulta_tratamento_id, request_data)
        # print("oieee ----->",response_data["data"])
        return Response(
        response=json.dumps(response_data),
        status=status_code,
        mimetype="application/json"
        )

    
    # Método para deletar uma consulta_tratamento
    def delete_consulta_tratamento(self, consulta_tratamento_id):
        response_data, status_code = Consulta_Tratamento_Service.delete_consulta_tratamento(consulta_tratamento_id)
        return Response(
            response=json.dumps(response_data),
            status=status_code,
            mimetype="application/json"
        )

#blueprint para ser chamado no app.py
consultas_tratamento_blueprint = Consulta_Tratamento_Controller("Consulta_Tratamento", __name__)
