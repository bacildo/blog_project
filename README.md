# Blog API

Uma API de blog com CRUD de posts locais e busca de posts remotos, com autenticação JWT e suporte a paginação para exibição dos dados no frontend.

## Sumário
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Autenticação](#autenticação)
- [Endpoints](#endpoints)
- [Paginação](#paginação)

## Instalação

### Pré-requisitos
- Docker
- Docker Compose

### Passos de Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd <nome-do-repositorio>
```

2. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
```env
DB_USERNAME=seu_usuario
DB_PASSWORD=sua_senha
DB_HOST=db
DB_PORT=5432
DB_NAME=nome_do_banco
JWT_SECRET_KEY=sua_chave_jwt
NEWS_API_KEY=sua_chave_news_api
```

3. Inicie a aplicação:
```bash
docker-compose up --build
```

**Nota:** O `entrypoint.sh` configura automaticamente o banco de dados, executando `db:create` e `db:migrate`.

## Autenticação

A API utiliza JWT (JSON Web Token) para autenticação. Para acessar endpoints protegidos:
- Inclua o token no header `Authorization`
- Formato: `Bearer <token>`

## Endpoints

### Usuários

#### Registro
- **POST** `/users`
- **Corpo da requisição:**
```json
{
  "user": {
    "email": "exemplo@teste.com",
    "password": "senha123",
    "password_confirmation": "senha123"
  }
}
```
- **Respostas:**
  - `201`: Usuário criado
  - `422`: Erro de validação

#### Login
- **POST** `/users/sign_in`
- **Corpo da requisição:**
```json
{
  "user": {
    "email": "exemplo@teste.com",
    "password": "123456"
  }
}
```
- **Respostas:**
  - `200`: Login bem-sucedido (retorna token JWT)
  - `401`: Credenciais inválidas

### Posts Locais

#### Criar Post
- **POST** `/posts`
- **Autenticação:** Requerida
- **Corpo da requisição:**
```json
{
  "post": {
    "title": "Título da Postagem",
    "content": "Conteúdo da Postagem",
    "image_url": "URL da Imagem"
  }
}
```

#### Listar Posts
- **GET** `/posts`
- **Autenticação:** Requerida
- **Parâmetros:**
  - `page`: Número da página (opcional, padrão: 1)
  - `limit`: Posts por página (opcional, padrão: 10)

#### Atualizar Post
- **PUT** `/posts/:id`
- **Autenticação:** Requerida
- **Corpo da requisição:** Igual ao de criação

#### Deletar Post
- **DELETE** `/posts/:id`
- **Autenticação:** Requerida
- **Respostas:**
  - `204`: Post deletado
  - `404`: Post não encontrado

### Posts Remotos

#### Buscar Posts Remotos
- **GET** `/posts/remote`
- **Autenticação:** Requerida
- **Parâmetros:**
  - `page`: Número da página
  - `page_size`: Posts por página

## Paginação

A API implementa dois tipos de paginação:
- **Posts Locais:** Utiliza Kaminari
- **Posts Remotos:** Paginação via parâmetros de query

### Exemplos de Uso

Posts Locais:
```bash
GET /posts?page=2&limit=10
```

Posts Remotos:
```bash
GET /posts/remote?page=2&page_size=10
```

O frontend implementa scroll infinito para melhor experiência do usuário.