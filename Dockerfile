# Usa a imagem base do Ruby para o Rails
FROM ruby:3.3.5 AS rails

# Instala PostgreSQL para o cliente do Rails
RUN apt-get update -qq && apt-get install -y postgresql-client

# Instala o Bundler globalmente
RUN gem install bundler

# Define o diretório de trabalho da aplicação Rails
WORKDIR /app

# Copia o entrypoint primeiro e ajusta permissões
COPY entrypoint.sh ./ 
RUN chmod +x /app/entrypoint.sh

# Copia o Gemfile e o Gemfile.lock para instalar dependências do Rails
COPY Gemfile Gemfile.lock ./
RUN bundle install

# Copia os arquivos restantes da aplicação Rails
COPY . .

# Prepara diretórios e permissões
RUN chmod -R 775 /app/tmp /app/log && \
    chown -R root:root /app && \
    chmod -R 755 /app

# Define o entrypoint para inicialização
ENTRYPOINT ["/app/entrypoint.sh"]

# Expõe a porta 3000 para o Rails
EXPOSE 3000

# Comando para iniciar o servidor Rails
CMD ["rails", "server", "-b", "0.0.0.0", "-p", "3000"]

# Usa uma imagem do Node.js para o Vite
FROM node:20.12.2 AS vite

# Define o diretório de trabalho para o Vite
WORKDIR /app

# Cria um usuário e grupo
RUN groupadd -g 1001 appuser && \
    useradd -u 1001 -g appuser -m appuser

# Copia o arquivo de dependências do Node e instala as dependências usando Yarn
COPY package.json yarn.lock ./
RUN yarn install

# Copia os arquivos restantes para o Vite
COPY . .

# Ajusta permissões da pasta node_modules
RUN chown -R appuser:appuser /app/node_modules

# Altera para o novo usuário
USER appuser

# Expõe a porta 3001 para o Vite
EXPOSE 3001

# Comando para iniciar o Vite
CMD ["yarn", "dev", "--host"]
