# Repositório do Grupo 2024-1B-T05-CC08-G01

Este é o repositório do projeto do grupo 2024-1B-T05-CC08-G01.

<table>
<tr>
<td>
<a href= "https://www.fm.usp.br/fofito/portal/"> <img src="artefatos/img/fmusp-logo.svg" alt="Faculdade de Medicina da USP" border="0" width="90%"></a>
</td>
<td><a href= "https://www.inteli.edu.br/"><img src="artefatos/img/inteli-logo.png" alt="Inteli - Instituto de Tecnologia e Liderança" border="0" width="35%"></a>
</td>
</tr>
</table>


## Projeto: Tapete sensorial como recurso lúdico para assistência a crianças com Transtorno do Espectro Autista.

## Grupo: Fofuxos

## Integrantes:

- [Guilherme Moura](https://www.linkedin.com/in/guilhermejmoura/)

- [Marcos Teixeira](https://www.linkedin.com/in/marcos-teixeira-37676a24a/)

- [Samuel Almeida](https://www.linkedin.com/in/samuel-lucas-almeida/)

- [Tony Sousa](https://www.linkedin.com/in/tonyjonas/)

- [Yago Phellipe](https://www.linkedin.com/in/yago-phellipe/)


## Descrição

O projeto tem como objetivo desenvolver um dispositivo de tecnologia assistiva, para ser utilizado na estimulação de crianças com TEA na assistência em Terapia
Ocupacional, através de estratégias lúdicas e relacionadas a integração sensorial, promovendo-se intervenções inovadoras para esta população, bem como experiências multiprofissionais e interdisciplinares para os alunos envolvidos.

## Configurações para desenvolvimento

Para rodar o projeto, é necessário ter o Docker, Python e Node.js instalados.

### Requisitos

- [Docker](https://docs.docker.com/get-docker/)
- [Python](https://www.python.org/downloads/)
- [Node.js](https://nodejs.org/en/download/)

### Backend

#### Preparação do Ambiente

1. **Inicializar o Banco de Dados**

   Com o Docker instalado, vá até a pasta `backend` e execute o comando abaixo para inicializar o banco de dados:

   ```bash
   docker-compose up -d
   ```

2. **Configurar o Ambiente Virtual e Instalar Dependências**

   Se houver pastas `venv` e `migrations` previamente criadas, exclua-as antes de continuar.

   Crie um ambiente virtual e instale as dependências necessárias:

   ```bash
   python -m venv venv
   source venv/bin/activate  # Para Windows, use: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Criar as Tabelas no Banco de Dados**

   Inicialize, migre e atualize o banco de dados:

   ```bash
   flask db init
   flask db migrate
   flask db upgrade
   ```

4. **Executar o Servidor**

   Execute o servidor com o comando:

   ```bash
   flask run
   ```

### Frontend

Para rodar o frontend, siga os passos abaixo na pasta `frontend`:

1. **Instalar as Dependências**

   ```bash
   npm install
   ```

2. **Buildar o Projeto**

   ```bash
   npm build
   ```

3. **Iniciar o Servidor**

   ```bash
   npm start
   ```

---

# Tags 

- SPRINT 1
    - Compreensão da Experiência do Usuário
    - Análise de Negócios
    - Especificação da Arquitetura do Sistema

- SPRINT 2
    - Ambiente de Desenvolvimento Integrado (IDE) - Primeira Versão
    - Rascunho Inicial do Artigo
    - Implementação do Analisador Léxico

- SPRINT 3
    - Desenvolvimento do Analisador Sintático
    - Ambiente de Desenvolvimento Integrado (IDE) - Segunda Versão
    - Segunda Versão do Artigo

- SPRINT 4
    - Implementação do Analisador Semântico e Geração de Código
    - Ambiente de Desenvolvimento Integrado (IDE) - Terceira Versão
    - Terceira Versão do Artigo

- SPRINT 5
    - Versões Finais dos Analisadores Léxico, Sintático e Semântico
    - Aprimoramento do Ambiente de Desenvolvimento Integrado (IDE)
    - Versão Final do Artigo
    - Organização do Repositório no Github

## Links Úteis

- [Documentação do Docker](https://docs.docker.com/get-docker/)
- [Download do Python](https://www.python.org/downloads/)
- [Download do Node.js](https://nodejs.org/en/download/)

Este readme fornece as instruções básicas para configurar e executar o projeto. Certifique-se de que todas as dependências estão instaladas corretamente antes de prosseguir com os comandos.

## Licença
<p align="center" style="display: flex; align-items: center; justify-content: left; gap: 10px;">
  <a href="https://creativecommons.org/licenses/by/4.0/?ref=chooser-v1">Este projeto está licenciado sob a licença Attribution 4.0 International (CC BY 4.0)</a>
  <img src="https://mirrors.creativecommons.org/presskit/icons/cc.xlarge.png" width="30" title="hover text">
  <img src="https://mirrors.creativecommons.org/presskit/icons/by.xlarge.png" width="30" alt="accessibility text">
</p>
