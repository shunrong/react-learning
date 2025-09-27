import React from 'react';
import { useAppDispatch } from './hooks';
import {
  addTodo,
  toggleTodo,
  updateTodo,
  deleteTodo,
  setFilter,
  clearCompleted,
  resetTodos,
} from './store';
import { useTodos, useFilter, useFilteredTodos, useTodoStats } from './hooks';

import AddTodoForm from '@/components/AddTodoForm';
import TodoItem from '@/components/TodoItem';
import TodoFilter from '@/components/TodoFilter';
import TodoStats from '@/components/TodoStats';
import type { TodoPriority, TodoCategory, Todo } from '@/types/todo';

const ReduxTodoApp: React.FC = () => {
  const dispatch = useAppDispatch();
  const allTodos = useTodos();
  const filter = useFilter();
  const filteredTodos = useFilteredTodos();
  const stats = useTodoStats();

  // 添加 Todo
  const handleAddTodo = (
    text: string,
    priority: TodoPriority,
    category: TodoCategory
  ) => {
    dispatch(addTodo({ text, priority, category }));
  };

  // 切换完成状态
  const handleToggleTodo = (id: string) => {
    dispatch(toggleTodo(id));
  };

  // 更新 Todo
  const handleUpdateTodo = (id: string, updates: Partial<Todo>) => {
    dispatch(updateTodo({ id, updates }));
  };

  // 删除 Todo
  const handleDeleteTodo = (id: string) => {
    dispatch(deleteTodo(id));
  };

  // 更新过滤器
  const handleFilterChange = (newFilter: typeof filter) => {
    dispatch(setFilter(newFilter));
  };

  // 清除已完成
  const handleClearCompleted = () => {
    dispatch(clearCompleted());
  };

  // 重置数据
  const handleReset = () => {
    dispatch(resetTodos());
  };

  return (
    <div className='max-w-6xl mx-auto space-y-6'>
      {/* 操作栏 */}
      <div className='bg-white rounded-lg border border-gray-200 p-6'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-xl font-semibold text-gray-900'>
            Redux Toolkit Todo 应用
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
              <div className='text-gray-400 text-6xl mb-4'>📝</div>
              <h3 className='text-lg font-medium text-gray-900 mb-2'>
                {allTodos.length === 0 ? '还没有 Todo' : '没有匹配的 Todo'}
              </h3>
              <p className='text-gray-500'>
                {allTodos.length === 0
                  ? '添加第一个 Todo 开始使用'
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

      {/* Redux 状态监控 */}
      <div className='bg-gray-50 rounded-lg p-6'>
        <h3 className='text-lg font-semibold text-gray-900 mb-4'>
          🔍 Redux 状态监控
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <h4 className='text-sm font-medium text-gray-700 mb-2'>
              当前过滤器状态
            </h4>
            <pre className='code-block text-xs'>
              {JSON.stringify(filter, null, 2)}
            </pre>
          </div>
          <div>
            <h4 className='text-sm font-medium text-gray-700 mb-2'>
              Todo 统计信息
            </h4>
            <pre className='code-block text-xs'>
              {JSON.stringify(stats, null, 2)}
            </pre>
          </div>
        </div>
        <div className='mt-4'>
          <h4 className='text-sm font-medium text-gray-700 mb-2'>
            Redux DevTools 提示
          </h4>
          <p className='text-sm text-gray-600'>
            打开浏览器开发者工具，切换到 "Redux" 选项卡查看完整的状态树和 action
            历史。 每个操作都会生成对应的 action，你可以看到状态的变化过程。
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReduxTodoApp;
