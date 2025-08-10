import { Component, output, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoItemComponent } from './todo-item-component/todo-item-component';
import { Todo } from '../../../models/todo.model';

@Component({
  selector: 'app-todo-list-component',
  standalone: true,
  imports: [TodoItemComponent, CommonModule],
  templateUrl: './todo-list-component.html',
  styleUrl: './todo-list-component.css',
})
export class TodoListComponent {
  todos = input<Todo[]>([]);
  update = output<{ uuid: string; updateData: any }>();
  delete = output<string>();

  onUpdate(event: { uuid: string; updateData: any }) {
    this.update.emit(event);
  }

  onDelete(uuid: string) {
    this.delete.emit(uuid);
  }

  trackByUuid(index: number, todo: Todo) {
    return todo.uuid;
  }
}
