# config/routes.rb
Rails.application.routes.draw do
  # Rotas do Devise para autenticação de usuários
  devise_for :users, controllers: {
    registrations: 'users/registrations',
    sessions: 'users/sessions'
  }, defaults: { format: :json }

  # CRUD de postagens locais
  resources :posts do
    collection do
      get 'remote', to: 'posts#remote_posts'
    end
  end

  # Rota para o React (as páginas React começam aqui)
  root 'home#index'  # Acesse a aplicação React através da rota raiz

  # Ajustar para que todas as outras rotas que não sejam API sejam tratadas pelo React
  get '/login', to: 'home#index'  # Rota específica para login
  get '/register', to: 'home#index'  # Rota para registro
  get '*path', to: 'home#index', constraints: ->(req) { !req.xhr? && req.format.html? }
end
