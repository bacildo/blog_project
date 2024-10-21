class PostsController < ApplicationController
  require 'httparty'

  skip_before_action :verify_authenticity_token, only: [:create, :update, :destroy] # Para desabilitar CSRF nas ações da API
  before_action :authenticate_user!  # Garante que o usuário esteja autenticado
  before_action :set_post, only: [:show, :update, :destroy]

  # Lista todos os posts locais do usuário autenticado
  def index
    @posts = current_user.posts
    render json: @posts, status: :ok
  end

  # Mostra um post local específico
  def show
    render json: @post, status: :ok
  end

  # Cria um novo post local
  def create
    @post = current_user.posts.build(post_params)

    if @post.save
      render json: @post, status: :created
    else
      render json: { errors: @post.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # Atualiza um post local específico
  def update
    if @post.update(post_params)
      render json: @post, status: :ok
    else
      render json: { errors: @post.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # Remove um post local específico
  def destroy
    @post.destroy
    head :no_content
  end

  # Busca posts remotos da API externa
  def remote_posts
    response = fetch_remote_posts

    if response.success?
      render json: response.parsed_response["articles"], status: :ok
    else
      render json: { error: "Erro ao buscar posts remotos" }, status: :bad_request
    end
  end

  private

  # Define o post atual para ações específicas
  def set_post
    @post = current_user.posts.find(params[:id])
  end

  # Permite apenas parâmetros específicos para criar ou atualizar posts
  def post_params
    params.require(:post).permit(:title, :content, :image_url) 
  end

  # Busca posts remotos da API
  def fetch_remote_posts
    url = "https://newsapi.org/v2/everything?q=watches&apiKey=#{Rails.application.credentials.news_api[:key]}" 
    HTTParty.get(url)
  end
end
