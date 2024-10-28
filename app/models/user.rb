class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
        :recoverable, :rememberable, :validatable,
        :jwt_authenticatable, jwt_revocation_strategy: JwtDenylist

        def generate_jwt
          JWT.encode({ user_id: id, exp: 24.hours.from_now.to_i, email: email }, ENV['JWT_SECRET_KEY'])
        end
        has_many :posts
end
