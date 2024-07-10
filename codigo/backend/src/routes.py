from flask import Blueprint
from src.controllers.consulta_controller import consultas_blueprint
from src.controllers.paciente_controller import pacientes_blueprint
from src.controllers.consulta_tratamento_controller import consultas_tratamento_blueprint
from src.controllers.lexico_controller import lexico_blueprint

from src import app

# Main blueprint to be registered in the app
api = Blueprint("api", __name__)


# Register the blueprints with the main API blueprint
api.register_blueprint(consultas_blueprint, url_prefix="/consultas")
api.register_blueprint(pacientes_blueprint, url_prefix="/pacientes")
api.register_blueprint(consultas_tratamento_blueprint, url_prefix="/consulta_tratamento")
api.register_blueprint(lexico_blueprint, url_prefix="/lexico")


