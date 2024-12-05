import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TodosStore } from 'app/store/todos.store';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.less'
})
export class TodoListComponent{
  newTodoTitle = signal('')

  store = inject(TodosStore)

  submitNewTodo(){
    this.store.addTodo(this.newTodoTitle());
    this.newTodoTitle.set('');
  }

  editTodo(todoId: string) {
    this.store.startEditing(todoId);
    this.newTodoTitle.set(this.store.editingTodo()?.title || '');
  }

  saveEdit() {
    if (this.newTodoTitle()) {
      this.store.saveEditingTodo(this.newTodoTitle());
      this.newTodoTitle.set('');
    }
  }

  cancelEdit() {
    this.store.cancelEditing();
    this.newTodoTitle.set('');
  }


}
