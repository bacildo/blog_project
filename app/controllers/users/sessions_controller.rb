# app/controllers/users/sessions_controller.rb
class Users::SessionsController < Devise::SessionsController
  skip_before_action :verify_authenticity_token, only: [:create, :destroy]
  respond_to :json

  def create
    user = User.find_by(email: params[:user][:email]) 

    if user&.valid_password?(params[:user][:password]) 
      token = user.generate_jwt
      render json: { token: token }, status: :ok
    else
      render json: { errors: ['Invalid email or password'] }, status: :unauthorized
    end
  end

  def destroy
    current_user&.jwt_denylist.create(jti: request.headers['Authorization'], exp: Time.current + Devise::JWT.config.expiration_time)
    head :no_content
  end
end
