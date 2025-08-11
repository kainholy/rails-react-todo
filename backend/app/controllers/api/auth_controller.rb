class Api::AuthController < ApplicationController
  def signup
    @user = User.new(user_params)
    if @user.save
      token = generate_token(@user.id)
      render json: {
        user: { id: @user.id, name: @user.name, email: @user.email },
        token: token
      }
    else
      render json: { errors: @user.errors }, status: :unprocessable_entity
    end
  end

  def login
    @user = User.find_by(email: params[:email])
    if @user && @user.authenticate(params[:password])
      token = generate_token(@user.id)
      render json: {
        user: { id: @user.id, name: @user.name, email: @user.email },
        token: token
      }
    else
      render json: { error: 'Invalid email or password' }, status: :unauthorized
    end
  end

  def me
    if current_user
      render json: {
        user: { id: current_user.id, name: current_user.name, email: current_user.email }
      }
    else
      render json: { error: 'Unauthorized' }, status: :unauthorized
    end
  end

  private

  def user_params
    params.require(:user).permit(:name, :email, :password)
  end

  def generate_token(user_id)
    payload = { user_id: user_id, exp: 24.hours.from_now.to_i }
    JWT.encode(payload, Rails.application.secret_key_base)
  end

  def current_user
    return nil unless request.headers['Authorization']
    
    token = request.headers['Authorization'].split(' ').last
    decoded_token = JWT.decode(token, Rails.application.secret_key_base)[0]
    User.find(decoded_token['user_id'])
  rescue JWT::DecodeError, ActiveRecord::RecordNotFound
    nil
  end
end