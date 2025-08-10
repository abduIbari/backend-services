import { Component, inject, computed, OnInit } from '@angular/core';
import { TodoAddComponent } from './todo-add-component/todo-add-component';
import { TodoListComponent } from './todo-list-component/todo-list-component';
import { TodoService } from '../todo-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todo-page-component',
  standalone: true,
  imports: [TodoAddComponent, TodoListComponent, CommonModule],
  templateUrl: './todo-page-component.html',
  styleUrl: './todo-page-component.css',
})
export class TodoPageComponent implements OnInit {
  todoService = inject(TodoService);
  todos = computed(() => this.todoService.tasks());

  ngOnInit() {
    this.todoService.getAllTasks();
  }
  onAdd(content: string) {
    this.todoService.createTodo(content);
    console.log(content);
  }

  onUpdate({ uuid, updateData }: { uuid: string; updateData: any }) {
    this.todoService.updateTodo(uuid, updateData);
  }

  onDelete(uuid: string) {
    this.todoService.deleteTodo(uuid);
  }
}
