from src.services.Token import NoInterno, NoFolha
from src.services.semantico_service import SemanticoService

class GeradorService:
    """
    Classe responsável por gerar código JavaScript a partir de uma árvore sintática analisada.
    
    Atribuições:
        - arvoreSintatica: Árvore sintática analisada pelo serviço semântico.
    """
    def __init__(self, arvoreSintatica):
        """
        Inicializa o objeto GeradorService com a árvore sintática fornecida.
        
        Parâmetros:
            arvoreSintatica (obj): Árvore sintática analisada pelo serviço semântico.
        """
        arvore_sintatica= SemanticoService(arvoreSintatica).analisar()
        print("\n")
        print(arvore_sintatica)
        print("\n")
        
        self.saida = ""
        self.arvore = arvore_sintatica
        # Você pode modificar e/ou criar seus atributos a partir daqui:
        self.mod = ""  # é necessário guardar informação referente à declaração "implicit mod"
        self.numTabs = -1  # é necessário guardar o nível de indentação
        # O nível -1 não existe, mas toda vez que entrarmos num block, este atributo será incrementado.
        self.simboloTab = "    "  # sugestão: utilize 4 espaços como indentação. Você pode usar este atributo como uma constante
        self.varNum = 0  # Contador de variáveis temporárias
        # Crie mais atributos se achar necessário:
    

    def gerarJS(self):
        """
        Gera o código JavaScript a partir da árvore sintática.
        
        Retorna:
            str: Código JavaScript gerado.
        """

        # self.saida += f"\n// Código gerado a partir do programa \"{self.arvore.get('id').valor}\"\n"
        # self.saida += "import { CanvasManager } from './CanvasManager.js';\n"
        self.saida += f"// Inicialização de variáveis\n"
        # self.saida += f"const canvasManager = new CanvasManager(\"tutorial\", \"imagens\");\n"
        self.saida += f"async function main(){{\n"
        self.visitarVarDeclarationList(self.arvore.get("var_declaration_list"))
        self.saida += f"// Início do código\n"
        self.visitarBlock(self.arvore.get("block"))
        # self.saida += "window.addEventListener(\"load\", () => canvasManager.draw());\n"
        self.saida += "}\n"
        self.saida += "main();\n"
        return self.saida
    
    def visitarVarDeclarationList(self, noVarDeclarationList):
        """
        Visita recursivamente cada declaração de variáveis em uma lista de declarações de variáveis.

        Este método verifica se a lista de declarações de variáveis não é nula. Se não for nula, adiciona um novo
        bloco de código (uma nova linha) ao código gerado, extrai a primeira declaração de variáveis da lista,
        visita essa declaração usando o método `visitarVarDeclaration`, e então verifica se existe uma próxima
        declaração de variáveis na lista. Se houver, visita essa próxima declaração recursivamente. Retorna o
        código gerado como uma string.

        :param noVarDeclarationList: Nó da AST que representa a lista de declarações de variáveis a ser processada.
        :return: Código gerado como uma string.
        """
        if noVarDeclarationList is not None:
            self.saida += "\n"
            varDeclaration = noVarDeclarationList.get("varDeclaration")
            prox = noVarDeclarationList.get("prox")
            self.visitarVarDeclaration(varDeclaration)
            if prox!= None:
                self.visitarVarDeclarationList(prox)
        else:
            return self.saida
        


    def visitarVarDeclaration(self, noVarDeclaration):
        """
        Inicializa variáveis para uma lista de identificadores com valores padrão baseados no tipo de dado.

        Este método percorre a lista de identificadores, inicializando cada variável com um valor padrão
        baseado no tipo de dado especificado. Os tipos de dados suportados incluem números, textos e binários,
        além de um comportamento padrão para outros tipos de dados.

        :param noIdentifierList: Nó da AST que representa a lista de identificadores a ser processada.
        :param type: Tipo de dado das variáveis a serem inicializadas, opcional.
        """
        identifierList= noVarDeclaration.get("identifierList")
        type= noVarDeclaration.get("type")

        self.visitarIdentifierList(identifierList, type)    

        return self.saida
    
    def visitarIdentifierList(self, noIdentifierList, type=None):
        """
        Inicializa variáveis para uma lista de identificadores com valores padrão baseados no tipo de dado.

        Este método percorre a lista de identificadores, inicializando cada variável com um valor padrão
        baseado no tipo de dado especificado. Os tipos de dados suportados incluem números, textos e binários,
        além de um comportamento padrão para outros tipos de dados.

        :param noIdentifierList: Nó da AST que representa a lista de identificadores a ser processada.
        :param type: Tipo de dado das variáveis a serem inicializadas, opcional.
        """
        id = noIdentifierList.get("id")
        prox = noIdentifierList.get("prox")

        if type.valor == "numero":
            self.saida += f"let {id.valor} = 0;\n"
        elif type.valor == "texto":
            self.saida += f"let {id.valor} = \"\";\n"
        elif type.valor == "binario":
            self.saida += f"let {id.valor} = false;\n"
        else:
            self.saida += f"let {id.valor};\n"

        if prox is not None:
            self.visitarIdentifierList(prox, type)

    def visitarBlock(self, noBlock):
        """
        Visita recursivamente cada declaração em um bloco de código.

        Este método extrai a lista de declarações do bloco e visita cada declaração na lista usando o método
        `visitarStatementList`. Isso permite processar sequencialmente todas as declarações contidas no bloco.

        :param noBlock: Nó da AST que representa o bloco de código a ser processado.
        """
        statementList= noBlock.get("statementList")
        if statementList == None:
            pass
        else: 
            self.visitarStatementList(statementList)    
               
    def visitarStatementList(self, noStatementList):
        """
        Visita recursivamente cada declaração em uma lista de declarações.

        Este método extrai a primeira declaração da lista e a visita usando o método `visitarStatement`.
        Em seguida, verifica se existe uma próxima declaração na lista e, caso exista, visita essa declaração
        recursivamente. Este processo continua até que todas as declarações na lista tenham sido visitadas.

        :param noStatementList: Nó da AST que representa a lista de declarações a ser processada.
        """
        statement= noStatementList.get("statement")
        prox= noStatementList.get("prox")
        self.visitarStatement(statement)
        if prox != None:
            self.visitarStatementList(prox)

    def visitarStatement(self, noStatement):
        """
        Decide qual método visitar com base no tipo de operação do nó da AST.

        Este método verifica o tipo de operação (`op`) do nó da AST passado como argumento e chama o método
        correspondente para gerar o código JavaScript apropriado para essa operação. Suporta várias operações,
        incluindo atribuições, estruturas condicionais, loops e comandos personalizados.

        :param noStatement: Nó da AST que representa a declaração a ser processada.
        """
        if noStatement.op == "assignStatement":
            self.visitarAssignStatement(noStatement)
        if noStatement.op == "ifStatement":
            self.visitarifStatement(noStatement)
        if noStatement.op == "whileStatement":
            self.visitarWhileStatement(noStatement)
        if noStatement.op == "repeatStatement":
            self.visitarRepeatStatement(noStatement)
        if noStatement.op == "commandStatement":
            self.visitarCommandStatement(noStatement)
        else:
            pass
    
    def visitarAssignStatement(self, noAssignStatement):
        """
        Gera um bloco de código JavaScript para uma instrução de atribuição a partir de uma declaração de atribuição.

        Este método analisa uma declaração de atribuição, identifica o identificador e a expressão a serem atribuídos,
        e verifica se há uma declaração de entrada ou texto a serem tratados de forma especial. Gera o código JavaScript
        correspondente para a instrução de atribuição, incluindo a atribuição do valor à variável especificada.

        :param noAssignStatement: Nó da AST que representa a declaração de atribuição a ser processada.
        """
        id= noAssignStatement.get("id")
        expression_no= noAssignStatement.get("expression")
        if noAssignStatement.get("inputStatement") is not None:
            print("Input Statement", noAssignStatement.get("inputStatement"), "\n")
            inputStatement= noAssignStatement.get("inputStatement")
            inputStatement_return= self.visitarInputStatement(inputStatement)
            self.saida += f"{id.valor} = {inputStatement_return};\n"
            return self.saida
        if expression_no != None:
            expression= self.visitarExpression(expression_no)
            self.saida += f"{id.valor} = {expression};\n"
            return self.saida
        if expression_no == None and noAssignStatement.get("texto") != None:
            string= noAssignStatement.get("texto")
            self.saida += f"{id.valor} = \"{string.valor}\";\n"
            return self.saida
    
    def visitarifStatement(self, noIfStatement):
        """
        Gera um bloco de código JavaScript para uma estrutura condicional 'if...else' a partir de uma declaração 'if'.

        Este método analisa uma declaração 'if', identifica a expressão condicional que define a condição do bloco 'if'
        e visita os blocos de código dentro dos blocos 'if' e 'else'. Gera o código JavaScript correspondente para uma
        estrutura condicional 'if...else', incluindo a condição do bloco 'if' e opcionais blocos 'else'.

        :param noIfStatement: Nó da AST que representa a declaração 'if' a ser processada.
        """
        expression = self.visitarExpression(noIfStatement.get("expression"))
        self.varNum = 0
        self.saida += f"{self.simboloTab * (self.numTabs)}if ({expression}){{\n"
        self.visitarBlock(noIfStatement.get("blockIf"))
        self.saida += "}\n"
        if noIfStatement.get("blockElse"):
            self.saida += f"{self.simboloTab * (self.numTabs)}else {{\n"
            self.visitarBlock(noIfStatement.get("blockElse"))
            self.saida += "}\n"

    def visitarWhileStatement(self, noWhileStatement):
        """
        Gera um bloco de código JavaScript para um loop 'while' a partir de uma declaração 'while'.

        Este método analisa uma declaração 'while', identifica a expressão condicional que define a condição do loop
        e visita o bloco de código dentro do loop. Gera o código JavaScript correspondente para um loop 'while',
        incluindo a condição do loop.

        :param noWhileStatement: Nó da AST que representa a declaração 'while' a ser processada.
        """
        self.varNum = 0
        expression = self.visitarExpressionWhile(noWhileStatement.get("expression"))
        print("Expression VALOR", expression, "\n")
        self.saida += f"{self.simboloTab * (self.numTabs)}while ({expression}){{\n"
        self.visitarBlock(noWhileStatement.get("block"))
        self.saida += "}\n"
    
    def visitarRepeatStatement(self, noRepeatStatement):
        """
        Gera um bloco de código JavaScript para um loop 'for' a partir de uma declaração de repetição.

        Este método analisa uma declaração de repetição, identifica a expressão somatória que define o número de vezes
        que o loop deve ser executado e visita o bloco de código dentro do loop. Gera o código JavaScript correspondente
        para um loop 'for', incluindo a inicialização da variável de controle do loop e a condição de continuação.

        :param noRepeatStatement: Nó da AST que representa a declaração de repetição a ser processada.
        """
        self.varNum = 0
        sumExpression = self.visitarSumExpression(noRepeatStatement.get("sumExpression"))
        self.saida += f"{self.simboloTab * (self.numTabs)}for (let i = 0; i < {sumExpression}; i++){{\n"
        self.visitarBlock(noRepeatStatement.get("block"))
        self.saida += "}\n"

    def visitarInputStatement(self, noInputStatement):
        """
        Processa declarações de entrada, como leitura de dados e criação de figuras/imagens.

        Este método analisa diferentes tipos de declarações de entrada, como leitura de números, textos, criação de figuras e imagens,
        e executa ações correspondentes. Utiliza métodos auxiliares para processar parâmetros conforme necessário e gera variáveis temporárias
        para armazenar os resultados dessas ações. Adiciona a instrução resultante à saída.

        :param noInputStatement: Dicionário contendo a declaração de entrada a ser processada.
        :return: Nome da variável temporal utilizada para armazenar o resultado da declaração de entrada.
        """
        tipo= noInputStatement.get("tipo")

        match tipo:
            case "aleatorio":
                parametros_list= noInputStatement.get("parametros")
                parametros= parametros_list[0]
                parametros2= parametros_list[1]
                
                if isinstance(parametros, NoInterno):
                    if parametros.op == "factor":
                        parametros1_value= self.visitarFactor(parametros)
                    if parametros.op == "sumExpression":
                        parametros1_value= self.visitarSumExpression(parametros)

                if isinstance(parametros, NoFolha):
                   # parametros1_value= f"\"{parametros.valor}\"";  
                    parametros1_value= {parametros.valor};  

                if isinstance(parametros2, NoInterno):
                    if parametros2.op == "factor":
                        parametros2_value= self.visitarFactor(parametros2)
                    if parametros2.op == "sumExpression":
                        parametros2_value= self.visitarSumExpression(parametros2)

                if isinstance(parametros2, NoFolha):
                    parametros2_value= {parametros.valor};  

                temp= self.criarTemp()
                self.saida += f"{temp}= aleatorio({parametros1_value}, {parametros2_value})\n"
                return temp
            case "ler_numero":
                parametros_list= noInputStatement.get("parametros")
                parametros= parametros_list[0]

                if isinstance(parametros, NoInterno):
                    parametros_value= self.visitarFactor(parametros)
                if isinstance(parametros, NoFolha):
                    parametros_value= f"\"{parametros.valor}\"";  
                    print(parametros_value)  
                
                temp= self.criarTemp()
                self.saida += f"{temp}= lerNumero({parametros_value})\n"
                return temp
            case "ler_binario":
                parametros_list= noInputStatement.get("parametros")
                parametros= parametros_list[0]

                if isinstance(parametros, NoInterno):
                    parametros_value= self.visitarFactor(parametros)
                if isinstance(parametros, NoFolha):
                    parametros_value= f"\"{parametros.valor}\"";  
                    print(parametros_value)  
                
                temp= self.criarTemp()
                self.saida += f"{temp}= lerBinario({parametros_value})\n"
                return temp
            case "ler":
                temp = self.criarTemp()
                self.saida += f"{temp}= ler()\n"
                return temp
            case "consultar":
                temp= self.criarTemp()
                self.saida += f"{temp}= consultar()\n"
                return temp
            case "criar_figura":
                parametros_list= noInputStatement.get("parametros")
                tipo= parametros_list[0]
                cor= parametros_list[1]
                x= parametros_list[2]
                y= parametros_list[3]
                tamanho= parametros_list[4]

                if isinstance(tipo, NoInterno):
                    tipo_value= self.visitarFactor(tipo)
                if isinstance(tipo, NoFolha):
                    tipo_value= f"\"{tipo.valor}\"";  

                if isinstance(cor, NoInterno):
                    cor_value= self.visitarFactor(cor)
                if isinstance(cor, NoFolha):
                    cor_value= f"\"{cor.valor}\"";  
                
                if isinstance(x, NoInterno):
                    if x.op == "factor":
                        x_value= self.visitarFactor(x)
                    if x.op == "sumExpression":
                        x_value= self.visitarSumExpression(x)          
                if isinstance(x, NoFolha):
                    x_value= x.valor; 
                
                if isinstance(y, NoInterno):
                    if y.op == "factor":
                        y_value= self.visitarFactor(y)
                    if y.op == "sumExpression":
                        y_value= self.visitarSumExpression(y)
                if isinstance(y, NoFolha):
                    y_value= {cor.valor};  
                
                if isinstance(tamanho, NoInterno):
                    if tamanho.op == "factor":
                        tamanho_value= self.visitarFactor(tamanho)
                    if tamanho.op == "sumExpression":
                        tamanho_value= self.visitarSumExpression(tamanho)
                if isinstance(tamanho, NoFolha):
                    tamanho_value= {cor.valor}; 
                
                temp= self.criarTemp()
                self.saida += f"{temp}= criarFigura({tipo_value}, {cor_value}, {x_value}, {y_value}, {tamanho_value})\n"
                return temp
            case "criar_imagem":
                parametros_list= noInputStatement.get("parametros")
                arq= parametros_list[0]
                x= parametros_list[1]
                y= parametros_list[2]

                if isinstance(arq, NoInterno):
                    arq_value= self.visitarFactor(arq)
                if isinstance(arq, NoFolha):
                    arq_value= f"\"{arq.valor}\"";  
                
                if isinstance(x, NoInterno):
                    if x.op == "factor":
                        x_value= self.visitarFactor(x)
                    if x.op == "sumExpression":
                        x_value= self.visitarSumExpression(x)    
                if isinstance(x, NoFolha):
                    x_value= x.valor; 
                
                if isinstance(y, NoInterno):
                    if y.op == "factor":
                        y_value= self.visitarFactor(y)
                    if y.op == "sumExpression":
                        y_value= self.visitarSumExpression(y)
                if isinstance(y, NoFolha):
                    y_value= {cor.valor}; 
    
                temp= self.criarTemp()
                self.saida += f"{temp}= criarImagem({arq_value}, {x_value}, {y_value})\n"
                return temp
            case "colidiu":
                parametros_list= noInputStatement.get("parametros")
                ref1= parametros_list[0]
                ref2= parametros_list[1]

                if isinstance(ref1, NoInterno):
                    if ref1.op == "factor":
                        ref1_value= self.visitarFactor(ref1)
                    if ref1.op == "sumExpression":
                        ref1_value= self.visitarSumExpression(ref1)
                if isinstance(ref1, NoFolha):
                    ref1_value= ref1.valor; 
                
                if isinstance(ref2, NoInterno):
                    if ref2.op == "factor":
                        ref2_value= self.visitarFactor(ref2)
                    if ref2.op == "sumExpression":
                        ref2_value= self.visitarSumExpression(ref2)
                if isinstance(ref2, NoFolha):
                    ref2_value= {ref2.valor}; 
    
                temp= self.criarTemp()
                self.saida += f"{temp}= colidiu({ref1_value}, {ref2_value})\n"
                return temp

            

    def visitarCommandStatement(self, noCommandStatement):
        """
        Método para visitar uma declaração de comando e gerar o código correspondente.

        Este método analisa o tipo de comando fornecido na declaração de comando e executa a ação apropriada,
        gerando o código necessário para executar essa ação. Os comandos suportados incluem mostrar, limpar,
        inicializar com cor, inicializar com imagem, redefinir figura, redefinir imagem, mover, destacar,
        reverter destaque, tocar e esperar.

        :param noCommandStatement: Dicionário contendo a declaração de comando a ser processada.
        :return: Uma string contendo o código gerado para executar a ação do comando.
        """
        tipo= noCommandStatement.get("tipo")

        match tipo:
            case "mostrar":
                parametros_list= noCommandStatement.get("parametros")
                parametros= parametros_list[0]
        
                print("Parametros", parametros, "\n")
                if isinstance(parametros, NoInterno):
                    if parametros.op == "factor":
                        parametros_value= self.visitarFactor(parametros)
                    if parametros.op == "sumExpression":
                        parametros_value= self.visitarSumExpression(parametros)
                if isinstance(parametros, NoFolha):
                    parametros_value= f"\"{parametros.valor}\"";  
                    print(parametros_value)  
                
                self.saida += f"mostrar({parametros_value});\n"
                return self.saida;
            case "limpar":
                self.saida += f"limpar();\n"
                return self.saida
            case "inicializar_com_cor":
                parametros_list= noCommandStatement.get("parametros")
                cor= parametros_list[0]

                if isinstance(cor, NoInterno):
                    cor_value= self.visitarFactor(cor);
                if isinstance(cor, NoFolha):
                    cor_value= f"\"{cor.valor}\"";
                
                self.saida += f"inicializarComCor({cor_value});\n"
                return self.saida
            case "inicializar_com_imagem":
                parametros_list= noCommandStatement.get("parametros")
                arq= parametros_list[0]

                if isinstance(arq, NoInterno):
                    arq_value= self.visitarFactor(arq)
                if isinstance(arq, NoFolha):
                    arq_value= f"\"{arq.valor}\""
    
                self.saida += f"inicializarComImagem({arq_value});\n"
                return self.saida
            case "redefinir_figura":
                parametros_list= noCommandStatement.get("parametros")
                ref= parametros_list[0]
                tipo= parametros_list[1]
                cor= parametros_list[2]
                x= parametros_list[3]
                y= parametros_list[4]
                tamanho= parametros_list[5]

                if isinstance(ref, NoInterno):
                    if ref.op == "factor":
                        ref_value= self.visitarFactor(ref)
                    if ref.op == "sumExpression":
                        ref_value= self.visitarSumExpression(ref)
                if isinstance(ref, NoFolha):
                    ref_value= ref.valor
                
                if isinstance(tipo, NoInterno):
                    tipo_value= self.visitarFactor(tipo)
                if isinstance(tipo, NoFolha):
                    tipo_value= f"\"{tipo.valor}\""

                if isinstance(cor, NoInterno):
                    cor_value= self.visitarFactor(cor)
                if isinstance(cor, NoFolha):
                    cor_value= f"\"{cor.valor}\""

                if isinstance(x, NoInterno):
                    if x.op == "factor":
                        x_value= self.visitarFactor(x)
                    if x.op == "sumExpression":
                        x_value= self.visitarSumExpression(x)
                if isinstance(x, NoFolha):
                    x_value= x.valor

                if isinstance(y, NoInterno):
                    if y.op == "factor":
                        y_value= self.visitarFactor(y)
                    if y.op == "sumExpression":
                        y_value= self.visitarSumExpression(y)
                if isinstance(y, NoFolha):
                    y_value= y.valor
                
                if isinstance(tamanho, NoInterno):
                    if tamanho.op == "factor":
                        tamanho_value= self.visitarFactor(tamanho)
                    if tamanho.op == "sumExpression":
                        tamanho_value= self.visitarSumExpression(tamanho)
                if isinstance(tamanho, NoFolha):
                    tamanho_value= tamanho.valor
                
                self.saida += f"redefinirFigura({ref_value}, {tipo_value}, {cor_value}, {x_value}, {y_value}, {tamanho_value});\n"
                return self.saida
            case "redefinir_imagem":
                parametros_list= noCommandStatement.get("parametros")
                ref= parametros_list[0]
                arq= parametros_list[1]
                x= parametros_list[2]
                y= parametros_list[3]

                if isinstance(ref, NoInterno):
                    if ref.op == "factor":
                        ref_value= self.visitarFactor(ref)
                    if ref.op == "sumExpression":
                        ref_value= self.visitarSumExpression(ref)
                if isinstance(ref, NoFolha):
                    ref_value= ref.valor
                
                if isinstance(arq, NoInterno):
                    arq_value= self.visitarFactor(arq)
                if isinstance(arq, NoFolha):
                    arq_value= f"\"{arq.valor}\""
                
                if isinstance(x, NoInterno):
                    if x.op == "factor":
                        x_value= self.visitarFactor(x)
                    if x.op == "sumExpression":
                        x_value= self.visitarSumExpression(x)
                if isinstance(x, NoFolha):
                    x_value= x.valor

                if isinstance(y, NoInterno):
                    if y.op == "factor":
                        y_value= self.visitarFactor(y)
                    if y.op == "sumExpression":
                        y_value= self.visitarSumExpression(y)
                if isinstance(y, NoFolha):
                    y_value= y.valor
                
                self.saida += f"redefinirImagem({ref_value}, {arq_value}, {x_value}, {y_value});\n"
                return self.saida
            case "mover":
                parametros_list= noCommandStatement.get("parametros")
                ref= parametros_list[0]
                dx= parametros_list[1]
                dy= parametros_list[2]

                if isinstance(ref, NoInterno):
                    if ref.op == "factor":
                        ref_value= self.visitarFactor(ref)
                    if ref.op == "sumExpression":
                        ref_value= self.visitarSumExpression(ref)
                if isinstance(ref, NoFolha):
                    ref_value= ref.valor
                
                if isinstance(dx, NoInterno):
                    if dx.op == "factor":
                        dx_value= self.visitarFactor(dx)
                    if dx.op == "sumExpression":
                        dx_value= self.visitarSumExpression(dx)
                if isinstance(dx, NoFolha):
                    dx_value= dx.valor

                if isinstance(dy, NoInterno):
                    if dy.op == "factor":
                        dy_value= self.visitarFactor(dy)
                    if dy.op == "sumExpression":
                        dy_value= self.visitarSumExpression(dy)
                if isinstance(dy, NoFolha):
                    dy_value= dy.valor
                
                self.saida += f"mover({ref_value}, {dx_value}, {dy_value});\n"
                return self.saida
            
            case "destacar":
                parametros_list= noCommandStatement.get("parametros")
                ref= parametros_list[0]

                if isinstance(ref, NoInterno):
                    if ref.op == "factor":
                        ref_value= self.visitarFactor(ref)
                    if ref.op == "sumExpression":
                        ref_value= self.visitarSumExpression(ref)
                if isinstance(ref, NoFolha):
                    ref_value= ref.valor
                
                self.saida += f"destacar({ref_value});\n"
                return self.saida
            
            case "reverter_destaque":
                self.saida += f"reverterDestaque();\n"
                return self.saida
            case "tocar":
                parametros_list= noCommandStatement.get("parametros")
                arq= parametros_list[0]

                if isinstance(arq, NoInterno):
                    if arq.op == "factor":
                        arq_value= self.visitarFactor(arq)
                    if arq.op == "sumExpression":
                        arq_value= self.visitarSumExpression(arq)
                if isinstance(arq, NoFolha):
                    arq_value= f"\"{arq.valor}\""
    
                self.saida += (
                        f'document.addEventListener("click", function () {{ '
                        f'document.getElementById("audio").play(); tocar({arq_value});}}, '
                        f'{{ once: true }});  \n'
                    )                
                return self.saida
            case "esperar":
                parametros_list= noCommandStatement.get("parametros")

                t= parametros_list[0]

                print("Parametros list ", t, "\n")

                if isinstance(t, NoInterno):
                    if t.op == "factor":
                        t_value= self.visitarFactor(t)
                    if t.op == "sumExpression":
                        t_value= self.visitarSumExpression(t)
                if isinstance(t, NoFolha):
                    t_value= t.valor
                
                self.saida += f"await esperar({t_value});\n"
                return self.saida

    def criarTemp(self, oper=None):
        """
        Gera variáveis temporárias baseadas no tipo de operação fornecida.

        Esta função cria e retorna nomes de variáveis temporárias específicos para diferentes tipos de operações lógicas (OU, E,!),
        aritméticas (+, -, *, /, ^, %) e relativas (>, <, =,!=, >=, <=). O contador `varNum` é usado para garantir que cada variável temporal seja única.

        :param oper: String representando o tipo de operação para a qual a variável temporal será criada.
        :return: Uma string contendo o nome da variável temporal criada ou um par de valores (nome da variável e operador substituto) para operações especiais como '^'.
        """
        self.varNum= 0
        if oper == None:
            self.varNum += 1
            return f"_TEMP_VAR{self.varNum}"
        if oper == "ou" or oper == "e" or oper == "!":
            self.varNum += 1
            return f"_TEMP_VAR_LOG{self.varNum}"
        if oper == "+" or oper == "-":
            self.varNum += 1
            return f"_TEMP_VAR_SUM{self.varNum}"
        if oper == "*" or oper == "/":
            self.varNum += 1
            return f"_TEMP_VAR_MUL{self.varNum}"
        if oper == "^":
            self.varNum += 1
            oper= "**"
            return f"_TEMP_VAR_POW{self.varNum}", oper
        if oper == "%":
            self.varNum += 1
            return f"_TEMP_VAR_MOD{self.varNum}"
        if oper == ">" or oper == "<" or oper == "=" or oper == "!=" or oper == ">=" or oper == "<=":
            self.varNum += 1
            return f"_TEMP_VAR_REL{self.varNum}"
        
    def visitarExpressionWhile(self, noExpression):
        """
        Processa expressões condicionais em um loop WHILE.

        Esta função analisa uma expressão condicional dentro de um loop WHILE, avaliando a expressão esquerda e direita
        com base na operação especificada (>, <, =,!=, >=, <=). Cria variáveis temporárias conforme necessário
        para armazenar os resultados intermediários das operações. Retorna uma string contendo a expressão completa
        após a avaliação.

        :param noExpression: Dicionário contendo a expressão condicional a ser processada.
        :return: Uma string representando a expressão condicional avaliada.
        """
        print("No Expression", noExpression, "\n")
        expression_esq= noExpression.get("esq")

        expression_dir= noExpression.get("dir")
        oper= noExpression.get("oper")

        if oper == ">":
            if expression_esq is not None and expression_esq.op == "factor":
                expression_esq_return= self.visitarFactor(expression_esq)
            else:
                expression_esq_return= self.visitarSumExpression(expression_esq);


            if expression_dir is not None and expression_dir.op == "factor":
                print("ENTREI")
                expression_dir_return= self.visitarFactor(expression_dir)
            else:
                print("Expression Dir", expression_dir, "\n")
                expression_dir_return= self.visitarSumExpression(expression_dir);
            
            temp= self.criarTemp(oper)
            valor_expression= f"{expression_esq_return} {oper} {expression_dir_return}"
            return valor_expression
        if oper == "<":
            if expression_esq is not None and expression_esq.op == "factor":
                expression_esq_return= self.visitarFactor(expression_esq)
            else:
                expression_esq_return= self.visitarSumExpression(expression_esq);

            if expression_dir is not None and expression_dir.op == "factor":
                expression_dir_return= self.visitarFactor(expression_dir)
            else:
                expression_dir_return= self.visitarSumExpression(expression_dir);
            
            valor_expression= f"{expression_esq_return} {oper} {expression_dir_return}"
            return valor_expression
        if oper == "=":

            if expression_esq is not None and expression_esq.op == "factor":
                expression_esq_return= self.visitarFactor(expression_esq)
            else:
                expression_esq_return= self.visitarSumExpression(expression_esq);

            if expression_dir is not None and expression_dir.op == "factor":
                expression_dir_return= self.visitarFactor(expression_dir)
            else:
                expression_dir_return= self.visitarSumExpression(expression_dir);

            temp= self.criarTemp(oper)
            
            valor_expression= f"{expression_esq_return} {oper} {expression_dir_return}"
            return valor_expression
        if oper == "!=":
            if expression_esq is not None and expression_esq.op == "factor":
                expression_esq_return= self.visitarFactor(expression_esq)
            else:
                expression_esq_return= self.visitarSumExpression(expression_esq);

            if expression_dir is not None and expression_dir.op == "factor":
                expression_dir_return= self.visitarFactor(expression_dir)
            else:
                expression_dir_return= self.visitarSumExpression(expression_dir);
            
            temp= self.criarTemp(oper)
            valor_expression= f"{expression_esq_return} {oper} {expression_dir_return}"
            return valor_expression
        if oper == ">=":
            if expression_esq is not None and expression_esq.op == "factor":
                expression_esq_return= self.visitarFactor(expression_esq)
            else:
                expression_esq_return= self.visitarSumExpression(expression_esq);

            if expression_dir is not None and expression_dir.op == "factor":
                expression_dir_return= self.visitarFactor(expression_dir)
            else:
                expression_dir_return= self.visitarSumExpression(expression_dir);
            temp= self.criarTemp(oper)
            valor_expression= f"{expression_esq_return} {oper} {expression_dir_return}"
            return valor_expression
        if oper == "<=":
            if expression_esq is not None and expression_esq.op == "factor":
                expression_esq_return= self.visitarFactor(expression_esq)
            else:
                expression_esq_return= self.visitarSumExpression(expression_esq);

            if expression_dir is not None and expression_dir.op == "factor":
                expression_dir_return= self.visitarFactor(expression_dir)
            else:
                expression_dir_return= self.visitarSumExpression(expression_dir);
            temp= self.criarTemp(oper)
            valor_expression= f"{expression_esq_return} {oper} {expression_dir_return}"
            return valor_expression
        
        if expression_esq is not None and expression_esq.op == "sumExpression":
            sumExpressionEsq= self.visitarSumExpression(expression_esq)
            return sumExpressionEsq
        if expression_dir is not None and expression_dir.op == "sumExpression":
            sumExpressionDir= self.visitarSumExpression(expression_dir)
            return sumExpressionDir
        if expression_esq is not None and expression_esq.op == "multTerm":
            print("Expression Esq GUI", expression_esq, "\n")
            multExpressionEsq= self.visitarSumExpression(expression_esq)
            return multExpressionEsq
        if expression_dir is not None and expression_dir.op == "multTerm":
            multExpressionDir= self.visitarSumExpression(expression_dir)
            return multExpressionDir
        if expression_esq is not None and expression_esq.op == "factor":
            factor_value = self.visitarFactor(expression_esq)
            return factor_value
        if expression_dir is not None and expression_dir.op == "factor":
            factor_value = self.visitarFactor(expression_dir)
            return factor_value

        
    def visitarExpression(self, noExpression):
        """
        Processa expressões binárias e atribuições.

        Esta função analisa expressões binárias e atribuições, avaliando a expressão esquerda e direita
        com base na operação especificada (>, <, =,!=, >=, <=). Cria variáveis temporárias conforme necessário
        para armazenar os resultados intermediários das operações. Adiciona a expressão resultante à saída
        e retorna o nome da variável temporal utilizada.

        :param noExpression: Dicionário contendo a expressão a ser processada.
        :return: Nome da variável temporal utilizada para armazenar o resultado da expressão.
        """
        print("No Expression", noExpression, "\n")
        expression_esq= noExpression.get("esq")

        expression_dir= noExpression.get("dir")
        oper= noExpression.get("oper")

        if oper == ">":
            if expression_esq is not None and expression_esq.op == "factor":
                expression_esq_return= self.visitarFactor(expression_esq)
            else:
                expression_esq_return= self.visitarSumExpression(expression_esq);

            if expression_dir is not None and expression_dir.op == "factor":
                expression_dir_return= self.visitarFactor(expression_dir)
            else:
                expression_dir_return= self.visitarSumExpression(expression_dir);
            
            temp= self.criarTemp(oper)
            self.saida += f"{temp}= {expression_esq_return} > {expression_dir_return}; \n"
            return temp
        if oper == "<":
            if expression_esq is not None and expression_esq.op == "factor":
                expression_esq_return= self.visitarFactor(expression_esq)
            else:
                expression_esq_return= self.visitarSumExpression(expression_esq);

            if expression_dir is not None and expression_dir.op == "factor":
                expression_dir_return= self.visitarFactor(expression_dir)
            else:
                expression_dir_return= self.visitarSumExpression(expression_dir);
            
            temp= self.criarTemp(oper)
            self.saida += f"{temp}= {expression_esq_return} < {expression_dir_return}; \n"
            return temp
        if oper == "=":

            if expression_esq is not None and expression_esq.op == "factor":
                expression_esq_return= self.visitarFactor(expression_esq)
            else:
                expression_esq_return= self.visitarSumExpression(expression_esq);

            if expression_dir is not None and expression_dir.op == "factor":
                expression_dir_return= self.visitarFactor(expression_dir)
            else:
                expression_dir_return= self.visitarSumExpression(expression_dir);

            temp= self.criarTemp(oper)
          
            self.saida += f"{temp}= {expression_esq_return} == {expression_dir_return}; \n"
            return temp
        if oper == "!=":
            if expression_esq is not None and expression_esq.op == "factor":
                expression_esq_return= self.visitarFactor(expression_esq)
            else:
                expression_esq_return= self.visitarSumExpression(expression_esq);

            if expression_dir is not None and expression_dir.op == "factor":
                expression_dir_return= self.visitarFactor(expression_dir)
            else:
                expression_dir_return= self.visitarSumExpression(expression_dir);
            
            temp= self.criarTemp(oper)
            self.saida += f"{temp}= {expression_esq_return} != {expression_dir_return}; \n"
            return temp
        if oper == ">=":
            if expression_esq is not None and expression_esq.op == "factor":
                expression_esq_return= self.visitarFactor(expression_esq)
            else:
                expression_esq_return= self.visitarSumExpression(expression_esq);

            if expression_dir is not None and expression_dir.op == "factor":
                expression_dir_return= self.visitarFactor(expression_dir)
            else:
                expression_dir_return= self.visitarSumExpression(expression_dir);
            temp= self.criarTemp(oper)
            self.saida += f"{temp}= {expression_esq_return} >= {expression_dir_return}; \n"
            return temp
        if oper == "<=":
            if expression_esq is not None and expression_esq.op == "factor":
                expression_esq_return= self.visitarFactor(expression_esq)
            else:
                expression_esq_return= self.visitarSumExpression(expression_esq);

            if expression_dir is not None and expression_dir.op == "factor":
                expression_dir_return= self.visitarFactor(expression_dir)
            else:
                expression_dir_return= self.visitarSumExpression(expression_dir);
            temp= self.criarTemp(oper)
            self.saida += f"{temp}= {expression_esq_return} <= {expression_dir_return}; \n"
            return temp

        if expression_esq is not None and expression_esq.op == "sumExpression":
            sumExpressionEsq= self.visitarSumExpression(expression_esq)
            return sumExpressionEsq
        if expression_dir is not None and expression_dir.op == "sumExpression":
            sumExpressionDir= self.visitarSumExpression(expression_dir)
            return sumExpressionDir
        if expression_esq is not None and expression_esq.op == "multTerm":
            print("Expression Esq GUI", expression_esq, "\n")
            multExpressionEsq= self.visitarSumExpression(expression_esq)
            return multExpressionEsq
        if expression_dir is not None and expression_dir.op == "multTerm":
            multExpressionDir= self.visitarSumExpression(expression_dir)
            return multExpressionDir
        if expression_esq is not None and expression_esq.op == "factor":
            factor_value = self.visitarFactor(expression_esq)
            return factor_value
        if expression_dir is not None and expression_dir.op == "factor":
            factor_value = self.visitarFactor(expression_dir)
            return factor_value
        

    def visitarSumExpression(self, noSumExpression):
        """
        Processa expressões de soma e outras operações relacionadas.

        Esta função analisa expressões de soma, incluindo termos múltiplos e potências, avaliando a expressão esquerda e direita
        com base na operação especificada. Utiliza recursivamente métodos para processar subexpressões e gera variáveis temporárias
        conforme necessário. Adiciona a expressão resultante à saída e retorna o nome da variável temporal utilizada.

        :param noSumExpression: Dicionário contendo a expressão de soma a ser processada.
        :return: Nome da variável temporal utilizada para armazenar o resultado da expressão.
        """
        print("No Sum Expression", noSumExpression, "\n")
        
        oper= noSumExpression.get("oper")
        
        if noSumExpression.op == "factor":	
            factor= noSumExpression.get("factor")
            factor1= self.visitarFactor(factor)
            return factor1
            

        if noSumExpression != None:
            esq= noSumExpression.get("esq")
            dir= noSumExpression.get("dir")
            print("Esq", esq, "\n")
            print("Dir", dir, "\n")
            
            if noSumExpression.op == "sumExpression":

                operator= noSumExpression.get("oper")
                
                if isinstance(esq, str):
                    esq_folha= esq
                if isinstance(dir, str):	
                    dir_folha= dir
                if esq.op == "factor":
                    esq_folha= self.visitarFactor(esq)

                if dir.op == "factor":
                    dir_folha= self.visitarFactor(dir)

                if isinstance(esq, NoInterno) and esq.op != "factor":
                    esq_folha= self.visitarSumExpression(esq)
                if isinstance(dir, NoInterno) and dir.op != "factor":
                    dir_folha= self.visitarSumExpression(dir)

                temp= self.criarTemp(operator)

                if operator == "ou":
                    operator= "||" 
                    self.saida += f"{temp} = ({esq_folha}) {operator} ({dir_folha}); \n"
                    return temp
                if operator == "e":
                    operator= "&&" 
                    self.saida += f"{temp} = ({esq_folha}) {operator} ({dir_folha}); \n"
                    return temp
                self.saida += f"{temp} = {esq_folha} {operator} {dir_folha}; \n"
                return temp
            
            elif noSumExpression.op == "multTerm":

                operator= noSumExpression.get("oper")

                if isinstance(esq, str):
                    esq_folha= esq
                if isinstance(dir, str):	
                    dir_folha= dir
                if esq.op == "factor":
                    esq_folha= self.visitarFactor(esq)
                if dir.op == "factor":
                    dir_folha= self.visitarFactor(dir)


                if isinstance(esq, NoInterno) and esq.op != "factor":
                    print("Esq MUL", esq, "\n")
                    esq_folha= self.visitarSumExpression(esq)
                if isinstance(dir, NoInterno) and dir.op != "factor":
                    dir_folha= self.visitarSumExpression(dir)

                temp= self.criarTemp(operator)
                if operator == "ou":
                    operator= "||" 
                    self.saida += f"{temp} = ({esq_folha}) {operator} ({dir_folha}); \n"
                    return temp
                if operator == "e":
                    operator= "&&" 
                    self.saida += f"{temp} = ({esq_folha}) {operator} ({dir_folha}); \n"
                    return temp
                self.saida += f"{temp} = {esq_folha} {operator} {dir_folha}; \n"
                return temp
            elif noSumExpression.op == "powerTerm":

                operator= noSumExpression.get("oper")

                if isinstance(esq, str):
                    esq_folha= esq
                if isinstance(dir, str):	
                    dir_folha= dir
                if esq.op == "factor" and dir.op == "factor":
                    esq_folha= self.visitarFactor(esq)
                    print("esqq", esq_folha, "\n")

                if dir.op == "factor" and esq.op == "factor":
                    dir_folha= self.visitarFactor(dir)
                    print("dirrr", dir_folha, "\n")
                print("OLA", esq)
                if hasattr(esq, 'expression') and esq.get("expression") is not None and esq.op == "factor":
                    print("OLA")
                    esq= self.visitarExpression(esq) 

                if hasattr(dir, 'expression') and dir.get("expression") is not None and dir.op == "factor":
                    print("TUDO BEM")
                    dir= self.visitarExpression(dir)
                if isinstance(esq, NoInterno) and esq.op != "factor":
                    esq_folha= self.visitarSumExpression(esq)
                if isinstance(dir, NoInterno) and dir.op != "factor":
                    dir_folha= self.visitarSumExpression(dir)

                [temp, oper]= self.criarTemp(operator)


                self.saida += f"{temp} = {esq_folha} {oper} {dir_folha}; \n"
                return temp
    
    def visitarFactor(self, noFactor, sinal_fora_alg=None):
        """
        Processa fatores, que podem ser valores folha ou expressões internas.

        Este método analisa fatores, que podem ser valores folha (como números, booleanos, texto) ou expressões internas,
        e realiza operações como negação ou multiplicação por -1 se aplicável. Gera variáveis temporárias conforme necessário
        e adiciona a expressão resultante à saída.

        :param noFactor: Objeto que representa o fator a ser processado.
        :param sinal_fora_alg: Sinal externo aplicável ao fator, como negação ou não.
        :return: Valor do fator processado ou nome da variável temporal utilizado.
        """
        print("No Factor", noFactor, "\n")
        op= noFactor.op
        
        if (isinstance(noFactor, NoFolha)):
            factor= noFactor.valor
        if (isinstance(noFactor, NoInterno)):
            factor= noFactor.get("factor")
            sinal= noFactor.get("sinal")

            if noFactor.get("expression") != None:
                print("Toma expressao ", noFactor.get("expression"), "\n")     
                expression = self.visitarExpression(noFactor.get("expression"))
                return expression
            if (isinstance(sinal, NoFolha)):
                sinal_fora_alg= sinal.valor
        
        if hasattr(noFactor, 'expression') and noFactor.get("expression") is not None:   
            expression_value= self.visitarExpression(noFactor.get("expression"))
            temp= self.criarTemp(sinal_fora_alg)
            self.saida += f"{temp}= !({expression_value}) \n"
            return temp
        
        if isinstance(factor, NoFolha):
            factor_value= factor.valor
 
            if factor.op == "texto" and factor_value != None:
                return f"\"{factor_value}\""
            if factor_value == "v" and factor.op == "binario":
                return "true"
            if factor_value == "f" and factor.op == "binario":
                return "false"
            if factor_value != None or factor != None:
                if sinal_fora_alg is not None and sinal_fora_alg == "-":
                    temp = self.criarTemp()
                    self.saida +=  f"{temp}= -{factor_value}; \n"
                    return temp
                if sinal_fora_alg is not None and sinal_fora_alg == "nao":
                    temp = self.criarTemp()
                    self.saida +=  f"{temp}= !({factor_value}); \n"
                    return temp
                return factor_value
            
        if isinstance(factor, NoInterno):
            factor_value= self.visitarFactor(factor, sinal_fora_alg)
            return factor_value
        return factor
    
