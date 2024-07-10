from datetime import datetime  # Adicionando importação do datetime

from src.models.consulta_tratamento_model import Consulta_Tratamento as ConsultaTratamentoModel
# from src.services.lexico_service import LexicoService
from src.services.gerador_service import GeradorService
from src.utils import Logging
from src import db

logger = Logging()

class Consulta_Tratamento_Service:
        
    # Método para retornar todas as consultas_tratamento
    @staticmethod
    def create_consulta_tratamento(consulta_data):
        try:
            print("consulta_data[codigo_fonte]")
            print(consulta_data["codigo_fonte"])              
            new_consulta = ConsultaTratamentoModel(
                consulta_id=consulta_data["consulta_id"],
                nome_projeto=consulta_data["nome_projeto"],
                codigo_fonte=consulta_data["codigo_fonte"],
                status_compilador="Aguardando codigo", #TODO
                tipo_projeto=consulta_data["tipo_projeto"]
            )
            new_consulta.save()
        
            logger.log_info(f"Consulta_tratamento criada com sucesso: {new_consulta}")
            return {"status": "success", "data": new_consulta.to_json()}, 200
         
        except Exception as e:

            return {"status": "failed", "message": "An error occurred", "error": str(e)}, 500
   
    # Método para atualizar todas as consultas_tratamento
        """_summary_

        Returns:
            _type_: _description_
        """
    @staticmethod
    def update_consulta_tratamento(consulta_tratamento_id, consulta_tratamento_data):
        try:
            consulta_tratamento = ConsultaTratamentoModel.query.filter_by(consulta_tratamento_id=consulta_tratamento_id).first()

            if consulta_tratamento:
                try:
                    arvore_sintatica=GeradorService(consulta_tratamento_data["codigo_fonte"]).gerarJS()
                    consulta_tratamento.update(
                        nome_projeto=consulta_tratamento_data["nome_projeto"],
                        codigo_fonte=consulta_tratamento_data["codigo_fonte"],
                        status_compilador="sucesso",
                        tipo_projeto=consulta_tratamento_data["tipo_projeto"],
                    )
                    logger.log_info(f"Consulta_tratamento atualizada com sucesso: {consulta_tratamento}")
                    return {"status": "success", "data": arvore_sintatica}, 200
                        
                    #Caso aconteça algum erro nos analisadores entra no Exception e retorna uma mensagem de acordo o erro
                except Exception as e:
                    contexto  = e.details
                    status = int(contexto["status"])
                    consulta_tratamento.update(
                            nome_projeto=consulta_tratamento_data["nome_projeto"],
                            codigo_fonte=consulta_tratamento_data["codigo_fonte"],
                            status_compilador="falha",
                            tipo_projeto=consulta_tratamento_data["tipo_projeto"],
                        )
                    # Se o erro for lexico entra no erro 501 dizendo a linha e o simbolo nao identificado
                    if status == 501:
                        carac = contexto["carac"]
                        linha = contexto["linha"]
                        logger.log_info(f"Consulta_tratamento criada com sucesso: {consulta_tratamento}, Erro Compilador: Simbolo '{carac}' encontrado na linha {linha} não pertence a linguagem.")
                        return {"status": "success", "data": {"simbolo":carac,"linha":linha,"status":status,"msn":f"Simbolo '{carac}' encontrado na linha {linha} não pertence a linguagem."}}, 201
                    # Se o erro for sintatico entra no erro 503 e pode retornar 2 tipos de erros diferentes 
                    if status == 502:
                        print("chegouuuuutype502")
                        type = contexto["type"]
                        valor = contexto["valor"]
                        tipo = contexto["tipo"]
                        linha = contexto["linha"]
                        if type == 0:

                            esperado = contexto["esperado"]
                            print({"tipo":tipo,"valor":valor,"esperado":esperado,"linha":linha,"status":status})
                            return {"status": "success", "data": {"msn":f"tipo : ({tipo} {valor}), valor esperado : {esperado}, linha : {linha}","status":status}}, 202
                        else:
                            return {"status": "success", "data": {"msn":f"tipo : ({tipo} {valor}), linha : {linha}","status":status}}, 202
                    # Caso for do tipo semantico entra no erro 503 e pode retornar 8 tipos de erros diferentes
                    if status == 503:
                        variavel = contexto["variavel"]
                        linha = contexto["linha"]
                        type = contexto["type"]
                        print(variavel,linha,type)
                        match(type):
                            case 1:
                                logger.log_info(f"Consulta_tratamento criada com sucesso: {consulta_tratamento}, O identificador {variavel} na linha {linha} já foi declarado")
                                print(variavel,linha,status,variavel,linha,1)
                                return {"status": "success", "data": {"variavel":{variavel},"linha":linha,"status":status,"msn":f"O identificador {variavel} na linha {linha} já foi declarado"}}, 203
                            case 2:
                                logger.log_info(f"Consulta_tratamento criada com sucesso: {consulta_tratamento}, O identificador {variavel} na linha {linha} não foi declarado")
                                print(variavel,linha,status,variavel,linha,2)
                                return {"status": "success", "data": {"variavel":{variavel},"linha":linha,"status":status,"msn":f"O identificador {variavel} na linha {linha} não foi declarado"}}, 203
                            case 3:
                                logger.log_info(f"Consulta_tratamento criada com sucesso: {consulta_tratamento}, Tipos incompatíveis: {variavel[0]} e {variavel[1]}")
                                print(variavel[0],variavel[1],variavel,linha,status,3)
                                return {"status": "success", "data": {"variavel":None,"linha":linha,"status":status,"msn":f"Tipos incompatíveis: {variavel[0]} e {variavel[1]}"}}, 203
                            case 4:
                                logger.log_info(f"Consulta_tratamento criada com sucesso: {consulta_tratamento}, Divisão por zero na linha {linha}.")
                                print(variavel,linha,status,variavel,linha,4)
                                return {"status": "success", "data": {"variavel":None,"linha":linha,"status":status,"msn":f"Divisão por zero na linha {linha}."}}, 203
                            case 5:
                                logger.log_info(f"Consulta_tratamento criada com sucesso: {consulta_tratamento}, O identificador {variavel} na linha {linha} não foi inicializado.")
                                print(variavel,linha,status,variavel,linha,5)
                                return {"status": "success", "data": {"variavel":{variavel},"linha":linha,"status":status,"msn":f"O identificador {variavel} na linha {linha} não foi inicializado."}}, 203
                            case 6:
                                logger.log_info(f"Consulta_tratamento criada com sucesso: {consulta_tratamento}, Expoente negativo na linha {linha}.")
                                print(variavel,linha,status,variavel,linha,6)
                                return {"status": "success", "data": {"variavel":None,"linha":linha,"status":status,"msn":f"Expoente negativo na linha {linha}."}}, 203
                            case 7:
                                logger.log_info(f"Consulta_tratamento criada com sucesso: {consulta_tratamento}, Tipos incompatíveis: {variavel[0]} e {variavel[1]}")
                                print(variavel,linha,status,variavel,linha,7)
                                return {"status": "success", "data": {"variavel":{variavel},"linha":linha,"status":status,"msn":f"Tipos incompatíveis: {variavel[0]} e {variavel[1]}"}}, 203
                            case 8:
                                logger.log_info(f"Consulta_tratamento criada com sucesso: {consulta_tratamento}, O tipo deveria ser uma string: {variavel}")
                                print(variavel,linha,status,variavel,linha,8)
                                return {"status": "success", "data": {"variavel":{variavel},"linha":None,"status":status,"msn":f"O tipo deveria ser uma string: {variavel}"}}, 203
            else:
                return {"status": "failed", "message": "consulta_tratamento not found"}, 404
        except Exception as e:
            return {"status": "failed", "message": "An error occurred", "error": str(e)}, 500
        
    # Metodo para Deletar  as consultas_tratamento pelo id
    @staticmethod
    def delete_consulta_tratamento(consulta_tratamento_id):
        try:
            consulta_tratamento = ConsultaTratamentoModel.query.filter_by(consulta_tratamento_id=consulta_tratamento_id).first()
            if consulta_tratamento:
                consulta_tratamento.delete()
                logger.log_info(f"Consulta_tratamento deletada com sucesso: {consulta_tratamento}")
                return {"status": "success", "data": consulta_tratamento.to_json()}, 200
            else:
                return {"status": "failed", "message": "consulta_tratamento not found"}, 404
        except Exception as e:
            return {"status": "failed", "message": "An error occurred", "error": str(e)}, 500
