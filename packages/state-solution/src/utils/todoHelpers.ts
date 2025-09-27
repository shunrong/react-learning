import { nanoid } from 'nanoid';
import type {
  Todo,
  TodoFilter,
  TodoStats,
  TodoPriority,
  TodoCategory,
} from '@/types/todo';

// Todo 创建工具
export const createTodo = (
  text: string,
  priority: TodoPriority = 'medium',
  category: TodoCategory = 'other'
): Todo => ({
  id: nanoid(),
  text: text.trim(),
  completed: false,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  priority,
  category,
});

// Todo 过滤工具
export const filterTodos = (todos: Todo[], filter: TodoFilter): Todo[] => {
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

// Todo 排序工具
export const sortTodos = (
  todos: Todo[],
  sortBy: 'createdAt' | 'updatedAt' | 'priority' | 'text' = 'createdAt'
): Todo[] => {
  const sorted = [...todos];

  switch (sortBy) {
    case 'priority':
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return sorted.sort(
        (a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]
      );

    case 'text':
      return sorted.sort((a, b) => a.text.localeCompare(b.text));

    case 'updatedAt':
      return sorted.sort((a, b) => b.updatedAt - a.updatedAt);

    case 'createdAt':
    default:
      return sorted.sort((a, b) => b.createdAt - a.createdAt);
  }
};

// Todo 统计工具
export const calculateTodoStats = (todos: Todo[]): TodoStats => {
  const stats: TodoStats = {
    total: todos.length,
    completed: 0,
    active: 0,
    byCategory: {
      work: 0,
      personal: 0,
      shopping: 0,
      health: 0,
      other: 0,
    },
    byPriority: {
      low: 0,
      medium: 0,
      high: 0,
    },
  };

  todos.forEach(todo => {
    if (todo.completed) {
      stats.completed++;
    } else {
      stats.active++;
    }

    stats.byCategory[todo.category]++;
    stats.byPriority[todo.priority]++;
  });

  return stats;
};

// 示例 Todo 数据生成
export const generateSampleTodos = (): Todo[] => [
  createTodo('完成 React 状态管理对比项目', 'high', 'work'),
  createTodo('学习 Redux Toolkit 最佳实践', 'medium', 'work'),
  createTodo('研究 Zustand 性能优化', 'medium', 'work'),
  createTodo('买菜购物', 'low', 'shopping'),
  createTodo('晨跑 30 分钟', 'medium', 'health'),
  createTodo('阅读技术文档', 'low', 'personal'),
  createTodo('优化应用性能', 'high', 'work'),
  createTodo('准备技术分享', 'medium', 'work'),
];

// 批量操作工具
export const batchUpdateTodos = (
  todos: Todo[],
  ids: string[],
  updates: Partial<Pick<Todo, 'completed' | 'priority' | 'category'>>
): Todo[] => {
  const updatedAt = Date.now();
  return todos.map(todo =>
    ids.includes(todo.id) ? { ...todo, ...updates, updatedAt } : todo
  );
};

// 导出/导入工具
export const exportTodos = (todos: Todo[]): string => {
  return JSON.stringify(todos, null, 2);
};

export const importTodos = (jsonString: string): Todo[] => {
  try {
    const parsed = JSON.parse(jsonString);
    if (Array.isArray(parsed)) {
      return parsed.filter(
        item =>
          typeof item === 'object' &&
          item.id &&
          item.text &&
          typeof item.completed === 'boolean'
      );
    }
    return [];
  } catch {
    return [];
  }
};
