from flask import Blueprint, request, Response, json
from src.services.paciente_service import Paciente_Service

class Paciente_Controller(Blueprint):

    def __init__(self, name, import_name):
        super().__init__(name, import_name)

        #rotas para chamar os metodos abaixo, lembrando que tem que colocar antes /api/{nome_da_tabela}, exemplo: /api/pacientes
        self.route("/", methods=["GET"])(self.get_all_pacientes)
        self.route("<string(36):paciente_id>", methods=["GET"])(self.get_paciente_by_id)
        self.route("/", methods=["POST"])(self.create_paciente)
        self.route("/<string(36):paciente_id>", methods=["PUT"])(self.update_paciente)
        self.route("/<string(36):paciente_id>", methods=["DELETE"])(self.delete_paciente)

    # Método para retornar todas os pacientes
    def get_all_pacientes(self):
        response_data, status_code = Paciente_Service.get_all_pacientes()
        return Response(
            json.dumps(response_data),
            status=status_code,
            mimetype="application/json"
        )

    # Método para retornar todas os pacientes pelo id
    def get_paciente_by_id(self, paciente_id):
        response_data, status_code = Paciente_Service.get_pacientes_by_id(paciente_id)
        return Response(
            json.dumps(response_data),
            status=status_code,
            mimetype="application/json"
        )
    
    # Método para criar um novo paciente
    def create_paciente(self):
        request_data = request.json
        response_data, status_code = Paciente_Service.create_paciente(request_data)
        return Response(
        response=json.dumps(response_data),
        status=status_code,
        mimetype="application/json"
        )
    
    # Método para atualizar um paciente
    def update_paciente(self, paciente_id):
        request_data = request.json
        response_data, status_code = Paciente_Service.update_paciente(paciente_id, request_data)
        return Response(
        response=json.dumps(response_data),
        status=status_code,
        mimetype="application/json"
        )
    
    # Método para deletar um paciente
    def delete_paciente(self, paciente_id):
        response_data, status_code = Paciente_Service.delete_paciente(paciente_id)
        return Response(
            response=json.dumps(response_data),
            status=status_code,
            mimetype="application/json"
        )

# Blueprint para chamar os métodos do controller
pacientes_blueprint = Paciente_Controller("pacientes", __name__)
