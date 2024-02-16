// Importaciones de módulos y clases necesarias desde Angular
import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, effect, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

// Importación de tipos y interfaces personalizadas
import { FilterType, Todo } from '../../Interfaces/todo';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {

  // Señales para los datos de la lista de tareas y el filtro
  todoList = signal<Todo[]>([]);
  filter = signal<FilterType>('all');

  // Cálculo de la lista de tareas filtradas
  todoListFiltered = computed(() => {
    const filter = this.filter();
    const todos = this.todoList();

    switch (filter) {
      case 'active':
        return todos.filter((todo) => !todo.completed);

      case 'completed':
        return todos.filter((todo) => todo.completed);

      default:
        return todos;
    }
  })

  // Campo de entrada para agregar nuevas tareas
  newTodo = new FormControl('', {
    // Validación de no nulo y longitud mínima del título
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(3)],
  });

  constructor() {
    // Efecto para guardar la lista de tareas en el almacenamiento local
    effect(() => {
      localStorage.setItem('todos', JSON.stringify(this.todoList()));
    });
  }

  ngOnInit(): void {
    // Cargar la lista de tareas desde el almacenamiento local al inicializar el componente
    const storage = localStorage.getItem('todos');
    if (storage) {
      this.todoList.set(JSON.parse(storage));
    }
  }

  // Método para cambiar el filtro de la lista de tareas
  changeFilter(filterString: FilterType) {
    this.filter.set(filterString)
  }

  // Método para agregar una nueva tarea
  addTodo() {
    const newTodoTitle = this.newTodo.value.trim();
    if (this.newTodo.valid && newTodoTitle !== '') {
      this.todoList.update((prev_todos) => {
        return [
          ...prev_todos,
          { id: Date.now(), title: newTodoTitle, completed: false }
        ];
      });

      this.newTodo.reset();
    } else {
      this.newTodo.reset();
    }
  }

  // Método para alternar el estado completado de una tarea
  toggleTodo(todoId: number) {
    return this.todoList.update((prev_todos) => prev_todos.map((todo) => {
      if (todo.id === todoId) {
        return {
          ...todo,
          completed: !todo.completed
        }
      }
      return { ...todo };
    }));
  }

  // Método para eliminar una tarea
  removeTodo(todoId: number) {
    this.todoList.update((prev_todos) =>
      prev_todos.filter((todo) => todo.id !== todoId)
    );
  }

  // Método para actualizar el modo de edición de una tarea
  updateTodoEditingMode(todoId: number) {
    return this.todoList.update((prev_todos) =>
      prev_todos.map((todo) => {
        return todo.id === todoId ?
          { ...todo, editing: true } :
          { ...todo, editing: false };
      })
    );
  }

  // Método para guardar el título de una tarea editada
  saveTitleTodo(todoId: number, event: Event) {
    const title = (event.target as HTMLInputElement).value;
    return this.todoList.update((prev_todos) => prev_todos.map((todo) => {
      return todo.id === todoId ? { ...todo, title: title, editing: false } : todo;
    }))
  }

}
