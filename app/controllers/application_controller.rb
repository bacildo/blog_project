class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern
  # Define para onde redirecionar após login
  def after_sign_in_path_for(resource)
    posts_path  # Exemplo: redirecionar para a lista de postagens
  end

  # Define para onde redirecionar após logout
  def after_sign_out_path_for(resource_or_scope)
    new_user_session_path  # Exemplo: redirecionar para a página de login
  end
end
