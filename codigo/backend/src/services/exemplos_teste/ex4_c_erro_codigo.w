programa "Este programa é mais complexo que o primeiro"
var
    numero a, b, soma;
    binario c, aconteceu;
    texto s;
{
    a : 0;
    b : -2;  # ignore este comentário
    soma : a + b;
    /#
    este é um comentário
    de múltiplas linhas
    #/
    c : f;
    s : "Programar em FOFI é muito divertido";
    se ((soma < a^2) e ((b <= -2) ou (c = v))) {
        aconteceu : nao c;
        mostrar(s);
    } senao {
        # esta linha deve ser ignorada e contabilizada
        b : consultar();
        repita(5) {
            soma : 16 + 2 * 3 - b;
            enquanto (SOMA != 0) {
                mostrar(a);
                sOmA : (b ^ 3 ^ 4) / a;
            }
        }
    }
    a = aleatorio(-10, 2);
}
