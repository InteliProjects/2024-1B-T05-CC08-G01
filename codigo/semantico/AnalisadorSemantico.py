from ClassesAuxiliares import NoFolha, NoInterno, NoTabela, SemanticException

class AnalisadorSemantico:
  
    def __init__(self, arvoreSintatica):
        """
        Construtor do analisador semântico: recebe a árvore sintática e inicializa a tabela de símbolos.
        """
        self.arvore = arvoreSintatica
        self.tabela = {}

    def analisar(self):
        """
        Método que inicia a análise semântica.
        """
        analise = self.visitarProgram()
        # print(f"\nself.tabela: {self.tabela}")
        return self.arvore

    def visitarProgram(self):
        """
        Método que visita o nó raiz da árvore sintática.
        """
        self.tabela[self.arvore.get("id").valor] = NoTabela(None, "program")
        self.visitarVarDeclarationList(self.arvore.get("var_declaration_list"))
        self.visitarBlock(self.arvore.get("block"))
        pass


    def visitarVarDeclarationList(self, varDeclarationList):
        """
        Método que visita a lista de declarações de variáveis.
        """
        while varDeclarationList != None:
            # print(f"Analisando {varDeclarationList.get('varDeclaration')} \n")
            self.visitarVarDeclaration(varDeclarationList.get("varDeclaration"))
            varDeclarationList = varDeclarationList.get("prox")
        pass



    def visitarVarDeclaration(self, varDeclaration):
        """
        Método que visita uma declaração de variável.
        """
        typeVar = varDeclaration.get("type").valor
        identifier = varDeclaration.get("identifierList")
        while identifier != None:
            self.verificaSeJaFoiDeclarado(identifier.get("id"))
            self.tabela[identifier.get("id").valor] = NoTabela(None, typeVar)
            identifier = identifier.get("prox")
        pass


    def visitarBlock(self, noBlock):
        """
        Método que visita um bloco de comandos.
        """
        statementList = noBlock.get("statementList")

        while statementList != None:
            statement = statementList.get("statement")
            self.visitarStatement(statement)
            
            
            statementList = statementList.get("prox")
        pass

        

    def visitarStatement(self, no):
        """
        Método que visita um comando.
        """
        if no.op == "assignStatement":
            self.visitarAssignStatement(no)
        elif no.op == "ifStatement":
            self.visitarIfStatement(no)
        

    def visitarAssignStatement(self, noAssignStatement):
        """
        Método que visita um comando de atribuição.
        """
        print(f"noAssignStatement: {noAssignStatement} \n")
        leftValue = noAssignStatement.get("id")
        
        self.verificaSeFoiDeclarado(leftValue)
        
        if noAssignStatement.get("expression"):
            expression = self.visitarExpression(noAssignStatement.get("expression"))
            self.verificaDoisTipos(self.tabela[leftValue.valor].tipo, expression.tipo)
            # self.verificaTipoIdentificadorExpressao(leftValue, expression)
            self.tabela[leftValue.valor].valor = expression.valor
        elif noAssignStatement.get("texto"):
            print("entrou aq")
            self.verificaDoisTipos(self.tabela[leftValue.valor].tipo, noAssignStatement.get("texto").op)
            self.tabela[leftValue.valor].valor = noAssignStatement.get("texto").valor
        elif noAssignStatement.get("input_statement"):
            input_statement = self.VisitarInputStatement(noAssignStatement.get("input_statement"))
            self.tabela[leftValue.valor].valor = input_statement.valor


        
    def VisitarInputStatement(self, noInputStatement):
        """
        Método que visita um 'noInputStatement' e realiza a verificação e 
        processamento de acordo com o tipo de instrução.
        """

        if noInputStatement.tipo == "ler_numero" or noInputStatement.tipo == "ler_binario":
            self.verificaTipoString(noInputStatement.get("parametros")[0])
        elif noInputStatement.tipo == "ler" and noInputStatement.tipo == "consultar":
            pass
        elif noInputStatement.tipo == "criar_figura":
            self.verificaTipoString(noInputStatement.get("parametros")[0])
            self.verificaTipoString(noInputStatement.get("parametros")[1])
            self.visitarSumExpression(noInputStatement.get("parametros")[2])
            self.visitarSumExpression(noInputStatement.get("parametros")[3])
            self.visitarSumExpression(noInputStatement.get("parametros")[4])
        elif noInputStatement.tipo == "criar_imagem":
            self.verificaTipoString(noInputStatement.get("parametros")[0])
            self.visitarSumExpression(noInputStatement.get("parametros")[1])
            self.visitarSumExpression(noInputStatement.get("parametros")[2])
        elif noInputStatement.tipo == "colidiu":
            self.visitarSumExpression(noInputStatement.get("parametros")[0])
            self.visitarSumExpression(noInputStatement.get("parametros")[1])
        elif noInputStatement.tipo == "aleatorio":
            self.visitarSumExpression(noInputStatement.get("parametros")[0])
            self.visitarSumExpression(noInputStatement.get("parametros")[1])

                
    def visitarIfStatement(self, noIfStatement):
        """
        Método que visita um comando condicional.
        """
        expression = self.visitarExpression(noIfStatement.get("expression"))
        blockIf = self.visitarBlock(noIfStatement.get("blockIf"))
        
        if noIfStatement.get("blockElse"):
            blockElse = self.visitarBlock(noIfStatement.get("blockElse"))
        

    def visitarWhileStatement(self, noWhileStatement):
        """
        Método que visita um comando de repetição.
        """
        expression = self.visitarExpression(noWhileStatement.get("expression"))
        block = self.visitarBlock(noWhileStatement.get("block"))

    def visitarRepeatStatement(self, noRepeatStatement):
        """
        Método que visita um comando de leitura.
        """
        sumExpression = self.visitarSumExpression(noRepeatStatement.get("sumExpression"))
        block = self.visitarBlock(noRepeatStatement.get("block"))

    def visitarCommandStatement(self, noCommandStatement):
        """
        Método que visita um comando de escrita.
        """
        leftValue = noCommandStatement.get("id")
        
        self.verificaSeFoiDeclarado(leftValue)
        if noCommandStatement.tipo == "mostrar":
            if noCommandStatement.get("texto"):
                string = self.verificaTipoString(noCommandStatement.get("texto"))
                self.tabela[leftValue.valor].valor = string.valor
            elif noCommandStatement.get("sum_expression"):
                sum_expression = self.verificaTipoString(noCommandStatement.get("sum_expression"))
                self.tabela[leftValue.valor].valor = sum_expression.valor
        elif noCommandStatement.tipo == "limpar":
            pass
        elif noCommandStatement.tipo == "inicializar_com_cor" or noCommandStatement.tipo == "inicializar_com_imagem":
            self.verificaTipoString(noCommandStatement.get("parametros")[0])
        elif noCommandStatement.tipo == "redefinir_figura":
            self.visitarSumExpression(noCommandStatement.get("parametros")[0])
            self.verificaTipoString(noCommandStatement.get("parametros")[1])
            self.verificaTipoString(noCommandStatement.get("parametros")[2])
            self.visitarSumExpression(noCommandStatement.get("parametros")[3])
            self.visitarSumExpression(noCommandStatement.get("parametros")[4])
            self.visitarSumExpression(noCommandStatement.get("parametros")[5])
        elif noCommandStatement.tipo == "mover":
            self.visitarSumExpression(noCommandStatement.get("parametros")[0])
            self.visitarSumExpression(noCommandStatement.get("parametros")[1])
            self.visitarSumExpression(noCommandStatement.get("parametros")[2])
        elif noCommandStatement.tipo == "destacar":
            self.visitarSumExpression(noCommandStatement.get("parametros")[0])
        elif noCommandStatement.tipo == "reverter_destaque":
            pass
        elif noCommandStatement.tipo == "tocar":
            self.verificaTipoString(noCommandStatement.get("parametros")[0])
        elif noCommandStatement.tipo == "esperar":
            self.visitarSumExpression(noCommandStatement.get("parametros")[0])


    def visitarExpression(self, no):
        """
        Método que visita uma expressão.
        """
        
        # Pega o termo da esquerda
        esq = self.visitarSumExpression(no.get("esq"))
        
        # Se houver operador, pega o termo da direita, caso contrário, retorna o termo da esquerda
        if no.get("oper") != None:
            dir = self.visitarSumExpression(no.get("dir"))
            return NoTabela(f"{esq.valor} {no.get('oper')} {dir.valor}", "binario")
        else:
            return esq
        
    def visitarSumExpression(self, noSumExpression):
        """
        Método que visita uma expressão de soma.
        """
        
        # Verifica se o nó é uma expressão de soma
        if noSumExpression != None:
            # Pega o termo da esquerda e o termo da direita e realiza uma recursão para cada um deles
            val1 = self.visitarSumExpression(noSumExpression.get("esq"))
            
            val2 = self.visitarSumExpression(noSumExpression.get("dir"))
            
            # Se o nó for uma expressão de sumExpression, multTerm ou powerTerm
            if noSumExpression.op == "sumExpression" or noSumExpression.op == "multTerm" or noSumExpression.op == "powerTerm":
                # print(f"noSumExpression entrou no if sum: {noSumExpression} \n")
                # print(f"val1 e val2: {val1} e {val2}")

                # print(f"noSumExpression.get('oper'): {noSumExpression.get('oper')}, val1: {val1}, val2: {val2}")
                self.verificaTipos(val1, val2)
                self.verificaDivisaoPorZero(val2, noSumExpression.get("oper"))
                self.verificaExpoenteNegativo(val2, noSumExpression.get("oper"))
                
                if val1 != None:
                    return val1
                else:
                    return val2
            
            # Se o nó for um fator e não possuir uma expressão entra nesse bloco para retornar o valor do fator em forma de noTabela
            elif noSumExpression.op == "factor" and not noSumExpression.get("expression"):
                # print(f"noSumExpression entrou no if factor: {noSumExpression}")
                sinal = noSumExpression.get("sinal")
                noFolha = noSumExpression.get("factor")
                if noFolha.op == "factor":
                    # print(f"noFolha: {noFolha} \n")
                    noFolha = noFolha.get("factor")
                    # print(f"noFolha2: {noFolha} \n")
                if noFolha.op == "id":
                    self.verificaSeFoiDeclaradoEInicializado(noFolha)
                    return NoTabela(noFolha.valor, self.tabela[noFolha.valor].tipo, linha=noFolha.linha)
                elif noFolha.op == "numero":
                    if sinal != "+":
                        # print(f"sinal aq {sinal.valor}")
                        if sinal.valor == "-":
                            return NoTabela(f"-{noFolha.valor}", "numero", linha=noFolha.linha)
                    else:
                        return NoTabela(noFolha.valor, "numero", linha=noFolha.linha)
                elif noFolha.op == "binario":
                    return NoTabela(noFolha.valor, "binario", linha=noFolha.linha)
            elif noSumExpression.op == "factor" and noSumExpression.get("expression"):
                # print(f"entrou aq {noSumExpression.get('expression')}")
                return self.visitarExpression(noSumExpression.get("expression"))
                    

    def verificaSeJaFoiDeclarado(self, noFolha):
        """
        Método que verifica se uma variável já foi declarada.
        """
        if noFolha.valor in self.tabela:
            raise SemanticException({"variavel":{noFolha.valor},"linha":{noFolha.linha},"status":503,"type":1})
            print(f'O identificador "{noFolha.valor}" na linha {noFolha.linha} já foi declarado.')


    def verificaSeFoiDeclarado(self, noFolha):
        """
        Método que verifica se uma variável foi declarada.
        """
        if noFolha.valor not in self.tabela:
            raise SemanticException({"variavel":{noFolha.valor},"linha":{noFolha.linha},"status":503,"type":2})
            print(f'O identificador "{noFolha.valor}" na linha {noFolha.linha} não foi declarado.')


    def verificaDoisTipos(self, tipo1, tipo2):
        """
        Método que verifica se dois tipos são iguais.
        """
        print(f"{tipo1}, {tipo2} --------------> entro")
        if tipo1 != tipo2:
            print(f'Tipos incompatíveis: "{tipo1}" e "{tipo2}"')
            raise SemanticException({"variavel":[{tipo1},{tipo2}],"status":503,"type":3})


    def verificaDivisaoPorZero(self, val2, oper):
        """
        Método que verifica se houve uma divisão por zero.
        """
        if oper == "/" and val2.tipo == "num" and int(val2.valor) == 0:
            raise SemanticException({"linha":{val2.get("linha")},"status":503,"type":4})

    
    def verificaSeFoiDeclaradoEInicializado(self, noFolha):
        """
        Método que verifica se uma variável foi declarada e inicializada de acordo com o valor na tabela.
        """
        self.verificaSeFoiDeclarado(noFolha)
        if self.tabela[noFolha.valor].valor == None:
            raise SemanticException({"variavel":{noFolha.valor},"linha":{noFolha.linha},"status":503,"type":5})


    def verificaExpoenteNegativo(self, val2, oper):
        """
        Método que verifica se houve uma exponenciação por expoente negativo.
        """
        if oper == "^" and val2.tipo == "num" and int(val2.valor) < 0:
            raise SemanticException({"linha":{val2.get("linha")},"status":503,"type":6})
    
    def verificaTipos(self, val1, val2):
        """
        Método que verifica se dois valores possuem o mesmo tipo.
        """
        if val1.tipo != val2.tipo:
            raise SemanticException({"variavel":[{val1.valor},{val2.valor}],"status":503,"type":7})
    
    def verificaTipoString(self, no):
        if no.op != "texto":
            raise SemanticException({"variavel": no.op,"status":503,"type":8})
            
