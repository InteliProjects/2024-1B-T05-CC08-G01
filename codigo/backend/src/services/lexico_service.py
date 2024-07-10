import re
from src.services.Token import Token, LexicalException

"""
Classe responsável pela análise léxica de um código fonte.
"""
class LexicoService:

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

    """
    Inicializa a instância da classe LexicoService com o código fonte a ser analisado.
    """
    def __init__(self, codigo):
        self.linha = 1
        self.codigo = codigo
        self.remove_comentario()
        self.get_tokens()
        
        pass

    """
    Remove comentários do código fonte.
    """
    def remove_comentario(self):
        codigo = str(self.codigo)
        # Remove comentários multilinha e de linha única
        x = re.sub(r'/\#(.*?)\#/', lambda m: '\n' * m.group(1).count('\n'), codigo, flags=re.DOTALL)
        self.codigo = re.sub(r'#.*?\n', '\n', x, flags=re.DOTALL)

    """
    Analisa o código fonte e extrai os tokens utilizando expressões regulares para identificar diferentes tipos de componentes léxicos.
    """
    def get_tokens(self):
        # Expressões regulares para identificar operadores e outros componentes
        oprel_re= re.compile(r"!=|<=|>=|=|>|<")
        opsum_re= re.compile(r"\+|-")
        opmul_re= re.compile(r"\*|/|%")
        oppow_re= re.compile(r"\^")
        codigo = str(self.codigo)
        pos = 0
        linha = self.linha  # Certifique-se de usar self.linha aqui
        listat=[]
        while pos < len(codigo):
            carac=codigo[pos]
            if carac == "\n":
                linha = linha +1  # Atualize linha usando self.linha
            elif carac == " ":
                pass
            elif carac == "\r":
                pass
            # Logica dos caracteres "especiais"
            elif carac in "(:,{;\")}":
               # listat.append(Token(LexicoService.simbolos[carac],carac,self.linha))  # Use self.linha aqui
                listat.append(Token(LexicoService.simbolos[carac], carac, linha))

                palavra = ""
                #Logica da String
                if carac == "\"" : # Processamento de strings
                    pos = pos +1 
                    #Pega a string completa dentro do range entre os parenteses
                    while pos < len(codigo):
                        if codigo[pos] == "\"" and (codigo[pos+1] in re.findall(r'[();",\n]',codigo[pos+1])) :
                            # listat.append(Token("STR",palavra,self.linha))  # Use self.linha aqui
                            # listat.append(Token(LexicoService.simbolos[carac],carac,self.linha))  # Use self.linha aqui
                            listat.append(Token("STR", palavra, linha))
                            listat.append(Token(LexicoService.simbolos[carac], carac, linha))

                            break
                        else:
                            palavra=palavra+codigo[pos]
                            pos = pos + 1
                                
            elif match := oprel_re.match(codigo, pos):
                oprel= match.group()
                #listat.append(Token("OPREL", oprel, self.linha))  # Use self.linha aqui
                listat.append(Token("OPREL", oprel, linha))

                pos += len(oprel) - 1
                    
            elif match := opsum_re.match(codigo, pos):
                opsum= match.group()
                #listat.append(Token("OPSUM", opsum, self.linha))  # Use self.linha aqui
                listat.append(Token("OPSUM", opsum, linha))


            elif match := opmul_re.match(codigo, pos):
                opmul= match.group()
                #listat.append(Token("OPMUL", opmul, self.linha))  # Use self.linha aqui
                listat.append(Token("OPMUL", opmul, linha))

            elif match := oppow_re.match(codigo, pos):
                oppow= match.group()
                #listat.append(Token("OPPOW", oppow, self.linha))  # Use self.linha aqui
                listat.append(Token("OPPOW", oppow, linha))

                
            #Logica das palavra                
            elif carac in re.findall(r'[_a-zA-Z0-9]',carac):
                palavra = ""
                inteiro_palavra=""
                while pos < len(codigo) and codigo[pos] in re.findall(r'[_a-zA-Z0-9]',codigo[pos]):
                    palavra = palavra + codigo[pos]
                    try:
                        inteiro_palavra= int(palavra)
                        if codigo[pos+1] in re.findall(r'[( ),;\^!= <= >= => < \*/%\+-]',codigo[pos+1]):
                            #listat.append(Token("INT", inteiro_palavra, self.linha))  # Use self.linha aqui
                            listat.append(Token("INT", inteiro_palavra, linha))
                            break
                    except:                        
                        if palavra not in LexicoService.simbolos and (codigo[pos+1] in re.findall(r'[(,:;" " \^ )!= <= >= => < \* / % \+ - \n]',codigo[pos+1])):
                            #listat.append(Token("ID",palavra,self.linha))  # Use self.linha aqui
                            listat.append(Token("ID", palavra, linha))

                            break
                        if palavra in LexicoService.simbolos and (codigo[pos+1] in re.findall(r'[(,;" " \^ ) {!= <= >= => < \* / % \+ - \n]',codigo[pos+1])):
                            #listat.append(Token(LexicoService.simbolos[palavra],palavra,self.linha))  # Use self.linha aqui
                            listat.append(Token(LexicoService.simbolos[palavra], palavra, linha))

                            break
                    pos = pos +1
                    # print(linha,"linhaaaaaaaaaaaaa---->")
                else:
                    raise LexicalException({"carac":codigo[pos], "linha":linha,"status":501})  # Use self.linha aqui
            else:
                    raise LexicalException({"carac":codigo[pos], "linha":linha,"status":501})  # Use self.linha aqui
                    # return codigo[pos], linha,501  # Use self.linha aqui
            pos= pos+1
        #listat.append(Token("EOF", "EOF", self.linha))  # Use self.linha aqui
        listat.append(Token("EOF", "EOF", linha))
        print(listat)
        return listat
        