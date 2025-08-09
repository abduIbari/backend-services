import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  GetTodosResponse,
  CreateTodoResponse,
  UpdateTodoResponse,
  TodoUpdate,
} from '../models/todo.model';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private apiURL = 'http://localhost:3000/api/todo';
  private http = inject(HttpClient);

  getAllTasks(): Observable<GetTodosResponse> {
    return this.http.get<GetTodosResponse>(`${this.apiURL}/`);
  }

  createTodo(content: string): Observable<CreateTodoResponse> {
    return this.http.post<CreateTodoResponse>(`${this.apiURL}/`, {
      content,
    });
  }

  updateTodo(
    uuid: string,
    updateData: TodoUpdate
  ): Observable<UpdateTodoResponse> {
    return this.http.put<UpdateTodoResponse>(
      `${this.apiURL}/${uuid}`,
      updateData
    );
  }

  deleteTodo(uuid: string): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/${uuid}`);
  }
}
