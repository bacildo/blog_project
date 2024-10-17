class CreateJwtDenylist < ActiveRecord::Migration[6.0]
  def change
    create_table :jwt_denylists do |t|
      t.string :jti, null: false  # Identificador único do JWT
      t.datetime :exp, null: false  # Data de expiração do JWT

      t.timestamps
    end
    add_index :jwt_denylists, :jti  # Índice para buscar tokens pela JTI
  end
end
