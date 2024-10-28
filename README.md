# Blog API

Uma API de blog com CRUD de posts locais e busca de posts remotos, com autenticação JWT e suporte a paginação para exibição dos dados no frontend.

## Índice

- [Instalação e Configuração](#instalação-e-configuração)
- [Autenticação e Segurança](#autenticação-e-segurança)
- [Endpoints](#endpoints)
  - [User Registration](#user-registration)
  - [User Login](#user-login)
  - [Posts Locais](#posts-locais)
  - [Posts Remotos](#posts-remotos)
- [Paginação](#paginação)

## Instalação e Configuração

### 1. Pré-requisitos

- Ruby: Versão 3.x
- Rails: Versão 7.x ou superior
- PostgreSQL: Como banco de dados principal

### 2. Configuração

Clone o repositório e configure o ambiente:

```bash
git clone <url-do-repositorio>
cd <nome-do-repositorio>
bundle install
rails db:create db:migrate
```

Para configurar a chave de API do NewsAPI, crie o arquivo `config/credentials.yml.enc`:

No vscode é possível abrir o arquivo através do comando set EDITOR=code --wait && rails credentials:edit, após terminar a edição basta fechar para que o mesmo seja encriptado e salvo.

```yaml
devise:
  jwt_secret_key: 'sua_jwt_key'
news_api:
  key: sua_key
```

## Autenticação e Segurança

A API utiliza autenticação JWT para proteger os endpoints. O token JWT é gerado no login e deve ser incluído em cada requisição autenticada no cabeçalho `Authorization` com o formato `Bearer <token>`.

## Endpoints

### User Registration

- **Rota**: `/users`
- **Método**: `POST`
- **Descrição**: Cadastra um novo usuário.
- **Parâmetros**:
```json
{
  "user": {
    "email": "exemplo@teste.com",
    "password": "senha123",
    "password_confirmation": "senha123"
  }
}
```
- **Resposta**:
  - 201 Created: `{"message": "User created successfully"}`
  - 422 Unprocessable Entity: `{"errors": ["error_message"]}`

### User Login

- **Rota**: `/users/sign_in`
- **Método**: `POST`
- **Descrição**: Faz o login de um usuário e retorna um token JWT.
- **Parâmetros**:
```json
{
  "user":{
    "email":"exemplo@teste.com",
    "password": "123456"
  }
}
```
- **Resposta**:
  - 200 OK: `{"token": "jwt_token"}`
  - 401 Unauthorized: `{"errors": ["Invalid email or password"]}`

### Posts Locais

#### Criar Post

- **Rota**: `/posts`
- **Método**: `POST`
- **Autenticação**: JWT
- **Descrição**: Cria uma nova postagem associada ao usuário logado.
- **Parâmetros**:
```json
{
  "post": {
    "title": "Título da Postagem",
    "content": "Conteúdo da Postagem",
    "image_url": "URL da Imagem"
  }
}
```
- **Resposta**:
  - 201 Created: Dados do post criado
  - 422 Unprocessable Entity: `{"errors": ["error_message"]}`

#### Listar Posts (Paginação)

- **Rota**: `/posts`
- **Método**: `GET`
- **Autenticação**: JWT
- **Descrição**: Retorna uma lista paginada dos posts locais do usuário logado.
- **Parâmetros de Query**:
  - `page`: Número da página (opcional, padrão = 1)
  - `limit`: Número de posts por página (opcional, padrão = 10)
- **Resposta**:
  - 200 OK: Lista de posts locais com paginação

#### Atualizar Post

- **Rota**: `/posts/:id`
- **Método**: `PUT`
- **Autenticação**: JWT
- **Descrição**: Atualiza um post do usuário logado.
- **Parâmetros**: Mesmos parâmetros de criação de post.
- **Resposta**:
  - 200 OK: Dados do post atualizado
  - 404 Not Found: `{"error": "Post not found"}`

#### Deletar Post

- **Rota**: `/posts/:id`
- **Método**: `DELETE`
- **Autenticação**: JWT
- **Descrição**: Deleta um post do usuário logado.
- **Resposta**:
  - 204 No Content: Post deletado
  - 404 Not Found: `{"error": "Post not found"}`

### Posts Remotos

- **Rota**: `/posts/remote`
- **Método**: `GET`
- **Autenticação**: JWT
- **Descrição**: Retorna uma lista de posts remotos paginada da API externa.
- **Parâmetros de Query**:
  - `page`: Número da página (opcional, padrão = 1)
  - `page_size`: Quantidade de itens por página (opcional, padrão = 10)
- **Resposta**:
  - 200 OK: Lista de posts remotos
  - 400 Bad Request: `{"error": "Erro ao buscar posts remotos"}`

## Paginação

Para posts locais, estamos usando Kaminari, enquanto para posts remotos a paginação é feita usando parâmetros de query diretamente na requisição à API externa. Além disso, o frontend conta com scroll infinito dos dados.

**Exemplo de Paginação de Posts Locais**:
```bash
GET /posts?page=2&limit=10
```

**Exemplo de Paginação de Posts Remotos**:
```bash
GET /posts/remote?page=2&limit=10
```
