// Todo 应用的类型定义 - 所有状态管理方案共享

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  updatedAt: number;
  priority: TodoPriority;
  category: TodoCategory;
}

export type TodoPriority = 'low' | 'medium' | 'high';
export type TodoCategory =
  | 'work'
  | 'personal'
  | 'shopping'
  | 'health'
  | 'other';

export interface TodoFilter {
  status: 'all' | 'active' | 'completed';
  category: TodoCategory | 'all';
  priority: TodoPriority | 'all';
  searchText: string;
}

export interface TodoStats {
  total: number;
  completed: number;
  active: number;
  byCategory: Record<TodoCategory, number>;
  byPriority: Record<TodoPriority, number>;
}

// 状态管理方案标识
export type StateManagementType =
  | 'redux-toolkit'
  | 'zustand'
  | 'jotai'
  | 'context-reducer';

// 性能监控类型
export interface PerformanceMetrics {
  stateManagement: StateManagementType;
  renderCount: number;
  averageRenderTime: number;
  totalRenderTime: number;
  memoryUsage?: number;
  bundleSize?: number;
}

export interface BenchmarkResult {
  method: StateManagementType;
  operation: string;
  duration: number;
  iterations: number;
  averageTime: number;
}
