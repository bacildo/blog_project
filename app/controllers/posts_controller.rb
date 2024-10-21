class PostsController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:create, :update, :destroy] # Desabilitar CSRF apenas para ações API

  before_action :authenticate_user! 
  before_action :set_post, only: [:show, :update, :destroy]

  def index
    @posts = Post.where(user: current_user)
    render json: @posts
  end

  def show
    render json: @post
  end

  def create
    Rails.logger.info("Current User: #{current_user.inspect}") # Verifica o usuário atual
    @post = current_user.posts.build(post_params)
  
    if @post.save
      render json: @post, status: :created
    else
      render json: { errors: @post.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @post.update(post_params)
      render json: @post
    else
      render json: { errors: @post.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @post.destroy
    head :no_content
  end

  private

  def set_post
    @post = Post.find(params[:id])
  end

  def post_params
    params.require(:post).permit(:title, :content, :image_url)
  end
end
