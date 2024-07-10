from datetime import datetime  # Adicionando importação do datetime

from src.models.consulta_model import Consulta as ConsultaModel
from src.models.paciente_model import Paciente as PacienteModel
from src.models.consulta_tratamento_model import Consulta_Tratamento as ConsultaTratamentoModel
from flask import json, jsonify
from src.utils import Logging
from src import db

logger = Logging()

class Consulta_Service:

    # Método para retornar todas as consultas
    @staticmethod
    def get_all_consultas():
        try:
            consultas = ConsultaModel.query.all()
            logger.log_info("Consultas encontradas com sucesso")
            if consultas:
                consultas_list = [consulta.to_json() for consulta in consultas]
                return {"status": "success", "data": consultas_list}, 200
            else:
                return {"status": "failed", "message": "consulta not found"}, 404
        except Exception as e:
            return {"status": "failed", "message": "An error occurred", "error": str(e)}, 500

    # Método para retornar todas as consultas pelo id
    @staticmethod
    def get_consulta_by_id(consulta_id):
        try:
            consulta = ConsultaModel.query.filter_by(consulta_id=consulta_id).first()
            logger.log_info(f"Consulta encontrada com o id {consulta_id}: {consulta}")
            if consulta:
                return {"status": "success", "data": consulta.to_json()}, 200
            else:
                return {"status": "failed", "message": "consulta not found"}, 404
        except Exception as e:
            return {"status": "failed", "message": "An error occurred", "error": str(e)}, 500

    # função para formatar os dados da consulta para fazer o join
    @staticmethod
    def formatar_consulta(consulta):
        consulta_dict = {
            "relatorio": consulta[0].relatorio,
            "data_consulta": consulta[0].data_consulta.strftime("%d/%m/%Y"),  # Alterando para formato brasileiro
            "paciente_id": consulta[1].paciente_id,
            "status": consulta[1].status,
            "idade": consulta[1].idade,
            "nome": consulta[1].nome,
            "ultima_consulta": consulta[1].ultima_consulta.strftime("%d/%m/%Y") if consulta[1].ultima_consulta else None,  # Alterando para formato brasileiro
            "consulta_tratamento_id": consulta[2].consulta_tratamento_id,
            "nome_projeto": consulta[2].nome_projeto,
            "codigo_fonte": consulta[2].codigo_fonte,
            "consulta_id": consulta[2].consulta_id,
            "status_compilador": consulta[2].status_compilador,
            "tipo_projeto": consulta[2].tipo_projeto
        }
        return consulta_dict

    # Método para retornar todas as consultas pelo id do paciente fazendo join das 3 tabelas
    @staticmethod
    def get_consultas_by_id_paciente(paciente_id):
        try:
            consultas = db.session.query(ConsultaModel, PacienteModel, ConsultaTratamentoModel).\
                filter(PacienteModel.paciente_id == paciente_id).\
                join(PacienteModel, ConsultaModel.paciente_id == PacienteModel.paciente_id).\
                join(ConsultaTratamentoModel, ConsultaModel.consulta_id == ConsultaTratamentoModel.consulta_id).\
                all()
            logger.log_info(f"Consultas encontradas com o id do paciente {paciente_id}")
            if (consultas):
                consultas_formatadas = [Consulta_Service.formatar_consulta(consulta) for consulta in consultas]
                return {"status": "success", "data": consultas_formatadas}, 200
            else:
                return {"status": "failed", "message": "consulta not found"}, 404
        except Exception as e:
            return {"status": "failed", "message": "An error occurred", "error": str(e)}, 500

    # Método para criar uma nova consulta
    @staticmethod
    def create_consulta(consulta_data):
        try:
            new_consulta = ConsultaModel(
                paciente_id=consulta_data["paciente_id"],
                relatorio=consulta_data["relatorio"],
                data_consulta=datetime.strptime(consulta_data["data_consulta"], "%d/%m/%Y")  # Corrigindo uso do datetime
            )
            new_consulta.save()
            logger.log_info(f"Consulta criada com sucesso: {new_consulta}")
            return {"status": "success", "data": new_consulta.to_json()}, 201
        except Exception as e:
            return {"status": "failed", "message": "An error occurred", "error": str(e)}, 500

    # Método para atualizar uma consulta
    @staticmethod
    def update_consulta(consulta_id, consulta_data):
        try:
            consulta = ConsultaModel.query.filter_by(consulta_id=consulta_id).first()
            if consulta:
                consulta.update(
                    relatorio=consulta_data["relatorio"],
                    data_consulta=datetime.strptime(consulta_data["data_consulta"], "%d/%m/%Y")  # Corrigindo uso do datetime
                )
                logger.log_info(f"Consulta atualizada com sucesso: {consulta}")
                return {"status": "success", "data": consulta.to_json()}, 200
            else:
                return {"status": "failed", "message": "consulta not found"}, 404
        except Exception as e:
            return {"status": "failed", "message": "An error occurred", "error": str(e)}, 500

    # Método para deletar uma consulta
    @staticmethod
    def delete_consulta(consulta_id):
        try:
            consulta = ConsultaModel.query.filter_by(consulta_id=consulta_id).first()
            if consulta:
                consulta.delete()
                logger.log_info(f"Consulta deletada com sucesso: {consulta}")
                return {"status": "success", "data": consulta.to_json()}, 200
            else:
                return {"status": "failed", "message": "consulta not found"}, 404
        except Exception as e:
            return {"status": "failed", "message": "An error occurred", "error": str(e)}, 500
