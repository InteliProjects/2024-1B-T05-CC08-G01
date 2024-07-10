# -*- coding: utf-8 -*-

from src.services.lexico_service import LexicoService
from src.services.Token import NoInterno, NoFolha, SyntaxException, Token


class SintaticoService:

	def __init__(self, string):
		"""
		Inicializa os atributos da classe.

		"""
		tokens=LexicoService(str(string))   # atributo tokens: contém a lista de objetos do tipo Token;
		   # atributo tokens: contém a lista de objetos do tipo Token;
		listaTokens=tokens.get_tokens()
		self.token = None
		self.valor = None
		self.tokens = listaTokens   
		self.tokenCorrente = None 
		self.esperado_ = None 
		self.posicao = -1
		self.linha = 1
		self.proximoToken()


	def proximoToken(self):
		"""
		Avança o próximo token da lista de tokens.
		O token corrente ficará disponível no atributo tokenCorrente.

		"""
    
        
		if self.posicao <= len(self.tokens)-2:  # Garante que vai estar sempre em uma faixa válida, caso contrário sempre retorna o último token (EOF)
			self.posicao += 1
			self.tokenCorrente = self.tokens[self.posicao]


	def lancarErro(self, tipoEsperado=None):
		"""
		Método que lança uma exceção do tipo SyntaxException.
		Ele será chamado pelo método comparar() quando o token esperado for diferente do token corrente.

		"""
		if tipoEsperado:
			raise SyntaxException({"tipo": {self.tokenCorrente.tipo}, "valor" :{self.tokenCorrente.valor},"esperado": {tipoEsperado}, "linha": {self.tokenCorrente.linha},"status":502,"type":0})
		else:
			raise SyntaxException({"tipo": {self.tokenCorrente.tipo}, "valor":{self.tokenCorrente.valor},"linha": {self.tokenCorrente.linha},"status":502,"type":1})

		
	def comparar(self, tipoEsperado):
		"""
		Compara o tokenCorrente com o tipo esperado (tipoEsperado) do token. Caso sejam diferentes, lança uma exceção do tipo SyntaxException.

		"""
		tokenRetorno = self.tokenCorrente
		if self.tokenCorrente.tipo == tipoEsperado.upper():
			self.proximoToken()
		else:
			print(f'Erro Lexico: {self.tokenCorrente.tipo} {self.tokenCorrente.valor} {tipoEsperado}')
			self.lancarErro(tipoEsperado)
		return tokenRetorno
	

	def analisar(self):
		"""
		Método que será chamado para inicializar a análise sintática.
		Chama o método alg().

		Retorna o resultado do método program().
		"""
		result = self.program()
		print("Arvore Sintatica ", result, "\n")
		return result
	
	def program(self):
		"""
		Método que analisa a variável <program> da linguagem.

		Retorna um NoInterno com os seguintes parâmetros nomeados: id (um NoFolha com op igual a "id"), declarations, block.
		"""
		print("Analisando <program>:")
		print("Analisando <program>:")
		print(f"Token corrente: {self.tokenCorrente.linha} \n")
		self.comparar('PROGRAMA')
		id_programa = self.str()
		self.comparar('VAR')
		var_declaration_list = self.var_declaration_list()
		block = self.block()
		self.comparar('EOF')

		# print(f"Árvore sintática retornada: {NoInterno(op='program', id=id_programa, var_declaration_list=var_declaration_list, block=block)}\n")
		return NoInterno(op='program', id=id_programa, var_declaration_list=var_declaration_list, block=block)

	def var_declaration_list(self):
		"""
		Método que analisa a variável <var_declaration_list> da linguagem.

		Retorna um NoInterno com os seguintes parâmetros nomeados: varDeclaration, prox.
		O valor do atributo op deve ser "varDeclarationList".
		"""
		print("Analisando <var_declaration_list>")
		print(f"Token corrente: {self.tokenCorrente.tipo} \n")

		if self.tokenCorrente.tipo == 'TYPE':
			var_declaration = self.var_declaration()
			prox = self.var_declaration_list()
			return NoInterno(op='varDeclarationList', varDeclaration=var_declaration, prox=prox)
		else:
			return None

	def var_declaration(self):
		"""
		Método que analisa a variável <var_declaration> da linguagem.

		Retorna um NoInterno com os seguintes parâmetros nomeados: type (um NoFolha com op igual a "type"), identifierList.
		O valor do atributo op deve ser "varDeclaration".
		"""
		print("Analisando <var_declaration>")
		print(f"Token corrente: {self.tokenCorrente.tipo} \n")

		type = self.comparar('TYPE')

		type_folha = NoFolha(op='type', valor=type.valor, linha=type.linha)
		identifier_list = self.identifier_list()

		self.comparar('SEMICOLON')

		return NoInterno(op='varDeclaration', type=type_folha, identifierList=identifier_list)

	def identifier_list(self):
		"""
		Método que analisa a variável <identifier_list> da linguagem.

		Retorna um NoInterno com os seguintes parâmetros nomeados: id (um NoFolha com op igual a "id"), prox.
		O valor do atributo op deve ser "identifierList".

		"""
		print("Analisando <identifier_list>")
		print(f"Token corrente: {self.tokenCorrente.tipo} \n")

		id = self.comparar('ID')
		id_folha = NoFolha(op='id', valor=id.valor, linha=id.linha)

		if self.tokenCorrente.tipo == 'COMMA':
			self.comparar('COMMA')
			prox = self.identifier_list()
			return NoInterno(op='identifierList', id=id_folha, prox=prox)
		else:
			return NoInterno(op='identifierList', id=id_folha, prox=None)

	def block(self):
		"""
		Método que analisa a variável <block> da linguagem.

		Retorna um NoInterno com o seguinte parâmetro nomeado: statementList.
		O valor do atributo op deve ser "block".
		"""
		print("Analisando <block>")
		print(f"Token corrente: {self.tokenCorrente.tipo} \n")

		self.comparar('LBLOCK')
		statement_list = self.statement_list()
		self.comparar('RBLOCK')
		return NoInterno(op='block', statementList=statement_list)

	def statement_list(self):
		"""
		Método que analisa a variável <statement_list> da linguagem.

		Retorna um NoInterno com os seguintes parâmetros nomeados: statement, prox.
		O valor do atributo op deve ser "statementList".

		"""
		print("Analisando <statement_list>")
		print(f"Token corrente: {self.tokenCorrente.tipo} \n")
		print(f"Token corrente valor: {self.tokenCorrente} \n")

		if self.tokenCorrente.tipo in ['ID', 'SE', 'ENQUANTO', 'REPITA', 'FUNCOUT']:
			statement = self.statement()
			prox = self.statement_list()
			return NoInterno(op='statementList', statement=statement, prox=prox)
		else:
			return None

	def statement(self):
		"""
		Método que analisa a variável <statement> da linguagem.
		Compara se o token corrente é ID, SE, ENQUANTO, REPITA ou comandos específicos e chama o método específico de cada caso.

		Esse método não cria nenhum nó na árvore sintática, mas deve retornar o objeto obtido ao chamar os métodos específicos.
		"""
		print("Analisando <statement>")
		print(f"Token corrente: {self.tokenCorrente.tipo} \n")

		if self.tokenCorrente.tipo == 'ID':
			return self.assign_statement()
		elif self.tokenCorrente.tipo == 'SE':
			return self.if_statement()
		elif self.tokenCorrente.tipo == 'ENQUANTO':
			return self.while_statement()
		elif self.tokenCorrente.tipo == 'REPITA':
			return self.repeat_statement()
		elif self.tokenCorrente.tipo in ['FUNCOUT']:
			return self.command_statement()
		else:
			return None

	def assign_statement(self):
		"""
		Método que analisa a variável <assign_statement> da linguagem.

		Retorna um NoInterno com os seguintes parâmetros nomeados, a depender do tipo de atribuição:
			- se o token corrente for um input_statement: id (um NoFolha com op igual a "id", contendo a variável que está recebendo o valor da atribuição), inputStatement;
			- caso contrário: id (um NoFolha com op igual a "id", contendo a variável que está recebendo o valor da atribuição), expression;
		O valor do atributo op deste NoInterno deve ser "assignStatement".
		"""
		print("Analisando <assign_statement>")
		print(f"Token corrente: {self.tokenCorrente.tipo} \n")

		id = self.comparar('ID')
		self.comparar('ASSIGN')
		if self.tokenCorrente.tipo in ['FUNCIN']:
			input_statement = self.input_statement()
			self.comparar('SEMICOLON')
			return NoInterno(op='assignStatement', id=NoFolha(op='id', valor=id.valor, linha=id.linha), inputStatement=input_statement)
		elif self.tokenCorrente.tipo == 'DQUOTE':
			string = self.str()
			self.comparar('SEMICOLON')
			return NoInterno(op='assignStatement', id=NoFolha(op='id', valor=id.valor, linha=id.linha), texto=string)
		else:
			expression = self.expression()
			self.comparar('SEMICOLON')
			return NoInterno(op='assignStatement', id=NoFolha(op='id', valor=id.valor, linha=id.linha), expression=expression)

	def input_statement(self):
		"""
		Método que analisa a variável <input_statement> da linguagem.

		Retorna um NoInterno com os seguintes parâmetros nomeados: tipo, parametros.
		O valor do atributo op deve ser "inputStatement".
		"""
		print("Analisando <input_statement>")
		print(f"Token corrente: {self.tokenCorrente.tipo} \n")

		token = self.comparar("FUNCIN")
		self.comparar('LPAR')
		if token.valor == "ler_numero":
			string = self.str()
			self.comparar('RPAR')
			return NoInterno(op='inputStatement', tipo=token.valor, parametros=[string])
		elif token.valor == "ler_binario":
			string = self.str()
			self.comparar('RPAR')
			return NoInterno(op='inputStatement', tipo=token.valor, parametros=[string])
		elif token.valor == "ler":
			self.comparar('RPAR')
			return NoInterno(op='inputStatement', tipo=token.valor, parametros=[])
		elif token.valor == "consultar":
			self.comparar('RPAR')
			return NoInterno(op='inputStatement', tipo=token.valor, parametros=[])
		elif token.valor == "criar_figura":
			string = self.str()
			self.comparar('COMMA')
			string_two = self.str()
			self.comparar('COMMA')
			sum_expression = self.sum_expression()
			self.comparar('COMMA')
			sum_expression_two = self.sum_expression()
			self.comparar('COMMA')
			sum_expression_three = self.sum_expression()
			self.comparar('RPAR')
			return NoInterno(op='inputStatement', tipo=token.valor, parametros=[string, string_two, sum_expression, sum_expression_two, sum_expression_three])
		elif token.valor == "criar_imagem":
			string = self.str()
			self.comparar('COMMA')
			sum_expression = self.sum_expression()
			self.comparar('COMMA')
			sum_expression_two = self.sum_expression()
			self.comparar('RPAR')
			return NoInterno(op='inputStatement', tipo=token.valor, parametros=[string, sum_expression, sum_expression_two])
		elif token.valor == "colidiu":
			sum_expression = self.sum_expression()
			self.comparar('COMMA')
			sum_expression_two = self.sum_expression()
			self.comparar('RPAR')
			return NoInterno(op='inputStatement', tipo=token.valor, parametros=[sum_expression, sum_expression_two])
		elif token.valor == "aleatorio":
			sum_expression = self.sum_expression()
			self.comparar('COMMA')
			sum_expression_two = self.sum_expression()
			self.comparar('RPAR')
			return NoInterno(op='inputStatement', tipo=token.valor, parametros=[sum_expression, sum_expression_two])
  
	def if_statement(self):
		"""
		Método que analisa a variável <if_statement> da linguagem.

		Retorna um NoInterno com os seguintes parâmetros nomeados: expression, blockIf, blockElse.
		O valor do atributo op deve ser "ifStatement".
		"""
		print("Analisando <if_statement>")
		print(f"Token corrente: {self.tokenCorrente.tipo} \n")
		self.comparar('SE')
		self.comparar('LPAR')
		expression = self.expression()
		self.comparar('RPAR')
		blockIf = self.block()
		if self.tokenCorrente.tipo == 'SENAO':
			self.comparar('SENAO')
			blockElse = self.block()
			return NoInterno(op='ifStatement', expression=expression, blockIf=blockIf, blockElse=blockElse)
		else:
			return NoInterno(op='ifStatement', expression=expression, blockIf=blockIf, blockElse=None)

	def while_statement(self):
		"""
		Método que analisa a variável <while_statement> da linguagem.

		Retorna um NoInterno com os seguintes parâmetros nomeados: expression, block.
		O valor do atributo op deve ser "whileStatement".
		"""
		print("Analisando <while_statement>")
		print(f"Token corrente: {self.tokenCorrente.tipo} \n")

		self.comparar('ENQUANTO')
		self.comparar('LPAR')
		expression = self.expression()
		self.comparar('RPAR')
		block = self.block()
		return NoInterno(op='whileStatement', expression=expression, block=block)

	def repeat_statement(self):
		"""
		Método que analisa a variável <repeat_statement> da linguagem.

		Retorna um NoInterno com os seguintes parâmetros nomeados: sumExpression, block.
		O valor do atributo op deve ser "repeatStatement".
		"""
		print("Analisando <repeat_statement>")
		print(f"Token corrente: {self.tokenCorrente.tipo} \n")

		self.comparar('REPITA')
		self.comparar('LPAR')
		sum_expression = self.sum_expression()
		self.comparar('RPAR')
		block = self.block()
		return NoInterno(op='repeatStatement', sumExpression=sum_expression, block=block)

	def command_statement(self):
		"""
		Método que analisa a variável <command_statement> da linguagem.
  
		Retorna um NoInterno com os seguintes parâmetros nomeados, a depender do comando:
			- se o comando for FUNCOUT: string (um NoFolha com op igual a "string"), sumExpression;
			- caso contrário: sumExpression, string, stringTwo, sumExpressionTwo, sumExpressionThree, sumExpressionFour.
		"""
		print("Analisando <command_statement>")
		print(f"Token corrente: {self.tokenCorrente.tipo} \n")
		
		token = self.comparar("FUNCOUT")
		self.comparar('LPAR')
		if token.valor == "mostrar":
			if self.tokenCorrente.tipo == 'DQUOTE':
				string = self.str()
				self.comparar('RPAR')
				self.comparar('SEMICOLON')
				return NoInterno(op='commandStatement', tipo=token.valor, parametros=[string])
			else:
				sum_expression = self.sum_expression()
				self.comparar('RPAR')
				self.comparar('SEMICOLON')
				return NoInterno(op='commandStatement', tipo=token.valor, parametros=[sum_expression])
		elif token.valor == "limpar":
			self.comparar('RPAR')
			self.comparar('SEMICOLON')
			return NoInterno(op='commandStatement', tipo=token.valor, parametros=[])
		elif token.valor == "inicializar_com_cor":
			string = self.str()
			self.comparar('RPAR')
			self.comparar('SEMICOLON')
			return NoInterno(op='commandStatement', tipo=token.valor, parametros=[string])
		elif token.valor == "inicializar_com_imagem":
			string = self.str()
			self.comparar('RPAR')
			self.comparar('SEMICOLON')
			return NoInterno(op='commandStatement', tipo=token.valor, parametros=[string])
		elif token.valor == "redefinir_figura":
			sum_expression = self.sum_expression()
			self.comparar('COMMA')
			string = self.str()
			self.comparar('COMMA')
			string_two = self.str()
			self.comparar('COMMA')
			sum_expression_two = self.sum_expression()
			self.comparar('COMMA')
			sum_expression_three = self.sum_expression()
			self.comparar('COMMA')
			sum_expression_four = self.sum_expression()
			self.comparar('RPAR')
			self.comparar('SEMICOLON')
			return NoInterno(op='commandStatement', tipo=token.valor, parametros=[sum_expression, string, string_two, sum_expression_two, sum_expression_three, sum_expression_four])
		elif token.valor == "redefinir_imagem":
			sum_expression = self.sum_expression()
			self.comparar('COMMA')
			string = self.str()
			self.comparar('COMMA')
			sum_expression_two = self.sum_expression()
			self.comparar('COMMA')
			sum_expression_three = self.sum_expression()
			self.comparar('RPAR')
			self.comparar('SEMICOLON')
			return NoInterno(op='commandStatement', tipo=token.valor, parametros=[sum_expression, string, sum_expression_two, sum_expression_three])
		elif token.valor == "mover":
			sum_expression = self.sum_expression()
			self.comparar('COMMA')
			sum_expression_two = self.sum_expression()
			self.comparar('COMMA')
			sum_expression_three = self.sum_expression()
			self.comparar('RPAR')
			self.comparar('SEMICOLON')
			return NoInterno(op='commandStatement', tipo=token.valor, parametros=[sum_expression, sum_expression_two, sum_expression_three])
		elif token.valor == "destacar":
			sum_expression = self.sum_expression()
			self.comparar('RPAR')
			self.comparar('SEMICOLON')
			return NoInterno(op='commandStatement', tipo=token.valor, parametros=[sum_expression])
		elif token.valor == "reverter_destaque":
			self.comparar('RPAR')
			self.comparar('SEMICOLON')
			return NoInterno(op='commandStatement', tipo=token.valor, parametros=[])
		elif token.valor == "tocar":
			string = self.str()
			self.comparar('RPAR')
			self.comparar('SEMICOLON')
			return NoInterno(op='commandStatement', tipo=token.valor, parametros=[string])
		elif token.valor == "esperar":
			sum_expression = self.sum_expression()
			self.comparar('RPAR')
			self.comparar('SEMICOLON')
			return NoInterno(op='commandStatement', tipo=token.valor, parametros=[sum_expression])
  
	def expression(self):
		"""
		Método que analisa a variável <expression> da linguagem.

		Retorna um NoInterno com os seguintes parâmetros nomeados: simpleExpression, prox.
		O valor do atributo op deve ser "expression".
		"""
		print("Analisando <expression>")
		print(f"Token corrente: {self.tokenCorrente.tipo} \n")
		
		esquerda = self.sum_expression()
		if self.tokenCorrente.tipo == "OPREL":
			operador = self.comparar("OPREL")
			direita = self.sum_expression()
			return NoInterno(op='expression', oper=operador.valor, esq=esquerda, dir=direita)
		else:
				return NoInterno(op='expression', oper=None, esq=esquerda, dir=None)
	
	def sum_expression(self):
		"""
		Método que analisa a variável <sum_expression> da linguagem.

		Retorna um NoInterno com os seguintes parâmetros nomeados: term, prox.
		O valor do atributo op deve ser "sumExpression".
		"""
		print("Analisando <sum_expression>")
		print(f"Token corrente: {self.tokenCorrente.tipo} \n")

		multiplicative_term = self.mult_term()
		return self.sum_expression_2(multiplicative_term)

	def sum_expression_2(self, esq=None):
		"""
		Método auxiliar que analisa a variável <sum_expression> da linguagem.

		Retorna um NoInterno com os seguintes parâmetros nomeados: term, prox.
		O valor do atributo op deve ser "sumExpression".
		"""
		print("Analisando <sum_expression>")
		print(f"Token corrente: {self.tokenCorrente.tipo} \n")

		if self.tokenCorrente.tipo == 'OPSUM':
			operador = self.comparar('OPSUM')
			multiplicative_term = self.mult_term()
			return self.sum_expression_2(NoInterno(op='sumExpression', oper=operador.valor, esq=esq, dir=multiplicative_term))
		else:
			return esq
	
	def mult_term(self):
		print("Analisando <mult_term>")
		print(f"Token corrente: {self.tokenCorrente.tipo} \n")
   
		power_term = self.power_term()
		return self.mult_term_2(power_term)

	def mult_term_2(self, esq=None):
		if self.tokenCorrente.tipo == 'OPMUL':
			operador = self.comparar('OPMUL')
			power_term = self.power_term()
			return self.mult_term_2(NoInterno(op='multTerm', oper=operador.valor, esq=esq, dir=power_term))
		else:
			return esq
 
	def power_term(self):
		print("Analisando <power_term>")
		print(f"Token corrente: {self.tokenCorrente.tipo} \n")
		esquerda = self.factor()

		if self.tokenCorrente.tipo == 'OPPOW':
			operador = self.comparar('OPPOW')
			direita = self.power_term()
			return NoInterno(op='powerTerm', oper=operador.valor, esq=esquerda, dir=direita)
		else:
			return esquerda
 
	def factor(self):
		print("Analisando <factor>")
		print(f"Token corrente: {self.tokenCorrente.tipo} \n")
		if self.tokenCorrente.tipo == 'ID':
			factor = self.comparar('ID')
			return NoInterno(op='factor', dir=None, esq=None, factor=NoFolha(op='id', valor=factor.valor, linha=factor.linha), sinal="+")
		elif self.tokenCorrente.tipo == 'INT':
			factor = self.comparar('INT')
			return NoInterno(op='factor', dir=None, esq=None, factor=NoFolha(op='numero', valor=factor.valor, linha=factor.linha), sinal="+")
		elif self.tokenCorrente.valor == '+':
			mais = self.comparar('OPSUM')
			factor = self.factor()
			#TODO perguntar sobre o sinal
			return NoInterno(op='factor', dir=None, esq=None, factor=factor, sinal=NoFolha(op='opsum', valor='+', linha=mais.linha))
		elif self.tokenCorrente.valor == '-':
			#TODO perguntar sobre o menos
			menos = self.comparar('OPSUM')
			factor = self.factor()
			return NoInterno(op='factor', dir=None, esq=None, factor=factor, sinal=NoFolha(op='opsum', valor='-', linha=menos.linha))
		elif self.tokenCorrente.tipo == 'LPAR':
			self.comparar('LPAR')
			expression = self.expression()
			self.comparar('RPAR')
			return NoInterno(op='factor', dir=None, esq=None, expression=expression, sinal="+")
		elif self.tokenCorrente.tipo == 'NAO':
			nao = self.comparar('NAO')
			factor = self.factor()
			#TODO perguntar sobre o nao
			return NoInterno(op='factor', dir=None, esq=None, factor=factor, sinal=NoFolha(op='nao', valor='!', linha=nao.linha))
		elif self.tokenCorrente.tipo == 'BOOL':
			factor = self.comparar('BOOL')
			return NoInterno(op='factor', dir=None, esq=None, factor=NoFolha(op='binario', valor=factor.valor, linha=factor.linha), sinal="+")
  
	def str(self):
		self.comparar('DQUOTE')
		string = self.comparar('STR')
		self.comparar('DQUOTE')
		return NoFolha(op='texto', valor=string.valor, linha=string.linha)
   
