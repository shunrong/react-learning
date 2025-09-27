import React from 'react';
import ZustandTodoApp from './ZustandTodoApp';

const ZustandExample: React.FC = () => {
  return (
    <div className='space-y-8'>
      {/* 标题和介绍 */}
      <div className='text-center'>
        <h1 className='text-3xl font-bold text-gray-900 mb-4'>
          🐻 Zustand 示例
        </h1>
        <p className='text-lg text-gray-600 mb-6'>
          轻量级状态管理 - 简单、快速、可扩展
        </p>

        <div className='bg-amber-50 border border-amber-200 rounded-lg p-6 text-left max-w-4xl mx-auto'>
          <h2 className='text-lg font-semibold text-amber-900 mb-3'>
            🎯 Zustand 特点
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-amber-800'>
            <div>
              <h3 className='font-medium mb-2'>✨ 优势</h3>
              <ul className='space-y-1'>
                <li>• 极简的 API 设计</li>
                <li>• 无需 Provider 包装</li>
                <li>• 天然支持 TypeScript</li>
                <li>• 很小的 bundle 大小 (~2.9kb)</li>
                <li>• 灵活的中间件系统</li>
                <li>• 支持 devtools 和持久化</li>
              </ul>
            </div>
            <div>
              <h3 className='font-medium mb-2'>🎯 适用场景</h3>
              <ul className='space-y-1'>
                <li>• 中小型应用</li>
                <li>• 需要快速开发</li>
                <li>• 追求简洁的代码</li>
                <li>• 不需要复杂的状态逻辑</li>
                <li>• 希望减少样板代码</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Zustand Todo 应用 */}
      <ZustandTodoApp />

      {/* 实现细节 */}
      <div className='bg-gray-50 rounded-lg p-6'>
        <h2 className='text-xl font-semibold text-gray-900 mb-4'>
          📝 实现解析
        </h2>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <div>
            <h3 className='text-lg font-medium text-gray-800 mb-3'>
              Store 创建
            </h3>
            <pre className='code-block text-xs overflow-x-auto'>
              {`// store.ts
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface TodoState {
  todos: Todo[];
  filter: TodoFilter;
  
  // Actions 直接定义在状态中
  addTodo: (text: string, priority, category) => void;
  toggleTodo: (id: string) => void;
  // 计算属性
  getFilteredTodos: () => Todo[];
}

export const useTodoStore = create<TodoState>()(
  immer((set, get) => ({
    todos: [],
    filter: initialFilter,
    
    addTodo: (text, priority, category) => {
      set(state => {
        // Immer 让我们直接"修改"状态
        const newTodo = { id: nanoid(), text, ... };
        state.todos.unshift(newTodo);
      });
    },
    
    getFilteredTodos: () => {
      const { todos, filter } = get();
      return todos.filter(/* 过滤逻辑 */);
    }
  }))
);`}
            </pre>
          </div>

          <div>
            <h3 className='text-lg font-medium text-gray-800 mb-3'>组件使用</h3>
            <pre className='code-block text-xs overflow-x-auto'>
              {`// Component.tsx
import { useTodoStore } from './store';

const TodoComponent = () => {
  // 选择需要的状态片段
  const todos = useTodoStore(state => state.todos);
  const addTodo = useTodoStore(state => state.addTodo);
  
  // 或者使用选择器
  const filteredTodos = useTodoStore(
    state => state.getFilteredTodos()
  );
  
  // 自定义 hooks 封装
  const { addTodo, toggleTodo } = useTodoActions();
  
  return (
    <div>
      {filteredTodos.map(todo => (
        <TodoItem 
          key={todo.id} 
          todo={todo}
          onToggle={toggleTodo}
        />
      ))}
    </div>
  );
};`}
            </pre>
          </div>
        </div>

        <div className='mt-6'>
          <h3 className='text-lg font-medium text-gray-800 mb-3'>性能特点</h3>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm'>
            <div className='bg-white p-4 rounded-lg border'>
              <h4 className='font-medium text-green-600 mb-2'>🚀 细粒度更新</h4>
              <p className='text-gray-600'>
                组件只在使用的状态片段变化时重新渲染，避免不必要的更新
              </p>
            </div>
            <div className='bg-white p-4 rounded-lg border'>
              <h4 className='font-medium text-blue-600 mb-2'>📦 轻量级</h4>
              <p className='text-gray-600'>
                核心库仅 2.9kb，比 Redux Toolkit 小很多，启动速度快
              </p>
            </div>
            <div className='bg-white p-4 rounded-lg border'>
              <h4 className='font-medium text-purple-600 mb-2'>
                🔄 中间件支持
              </h4>
              <p className='text-gray-600'>
                支持 devtools、persist、immer 等中间件扩展功能
              </p>
            </div>
          </div>
        </div>

        <div className='mt-6'>
          <h3 className='text-lg font-medium text-gray-800 mb-3'>
            与 Redux 的对比
          </h3>
          <div className='overflow-x-auto'>
            <table className='w-full text-sm border-collapse'>
              <thead>
                <tr className='bg-gray-100'>
                  <th className='border border-gray-300 px-4 py-2 text-left'>
                    特性
                  </th>
                  <th className='border border-gray-300 px-4 py-2 text-left'>
                    Zustand
                  </th>
                  <th className='border border-gray-300 px-4 py-2 text-left'>
                    Redux Toolkit
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className='border border-gray-300 px-4 py-2'>学习成本</td>
                  <td className='border border-gray-300 px-4 py-2 text-green-600'>
                    很低
                  </td>
                  <td className='border border-gray-300 px-4 py-2 text-yellow-600'>
                    中等
                  </td>
                </tr>
                <tr>
                  <td className='border border-gray-300 px-4 py-2'>样板代码</td>
                  <td className='border border-gray-300 px-4 py-2 text-green-600'>
                    极少
                  </td>
                  <td className='border border-gray-300 px-4 py-2 text-yellow-600'>
                    较多
                  </td>
                </tr>
                <tr>
                  <td className='border border-gray-300 px-4 py-2'>
                    Bundle 大小
                  </td>
                  <td className='border border-gray-300 px-4 py-2 text-green-600'>
                    2.9kb
                  </td>
                  <td className='border border-gray-300 px-4 py-2 text-yellow-600'>
                    ~45kb
                  </td>
                </tr>
                <tr>
                  <td className='border border-gray-300 px-4 py-2'>DevTools</td>
                  <td className='border border-gray-300 px-4 py-2 text-green-600'>
                    支持
                  </td>
                  <td className='border border-gray-300 px-4 py-2 text-green-600'>
                    强大
                  </td>
                </tr>
                <tr>
                  <td className='border border-gray-300 px-4 py-2'>时间旅行</td>
                  <td className='border border-gray-300 px-4 py-2 text-yellow-600'>
                    基础
                  </td>
                  <td className='border border-gray-300 px-4 py-2 text-green-600'>
                    完整
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZustandExample;
