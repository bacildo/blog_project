Rails.application.routes.draw do
  # Rotas do Devise para autenticação de usuários
  devise_for :users, controllers: {
    registrations: 'users/registrations',
    sessions: 'users/sessions'
  }

  # CRUD de postagens locais
  resources :posts do
    collection do
      get 'remote', to: 'posts#remote_posts'  # Rota para buscar postagens remotas
    end
  end

  # Define a rota raiz (opcional, pode ser a página de login ou lista de posts)
  root to: 'posts#index'
end