if __name__ == "__main__":
	"""
	Caso você queira testar o seu código na mão, pode usar este espaço para implementar os seus testes.
	Apenas mantenha todo o código indentado dentro do bloco deste if, pois ele não será executado quando
	você rodar os testes unitários, e quando o professor for corrigir a sua atividade.
	"""
	arvoreSintatica= NoInterno(op="program", block=NoInterno(op="block", statementList=NoInterno(op="statementList", prox=NoInterno(op="statementList", prox=NoInterno(op="statementList", prox=None, statement=NoInterno(op="commandStatement", parametros=[], tipo="limpar")), statement=NoInterno(op="ifStatement", blockElse=NoInterno(op="block", statementList=NoInterno(op="statementList", prox=None, statement=NoInterno(op="commandStatement", parametros=[NoInterno(op="factor", dir=None, esq=None, factor=NoFolha(op="int", valor="20", linha=11), sinal="+")], tipo="mostrar"))), blockIf=NoInterno(op="block", statementList=NoInterno(op="statementList", prox=NoInterno(op="statementList", prox=None, statement=NoInterno(op="ifStatement", blockElse=None, blockIf=NoInterno(op="block", statementList=NoInterno(op="statementList", prox=None, statement=NoInterno(op="commandStatement", parametros=[NoFolha(op="texto", valor="musica.mp3", linha=8)], tipo="tocar"))), expression=NoInterno(op="expression", dir=None, esq=NoInterno(op="factor", dir=None, esq=None, factor=NoFolha(op="binario", valor="f", linha=7), sinal="+"), oper=None))), statement=NoInterno(op="commandStatement", parametros=[NoInterno(op="sumExpression", dir=NoInterno(op="factor", dir=None, esq=None, factor=NoFolha(op="int", valor="1", linha=6), sinal="+"), esq=NoInterno(op="factor", dir=None, esq=None, factor=NoFolha(op="int", valor="10", linha=6), sinal="+"), oper="+")], tipo="esperar"))), expression=NoInterno(op="expression", dir=None, esq=NoInterno(op="factor", dir=None, esq=None, factor=NoFolha(op="binario", valor="v", linha=5), sinal="+"), oper=None))), statement=NoInterno(op="commandStatement", parametros=[NoFolha(op="texto", valor="Ola mundo!", linha=4)], tipo="mostrar"))), id=NoFolha(op="texto", valor="Descrição do programa", linha=1), var_declaration_list=None)
	gerador = GeradorService(arvoreSintatica)
	codigoJS = gerador.gerarJS()
	print(codigoJS)

