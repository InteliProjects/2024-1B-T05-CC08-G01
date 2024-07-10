from src.services.sintatico_service import SintaticoService
from src.services.Token import NoInterno, NoFolha, SemanticException,NoTabela

class SemanticoService:
  
    def __init__(self, string):
        """
        Construtor do analisador semântico: recebe a árvore sintática e inicializa a tabela de símbolos.
        """
        arvore_sintatica= SintaticoService(string).analisar()
        self.arvore = arvore_sintatica
        self.tabela = {}

    def analisar(self):
        """
        Método que inicia a análise semântica.
        """
        print("\n")
        print(self.arvore,"\n<------")
        analise = self.visitarProgram()
        print("Semantico concluido")
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
        print("no",no)
        if no.op == "assignStatement":
            self.visitarAssignStatement(no)
        elif no.op == "ifStatement":
            self.visitarIfStatement(no)
        

    def visitarAssignStatement(self, noAssignStatement):
        """
        Método que visita um comando de atribuição.
        """
        print(f"noAssign: {noAssignStatement}")
        leftValue = noAssignStatement.get("id")
        print(f"noAssignStatement: {leftValue} \n")
        
        self.verificaSeFoiDeclarado(leftValue)
        
        if noAssignStatement.get("expression"):
            expression = self.visitarExpression(noAssignStatement.get("expression"))
            self.verificaDoisTipos(self.tabela[leftValue.valor].tipo, expression.tipo)
            # self.verificaTipoIdentificadorExpressao(leftValue, expression)
            self.tabela[leftValue.valor].valor = expression.valor
        elif noAssignStatement.get("texto"):
            print("entrou aq")
            self.verificaDoisTipos(self.tabela[leftValue.valor].tipo, noAssignStatement.get("texto").op)
            self.tabela[leftValue.valor].valor = noAssignStatement.get("texto")
        elif noAssignStatement.get("input_statement"):
            input_statement = self.VisitarInputStatement(noAssignStatement.get("input_statement"))
            self.tabela[leftValue.valor].valor = input_statement.valor


        
    def VisitarInputStatement(self, noInputStatement):

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
        esq = self.visitarSumExpression(no.get("esq"))
        # print(f"esq: {esq}")
        # print(f"no: {no}")
        if no.get("oper") != None:
            dir = self.visitarSumExpression(no.get("dir"))
            return NoTabela(f"{esq.valor} {no.get('oper')} {dir.valor}", "binario")
        else:
            return esq
        
    def visitarSumExpression(self, noSumExpression):
        if noSumExpression != None:
            val1 = self.visitarSumExpression(noSumExpression.get("esq"))
            # print(f"val1: {val1}")
            
            val2 = self.visitarSumExpression(noSumExpression.get("dir"))
            # print(f"val2: {val2}")
            
            if noSumExpression.op == "sumExpression" or noSumExpression.op == "multTerm" or noSumExpression.op == "powerTerm":
                # print(f"noSumExpression entrou no if sum: {noSumExpression} \n")
                # print(f"val1 e val2: {val1} e {val2}")
                # print(f"noSumExpression.get('oper'): {noSumExpression.get('oper')}, val1: {val1}, val2: {val2}")
                self.verificaTipos(val1, val2)
                self.verificaDivisaoPorZero(val2, noSumExpression.get("oper"))
                self.verificaExpoenteNegativo(val2, noSumExpression.get("oper"))
                if val1 != None:
                    # print(f"entrou no return val1: {val1}")
                    return val1
                else:
                    # print(f"entrou no return val2: {val2}")
                    return val2
                
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
            print(f'O identificador "{noFolha.valor}" na linha {noFolha.linha} já foi declarado.')
            raise SemanticException({"variavel":{noFolha.valor},"linha":{noFolha.linha},"status":503,"type":1})


    def verificaSeFoiDeclarado(self, noFolha):
        """
        Método que verifica se uma variável foi declarada.
        """
        
        print(f"nofolha dentro do verifica: {noFolha}")
        if noFolha.valor not in self.tabela:
            print(f'O identificador "{noFolha.valor}" na linha {noFolha.linha} não foi declarado.')
            raise SemanticException({"variavel":{noFolha.valor},"linha":{noFolha.linha},"status":503,"type":2})


    def verificaDoisTipos(self, tipo1, tipo2):
        """
        Método que verifica se dois tipos são iguais.
        """
        print(f"{tipo1}, {tipo2} --------------> entro")
        if tipo1 != tipo2:
            print(f'Tipos incompatíveis: "{tipo1}" e "{tipo2}"')
            raise SemanticException({"variavel":[tipo1,tipo2],"linha":None,"status":503,"type":3})


    def verificaDivisaoPorZero(self, val2, oper):
        """
        Método que verifica se houve uma divisão por zero.
        """
        if oper == "/" and val2.tipo == "num" and int(val2.valor) == 0:
            raise SemanticException({"variavel":None,"linha":{val2.get("linha")},"status":503,"type":4})

    
    def verificaSeFoiDeclaradoEInicializado(self, noFolha):
        self.verificaSeFoiDeclarado(noFolha)
        if self.tabela[noFolha.valor].valor == None:
            raise SemanticException({"variavel":{noFolha.valor},"linha":{noFolha.linha},"status":503,"type":5})


    def verificaExpoenteNegativo(self, val2, oper):
        if oper == "^" and val2.tipo == "num" and int(val2.valor) < 0:
            raise SemanticException({"variavel":None,"linha":{val2.get("linha")},"status":503,"type":6})
    
    def verificaTipos(self, val1, val2):
        if val1.tipo != val2.tipo:
            raise SemanticException({"variavel":[val1.valor,val2.valor],"linha":None,"status":503,"type":7})
    
    def verificaTipoString(self, no):
        if no.op != "texto":
            raise SemanticException({"variavel": no.op,"linha":None,"status":503,"type":8})
