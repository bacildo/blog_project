# Exemplo no controlador
class HomeController < ApplicationController
  def index
    render layout: false # Desativa o layout padrão
  end
end
