Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check
  
  namespace "api" do
    resources :users, only: %i[create]
    post 'signup', to: 'auth#signup'
    post 'login', to: 'auth#login'
    get 'me', to: 'auth#me'

    resources :todos, only: [:index, :create, :update, :destroy]
  end
end