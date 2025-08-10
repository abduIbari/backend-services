import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Todo } from '../../../../models/todo.model';

@Component({
  selector: 'app-todo-item-component',
  standalone: true, // must be standalone
  imports: [CommonModule],
  templateUrl: './todo-item-component.html',
  styleUrl: './todo-item-component.css',
})
export class TodoItemComponent {
  todo = input.required<Todo>();
  update = output<{ uuid: string; updateData: any }>();
  delete = output<string>();

  onToggleComplete(event: Event) {
    console.log('completed', this.todo().uuid);
    const target = event.target as HTMLInputElement | null;
    if (!target) return;

    const isChecked = target.checked;

    this.update.emit({
      uuid: this.todo().uuid,
      updateData: { completed: isChecked },
    });
  }

  onContentUpdate(event: Event) {
    console.log('updated', this.todo());
    if (event instanceof KeyboardEvent) {
      if (event.key !== 'Enter') {
        return; // ignore other keys
      }
      event.preventDefault();
      (event.target as HTMLElement).blur();
    }

    const target = event.target as HTMLElement | null;
    const newContent = target?.textContent?.trim() ?? '';

    if (newContent && newContent !== this.todo().content) {
      this.update.emit({
        uuid: this.todo().uuid,
        updateData: { content: newContent },
      });
    }
  }

  onDelete() {
    console.log('deleting', this.todo().uuid);
    this.delete.emit(this.todo().uuid);
  }
}
