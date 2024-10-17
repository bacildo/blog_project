class AddDeviseToUsers < ActiveRecord::Migration[6.0]
  def change
    change_table :users do |t|
      # Verifique se a coluna já existe antes de adicioná-la
      unless column_exists?(:users, :email)
        t.string :email, null: false, default: ""
      end
      unless column_exists?(:users, :encrypted_password)
        t.string :encrypted_password, null: false, default: ""
      end
    end
  end
end
