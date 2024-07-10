from sqlalchemy import Column, String, Integer, Date, TEXT, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from src import db
import uuid
from datetime import datetime

class Consulta(db.Model):
    __tablename__ = 'Consulta'

    consulta_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), unique=True, nullable=False)
    paciente_id = Column(String(36), ForeignKey('Paciente.paciente_id'), nullable=False)
    relatorio = Column(TEXT, nullable=False)
    data_consulta = Column(Date, nullable=False)

    consulta_tratamento = db.relationship('Consulta_Tratamento', cascade="all, delete")
    
    def __init__ (self, paciente_id, relatorio, data_consulta):
        self.paciente_id = paciente_id
        self.relatorio = relatorio
        self.data_consulta = data_consulta
  
    def __repr__(self):
        return f"relatorio: {self.relatorio}, data_consulta: {self.data_consulta}, paciente_id: {self.paciente_id}"

    def save(self):
        """
        Salva o objeto no banco de dados
        """
        db.session.add(self)
        db.session.commit()
    
    def update(self, paciente_id=None, relatorio=None, data_consulta=None):
        """
        Atualiza o objeto no banco de dados
        """
        if paciente_id is not None:
            self.paciente_id = paciente_id
        if relatorio is not None:
            self.relatorio = relatorio
        if data_consulta is not None:
            self.data_consulta = data_consulta
        
        db.session.commit()
    
    def delete(self):
        """
        Deleta o objeto do banco de dados
        """
        db.session.delete(self)
        db.session.commit()

    def to_json(self):
        return {
            "id": self.consulta_id,
            "paciente_id": self.paciente_id,
            "relatorio": self.relatorio,
            "data_consulta": self.data_consulta.strftime("%d/%m/%Y")  # Alterando para formato brasileiro
        }
