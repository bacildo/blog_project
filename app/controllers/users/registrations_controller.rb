# app/controllers/users/registrations_controller.rb
class Users::RegistrationsController < Devise::RegistrationsController
  skip_before_action :verify_authenticity_token, only: [:create]

  respond_to :json

  def create
    build_resource(sign_up_params)  # Passando os parâmetros de inscrição

    if resource.save
      render json: { message: 'User created successfully'}, status: :created
    else
      render json: { errors: resource.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def sign_up_params
    params.require(:user).permit(:email, :password, :password_confirmation)  # Adicione aqui a confirmação da senha
  end
end
