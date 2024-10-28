class PostsController < ApplicationController
  require 'httparty'

  skip_before_action :verify_authenticity_token, only: [:create, :update, :destroy]
  before_action :authenticate_user!  
  before_action :set_post, only: [:show, :update, :destroy]

  # Lista todos os posts locais do usuário autenticado, ordenados por created_at
  def index
    @posts = Post.where(user: current_user).order(created_at: :desc).page(params[:page]).per(10)
    render json: {
      posts: @posts,
      total_pages: @posts.total_pages
    }, status: :ok
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
    page = params[:page] || 1
    limit = params[:limit] || 10
    response = fetch_remote_posts(page, limit)
    
    if response.success?
      articles = response.parsed_response["articles"].sort_by { |article| article["publishedAt"] }
      total_results = response.parsed_response["totalResults"] # Total de resultados da API
      total_pages = (total_results / limit.to_f).ceil # Calcula total de páginas
  
      render json: { articles: articles, total_pages: total_pages }, status: :ok
    else
      render json: { error: "Erro ao buscar posts remotos" }, status: :bad_request
    end
  end

  private

  # Busca posts remotos da API com paginação e ordenação
  def fetch_remote_posts(page, limit)
    url = "https://newsapi.org/v2/everything?q=watches&apiKey=#{Rails.application.credentials.news_api[:key]}&page=#{page}&pageSize=#{limit}&sortBy=publishedAt" 
    HTTParty.get(url)
  end

  # Define o post atual para ações específicas
  def set_post
    @post = current_user.posts.find(params[:id])
  end

  # Permite apenas parâmetros específicos para criar ou atualizar posts
  def post_params
    params.require(:post).permit(:title, :content, :image_url) 
  end
end
