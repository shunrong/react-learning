import React, { createContext, useContext, useReducer, useMemo } from 'react';
import type {
  Todo,
  TodoFilter,
  TodoPriority,
  TodoCategory,
} from '@/types/todo';
import { generateSampleTodos } from '@/utils/todoHelpers';

// State 接口
interface TodoState {
  todos: Todo[];
  filter: TodoFilter;
  loading: boolean;
  error: string | null;
}

// Action 类型
type TodoAction =
  | {
      type: 'ADD_TODO';
      payload: { text: string; priority: TodoPriority; category: TodoCategory };
    }
  | { type: 'TOGGLE_TODO'; payload: string }
  | { type: 'UPDATE_TODO'; payload: { id: string; updates: Partial<Todo> } }
  | { type: 'DELETE_TODO'; payload: string }
  | { type: 'CLEAR_COMPLETED' }
  | { type: 'UPDATE_FILTER'; payload: Partial<TodoFilter> }
  | { type: 'RESET_FILTER' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_TODOS' };

// 初始状态
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

// Reducer
function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case 'ADD_TODO': {
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
      return {
        ...state,
        todos: [newTodo, ...state.todos],
      };
    }

    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed, updatedAt: Date.now() }
            : todo
        ),
      };

    case 'UPDATE_TODO': {
      const { id, updates } = action.payload;
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === id ? { ...todo, ...updates, updatedAt: Date.now() } : todo
        ),
      };
    }

    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload),
      };

    case 'CLEAR_COMPLETED':
      return {
        ...state,
        todos: state.todos.filter(todo => !todo.completed),
      };

    case 'UPDATE_FILTER':
      return {
        ...state,
        filter: { ...state.filter, ...action.payload },
      };

    case 'RESET_FILTER':
      return {
        ...state,
        filter: initialState.filter,
      };

    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };

    case 'RESET_TODOS':
      return {
        ...state,
        todos: generateSampleTodos(),
        filter: initialState.filter,
        error: null,
      };

    default:
      return state;
  }
}

// Context 类型
interface TodoContextType {
  state: TodoState;
  dispatch: React.Dispatch<TodoAction>;
  // 计算属性
  filteredTodos: Todo[];
  todoStats: {
    total: number;
    completed: number;
    active: number;
    byCategory: Record<TodoCategory, number>;
    byPriority: Record<TodoPriority, number>;
  };
  // Action creators
  actions: {
    addTodo: (
      text: string,
      priority: TodoPriority,
      category: TodoCategory
    ) => void;
    toggleTodo: (id: string) => void;
    updateTodo: (id: string, updates: Partial<Todo>) => void;
    deleteTodo: (id: string) => void;
    clearCompleted: () => void;
    updateFilter: (filter: Partial<TodoFilter>) => void;
    resetFilter: () => void;
    resetTodos: () => void;
  };
}

// Context
const TodoContext = createContext<TodoContextType | null>(null);

// Provider 组件
export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  // 计算过滤后的 todos
  const filteredTodos = useMemo(() => {
    return state.todos.filter(todo => {
      // 状态过滤
      if (state.filter.status === 'active' && todo.completed) return false;
      if (state.filter.status === 'completed' && !todo.completed) return false;

      // 分类过滤
      if (
        state.filter.category !== 'all' &&
        todo.category !== state.filter.category
      )
        return false;

      // 优先级过滤
      if (
        state.filter.priority !== 'all' &&
        todo.priority !== state.filter.priority
      )
        return false;

      // 文本搜索
      if (
        state.filter.searchText &&
        !todo.text.toLowerCase().includes(state.filter.searchText.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  }, [state.todos, state.filter]);

  // 计算统计信息
  const todoStats = useMemo(() => {
    return {
      total: state.todos.length,
      completed: state.todos.filter(t => t.completed).length,
      active: state.todos.filter(t => !t.completed).length,
      byCategory: {
        work: state.todos.filter(t => t.category === 'work').length,
        personal: state.todos.filter(t => t.category === 'personal').length,
        shopping: state.todos.filter(t => t.category === 'shopping').length,
        health: state.todos.filter(t => t.category === 'health').length,
        other: state.todos.filter(t => t.category === 'other').length,
      },
      byPriority: {
        low: state.todos.filter(t => t.priority === 'low').length,
        medium: state.todos.filter(t => t.priority === 'medium').length,
        high: state.todos.filter(t => t.priority === 'high').length,
      },
    };
  }, [state.todos]);

  // Action creators
  const actions = useMemo(
    () => ({
      addTodo: (
        text: string,
        priority: TodoPriority,
        category: TodoCategory
      ) => {
        dispatch({ type: 'ADD_TODO', payload: { text, priority, category } });
      },
      toggleTodo: (id: string) => {
        dispatch({ type: 'TOGGLE_TODO', payload: id });
      },
      updateTodo: (id: string, updates: Partial<Todo>) => {
        dispatch({ type: 'UPDATE_TODO', payload: { id, updates } });
      },
      deleteTodo: (id: string) => {
        dispatch({ type: 'DELETE_TODO', payload: id });
      },
      clearCompleted: () => {
        dispatch({ type: 'CLEAR_COMPLETED' });
      },
      updateFilter: (filter: Partial<TodoFilter>) => {
        dispatch({ type: 'UPDATE_FILTER', payload: filter });
      },
      resetFilter: () => {
        dispatch({ type: 'RESET_FILTER' });
      },
      resetTodos: () => {
        dispatch({ type: 'RESET_TODOS' });
      },
    }),
    [dispatch]
  );

  // Context 值
  const contextValue = useMemo(
    () => ({
      state,
      dispatch,
      filteredTodos,
      todoStats,
      actions,
    }),
    [state, dispatch, filteredTodos, todoStats, actions]
  );

  return (
    <TodoContext.Provider value={contextValue}>{children}</TodoContext.Provider>
  );
};

// 自定义 Hook
export const useTodoContext = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodoContext must be used within a TodoProvider');
  }
  return context;
};

// 便捷的选择器 hooks
export const useTodos = () => {
  const { state } = useTodoContext();
  return state.todos;
};

export const useFilter = () => {
  const { state } = useTodoContext();
  return state.filter;
};

export const useFilteredTodos = () => {
  const { filteredTodos } = useTodoContext();
  return filteredTodos;
};

export const useTodoStats = () => {
  const { todoStats } = useTodoContext();
  return todoStats;
};

export const useTodoActions = () => {
  const { actions } = useTodoContext();
  return actions;
};

export const useLoading = () => {
  const { state } = useTodoContext();
  return state.loading;
};

export const useError = () => {
  const { state } = useTodoContext();
  return state.error;
};
