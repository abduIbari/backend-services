import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import {
  GetTodosResponse,
  CreateTodoResponse,
  UpdateTodoResponse,
  TodoUpdate,
} from '../models/todo.model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private apiURL = 'http://localhost:3000/api/todo';
  private http = inject(HttpClient);

  tasks = signal<GetTodosResponse['todos']>([]);
  loading = signal(true);

  private platformId = inject(PLATFORM_ID);

  private getAuthHeaders(): { headers: HttpHeaders } {
    let token = '';
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem('token') || '';
    }
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
  }

  getAllTasks(): void {
    this.loading.set(true);
    this.http
      .get<GetTodosResponse>(`${this.apiURL}/`, this.getAuthHeaders())
      .subscribe({
        next: (res) => {
          this.tasks.set(res.todos);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        },
      });
  }

  createTodo(content: string): void {
    this.http
      .post<CreateTodoResponse>(
        `${this.apiURL}/`,
        {
          content,
        },
        this.getAuthHeaders()
      )
      .subscribe((res) => {
        this.tasks.update((list) => [...list, res.task]);
        this.getAllTasks();
      });
  }

  updateTodo(uuid: string, updateData: TodoUpdate): void {
    this.http
      .put<UpdateTodoResponse>(
        `${this.apiURL}/${uuid}`,
        updateData,
        this.getAuthHeaders()
      )
      .subscribe((res) => {
        this.tasks.update((list) =>
          list.map((t) => (t.uuid === uuid ? res.updatedTask : t))
        );
      });
  }

  deleteTodo(uuid: string): void {
    this.http
      .delete<void>(`${this.apiURL}/${uuid}`, this.getAuthHeaders())
      .subscribe((res) => {
        this.tasks.update((list) => list.filter((t) => t.uuid !== uuid));
      });
  }
}
