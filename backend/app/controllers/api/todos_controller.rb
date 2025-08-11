class Api::TodosController < ApplicationController
  before_action :authenticate_request
  before_action :set_todo, only: [:update, :destroy]  # showを削除

  def index
    @todos = current_user.todos.order(created_at: :desc)
    render json: { todos: @todos }
  end

  def create
    todo_attributes = todo_params
    todo_attributes[:completed] = false if todo_attributes[:completed].nil?
    
    @todo = current_user.todos.build(todo_attributes)
    if @todo.save
      render json: { todo: @todo }, status: :created
    else
      render json: { errors: @todo.errors }, status: :unprocessable_entity
    end
  end

  def update
    if @todo.update(todo_params)
      render json: { todo: @todo }
    else
      render json: { errors: @todo.errors }, status: :unprocessable_entity
    end
  end

  def destroy
    @todo.destroy
    render json: { message: 'Todo deleted successfully' }
  end

  private

  def set_todo
    @todo = current_user.todos.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Todo not found' }, status: :not_found
  end

  def todo_params
    params.require(:todo).permit(:title, :completed)
  end

  def authenticate_request
    return render json: { error: 'Unauthorized' }, status: :unauthorized unless current_user
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
