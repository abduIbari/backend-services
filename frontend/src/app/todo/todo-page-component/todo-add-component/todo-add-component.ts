import { Component, output, signal } from '@angular/core';

@Component({
  selector: 'app-todo-add-component',
  imports: [],
  templateUrl: './todo-add-component.html',
  styleUrl: './todo-add-component.css',
})
export class TodoAddComponent {
  add = output<string>();
  content = signal('');

  addTask() {
    const trimmedContent = this.content().trim();
    if (trimmedContent) {
      this.add.emit(trimmedContent);
      console.log('added', trimmedContent);
      this.content.set('');
    }
  }
}
