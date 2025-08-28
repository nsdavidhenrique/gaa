# Gestão de Atividades Administrativas
  GAA é um projeto que tem o propósito de corrigir problemas administrativos relacionados a alocação de pessoas para certas demandas e ao acompanhamento dessas demandas.

  O nome foi escolhido para ser similar a outro sistema já utilizado, o GAN (Gestão Administrativa de negócios).

### Problemas
Os principais problemas encontrados pela equipe administrativa são:
- Atraso na entrega de demandas.
- Dificuldade em distribuir demandas.
- Falhas de comunicação.
- Pendencias esquecidas por falta de registro.

### Proposta
A criação de um aplicativo movel, com as funções:
- Criação de tarefas com:
    - Descrição.
    - Responsável pela tarefa.
    - Prazo de conclusão.
    - Status de pendente, em andamento ou finalizado .
- Visualização de tarefas por status ou colaborador.
- Análise de criação/conclusão de tarefas por colaborador ou por data.

## Tecnologias
Linguagens:
- [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [Python](https://docs.python.org/3/reference/index.html)
- [SQL](https://www.sqlite.org/docs.html)

Tecnologias usadas são:
- [Node.js](https://nodejs.org/pt)
- [Python](https://www.python.org/downloads/)
- [Git](https://git-scm.com/downloads) (opcional)
- [SQLite](https://www.sqlite.org/download.html) (opcional)
- [Java JDK](https://www.oracle.com/java/technologies/downloads/) (opcional)
- [Android Studio](https://developer.android.com/studio?hl=pt-br) (opcional)

Bibliotecas usadas são:
- [React](https://react.dev/reference/react)
- [React-native](https://reactnative.dev/docs/getting-started)
- [JSX](https://pt-br.legacy.reactjs.org/docs/introducing-jsx.html)
- [Expo](https://docs.expo.dev/)
- [Expo-router](https://docs.expo.dev/versions/latest/sdk/router/)
- [Flask](https://flask.palletsprojects.com/en/stable/)

## Estrutura

### Cliente
A criação da estrutura do cliente foi feita utilizando os comandos.  
```console
$ npx create-expo-app@latest client --template blank
$ npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar
````
Para poder executar o cliente é necessário escrever os comandos:  
```console
$ git clone https://github.com/nsdavidhenrique/gaa
$ cd gaa/client
$ npm install
$ npm start
````

O diretorio do cliente contém a seguinte estrutura:
- assets/ Contém os arquivos estáticos, como imagens, logos, etc.
- src/    Contém o código fonte do projeto
    - app/        Contém as telas do aplicativo.
    - components/ Contém componentes react que podem ser utilizados por todo o código.
    - context/    Contém contexto react que podem podem ser compartilhado por diferentes componentes.
    - services/   Contém rotinas que podem ser executados em diferentes partes do codigo, como requisições ao servidor, etc.
    - styles/     Contém os StyleSheets.
    - utils/      Funções que podem ser reutilizadas, por exemplo [isLate()](client/src/utils/isLate.js)

Por estar utilizando o expo-router cada arquivo dentro do diretório cliente/src/app representa um tela do aplicativo com exceção dos arquivos _layout.jsx que representam o layout das telas dentro de um mesmo diretório.

A Rota raiz do projeto está organizado no layout Tab. que consiste em três telas. Tarefas, Cria e Análise.

A Rota tasks está organizado no layout Stack
TODO rota criar e rota analise

### Server
O servidor foi escrito em python utilizando a biblioteca Flask.

Para inicia-lo no linux é necessário executar os comandos:  
```console
$ git clone https://github.com/nsdavidhenrique/gaa
$ cd gaa/server
$ python3 -m venv venv
$ source venv/bin/activate
$ pip install requirements.txt
$ python3 src/app.py
````
No windows:
```console
$ git clone https://github.com/nsdavidhenrique/gaa
$ cd gaa/server
$ python -m venv venv
$ source venv/Scripts/activate
$ pip install requirements.txt
$ python src/app.py
````

O diretorio do servidor contém a seguinte estrutura:
- sql/ contém os arquivos de criação do schema, tuplas padrões e o banco de dados.
- src/ contém o codigo fonte do servidor.

O banco de dados database.db é criado ao executar o servidor pela primeira vez.

O banco de dados possue quatro tabelas:

**Users**
|Coluna|Tipo        |
|------|------------|
|id    |INTEGER     |
|name  |VARCHAR(255)|

**Areas**
|Coluna |Tipo        |
|-------|------------|
|id     |INTEGER     |
|name   |VARCHAR(255)|

**TaskStatuses**
|Coluna |Tipo        |
|-------|------------|
|id     |INTEGER     |
|name   |VARCHAR(255)|

**Tasks**
|Coluna      |Tipo     |
|------------|---------|
|id          |INTEGER  |
|description |VARCHAR  |
|deadline    |DATETIME |
|urgent      |BOOLEAN  |
|createdAt   |DATETIME |
|lastUpdate  |DATETIME |
|doneAt      |DATETIME |
|targetId    |INTEGER  |
|areaId      |INTEGER  |
|statusId    |INTEGER  |
|createdBy   |INTEGER  |
|beingDoneBy |INTEGER  |

**API**
1. /users?id=int&name=string
    - Método GET.
    - Retorna um ou mais usuário.
    - id e/ou name podem ser omitidos.
    - Caso ambos sejam omitidos retorna todos os usuários.
2. /areas?id=int&name=string
    - Método GET.
    - Retorna uma ou mais áreas.
    - id e/ou name podem ser omitidos.
    - Caso ambos sejam omitidos retorna todos as areas.
3. /taskDetails?id=int
    - Método GET.
    - Retorna informações completas sobre uma determinada tarefa.
    - id não pode ser omitido.
4. /taskList?pending=bool&offset&=int
    - Método GET.
    - Retorna lista de tarefas.
    - Se pending=true retorna todas as pendentes ou em andamento e se pending=false retorna as finalizadas e 5 em 5 com base no offset.
5. /createTask
    - Método POST
    - Cria uma task.
    - É necessario passar um json com os campos: {"description" : "string", "deadline" : "datetime", "urgent" : "bool", "targetId" : "int", "areaId" : "int", "createdBy" : "int"}

## Outras referências
Regras do expo-route: https://docs.expo.dev/router/basics/notation/  
Regras de layout: https://docs.expo.dev/router/basics/layout/  
Estilização com React-Native: https://reactnative.dev/docs/stylesheet  

