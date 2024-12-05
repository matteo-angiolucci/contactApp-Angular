import { computed } from '@angular/core';
import { todos } from '@dm/todo-mock';
import { Todo } from '@dm/todo.model';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';

export type TodoFilter = 'all' | 'pending' | 'completed';

interface TodosState {
  todos: Todo[];
  loading: boolean;
  filter: TodoFilter;
  editingTodo: Partial<Todo> | null;
}

const initialState: TodosState = {
  todos: todos,
  loading: false,
  filter: 'all',
  editingTodo: null,
};

export const TodosStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    addTodo(newTodoTitle: string) {
      patchState(store, {
        todos: [
          {
            title: newTodoTitle,
            id: Date.now().toString(),
            completed: false,
          },
          ...store.todos(),
        ],
      });
    },
    deleteTodo(todoId: string) {
      patchState(store, {
        todos: store.todos().filter((todo) => todo.id !== todoId),
      });
    },
    toggleTodo(todoId: string) {
      patchState(store, {
        todos: store.todos().map((todoItem) =>
          todoItem.id === todoId
            ? { ...todoItem, completed: !todoItem.completed }
            : todoItem
        ),
      });
    },
    changeFilter(filter: TodoFilter) {
      patchState(store, { filter });
    },
    // Start editing a todo
    startEditing(todoId: string) {
      const todo = store.todos().find((todoItem) => todoItem.id === todoId);
      if (todo) {
        patchState(store, { editingTodo: { ...todo } });
      }
    },
    // Save the edited todo
    saveEditingTodo(newTitle: string) {
      if (store.editingTodo()) {
        patchState(store, {
          todos: store.todos().map((todoItem) =>
            todoItem.id === store.editingTodo()?.id
              ? { ...todoItem, title: newTitle }
              : todoItem
          ),
          editingTodo: null, // Clear editing state
        });
      }
    },
    // Cancel editing
    cancelEditing() {
      patchState(store, { editingTodo: null });
    },
  })),
  withComputed(({ todos, filter }) => ({
    completedTodos: computed(() =>
      todos().filter((todoItem) => {
        return todoItem.completed;
      }),
    ),
    filteredTodos: computed(() => {
      switch (filter()){
        case 'completed':
          return todos().filter((todoitem) => {
            return todoitem.completed
          });
          case 'pending':
            return todos().filter((todoitem) => {
              return !todoitem.completed
            });
            default :
            return todos();
      }

    })
  })),
);

