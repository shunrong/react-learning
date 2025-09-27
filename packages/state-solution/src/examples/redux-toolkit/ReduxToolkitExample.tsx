import React from 'react';
import { Provider } from 'react-redux';
import { reduxStore } from './store';
import ReduxTodoApp from './ReduxTodoApp';

const ReduxToolkitExample: React.FC = () => {
  return (
    <div className='space-y-8'>
      {/* 标题和介绍 */}
      <div className='text-center'>
        <h1 className='text-3xl font-bold text-gray-900 mb-4'>
          ⚛️ Redux Toolkit 示例
        </h1>
        <p className='text-lg text-gray-600 mb-6'>
          现代 Redux 最佳实践 - 使用 createSlice 和 configureStore
        </p>

        <div className='bg-blue-50 border border-blue-200 rounded-lg p-6 text-left max-w-4xl mx-auto'>
          <h2 className='text-lg font-semibold text-blue-900 mb-3'>
            🎯 Redux Toolkit 特点
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800'>
            <div>
              <h3 className='font-medium mb-2'>✨ 优势</h3>
              <ul className='space-y-1'>
                <li>• 减少样板代码 (createSlice)</li>
                <li>• 内置 Immer 支持</li>
                <li>• 优秀的 TypeScript 支持</li>
                <li>• 强大的 DevTools 集成</li>
                <li>• 内置异步处理 (createAsyncThunk)</li>
              </ul>
            </div>
            <div>
              <h3 className='font-medium mb-2'>🎯 适用场景</h3>
              <ul className='space-y-1'>
                <li>• 中大型复杂应用</li>
                <li>• 需要时间旅行调试</li>
                <li>• 团队协作开发</li>
                <li>• 复杂的状态逻辑</li>
                <li>• 需要可预测的状态管理</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Redux Provider 包装 */}
      <Provider store={reduxStore}>
        <ReduxTodoApp />
      </Provider>

      {/* 实现细节 */}
      <div className='bg-gray-50 rounded-lg p-6'>
        <h2 className='text-xl font-semibold text-gray-900 mb-4'>
          📝 实现解析
        </h2>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <div>
            <h3 className='text-lg font-medium text-gray-800 mb-3'>
              Store 配置
            </h3>
            <pre className='code-block text-xs overflow-x-auto'>
              {`// store.ts
import { configureStore, createSlice } from '@reduxjs/toolkit';

const todoSlice = createSlice({
  name: 'todos',
  initialState: {
    todos: [],
    filter: { status: 'all', ... },
    loading: false,
    error: null
  },
  reducers: {
    addTodo: (state, action) => {
      // Immer 自动处理不可变更新
      state.todos.unshift(action.payload);
    },
    toggleTodo: (state, action) => {
      const todo = state.todos.find(t => t.id === action.payload);
      if (todo) todo.completed = !todo.completed;
    },
    // 更多 reducers...
  }
});

export const store = configureStore({
  reducer: { todos: todoSlice.reducer },
  devTools: process.env.NODE_ENV !== 'production'
});`}
            </pre>
          </div>

          <div>
            <h3 className='text-lg font-medium text-gray-800 mb-3'>
              类型化 Hooks
            </h3>
            <pre className='code-block text-xs overflow-x-auto'>
              {`// hooks.ts
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

export const useAppDispatch = () => 
  useDispatch<AppDispatch>();

export const useAppSelector: TypedUseSelectorHook<RootState> = 
  useSelector;

// 自定义选择器
export const useFilteredTodos = () => {
  const todos = useAppSelector(state => state.todos.todos);
  const filter = useAppSelector(state => state.todos.filter);
  
  return todos.filter(todo => {
    // 过滤逻辑
    if (filter.status === 'active' && todo.completed) return false;
    // ...
    return true;
  });
};`}
            </pre>
          </div>
        </div>

        <div className='mt-6'>
          <h3 className='text-lg font-medium text-gray-800 mb-3'>性能特点</h3>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm'>
            <div className='bg-white p-4 rounded-lg border'>
              <h4 className='font-medium text-green-600 mb-2'>🚀 渲染优化</h4>
              <p className='text-gray-600'>
                connect 和 useSelector 只在选中的状态片段变化时重新渲染
              </p>
            </div>
            <div className='bg-white p-4 rounded-lg border'>
              <h4 className='font-medium text-blue-600 mb-2'>📊 调试能力</h4>
              <p className='text-gray-600'>
                Redux DevTools 提供完整的状态历史和时间旅行调试
              </p>
            </div>
            <div className='bg-white p-4 rounded-lg border'>
              <h4 className='font-medium text-purple-600 mb-2'>
                🔄 状态持久化
              </h4>
              <p className='text-gray-600'>
                易于集成 redux-persist 实现状态持久化存储
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReduxToolkitExample;
