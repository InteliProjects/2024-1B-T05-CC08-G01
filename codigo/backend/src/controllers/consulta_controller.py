from flask import Blueprint, request, Response, json
from src.services.consulta_service import Consulta_Service

class Consulta_Controller(Blueprint):

    def __init__(self, name, import_name):
        super().__init__(name, import_name)
        #rotas para chamar os metodos abaixo, lembrando que tem que colocar antes /api/{nome_da_tabela}, exemplo: /api/consultas
        self.route("/", methods=["GET"])(self.get_all_consultas)
        self.route("/<string(36):consulta_id>", methods=["GET"])(self.get_consulta_by_id)
        self.route("/paciente/<string(36):paciente_id>", methods=["GET"])(self.get_consulta_by_id_paciente)
        self.route("/", methods=["POST"])(self.create_consulta)
        self.route("/<string(36):consulta_id>", methods=["PUT"])(self.update_consultas)
        self.route("/<string(36):consulta_id>", methods=["DELETE"])(self.delete_consulta)

    # Método para retornar todas as consultas
    def get_all_consultas(self):
        response_data, status_code = Consulta_Service.get_all_consultas()
        return Response(
            json.dumps(response_data),
            status=status_code,
            mimetype="application/json"
        )

    # Método para retornar todas as consultas pelo id
    def get_consulta_by_id(self, consulta_id):
        response_data, status_code = Consulta_Service.get_consulta_by_id(consulta_id)
        return Response(
            json.dumps(response_data),
            status=status_code,
            mimetype="application/json"
        )
    
    # Método para retornar todas as consultas pelo id do paciente
    def get_consulta_by_id_paciente(self, paciente_id):
        response_data, status_code = Consulta_Service.get_consultas_by_id_paciente(paciente_id)
        return Response(
            json.dumps(response_data),
            status=status_code, 
            mimetype="application/json"
        )
    
    # Método para criar uma nova consulta
    def create_consulta(self):
        request_data = request.json
        response_data, status_code = Consulta_Service.create_consulta(request_data)
        return Response(
        response=json.dumps(response_data),
        status=status_code,
        mimetype="application/json"
        )
    
    # Método para atualizar uma consulta
    def update_consultas(self, consulta_id):
        request_data = request.json
        response_data, status_code = Consulta_Service.update_consulta(consulta_id, request_data)
        return Response(
        response=json.dumps(response_data),
        status=status_code,
        mimetype="application/json"
        )
    
    # Método para deletar uma consulta
    def delete_consulta(self, consulta_id):
        response_data, status_code = Consulta_Service.delete_consulta(consulta_id)
        return Response(
            response=json.dumps(response_data),
            status=status_code,
            mimetype="application/json"
        )

# Blueprint para chamar os métodos do controller
consultas_blueprint = Consulta_Controller("consultas", __name__)
