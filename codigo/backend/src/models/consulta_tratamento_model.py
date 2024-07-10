from sqlalchemy import Column, String, Integer, Date, TEXT, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from src import db
import uuid
from datetime import datetime

class Consulta_Tratamento(db.Model):
    __tablename__ = 'Consulta_Tratamento'

    consulta_tratamento_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), unique=True, nullable=False)
    consulta_id = Column(String(36), ForeignKey('Consulta.consulta_id'), nullable=False)
    nome_projeto = Column(TEXT, nullable=False)
    codigo_fonte = Column(TEXT, nullable=False)
    status_compilador = Column(String(20), nullable=False)
    tipo_projeto = Column(String(30), nullable=False)

    paciente = db.relationship("Consulta", backref="Consulta_Tratamento")

    def __init__ (self, consulta_id, nome_projeto, codigo_fonte, status_compilador, tipo_projeto):
        self.consulta_id = consulta_id
        self.nome_projeto = nome_projeto
        self.codigo_fonte = codigo_fonte
        self.status_compilador = status_compilador
        self.tipo_projeto = tipo_projeto
  
    def __repr__(self):
        return f" nome_projeto: {self.nome_projeto},codigo_fonte: {self.codigo_fonte}, consulta_id: {self.consulta_id}, status_compilador: {self.status_compilador}, tipo_projeto: {self.tipo_projeto}"

    def save(self):
        """
        Salva o objeto no banco de dados
        """
        db.session.add(self)
        db.session.commit()
    
    def update(self, consulta_id=None, nome_projeto=None, codigo_fonte=None, status_compilador=None, tipo_projeto=None):
        """
        Atualiza o objeto no banco de dados
        """
        if consulta_id is not None:
            self.consulta_id = consulta_id
        if nome_projeto is not None:
            self.nome_projeto = nome_projeto
        if codigo_fonte is not None:
            self.codigo_fonte = codigo_fonte
        if status_compilador is not None:
            self.status_compilador = status_compilador
        if tipo_projeto is not None:
            self.tipo_projeto = tipo_projeto
        
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
            "consulta_id": self.consulta_id,
            "nome_projeto": self.nome_projeto,
            "codigo_fonte": self.codigo_fonte,
            "status_codigo": self.status_compilador,
            "tipo_projeto": self.tipo_projeto
        }
