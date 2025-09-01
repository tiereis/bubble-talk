# Bubble-Talk

Este é o repositório do projeto Bubble-Talk, uma aplicação web de rede social construída como parte dos requisitos do curso EBAC.

## Visão Geral do Projeto

O Bubble-Talk é uma plataforma de rede social com funcionalidades essenciais, incluindo:

* **Sistema de Autenticação e Perfil:** Registro de novos usuários, login seguro e a possibilidade de editar nome, foto e senha do perfil.
* **Feed de Notícias Personalizado:** O feed exibe postagens apenas das pessoas que o usuário segue.
* **Interações:** Os usuários podem curtir e comentar nas postagens.

## Tecnologias Utilizadas

### Back-end
* **Linguagem:** Python
* **Framework:** Django com Django REST Framework (DRF)
* **Banco de Dados:** SQLite

### Front-end
* **Biblioteca:** React
* **Linguagem:** TypeScript
* **Estilização:** Bootstrap

## Como Rodar o Projeto Localmente

Siga estas instruções para configurar e rodar o projeto em sua máquina local.

### 1. Pré-requisitos
Certifique-se de ter o Python (recomendado 3.10+) e o Node.js instalados.

### 2. Configuração do Back-end
1.  Navegue para a pasta `backend` do projeto:
    ```bash
    cd backend
    ```
2.  Crie e ative um ambiente virtual:
    ```bash
    python -m venv venv
    .\venv\Scripts\Activate.ps1
    ```
3.  Instale as dependências do Django:
    ```bash
    pip install -r requirements.txt
    ```
4.  Execute as migrações do banco de dados:
    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```
5.  Inicie o servidor de desenvolvimento:
    ```bash
    python manage.py runserver
    ```
    O back-end estará rodando em `http://127.0.0.1:8000`.

### 3. Configuração do Front-end
1.  Abra um **novo terminal** e navegue para a pasta `frontend` do projeto:
    ```bash
    cd frontend
    ```
2.  Instale as dependências do React:
    ```bash
    npm install
    ```
3.  Inicie o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```
    O front-end estará rodando em `http://localhost:5173`.

### Endpoints da API (Back-end)

Aqui estão os principais endpoints da API do back-end.

* **`POST /api/users/register/`**: Cria um novo usuário.
* **`POST /api/users/login/`**: Autentica o usuário e retorna um token.
* **`GET /api/users/profile/`**: Obtém os dados do perfil do usuário autenticado.
* **`PATCH /api/users/profile/`**: Edita os dados do perfil.
* **`POST /api/users/follow/<int:user_id>/`**: Segue um usuário.
* **`DELETE /api/users/follow/<int:user_id>/`**: Deixa de seguir um usuário.
* **`GET /api/posts/all/`**: Lista todas as postagens.
* **`POST /api/posts/all/`**: Cria uma nova postagem (requer autenticação).
* **`GET /api/posts/feed/`**: Retorna o feed de notícias do usuário autenticado (apenas postagens de quem ele segue).
* **`POST /api/posts/<int:post_id>/comments/`**: Adiciona um comentário a uma postagem.
* **`POST /api/posts/<int:post_id>/like/`**: Adiciona/remove uma curtida em uma postagem.

---