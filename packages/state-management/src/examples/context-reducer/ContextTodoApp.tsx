import React from 'react';
import {
  useTodos,
  useFilter,
  useFilteredTodos,
  useTodoStats,
  useTodoActions,
  useTodoContext,
} from './TodoContext';

import AddTodoForm from '@/components/AddTodoForm';
import TodoItem from '@/components/TodoItem';
import TodoFilter from '@/components/TodoFilter';
import TodoStats from '@/components/TodoStats';
import type { TodoPriority, TodoCategory, Todo } from '@/types/todo';

const ContextTodoApp: React.FC = () => {
  // 状态订阅
  const allTodos = useTodos();
  const filter = useFilter();
  const filteredTodos = useFilteredTodos();
  const stats = useTodoStats();
  const { state } = useTodoContext();

  // Actions
  const {
    addTodo,
    toggleTodo,
    updateTodo,
    deleteTodo,
    clearCompleted,
    updateFilter,
    resetTodos,
  } = useTodoActions();

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
    updateFilter(newFilter);
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
            🎣 Context + useReducer Todo 应用
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
              <div className='text-gray-400 text-6xl mb-4'>🎣</div>
              <h3 className='text-lg font-medium text-gray-900 mb-2'>
                {allTodos.length === 0
                  ? 'Context 中还没有 Todo'
                  : '没有匹配的 Todo'}
              </h3>
              <p className='text-gray-500'>
                {allTodos.length === 0
                  ? '使用 useReducer 添加第一个 Todo'
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

      {/* Context + useReducer 状态监控 */}
      <div className='bg-blue-50 rounded-lg p-6 border border-blue-200'>
        <h3 className='text-lg font-semibold text-blue-900 mb-4'>
          🔍 Context + useReducer 状态监控
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <h4 className='text-sm font-medium text-blue-800 mb-2'>
              当前 Context 状态
            </h4>
            <pre className='bg-white rounded border border-blue-200 p-3 text-xs text-gray-800 overflow-x-auto'>
              {JSON.stringify(
                {
                  todosCount: state.todos.length,
                  filter: state.filter,
                  loading: state.loading,
                  error: state.error,
                },
                null,
                2
              )}
            </pre>
          </div>
          <div>
            <h4 className='text-sm font-medium text-blue-800 mb-2'>
              计算状态（useMemo）
            </h4>
            <pre className='bg-white rounded border border-blue-200 p-3 text-xs text-gray-800 overflow-x-auto'>
              {JSON.stringify(
                {
                  filteredCount: filteredTodos.length,
                  stats,
                },
                null,
                2
              )}
            </pre>
          </div>
        </div>

        <div className='mt-6'>
          <h4 className='text-sm font-medium text-blue-800 mb-2'>
            🎣 Context + useReducer 特性演示
          </h4>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
            <div className='bg-white rounded border border-blue-200 p-4'>
              <h5 className='font-medium text-blue-700 mb-2'>
                🔄 Reducer 模式
              </h5>
              <p className='text-blue-600 text-xs'>
                所有状态更新通过 dispatch action
                进行，保证更新的一致性和可预测性。 每个 action 都有明确的 type
                和 payload。
              </p>
            </div>
            <div className='bg-white rounded border border-blue-200 p-4'>
              <h5 className='font-medium text-blue-700 mb-2'>
                📦 Context 共享
              </h5>
              <p className='text-blue-600 text-xs'>
                通过 Context 避免 prop drilling，任何组件都可以访问状态和
                dispatch 函数， 无需层层传递属性。
              </p>
            </div>
            <div className='bg-white rounded border border-blue-200 p-4'>
              <h5 className='font-medium text-blue-700 mb-2'>🎯 性能优化</h5>
              <p className='text-blue-600 text-xs'>
                使用 useMemo 缓存计算状态，useCallback 缓存 action creators，
                减少不必要的重新渲染。
              </p>
            </div>
            <div className='bg-white rounded border border-blue-200 p-4'>
              <h5 className='font-medium text-blue-700 mb-2'>🛠️ 调试体验</h5>
              <p className='text-blue-600 text-xs'>
                虽然没有专门的 DevTools，但可以通过 console.log 在 reducer 中
                打印每个 action 来调试状态变化。
              </p>
            </div>
          </div>
        </div>

        {/* Action 演示 */}
        <div className='mt-6'>
          <h4 className='text-sm font-medium text-blue-800 mb-2'>
            🎬 Reducer Actions 演示
          </h4>
          <div className='bg-white rounded border border-blue-200 p-4'>
            <div className='text-xs text-blue-700 mb-2'>
              可用的 Action 类型：
            </div>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-2 text-xs font-mono'>
              <div className='bg-blue-50 px-2 py-1 rounded'>ADD_TODO</div>
              <div className='bg-blue-50 px-2 py-1 rounded'>TOGGLE_TODO</div>
              <div className='bg-blue-50 px-2 py-1 rounded'>UPDATE_TODO</div>
              <div className='bg-blue-50 px-2 py-1 rounded'>DELETE_TODO</div>
              <div className='bg-blue-50 px-2 py-1 rounded'>
                CLEAR_COMPLETED
              </div>
              <div className='bg-blue-50 px-2 py-1 rounded'>UPDATE_FILTER</div>
              <div className='bg-blue-50 px-2 py-1 rounded'>RESET_FILTER</div>
              <div className='bg-blue-50 px-2 py-1 rounded'>RESET_TODOS</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContextTodoApp;
