import { atom } from 'jotai';
import { atomWithImmer } from 'jotai-immer';
import type {
  Todo,
  TodoFilter,
  TodoPriority,
  TodoCategory,
} from '@/types/todo';
import { generateSampleTodos } from '@/utils/todoHelpers';

// 基础原子状态
export const todosAtom = atomWithImmer<Todo[]>(generateSampleTodos());

export const filterAtom = atomWithImmer<TodoFilter>({
  status: 'all',
  category: 'all',
  priority: 'all',
  searchText: '',
});

export const loadingAtom = atom<boolean>(false);
export const errorAtom = atom<string | null>(null);

// 派生原子 - 过滤后的 todos
export const filteredTodosAtom = atom(get => {
  const todos = get(todosAtom);
  const filter = get(filterAtom);

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
});

// 派生原子 - 统计信息
export const todoStatsAtom = atom(get => {
  const todos = get(todosAtom);

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
});

// 写入原子 - Todo 操作
export const addTodoAtom = atom(
  null,
  (
    _get,
    set,
    {
      text,
      priority,
      category,
    }: { text: string; priority: TodoPriority; category: TodoCategory }
  ) => {
    const newTodo: Todo = {
      id: `todo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text,
      completed: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      priority,
      category,
    };

    set(todosAtom, draft => {
      draft.unshift(newTodo);
    });
  }
);

export const toggleTodoAtom = atom(null, (_get, set, id: string) => {
  set(todosAtom, draft => {
    const todo = draft.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      todo.updatedAt = Date.now();
    }
  });
});

export const updateTodoAtom = atom(
  null,
  (_get, set, { id, updates }: { id: string; updates: Partial<Todo> }) => {
    set(todosAtom, draft => {
      const todo = draft.find(t => t.id === id);
      if (todo) {
        Object.assign(todo, updates, { updatedAt: Date.now() });
      }
    });
  }
);

export const deleteTodoAtom = atom(null, (_get, set, id: string) => {
  set(todosAtom, draft => {
    const index = draft.findIndex(t => t.id === id);
    if (index !== -1) {
      draft.splice(index, 1);
    }
  });
});

// 批量操作原子
export const batchToggleTodosAtom = atom(null, (_get, set, ids: string[]) => {
  const updatedAt = Date.now();
  set(todosAtom, draft => {
    ids.forEach(id => {
      const todo = draft.find(t => t.id === id);
      if (todo) {
        todo.completed = !todo.completed;
        todo.updatedAt = updatedAt;
      }
    });
  });
});

export const clearCompletedAtom = atom(null, (_get, set) => {
  set(todosAtom, draft => {
    return draft.filter(t => !t.completed);
  });
});

// 过滤器操作原子
export const updateFilterAtom = atom(
  null,
  (_get, set, filterUpdates: Partial<TodoFilter>) => {
    set(filterAtom, draft => {
      Object.assign(draft, filterUpdates);
    });
  }
);

export const resetFilterAtom = atom(null, (_get, set) => {
  set(filterAtom, {
    status: 'all',
    category: 'all',
    priority: 'all',
    searchText: '',
  });
});

// 重置数据原子
export const resetTodosAtom = atom(null, (_get, set) => {
  set(todosAtom, generateSampleTodos());
  set(filterAtom, {
    status: 'all',
    category: 'all',
    priority: 'all',
    searchText: '',
  });
  set(errorAtom, null);
});

// 组合原子 - 用于特定功能
export const todosByPriorityAtom = atom(get => {
  const todos = get(todosAtom);
  const priorityOrder = { high: 3, medium: 2, low: 1 };

  return [...todos].sort(
    (a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]
  );
});

export const todosByCategoryAtom = atom(get => {
  const todos = get(todosAtom);
  const categories: Record<TodoCategory, Todo[]> = {
    work: [],
    personal: [],
    shopping: [],
    health: [],
    other: [],
  };

  todos.forEach(todo => {
    categories[todo.category].push(todo);
  });

  return categories;
});

// 搜索相关的原子
export const searchQueryAtom = atom<string>('');

export const searchResultsAtom = atom(get => {
  const todos = get(todosAtom);
  const query = get(searchQueryAtom);

  if (!query.trim()) return todos;

  const lowercaseQuery = query.toLowerCase();
  return todos.filter(
    todo =>
      todo.text.toLowerCase().includes(lowercaseQuery) ||
      todo.category.toLowerCase().includes(lowercaseQuery) ||
      todo.priority.toLowerCase().includes(lowercaseQuery)
  );
});
