class Api::UsersController < ApplicationController
 def create
   @user = User.new(user_params)
   if @user.save
     render json: {user: {name: @user.name, email: @user.email}}
   else
     render json: {errors: {body: @user.errors}}, status: :unprocessable_entity
   end
 end

 private
 def user_params
   params.require(:user).permit(:name, :email, :password)
 end
end