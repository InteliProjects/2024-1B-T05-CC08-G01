# -*- coding: utf-8 -*-

"""
Este arquivo contém classes auxiliares fornecidas com a atividade.
NÃO altere o código abaixo.
"""

class LexicalException(Exception):
	"""
		Define uma classe (vazia) que representa um erro léxico.
		Herda da classe Exception.
	"""
	pass


class Token:
	"""
	Classe que representa um token.
	Por simplicidade, mantenha os atributos públicos.
	"""

	def __init__(self, tipo, valor, linha):
		self.tipo = tipo
		self.valor = valor
		self.linha = linha
	
	
	def __repr__(self):
		"""
		Método auxiliar que é chamado automaticamente quando desejamos converter
		um objeto token em string. Exemplo: print(token)
		"""
		return f"({self.tipo} {self.valor} {self.linha})"