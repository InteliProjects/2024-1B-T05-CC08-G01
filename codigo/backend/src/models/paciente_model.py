from sqlalchemy import Column, String, Integer, Date, UUID
from sqlalchemy.ext.declarative import declarative_base
import uuid
from src import db

class Paciente(db.Model):
    __tablename__ = 'Paciente'

    paciente_id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()), unique=True, nullable=False)
    nome = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(15), nullable=False)
    idade = db.Column(db.Integer, nullable=False)
    terapeuta = db.Column(db.String(50), nullable=False)
    registro = db.Column(db.String(7), nullable=False)
    responsavel = db.Column(db.String(50), nullable=False)
    telefone = db.Column(db.String(17), nullable=False)
    
    consultas = db.relationship('Consulta', backref='Paciente', cascade='all, delete-orphan')
    ultima_consulta = db.Column(db.Date)

    def __init__ (self, nome, status, idade, terapeuta, registro, responsavel,telefone,ultima_consulta):
        self.nome = nome
        self.status = status
        self.idade = idade
        self.terapeuta = terapeuta
        self.registro = registro
        self.responsavel = responsavel
        self.telefone = telefone
        self.ultima_consulta = ultima_consulta
  
    def __repr__(self):
        return f"id: {self.paciente_id}, status: {self.status}, idade: {self.idade}, terapeuta: {self.terapeuta}, registro: {self.registro}, responsavel: {self.responsavel}, telefone: {self.telefone}, nome: {self.nome}, ultima_consulta: {self.ultima_consulta}"

    def save(self):
        """
        Salva o objeto no banco de dados
        """
        db.session.add(self)
        db.session.commit()
    
    def update(self, paciente_id=None, nome=None, status=None, idade=None, terapeuta=None, registro=None, responsavel=None, telefone=None, ultima_consulta=None):
        """
        Atualiza o objeto no banco de dados
        """
        if paciente_id is not None:
            self.paciente_id = paciente_id
        if nome is not None:
            self.nome = nome
        if status is not None:
            self.status = status
        if idade is not None:
            self.idade = idade
        if terapeuta is not None:
            self.terapeuta = terapeuta
        if registro is not None:
            self.registro = registro
        if responsavel is not None:
            self.responsavel = responsavel
        if telefone is not None:
            self.telefone = telefone
        if ultima_consulta is not None:
            self.ultima_consulta = ultima_consulta
        db.session.commit()
    
    def delete(self):
        """
        Deleta o objeto do banco de dados
        """
        db.session.delete(self)
        db.session.commit()
