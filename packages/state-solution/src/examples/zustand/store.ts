import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware';
import type {
  Todo,
  TodoFilter,
  TodoPriority,
  TodoCategory,
} from '@/types/todo';
import { generateSampleTodos } from '@/utils/todoHelpers';

interface TodoState {
  // 状态
  todos: Todo[];
  filter: TodoFilter;
  loading: boolean;
  error: string | null;

  // Actions
  addTodo: (
    text: string,
    priority: TodoPriority,
    category: TodoCategory
  ) => void;
  toggleTodo: (id: string) => void;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  batchToggleTodos: (ids: string[]) => void;
  batchDeleteTodos: (ids: string[]) => void;
  clearCompleted: () => void;

  // 过滤器 Actions
  setFilter: (filter: Partial<TodoFilter>) => void;
  resetFilter: () => void;

  // 工具 Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetTodos: () => void;

  // 计算属性 (选择器)
  getFilteredTodos: () => Todo[];
  getTodoStats: () => {
    total: number;
    completed: number;
    active: number;
    byCategory: Record<TodoCategory, number>;
    byPriority: Record<TodoPriority, number>;
  };
}

const initialFilter: TodoFilter = {
  status: 'all',
  category: 'all',
  priority: 'all',
  searchText: '',
};

export const useTodoStore = create<TodoState>()(
  devtools(
    immer((set, get) => ({
      // 初始状态
      todos: generateSampleTodos(),
      filter: initialFilter,
      loading: false,
      error: null,

      // Todo CRUD Actions
      addTodo: (text, priority, category) => {
        set(state => {
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
        });
      },

      toggleTodo: id => {
        set(state => {
          const todo = state.todos.find(t => t.id === id);
          if (todo) {
            todo.completed = !todo.completed;
            todo.updatedAt = Date.now();
          }
        });
      },

      updateTodo: (id, updates) => {
        set(state => {
          const todo = state.todos.find(t => t.id === id);
          if (todo) {
            Object.assign(todo, updates, { updatedAt: Date.now() });
          }
        });
      },

      deleteTodo: id => {
        set(state => {
          state.todos = state.todos.filter(t => t.id !== id);
        });
      },

      // 批量操作
      batchToggleTodos: ids => {
        set(state => {
          const updatedAt = Date.now();
          ids.forEach(id => {
            const todo = state.todos.find(t => t.id === id);
            if (todo) {
              todo.completed = !todo.completed;
              todo.updatedAt = updatedAt;
            }
          });
        });
      },

      batchDeleteTodos: ids => {
        set(state => {
          state.todos = state.todos.filter(t => !ids.includes(t.id));
        });
      },

      clearCompleted: () => {
        set(state => {
          state.todos = state.todos.filter(t => !t.completed);
        });
      },

      // 过滤器 Actions
      setFilter: filterUpdates => {
        set(state => {
          Object.assign(state.filter, filterUpdates);
        });
      },

      resetFilter: () => {
        set(state => {
          state.filter = { ...initialFilter };
        });
      },

      // 工具 Actions
      setLoading: loading => {
        set(state => {
          state.loading = loading;
        });
      },

      setError: error => {
        set(state => {
          state.error = error;
        });
      },

      resetTodos: () => {
        set(state => {
          state.todos = generateSampleTodos();
          state.filter = { ...initialFilter };
          state.error = null;
        });
      },

      // 计算属性 (选择器)
      getFilteredTodos: () => {
        const { todos, filter } = get();
        return todos.filter(todo => {
          // 状态过滤
          if (filter.status === 'active' && todo.completed) return false;
          if (filter.status === 'completed' && !todo.completed) return false;

          // 分类过滤
          if (filter.category !== 'all' && todo.category !== filter.category)
            return false;

          // 优先级过滤
          if (filter.priority !== 'all' && todo.priority !== filter.priority)
            return false;

          // 文本搜索
          if (
            filter.searchText &&
            !todo.text.toLowerCase().includes(filter.searchText.toLowerCase())
          ) {
            return false;
          }

          return true;
        });
      },

      getTodoStats: () => {
        const todos = get().todos;
        return {
          total: todos.length,
          completed: todos.filter(t => t.completed).length,
          active: todos.filter(t => !t.completed).length,
          byCategory: {
            work: todos.filter(t => t.category === 'work').length,
            personal: todos.filter(t => t.category === 'personal').length,
            shopping: todos.filter(t => t.category === 'shopping').length,
            health: todos.filter(t => t.category === 'health').length,
            other: todos.filter(t => t.category === 'other').length,
          },
          byPriority: {
            low: todos.filter(t => t.priority === 'low').length,
            medium: todos.filter(t => t.priority === 'medium').length,
            high: todos.filter(t => t.priority === 'high').length,
          },
        };
      },
    })),
    {
      name: 'todo-store', // DevTools 中显示的名称
    }
  )
);

// 便捷的选择器 hooks
export const useTodos = () => useTodoStore(state => state.todos);
export const useFilter = () => useTodoStore(state => state.filter);
export const useLoading = () => useTodoStore(state => state.loading);
export const useError = () => useTodoStore(state => state.error);
export const useFilteredTodos = () =>
  useTodoStore(state => state.getFilteredTodos());
export const useTodoStats = () => useTodoStore(state => state.getTodoStats());

// Actions hooks
export const useTodoActions = () => ({
  addTodo: useTodoStore(state => state.addTodo),
  toggleTodo: useTodoStore(state => state.toggleTodo),
  updateTodo: useTodoStore(state => state.updateTodo),
  deleteTodo: useTodoStore(state => state.deleteTodo),
  clearCompleted: useTodoStore(state => state.clearCompleted),
  resetTodos: useTodoStore(state => state.resetTodos),
});

export const useFilterActions = () => ({
  setFilter: useTodoStore(state => state.setFilter),
  resetFilter: useTodoStore(state => state.resetFilter),
});
