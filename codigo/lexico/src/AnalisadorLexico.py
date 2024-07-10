import re
from Token import Token


class SimboloNaoEncontradoError(Exception):
    def __init__(self, simbolo, linha):
        super().__init__(f"Simbolo '{simbolo}' nao encontrado na linha {linha}.")

    
    """
Classe que implementa um analisador léxico para um subconjunto da linguagem de programação
que pode reconhecer tipos de dados, operadores, palavras reservadas e estruturas de controle básicas.

Atributos:
    simbolos (dict): Dicionário que mapeia palavras-chave e símbolos especiais para seus respectivos tipos de tokens.
    linha (int): Mantém o controle da linha atual no código fonte para rastreamento de erros.
    codigo (str): Armazena o código fonte a ser analisado.
    
Métodos:
    __init__(self, codigo): Inicializa o analisador com o código fonte e prepara a análise removendo comentários.
    remove_comentario(self): Remove os comentários do código fonte, substituindo-os por espaços em branco ou quebras de linha.
    getTokens(self): Processa o código fonte para extrair os tokens, utilizando expressões regulares para identificar os componentes léxicos.
"""

class AnalisadorLexico:
    
    simbolos= {
    'programa': "PROGRAMA", 
    'var': "VAR", 
    'binario': "TYPE", 
    'numero': "TYPE", 
    'texto': "TYPE", 
    'se': "SE", 
    'senao': "SENAO", 
    'nao': "NAO", 
    'enquanto': "ENQUANTO", 
    'repita': "REPITA", 
    'ler_numero': "FUNCIN", 
    'ler_binario': "FUNCIN", #
    'ler': "FUNCIN", #
    'consultar': "FUNCIN", #
    'criar_figura': "FUNCIN", 
    'criar_imagem': "FUNCIN", 
    'colidiu': "FUNCIN",
    'aleatorio': "FUNCIN",
    'v': "BOOL", 
    'f': "BOOL", 
    ':': "ASSIGN", 
    ',': "COMMA", 
    ';': "SEMICOLON", 
    '"': "DQUOTE", 
    '(': "LPAR", 
    ')': "RPAR", 
    '{': "LBLOCK", 
    '}': "RBLOCK",
    #Phd
        "=": "OPREL",
    "!=": "OPREL",
    "<": "OPREL",
    "<=": "OPREL",
    ">": "OPREL",
    ">=": "OPREL",
    "+": "OPSUM",
    "-": "OPSUM",
    "ou": "OPSUM",
    "*": "OPMUL",
    "/": "OPMUL",
    "%": "OPMUL",
    "e": "OPMUL",
    "^": "OPPOW",
    "EOF": "EOF",
    "mostrar": "FUNCOUT",
    "limpar": "FUNCOUT",
    "inicializar_com_cor": "FUNCOUT",
    "inicializar_com_imagem": "FUNCOUT",
    "redefinir_figura": "FUNCOUT",
    "redefinir_imagem": "FUNCOUT",
    "mover": "FUNCOUT",
    "destacar": "FUNCOUT",
    "reverter_destaque": "FUNCOUT",
    "tocar": "FUNCOUT",
    "esperar": "FUNCOUT" 
	}

    def __init__(self,codigo):
        """
        Inicializa a instância do analisador léxico, configurando o código fonte e removendo os comentários.
        """
        self.linha = 1
        self.codigo = codigo
        self.remove_comentario()
        self.getTokens()
        pass

    def remove_comentario(self):
        """
        Remove os comentários do código fonte para simplificar a análise léxica.
        """
        codigo = str(self.codigo)
        # Remove comentários multilinha e de linha única
        x = re.sub(r'/\#(.*?)\#/', lambda m: '\n' * m.group(1).count('\n'), codigo, flags=re.DOTALL)
        self.codigo = re.sub(r'#.*?\n', '\n', x, flags=re.DOTALL)


    def getTokens(self):
        """
        Analisa o código fonte e extrai os tokens utilizando expressões regulares para identificar diferentes tipos de componentes léxicos.
        """
        # Expressões regulares para identificar operadores e outros componentes
        oprel_re= re.compile(r"!=|<=|>=|=|>|<")
        opsum_re= re.compile(r"\+|-")
        opmul_re= re.compile(r"\*|/|%")
        oppow_re= re.compile(r"\^")

        codigo = str(self.codigo)
        # print(codigo)
        pos = 0
        linha = self.linha
        listat=[]
        while pos < len(codigo):
            carac=codigo[pos]
            if carac == "\n":
                linha = linha +1
            elif carac == " ":
                pass
                # print("") 
            elif carac == "\r":
                pass
                # print("")
            # Logica dos caracteres "especiais"
            elif carac in "(:,{;\")}:":
                listat.append(Token(AnalisadorLexico.simbolos[carac],carac,linha))
                palavra = ""
                #Logica da String
                if carac == "\"" : # Processamento de strings
                    pos = pos +1 
                    #Pega a string completa dentro do range entre os parenteses
                    while pos < len(codigo):
                        # print(palavra)
                        if codigo[pos] == "\"" and (codigo[pos+1] in re.findall(r'[;"""# "\n]',codigo[pos+1])) :
                            listat.append(Token("STR",palavra,linha))
                            listat.append(Token(AnalisadorLexico.simbolos[carac],carac,linha))
                            break
                        else:
                            palavra=palavra+codigo[pos]
                            pos = pos + 1
 
            elif match := oprel_re.match(codigo, pos):
                oprel= match.group()
                listat.append(Token("OPREL", oprel, linha))
                pos += len(oprel) - 1
                
            elif match := opsum_re.match(codigo, pos):
                opsum= match.group()
                listat.append(Token("OPSUM", opsum, linha))
                
            elif match := opmul_re.match(codigo, pos):
                opmul= match.group()
                listat.append(Token("OPMUL", opmul, linha))
                
            elif match := oppow_re.match(codigo, pos):
                oppow= match.group()
                listat.append(Token("OPPOW", oppow, linha))
            
            #Logica das palavra                
            elif carac in re.findall(r'[_a-zA-Z0-9]',carac):
                palavra = ""
                inteiro_palavra=""
                while pos < len(codigo) and codigo[pos] in re.findall(r'[_a-zA-Z0-9]',codigo[pos]):
                    palavra = palavra + codigo[pos]
                    try:
                    #Se a palavra nao estiver dentro do dicionario simbolos e ela estiver acabada ela é um ID
                        inteiro_palavra= int(palavra)
                        if codigo[pos+1] in re.findall(r'[( ),;\^ != <= >= => < \*/%\+-]',codigo[pos+1]):
                            listat.append(Token("INT", inteiro_palavra, linha))
                            break
                    except:                        
                    #Se a palavra não estiver dentro do dicionario simbolos e ela estiver acabada adiciona ID no Token
                        if palavra not in AnalisadorLexico.simbolos and (codigo[pos+1] in re.findall(r'[( ,;" " : \^ ) \n]',codigo[pos+1])):
                            listat.append(Token("ID",palavra,linha))
                            break
                    #Se a palavra estiver dentro do dicionario simbolos e ela estiver acabada ela é um tipo descrito no dicionario
                        if palavra in AnalisadorLexico.simbolos and (codigo[pos+1] in re.findall(r'[( ,;" " \^ ) { \n]',codigo[pos+1])):
                            listat.append(Token(AnalisadorLexico.simbolos[palavra],palavra,linha))
                            break
                    pos = pos +1
                else:
                    raise SimboloNaoEncontradoError(codigo[pos], linha)
            else:
                raise SimboloNaoEncontradoError(carac, linha)
            pos= pos+1
        listat.append(Token("EOF", "EOF", linha))
        # print(listat)
        return listat
            



            
        # print(0)
    
if __name__ == "__main__":
    
    # for i in range(0,15):
    with open(r'./codigo13.w', 'r',encoding='utf-8') as arquivo:
        codigo=str(arquivo.read())
        # print(codigo)

    analisador = AnalisadorLexico(codigo)
    print(analisador.getTokens())
    pass 

    
