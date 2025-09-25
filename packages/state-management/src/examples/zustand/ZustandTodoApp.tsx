import React from 'react';
import {
  useTodos,
  useFilter,
  useFilteredTodos,
  useTodoStats,
  useTodoActions,
  useFilterActions,
} from './store';

import AddTodoForm from '@/components/AddTodoForm';
import TodoItem from '@/components/TodoItem';
import TodoFilter from '@/components/TodoFilter';
import TodoStats from '@/components/TodoStats';
import type { TodoPriority, TodoCategory, Todo } from '@/types/todo';

const ZustandTodoApp: React.FC = () => {
  // 状态订阅
  const allTodos = useTodos();
  const filter = useFilter();
  const filteredTodos = useFilteredTodos();
  const stats = useTodoStats();

  // Actions
  const {
    addTodo,
    toggleTodo,
    updateTodo,
    deleteTodo,
    clearCompleted,
    resetTodos,
  } = useTodoActions();
  const { setFilter } = useFilterActions();

  // 事件处理
  const handleAddTodo = (
    text: string,
    priority: TodoPriority,
    category: TodoCategory
  ) => {
    addTodo(text, priority, category);
  };

  const handleToggleTodo = (id: string) => {
    toggleTodo(id);
  };

  const handleUpdateTodo = (id: string, updates: Partial<Todo>) => {
    updateTodo(id, updates);
  };

  const handleDeleteTodo = (id: string) => {
    deleteTodo(id);
  };

  const handleFilterChange = (newFilter: typeof filter) => {
    setFilter(newFilter);
  };

  const handleClearCompleted = () => {
    clearCompleted();
  };

  const handleReset = () => {
    resetTodos();
  };

  return (
    <div className='max-w-6xl mx-auto space-y-6'>
      {/* 操作栏 */}
      <div className='bg-white rounded-lg border border-gray-200 p-6'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-xl font-semibold text-gray-900'>
            🐻 Zustand Todo 应用
          </h2>
          <div className='flex gap-3'>
            <button
              onClick={handleClearCompleted}
              disabled={stats.completed === 0}
              className='px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
            >
              清除已完成 ({stats.completed})
            </button>
            <button
              onClick={handleReset}
              className='px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors'
            >
              重置数据
            </button>
          </div>
        </div>

        <AddTodoForm onAdd={handleAddTodo} />
      </div>

      {/* 过滤器和统计 */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2'>
          <TodoFilter filter={filter} onFilterChange={handleFilterChange} />
        </div>
        <div>
          <TodoStats stats={stats} />
        </div>
      </div>

      {/* Todo 列表 */}
      <div className='bg-white rounded-lg border border-gray-200'>
        <div className='p-6 border-b border-gray-200'>
          <div className='flex justify-between items-center'>
            <h3 className='text-lg font-semibold text-gray-900'>Todo 列表</h3>
            <div className='text-sm text-gray-500'>
              显示 {filteredTodos.length} / {allTodos.length} 项
            </div>
          </div>
        </div>

        <div className='p-6'>
          {filteredTodos.length === 0 ? (
            <div className='text-center py-12'>
              <div className='text-gray-400 text-6xl mb-4'>🐻</div>
              <h3 className='text-lg font-medium text-gray-900 mb-2'>
                {allTodos.length === 0
                  ? 'Zustand 熊说：还没有 Todo'
                  : '没有匹配的 Todo'}
              </h3>
              <p className='text-gray-500'>
                {allTodos.length === 0
                  ? '添加第一个 Todo 开始使用 Zustand'
                  : '尝试调整过滤条件'}
              </p>
            </div>
          ) : (
            <div className='space-y-3'>
              {filteredTodos.map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={handleToggleTodo}
                  onUpdate={handleUpdateTodo}
                  onDelete={handleDeleteTodo}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Zustand 状态监控 */}
      <div className='bg-amber-50 rounded-lg p-6 border border-amber-200'>
        <h3 className='text-lg font-semibold text-amber-900 mb-4'>
          🔍 Zustand Store 监控
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <h4 className='text-sm font-medium text-amber-800 mb-2'>
              当前过滤器状态
            </h4>
            <pre className='bg-white rounded border border-amber-200 p-3 text-xs text-gray-800 overflow-x-auto'>
              {JSON.stringify(filter, null, 2)}
            </pre>
          </div>
          <div>
            <h4 className='text-sm font-medium text-amber-800 mb-2'>
              Todo 统计信息
            </h4>
            <pre className='bg-white rounded border border-amber-200 p-3 text-xs text-gray-800 overflow-x-auto'>
              {JSON.stringify(stats, null, 2)}
            </pre>
          </div>
        </div>

        <div className='mt-6'>
          <h4 className='text-sm font-medium text-amber-800 mb-2'>
            🧸 Zustand 特点演示
          </h4>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
            <div className='bg-white rounded border border-amber-200 p-4'>
              <h5 className='font-medium text-amber-700 mb-2'>🎯 选择器订阅</h5>
              <p className='text-amber-600 text-xs'>
                每个组件只订阅需要的状态片段，例如：
                <code className='bg-amber-100 px-1 rounded'>
                  useTodos()
                </code>{' '}
                只在 todos 变化时更新。
              </p>
            </div>
            <div className='bg-white rounded border border-amber-200 p-4'>
              <h5 className='font-medium text-amber-700 mb-2'>
                🚀 无 Provider
              </h5>
              <p className='text-amber-600 text-xs'>
                Zustand 不需要 Provider 包装，直接导入 hook 即可使用，
                减少了组件树的嵌套层级。
              </p>
            </div>
            <div className='bg-white rounded border border-amber-200 p-4'>
              <h5 className='font-medium text-amber-700 mb-2'>🔧 Immer 集成</h5>
              <p className='text-amber-600 text-xs'>
                使用 Immer 中间件，可以直接"修改"状态对象，
                内部自动处理不可变更新。
              </p>
            </div>
            <div className='bg-white rounded border border-amber-200 p-4'>
              <h5 className='font-medium text-amber-700 mb-2'>🛠️ DevTools</h5>
              <p className='text-amber-600 text-xs'>
                集成 Redux DevTools，可以查看状态变化历史和时间旅行调试 (名称:
                todo-store)。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZustandTodoApp;
