Rails.application.routes.draw do
  # Rotas do Devise para autenticação de usuários
  devise_for :users, controllers: {
    registrations: 'users/registrations',
    sessions: 'users/sessions'
  }

  # CRUD de postagens locais
  resources :posts

  # Rota para buscar postagens remotas
  get 'remote_posts', to: 'remote_posts#index'

  # Define a rota raiz (opcional, pode ser a página de login ou lista de posts)
  root to: 'posts#index'
end
