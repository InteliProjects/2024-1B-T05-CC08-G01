// Inicialização de variáveis
async function main() {
  let r1 = 0;
  let r2 = 0;
  let r3 = 0;
  let r4 = 0;
  let r5 = 0;
  let r6 = 0;
  let i = 0;
  let delta = 0;
  let startX = 0;
  let startY = 0;
  let setWhile = 0;

  let c = false;
  let sair = false;
  let isMoving = false;
  // Início do código
  inicializarComCor("grey");
  _TEMP_VAR1 = criarImagem("monica.png", 350, 10);
  r6 = _TEMP_VAR1;
  delta = 2;
  setWhile = 1;
  while (sair) {
    i = 2;
    while (setWhile >= 1) {
      await esperar(15);
      mover(r1, 0, delta);
      mover(r2, 0, delta);
      mover(r3, 0, delta);
      mover(r4, 0, delta);
      _TEMP_VAR1 = colidiu(r1, r6);
      c = _TEMP_VAR1;
      if (c) {
        mostrar("End Game");
      }
      _TEMP_VAR1 = colidiu(r2, r6);
      c = _TEMP_VAR1;
      if (c) {
        mostrar("End Game");
      }
      _TEMP_VAR1 = colidiu(r3, r6);
      c = _TEMP_VAR1;
      if (c) {
        mostrar("End Game");
      }
      _TEMP_VAR1 = colidiu(r4, r6);
      c = _TEMP_VAR1;
      if (c) {
        mostrar("End Game");
      }
      _TEMP_VAR1 = colidiu(r5, r6);
      c = _TEMP_VAR1;
      if (c) {
        mostrar("End Game");
      }
      _TEMP_VAR_SUM1 = i + 1;
      i = _TEMP_VAR_SUM1;
      _TEMP_VAR_REL1 = i >= 500;
      if (_TEMP_VAR_REL1) {
        mover(r1, 0, 0);
        mover(r1, 10, 10);
        mover(r2, 0, 0);
        mover(r2, 150, 10);
        mover(r3, 0, 0);
        mover(r3, 300, 10);
        mover(r4, 0, 0);
        mover(r4, 450, 10);
        _TEMP_VAR_MUL1 = 10 / 100;
        _TEMP_VAR_MUL1 = delta * _TEMP_VAR_MUL1;
        _TEMP_VAR_SUM1 = delta + _TEMP_VAR_MUL1;
        delta = _TEMP_VAR_SUM1;
        _TEMP_VAR_MUL1 = 10 / 100;
        _TEMP_VAR_MUL1 = i * _TEMP_VAR_MUL1;
        _TEMP_VAR_SUM1 = i + _TEMP_VAR_MUL1;
        i = _TEMP_VAR_SUM1;
        setWhile = 0;
      }
    }
  }
}
main();
