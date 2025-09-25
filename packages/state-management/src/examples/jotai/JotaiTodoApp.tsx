import React from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  todosAtom,
  filterAtom,
  filteredTodosAtom,
  todoStatsAtom,
  addTodoAtom,
  toggleTodoAtom,
  updateTodoAtom,
  deleteTodoAtom,
  clearCompletedAtom,
  updateFilterAtom,
  resetTodosAtom,
  searchQueryAtom,
  searchResultsAtom,
  todosByPriorityAtom,
  todosByCategoryAtom,
} from './atoms';

import AddTodoForm from '@/components/AddTodoForm';
import TodoItem from '@/components/TodoItem';
import TodoFilter from '@/components/TodoFilter';
import TodoStats from '@/components/TodoStats';
import type { TodoPriority, TodoCategory, Todo } from '@/types/todo';

const JotaiTodoApp: React.FC = () => {
  // 原子状态订阅
  const allTodos = useAtomValue(todosAtom);
  const filter = useAtomValue(filterAtom);
  const filteredTodos = useAtomValue(filteredTodosAtom);
  const stats = useAtomValue(todoStatsAtom);

  // 额外的派生状态演示
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);
  const searchResults = useAtomValue(searchResultsAtom);
  const todosByPriority = useAtomValue(todosByPriorityAtom);
  const todosByCategory = useAtomValue(todosByCategoryAtom);

  // 写入原子操作
  const addTodo = useSetAtom(addTodoAtom);
  const toggleTodo = useSetAtom(toggleTodoAtom);
  const updateTodo = useSetAtom(updateTodoAtom);
  const deleteTodo = useSetAtom(deleteTodoAtom);
  const clearCompleted = useSetAtom(clearCompletedAtom);
  const updateFilter = useSetAtom(updateFilterAtom);
  const resetTodos = useSetAtom(resetTodosAtom);

  // 事件处理
  const handleAddTodo = (
    text: string,
    priority: TodoPriority,
    category: TodoCategory
  ) => {
    addTodo({ text, priority, category });
  };

  const handleToggleTodo = (id: string) => {
    toggleTodo(id);
  };

  const handleUpdateTodo = (id: string, updates: Partial<Todo>) => {
    updateTodo({ id, updates });
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

  const [showAdvanced, setShowAdvanced] = React.useState(false);

  return (
    <div className='max-w-6xl mx-auto space-y-6'>
      {/* 操作栏 */}
      <div className='bg-white rounded-lg border border-gray-200 p-6'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-xl font-semibold text-gray-900'>
            ⚛️ Jotai Todo 应用
          </h2>
          <div className='flex gap-3'>
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className='px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors'
            >
              {showAdvanced ? '隐藏' : '显示'}高级特性
            </button>
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

      {/* 高级搜索功能演示 */}
      {showAdvanced && (
        <div className='bg-green-50 border border-green-200 rounded-lg p-6'>
          <h3 className='text-lg font-semibold text-green-900 mb-4'>
            🔍 Jotai 原子化搜索演示
          </h3>
          <div className='mb-4'>
            <input
              type='text'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder='搜索 Todo（支持内容、分类、优先级）...'
              className='w-full px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
            />
          </div>
          {searchQuery && (
            <div className='text-sm text-green-700'>
              找到 {searchResults.length} 个匹配项
            </div>
          )}
        </div>
      )}

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
              <div className='text-gray-400 text-6xl mb-4'>⚛️</div>
              <h3 className='text-lg font-medium text-gray-900 mb-2'>
                {allTodos.length === 0
                  ? '原子还未创建 Todo'
                  : '没有匹配的 Todo'}
              </h3>
              <p className='text-gray-500'>
                {allTodos.length === 0
                  ? '创建第一个 Todo 原子开始使用'
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

      {/* 高级特性展示 */}
      {showAdvanced && (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* 按优先级分组 */}
          <div className='bg-white rounded-lg border border-gray-200 p-6'>
            <h3 className='text-lg font-semibold text-gray-900 mb-4'>
              📊 按优先级排序（派生原子）
            </h3>
            <div className='space-y-2'>
              {todosByPriority.slice(0, 5).map(todo => (
                <div
                  key={todo.id}
                  className='flex justify-between items-center text-sm'
                >
                  <span
                    className={`${todo.completed ? 'line-through text-gray-500' : ''}`}
                  >
                    {todo.text}
                  </span>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      todo.priority === 'high'
                        ? 'bg-red-100 text-red-700'
                        : todo.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {todo.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 按分类分组 */}
          <div className='bg-white rounded-lg border border-gray-200 p-6'>
            <h3 className='text-lg font-semibold text-gray-900 mb-4'>
              📂 按分类分组（派生原子）
            </h3>
            <div className='space-y-3'>
              {Object.entries(todosByCategory).map(
                ([category, todos]) =>
                  todos.length > 0 && (
                    <div key={category}>
                      <h4 className='font-medium text-gray-700 capitalize mb-1'>
                        {category} ({todos.length})
                      </h4>
                      <div className='text-sm text-gray-600 ml-4'>
                        {todos.slice(0, 2).map(todo => (
                          <div
                            key={todo.id}
                            className={todo.completed ? 'line-through' : ''}
                          >
                            • {todo.text}
                          </div>
                        ))}
                        {todos.length > 2 && (
                          <div className='text-gray-400'>
                            ... 还有 {todos.length - 2} 项
                          </div>
                        )}
                      </div>
                    </div>
                  )
              )}
            </div>
          </div>
        </div>
      )}

      {/* Jotai 原子状态监控 */}
      <div className='bg-green-50 rounded-lg p-6 border border-green-200'>
        <h3 className='text-lg font-semibold text-green-900 mb-4'>
          🔍 Jotai 原子状态监控
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <h4 className='text-sm font-medium text-green-800 mb-2'>
              当前过滤器原子
            </h4>
            <pre className='bg-white rounded border border-green-200 p-3 text-xs text-gray-800 overflow-x-auto'>
              {JSON.stringify(filter, null, 2)}
            </pre>
          </div>
          <div>
            <h4 className='text-sm font-medium text-green-800 mb-2'>
              统计原子（派生）
            </h4>
            <pre className='bg-white rounded border border-green-200 p-3 text-xs text-gray-800 overflow-x-auto'>
              {JSON.stringify(stats, null, 2)}
            </pre>
          </div>
        </div>

        {showAdvanced && (
          <div className='mt-6'>
            <h4 className='text-sm font-medium text-green-800 mb-2'>
              搜索原子状态
            </h4>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='bg-white rounded border border-green-200 p-3'>
                <div className='text-xs text-green-700 mb-1'>搜索查询</div>
                <div className='text-sm font-mono'>"{searchQuery}"</div>
              </div>
              <div className='bg-white rounded border border-green-200 p-3'>
                <div className='text-xs text-green-700 mb-1'>结果数量</div>
                <div className='text-sm font-mono'>
                  {searchResults.length} 项
                </div>
              </div>
            </div>
          </div>
        )}

        <div className='mt-6'>
          <h4 className='text-sm font-medium text-green-800 mb-2'>
            ⚛️ Jotai 原子化特性演示
          </h4>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
            <div className='bg-white rounded border border-green-200 p-4'>
              <h5 className='font-medium text-green-700 mb-2'>🎯 原子订阅</h5>
              <p className='text-green-600 text-xs'>
                每个组件只订阅需要的原子，例如统计组件只订阅
                <code className='bg-green-100 px-1 rounded'>todoStatsAtom</code>
                ， 在 todos 变化时自动重新计算。
              </p>
            </div>
            <div className='bg-white rounded border border-green-200 p-4'>
              <h5 className='font-medium text-green-700 mb-2'>🔄 派生原子</h5>
              <p className='text-green-600 text-xs'>
                <code className='bg-green-100 px-1 rounded'>
                  filteredTodosAtom
                </code>
                自动依赖 todosAtom 和
                filterAtom，任一变化时自动重新计算过滤结果。
              </p>
            </div>
            <div className='bg-white rounded border border-green-200 p-4'>
              <h5 className='font-medium text-green-700 mb-2'>✏️ 写入原子</h5>
              <p className='text-green-600 text-xs'>
                <code className='bg-green-100 px-1 rounded'>addTodoAtom</code>
                等写入原子封装了状态更新逻辑，保持操作的一致性和可预测性。
              </p>
            </div>
            <div className='bg-white rounded border border-green-200 p-4'>
              <h5 className='font-medium text-green-700 mb-2'>🎨 组合设计</h5>
              <p className='text-green-600 text-xs'>
                原子可以自由组合构建复杂逻辑，如搜索原子组合基础状态，
                实现实时搜索功能。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JotaiTodoApp;
