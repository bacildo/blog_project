class RemotePostsController < ApplicationController
  # Método para buscar postagens remotas da API
  def index
    response = HTTP.get("https://newsapi.org/v2/everything?q=watches&apiKey=YOUR_API_KEY")
    remote_posts = JSON.parse(response.body)["articles"]

    render json: remote_posts
  end
end
