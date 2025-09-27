import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// 类型化的 hooks
export const useAppDispatch: () => AppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// 选择器
export const useTodos = () => useAppSelector(state => state.todos.todos);
export const useFilter = () => useAppSelector(state => state.todos.filter);
export const useLoading = () => useAppSelector(state => state.todos.loading);
export const useError = () => useAppSelector(state => state.todos.error);

// 带过滤的 todos
export const useFilteredTodos = () => {
  const todos = useTodos();
  const filter = useFilter();

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
};

// 统计信息
export const useTodoStats = () => {
  const todos = useTodos();

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
};
