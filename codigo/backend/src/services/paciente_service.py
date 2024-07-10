import os
from src.models.paciente_model import Paciente as PacienteModel
from src.utils import Logging

logger = Logging()

class Paciente_Service:

    # Método para retornar todas os pacientes
    @staticmethod
    def get_all_pacientes():
        try:
            pacientes = PacienteModel.query.all()
            logger.log_info("Pacientes encontrados com sucesso")
            if pacientes:
                pacientes_list = []
                for paciente in pacientes:
                    paciente_data = {
                        "id": paciente.paciente_id,
                        "nome": paciente.nome,
                        "status": paciente.status,
                        "idade": paciente.idade,
                        "terapeuta": paciente.terapeuta,
                        "registro": paciente.registro,
                        "responsavel": paciente.responsavel,
                        "telefone": paciente.telefone,
                        "ultima_consulta": paciente.ultima_consulta
                    }
                    pacientes_list.append(paciente_data)
                return {"status": "success", "data": pacientes_list}, 200
            else:
                    # If paciente does not exist
                    return {"status": "failed", "message": "paciente not found"}, 404
        except Exception as e:
            return {"status": "failed", "message": "An error occurred", "error": str(e)}, 500
    
    # Método para retornar todas os pacientes pelo id
    @staticmethod
    def get_pacientes_by_id(paciente_id):
        try:
            # Get paciente from the database
            paciente = PacienteModel.query.filter_by(paciente_id=paciente_id).first()
            
            logger.log_info(f"paciente encontrado com o id {paciente_id}: {paciente}")
            
            # If paciente exists
            if paciente:
                paciente_data = {
                    "paciente_id": paciente.paciente_id,
                    "nome": paciente.nome,
                    "status": paciente.status,
                    "idade": paciente.idade,
                    "terapeuta": paciente.terapeuta,
                    "registro": paciente.registro,
                    "responsavel": paciente.responsavel,
                    "telefone": paciente.telefone,
                    "ultima_consulta": paciente.ultima_consulta

                }
                return {"status": "success", "data": paciente_data}, 200
            else:
                # If paciente does not exist
                return {"status": "failed", "message": "paciente not found"}, 404
        except Exception as e:
            return {"status": "failed", "message": "An error occurred", "error": str(e)}, 500
        
    # Método para criar um novo paciente
    @staticmethod
    def create_paciente(paciente_data):
        try:            
            new_paciente = PacienteModel(
                nome=paciente_data["nome"],
                status=paciente_data["status"],
                idade=paciente_data["idade"],
                terapeuta=paciente_data["terapeuta"],
                registro=paciente_data["registro"],
                responsavel=paciente_data["responsavel"],
                telefone=paciente_data["telefone"],
                ultima_consulta=paciente_data["ultima_consulta"] if "ultima_consulta" in paciente_data else None
            )

            new_paciente.save()
            
            logger.log_info(f"paciente criado com sucesso: {new_paciente}")
            
            return {"status": "success", "message": "paciente created successfully", "data": paciente_data}, 201
        except Exception as e:
            return {"status": "failed", "message": "An error occurred", "error": str(e)}, 500
    
    # Método para atualizar todas os pacientes
    @staticmethod
    def update_paciente(paciente_id, paciente_data):
        try:
            paciente = PacienteModel.query.filter_by(paciente_id=paciente_id).first()

            logger.log_info(f"paciente encontrado com o id {paciente_id}: {paciente}")
            logger.log_info(f"paciente encontrado com o id {paciente_id}: atualização: {paciente_data}")
        
            if paciente:
                updated_paciente_data = {
                    "paciente_id": paciente.paciente_id,
                    "nome": paciente_data["nome"],
                    "status": paciente_data["status"],
                    "idade": paciente_data["idade"],
                    "terapeuta": paciente_data["terapeuta"],
                    "registro": paciente_data["registro"],
                    "responsavel": paciente_data["responsavel"],
                    "telefone": paciente_data["telefone"],
                    "ultima_consulta": paciente_data["ultima_consulta"]
                }
                paciente.update(
                    nome=updated_paciente_data.get("nome"),
                    status=updated_paciente_data.get("status"),
                    idade=updated_paciente_data.get("idade"),
                    terapeuta=updated_paciente_data.get("terapeuta"),
                    registro=updated_paciente_data.get("registro"),
                    responsavel=updated_paciente_data.get("responsavel"),
                    telefone=updated_paciente_data.get("telefone")
                )
                
                return {"status": "success", "message": "paciente updated successfully", "data": updated_paciente_data}, 200
            else:
                # If paciente does not exist
                return {"status": "failed", "message": "paciente not found"}, 404
        except Exception as e:
            return {"status": "failed", "message": "An error occurred", "error": str(e)}, 500
    
    # Método para deletar todas os pacientes
    @staticmethod
    def delete_paciente(paciente_id):
        try:
            paciente = PacienteModel.query.filter_by(paciente_id=paciente_id).first()

            logger.log_info(f"paciente com o id {paciente_id}: {paciente} foi deletado")

            if paciente:
                paciente.delete()
                return {"status": "success", "message": "paciente deleted successfully"}, 200
            else:
                return {"status": "failed", "message": "paciente not found"}, 404
        except Exception as e:
            return {"status": "failed", "message": "An error occurred", "error": str(e)}, 500