# if __name__ == '__main__':
#   import sys
#   import os
# with open("src/backend/src/services/exemplos_teste/ex3_n_erro_codigo.w", 'r', encoding='utf-8') as arquivo:
# 	sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../lexico/src")))
# 	codigo = str(arquivo.read())
# 	tokens = tokens = [
#     Token("PROGRAMA", "programa", 1),
#     Token("DQUOTE", "\"", 1),
#     Token("STR", "Este programa é mais complexo que o primeiro", 1),
#     Token("DQUOTE", "\"", 1),
#     Token("VAR", "var", 2),
#     Token("TYPE", "numero", 3),
#     Token("ID", "a", 3),
#     Token("COMMA", ",", 3),
#     Token("ID", "b", 3),
#     Token("COMMA", ",", 3),
#     Token("ID", "soma", 3),
#     Token("SEMICOLON", ";", 3),
#     Token("TYPE", "binario", 4),
#     Token("ID", "c", 4),
#     Token("COMMA", ",", 4),
#     Token("ID", "aconteceu", 4),
#     Token("SEMICOLON", ";", 4),
#     Token("TYPE", "texto", 5),
#     Token("ID", "s", 5),
#     Token("SEMICOLON", ";", 5),
#     Token("LBLOCK", "{", 6),
#     Token("ID", "a", 7),
#     Token("ASSIGN", ":", 7),
#     Token("INT", "0", 7),
#     Token("SEMICOLON", ";", 7),
#     Token("ID", "b", 8),
#     Token("ASSIGN", ":", 8),
#     Token("OPSUM", "-", 8),
#     Token("INT", "2", 8),
#     Token("SEMICOLON", ";", 8),
#     Token("ID", "soma", 9),
#     Token("ASSIGN", ":", 9),
#     Token("ID", "a", 9),
#     Token("OPSUM", "+", 9),
#     Token("ID", "b", 9),
#     Token("SEMICOLON", ";", 9),
#     Token("ID", "c", 14),
#     Token("ASSIGN", ":", 14),
#     Token("BOOL", "f", 14),
#     Token("SEMICOLON", ";", 14),
#     Token("ID", "s", 15),
#     Token("ASSIGN", ":", 15),
#     Token("DQUOTE", "\"", 15),
#     Token("STR", "Programar em FOFI é muito divertido", 15),
#     Token("DQUOTE", "\"", 15),
#     Token("SEMICOLON", ";", 15),
#     Token("SE", "se", 16),
#     Token("LPAR", "(", 16),
#     Token("LPAR", "(", 16),
#     Token("ID", "soma", 16),
#     Token("OPREL", "<", 16),
#     Token("ID", "a", 16),
#     Token("OPPOW", "^", 16),
#     Token("INT", "2", 16),
#     Token("RPAR", ")", 16),
#     Token("OPMUL", "e", 16),
#     Token("LPAR", "(", 16),
#     Token("LPAR", "(", 16),
#     Token("ID", "b", 16),
#     Token("OPREL", "<=", 16),
#     Token("OPSUM", "-", 16),
#     Token("INT", "2", 16),
#     Token("RPAR", ")", 16),
#     Token("OPSUM", "ou", 16),
#     Token("LPAR", "(", 16),
#     Token("ID", "c", 16),
#     Token("OPREL", "=", 16),
#     Token("BOOL", "v", 16),
#     Token("RPAR", ")", 16),
#     Token("RPAR", ")", 16),
#     Token("RPAR", ")", 16),
#     Token("LBLOCK", "{", 16),
#     Token("ID", "aconteceu", 17),
#     Token("ASSIGN", ":", 17),
#     Token("NAO", "nao", 17),
#     Token("ID", "c", 17),
#     Token("SEMICOLON", ";", 17),
#     Token("FUNCOUT", "mostrar", 18),
#     Token("LPAR", "(", 18),
#     Token("ID", "s", 18),
#     Token("RPAR", ")", 18),
#     Token("SEMICOLON", ";", 18),
#     Token("RBLOCK", "}", 19),
#     Token("SENAO", "senao", 19),
#     Token("LBLOCK", "{", 19),
#     Token("ID", "b", 21),
#     Token("ASSIGN", ":", 21),
#     Token("FUNCIN", "consultar", 21),
#     Token("LPAR", "(", 21),
#     Token("RPAR", ")", 21),
#     Token("SEMICOLON", ";", 21),
#     Token("REPITA", "repita", 22),
#     Token("LPAR", "(", 22),
#     Token("INT", "5", 22),
#     Token("RPAR", ")", 22),
#     Token("LBLOCK", "{", 22),
#     Token("ID", "soma", 23),
#     Token("ASSIGN", ":", 23),
#     Token("INT", "16", 23),
#     Token("OPSUM", "+", 23),
#     Token("INT", "2", 23),
#     Token("OPMUL", "*", 23),
#     Token("INT", "3", 23),
#     Token("OPSUM", "-", 23),
#     Token("ID", "b", 23),
#     Token("SEMICOLON", ";", 23),
#     Token("ENQUANTO", "enquanto", 24),
#     Token("LPAR", "(", 24),
#     Token("ID", "SOMA", 24),
#     Token("OPREL", "!=", 24),
#     Token("INT", "0", 24),
#     Token("RPAR", ")", 24),
#     Token("LBLOCK", "{", 24),
#     Token("FUNCOUT", "mostrar", 25),
#     Token("LPAR", "(", 25),
#     Token("ID", "a", 25),
#     Token("RPAR", ")", 25),
#     Token("SEMICOLON", ";", 25),
#     Token("ID", "sOmA", 26),
#     Token("ASSIGN", ":", 26),
#     Token("LPAR", "(", 26),
#     Token("ID", "b", 26),
#     Token("OPPOW", "^", 26),
#     Token("INT", "3", 26),
#     Token("OPPOW", "^", 26),
#     Token("INT", "4", 26),
#     Token("RPAR", ")", 26),
#     Token("OPMUL", "/", 26),
#     Token("ID", "a", 26),
#     Token("SEMICOLON", ";", 26),
#     Token("RBLOCK", "}", 27),
#     Token("RBLOCK", "}", 28),
#     Token("RBLOCK", "}", 29),
#     Token("ID", "a", 30),
#     Token("ASSIGN", ":", 30),
#     Token("FUNCIN", "aleatorio", 30),
#     Token("LPAR", "(", 30),
#     Token("OPSUM", "-", 30),
#     Token("INT", "10", 30),
#     Token("COMMA", ",", 30),
#     Token("INT", "2", 30),
#     Token("RPAR", ")", 30),
#     Token("SEMICOLON", ";", 30),
#     Token("RBLOCK", "}", 31),
#     Token("EOF", "EOF", 32)
# 	]
# print(codigo)
# lexico = SintaticoService(codigo)