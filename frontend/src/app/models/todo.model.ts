export interface Todo {
  task_uuid: string;
  content: string;
  user_uuid: string;
  completed: boolean;
  createdAt: string;
}

export interface GetTodosResponse {
  todos: Todo[];
  message: string;
}

export interface CreateTodoResponse {
  message: string;
  task: Todo;
}

export interface TodoUpdate {
  content?: string;
  completed?: boolean;
}

export interface UpdateTodoResponse {
  message: string;
  updatedTask: Todo;
}
