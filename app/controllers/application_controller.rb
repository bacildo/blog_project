class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern
  
  # Habilitar CSRF apenas para rotas não-API
  protect_from_forgery with: :exception, unless: :json_request?

  # Define para onde redirecionar após login
  def after_sign_in_path_for(resource)
    posts_path if resource_signed_in?  # Redireciona para a lista de postagens se o usuário estiver autenticado
  end

  # Define para onde redirecionar após logout
  def after_sign_out_path_for(resource_or_scope)
    new_user_session_path  # Exemplo: redirecionar para a página de login
  end

  private

  def json_request?
    request.format.json?
  end

  def authenticate_user!
    token = request.headers['Authorization']&.split(' ')&.last
    return render json: { errors: ['Unauthorized'] }, status: :unauthorized unless token

    begin
      decoded_token = JWT.decode(token, ENV['JWT_SECRET_KEY']).first
      Rails.logger.debug "Decoded Token: #{decoded_token}"
      @current_user = User.find(decoded_token['user_id'])
    rescue JWT::DecodeError, ActiveRecord::RecordNotFound
      render json: { errors: ['Unauthorized'] }, status: :unauthorized
    end
  end

  def current_user
    @current_user
  end
end
