import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type {
  Todo,
  TodoFilter,
  TodoPriority,
  TodoCategory,
} from '@/types/todo';
import { generateSampleTodos } from '@/utils/todoHelpers';

// Todo Slice
interface TodoState {
  todos: Todo[];
  filter: TodoFilter;
  loading: boolean;
  error: string | null;
}

const initialState: TodoState = {
  todos: generateSampleTodos(),
  filter: {
    status: 'all',
    category: 'all',
    priority: 'all',
    searchText: '',
  },
  loading: false,
  error: null,
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    // Todo CRUD 操作
    addTodo: (
      state,
      action: PayloadAction<{
        text: string;
        priority: TodoPriority;
        category: TodoCategory;
      }>
    ) => {
      const { text, priority, category } = action.payload;
      const newTodo: Todo = {
        id: `todo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text,
        completed: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        priority,
        category,
      };
      state.todos.unshift(newTodo);
    },

    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find(t => t.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        todo.updatedAt = Date.now();
      }
    },

    updateTodo: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<Todo> }>
    ) => {
      const { id, updates } = action.payload;
      const todo = state.todos.find(t => t.id === id);
      if (todo) {
        Object.assign(todo, updates, { updatedAt: Date.now() });
      }
    },

    deleteTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter(t => t.id !== action.payload);
    },

    // 批量操作
    batchToggleTodos: (state, action: PayloadAction<string[]>) => {
      const ids = action.payload;
      const updatedAt = Date.now();
      ids.forEach(id => {
        const todo = state.todos.find(t => t.id === id);
        if (todo) {
          todo.completed = !todo.completed;
          todo.updatedAt = updatedAt;
        }
      });
    },

    batchDeleteTodos: (state, action: PayloadAction<string[]>) => {
      const ids = action.payload;
      state.todos = state.todos.filter(t => !ids.includes(t.id));
    },

    clearCompleted: state => {
      state.todos = state.todos.filter(t => !t.completed);
    },

    // 过滤器操作
    setFilter: (state, action: PayloadAction<Partial<TodoFilter>>) => {
      state.filter = { ...state.filter, ...action.payload };
    },

    resetFilter: state => {
      state.filter = initialState.filter;
    },

    // 加载状态
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // 数据重置
    resetTodos: state => {
      state.todos = generateSampleTodos();
      state.filter = initialState.filter;
      state.error = null;
    },
  },
});

// Actions
export const {
  addTodo,
  toggleTodo,
  updateTodo,
  deleteTodo,
  batchToggleTodos,
  batchDeleteTodos,
  clearCompleted,
  setFilter,
  resetFilter,
  setLoading,
  setError,
  resetTodos,
} = todoSlice.actions;

// Store
export const reduxStore = configureStore({
  reducer: {
    todos: todoSlice.reducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof reduxStore.getState>;
export type AppDispatch = typeof reduxStore.dispatch;