if __name__ == "__main__":
  listaNos = NoInterno(op="program", block=NoInterno(op="block", statementList=NoInterno(op="statementList", prox=NoInterno(op="statementList", prox=NoInterno(op="statementList", prox=NoInterno(op="statementList", prox=NoInterno(op="statementList", prox=NoInterno(op="statementList", prox=NoInterno(op="statementList", prox=None, statement=NoInterno(op="assignStatement", id=NoFolha(op="id", valor="a", linha=32), inputStatement=NoInterno(op="inputStatement", parametros=[NoInterno(op="factor", dir=None, esq=None, factor=NoInterno(op="factor", dir=None, esq=None, factor=NoFolha(op="numero", valor="10", linha=32), sinal="+"), sinal=NoFolha(op="opsum", valor="-", linha=32)), NoInterno(op="factor", dir=None, esq=None, factor=NoFolha(op="numero", valor="2", linha=32), sinal="+")], tipo="aleatorio"))), statement=NoInterno(op="ifStatement", blockElse=NoInterno(op="block", statementList=NoInterno(op="statementList", prox=NoInterno(op="statementList", prox=None, statement=NoInterno(op="repeatStatement", block=NoInterno(op="block", statementList=NoInterno(op="statementList", prox=NoInterno(op="statementList", prox=None, statement=NoInterno(op="whileStatement", block=NoInterno(op="block", statementList=NoInterno(op="statementList", prox=NoInterno(op="statementList", prox=None, statement=NoInterno(op="assignStatement", expression=NoInterno(op="expression", dir=None, esq=NoInterno(op="multTerm", dir=NoInterno(op="factor", dir=None, esq=None, factor=NoFolha(op="id", valor="a", linha=28), sinal="+"), esq=NoInterno(op="factor", dir=None, esq=None, expression=NoInterno(op="expression", dir=None, esq=NoInterno(op="powerTerm", dir=NoInterno(op="powerTerm", dir=NoInterno(op="factor", dir=None, esq=None, factor=NoFolha(op="numero", valor="4", linha=28), sinal="+"), esq=NoInterno(op="factor", dir=None, esq=None, factor=NoFolha(op="numero", valor="3", linha=28), sinal="+"), oper="^"), esq=NoInterno(op="factor", dir=None, esq=None, factor=NoFolha(op="id", valor="b", linha=28), sinal="+"), oper="^"), oper=None), sinal="+"), oper="/"), oper=None), id=NoFolha(op="id", valor="sOmA", linha=28))), statement=NoInterno(op="commandStatement", parametros=[NoInterno(op="factor", dir=None, esq=None, factor=NoFolha(op="id", valor="a", linha=27), sinal="+")], tipo="mostrar"))), expression=NoInterno(op="expression", dir=NoInterno(op="factor", dir=None, esq=None, factor=NoFolha(op="numero", valor="0", linha=26), sinal="+"), esq=NoInterno(op="factor", dir=None, esq=None, factor=NoFolha(op="id", valor="SOMA", linha=26), sinal="+"), oper="!="))), statement=NoInterno(op="assignStatement", expression=NoInterno(op="expression", dir=None, esq=NoInterno(op="sumExpression", dir=NoInterno(op="factor", dir=None, esq=None, factor=NoFolha(op="id", valor="b", linha=25), sinal="+"), esq=NoInterno(op="sumExpression", dir=NoInterno(op="multTerm", dir=NoInterno(op="factor", dir=None, esq=None, factor=NoFolha(op="numero", valor="3", linha=25), sinal="+"), esq=NoInterno(op="factor", dir=None, esq=None, factor=NoFolha(op="numero", valor="2", linha=25), sinal="+"), oper="*"), esq=NoInterno(op="factor", dir=None, esq=None, factor=NoFolha(op="numero", valor="16", linha=25), sinal="+"), oper="+"), oper="-"), oper=None), id=NoFolha(op="id", valor="soma", linha=25)))), sumExpression=NoInterno(op="factor", dir=None, esq=None, factor=NoFolha(op="numero", valor="5", linha=24), sinal="+"))), statement=NoInterno(op="assignStatement", id=NoFolha(op="id", valor="b", linha=23), inputStatement=NoInterno(op="inputStatement", parametros=[], tipo="consultar")))), blockIf=NoInterno(op="block", statementList=NoInterno(op="statementList", prox=NoInterno(op="statementList", prox=None, statement=NoInterno(op="commandStatement", parametros=[NoInterno(op="factor", dir=None, esq=None, factor=NoFolha(op="id", valor="s", linha=19), sinal="+")], tipo="mostrar")), statement=NoInterno(op="assignStatement", expression=NoInterno(op="expression", dir=None, esq=NoInterno(op="factor", dir=None, esq=None, factor=NoInterno(op="factor", dir=None, esq=None, factor=NoFolha(op="id", valor="c", linha=18), sinal="+"), sinal=NoFolha(op="nao", valor="!", linha=18)), oper=None), id=NoFolha(op="id", valor="aconteceu", linha=18)))), expression=NoInterno(op="expression", dir=None, esq=NoInterno(op="multTerm", dir=NoInterno(op="factor", dir=None, esq=None, expression=NoInterno(op="expression", dir=None, esq=NoInterno(op="sumExpression", dir=NoInterno(op="factor", dir=None, esq=None, expression=NoInterno(op="expression", dir=NoInterno(op="factor", dir=None, esq=None, factor=NoFolha(op="binario", valor="v", linha=17), sinal="+"), esq=NoInterno(op="factor", dir=None, esq=None, factor=NoFolha(op="id", valor="c", linha=17), sinal="+"), oper="="), sinal="+"), esq=NoInterno(op="factor", dir=None, esq=None, expression=NoInterno(op="expression", dir=NoInterno(op="factor", dir=None, esq=None, factor=NoInterno(op="factor", dir=None, esq=None, factor=NoFolha(op="numero", valor="2", linha=17), sinal="+"), sinal=NoFolha(op="opsum", valor="-", linha=17)), esq=NoInterno(op="factor", dir=None, esq=None, factor=NoFolha(op="id", valor="b", linha=17), sinal="+"), oper="<="), sinal="+"), oper="ou"), oper=None), sinal="+"), esq=NoInterno(op="factor", dir=None, esq=None, expression=NoInterno(op="expression", dir=NoInterno(op="powerTerm", dir=NoInterno(op="factor", dir=None, esq=None, factor=NoFolha(op="numero", valor="2", linha=17), sinal="+"), esq=NoInterno(op="factor", dir=None, esq=None, factor=NoFolha(op="id", valor="a", linha=17), sinal="+"), oper="^"), esq=NoInterno(op="factor", dir=None, esq=None, factor=NoFolha(op="id", valor="soma", linha=17), sinal="+"), oper="<"), sinal="+"), oper="e"), oper=None))), statement=NoInterno(op="assignStatement", id=NoFolha(op="id", valor="s", linha=16), texto=NoFolha(op="texto", valor="Programar em FOFI é muito divertido", linha=16))), statement=NoInterno(op="assignStatement", expression=NoInterno(op="expression", dir=None, esq=NoInterno(op="factor", dir=None, esq=None, factor=NoFolha(op="binario", valor="f", linha=15), sinal="+"), oper=None), id=NoFolha(op="id", valor="c", linha=15))), statement=NoInterno(op="assignStatement", expression=NoInterno(op="expression", dir=None, esq=NoInterno(op="sumExpression", dir=NoInterno(op="factor", dir=None, esq=None, factor=NoFolha(op="id", valor="b", linha=10), sinal="+"), esq=NoInterno(op="factor", dir=None, esq=None, factor=NoFolha(op="id", valor="a", linha=10), sinal="+"), oper="+"), oper=None), id=NoFolha(op="id", valor="soma", linha=10))), statement=NoInterno(op="assignStatement", expression=NoInterno(op="expression", dir=None, esq=NoInterno(op="factor", dir=None, esq=None, factor=NoInterno(op="factor", dir=None, esq=None, factor=NoFolha(op="numero", valor="2", linha=9), sinal="+"), sinal=NoFolha(op="opsum", valor="-", linha=9)), oper=None), id=NoFolha(op="id", valor="b", linha=9))), statement=NoInterno(op="assignStatement", expression=NoInterno(op="expression", dir=None, esq=NoInterno(op="factor", dir=None, esq=None, factor=NoFolha(op="numero", valor="0", linha=8), sinal="+"), oper=None), id=NoFolha(op="id", valor="a", linha=8)))), id=NoFolha(op="texto", valor="Este programa é mais complexo que o primeiro", linha=2), var_declaration_list=NoInterno(op="varDeclarationList", prox=NoInterno(op="varDeclarationList", prox=NoInterno(op="varDeclarationList", prox=None, varDeclaration=NoInterno(op="varDeclaration", identifierList=NoInterno(op="identifierList", id=NoFolha(op="id", valor="s", linha=6), prox=None), type=NoFolha(op="type", valor="texto", linha=6))), varDeclaration=NoInterno(op="varDeclaration", identifierList=NoInterno(op="identifierList", id=NoFolha(op="id", valor="c", linha=5), prox=NoInterno(op="identifierList", id=NoFolha(op="id", valor="aconteceu", linha=5), prox=None)), type=NoFolha(op="type", valor="binario", linha=5))), varDeclaration=NoInterno(op="varDeclaration", identifierList=NoInterno(op="identifierList", id=NoFolha(op="id", valor="a", linha=4), prox=NoInterno(op="identifierList", id=NoFolha(op="id", valor="b", linha=4), prox=NoInterno(op="identifierList", id=NoFolha(op="id", valor="soma", linha=4), prox=None))), type=NoFolha(op="type", valor="numero", linha=4))))
  analisador = AnalisadorSemantico(listaNos)
  print(analisador.analisar())
  