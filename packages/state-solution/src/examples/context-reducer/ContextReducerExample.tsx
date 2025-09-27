import React from 'react';
import { TodoProvider } from './TodoContext';
import ContextTodoApp from './ContextTodoApp';

const ContextReducerExample: React.FC = () => {
  return (
    <div className='space-y-8'>
      {/* 标题和介绍 */}
      <div className='text-center'>
        <h1 className='text-3xl font-bold text-gray-900 mb-4'>
          🎣 Context + useReducer 示例
        </h1>
        <p className='text-lg text-gray-600 mb-6'>
          React 内置状态管理 - 无需第三方库的原生方案
        </p>

        <div className='bg-blue-50 border border-blue-200 rounded-lg p-6 text-left max-w-4xl mx-auto'>
          <h2 className='text-lg font-semibold text-blue-900 mb-3'>
            🎯 Context + useReducer 特点
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800'>
            <div>
              <h3 className='font-medium mb-2'>✨ 优势</h3>
              <ul className='space-y-1'>
                <li>• React 官方内置方案</li>
                <li>• 无额外依赖</li>
                <li>• 可预测的状态更新</li>
                <li>• 类似 Redux 的模式</li>
                <li>• 支持复杂状态逻辑</li>
                <li>• 易于测试</li>
              </ul>
            </div>
            <div>
              <h3 className='font-medium mb-2'>🎯 适用场景</h3>
              <ul className='space-y-1'>
                <li>• 中等复杂度应用</li>
                <li>• 避免引入第三方库</li>
                <li>• 组件树状态共享</li>
                <li>• 需要复杂状态逻辑</li>
                <li>• 学习状态管理概念</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Context Provider 包装 */}
      <TodoProvider>
        <ContextTodoApp />
      </TodoProvider>

      {/* 实现细节 */}
      <div className='bg-gray-50 rounded-lg p-6'>
        <h2 className='text-xl font-semibold text-gray-900 mb-4'>
          📝 实现解析
        </h2>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <div>
            <h3 className='text-lg font-medium text-gray-800 mb-3'>
              Reducer 定义
            </h3>
            <pre className='code-block text-xs overflow-x-auto'>
              {`// TodoContext.tsx
interface State {
  todos: Todo[];
  filter: TodoFilter;
  loading: boolean;
}

type Action = 
  | { type: 'ADD_TODO'; payload: Todo }
  | { type: 'TOGGLE_TODO'; payload: string }
  | { type: 'UPDATE_FILTER'; payload: Partial<TodoFilter> }
  | { type: 'CLEAR_COMPLETED' };

function todoReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        ...state,
        todos: [action.payload, ...state.todos]
      };
      
    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        )
      };
      
    case 'UPDATE_FILTER':
      return {
        ...state,
        filter: { ...state.filter, ...action.payload }
      };
      
    default:
      return state;
  }
}`}
            </pre>
          </div>

          <div>
            <h3 className='text-lg font-medium text-gray-800 mb-3'>
              Context 使用
            </h3>
            <pre className='code-block text-xs overflow-x-auto'>
              {`// TodoContext.tsx
const TodoContext = createContext<{
  state: State;
  dispatch: Dispatch<Action>;
} | null>(null);

export const TodoProvider: React.FC<{ children }> = ({ children }) => {
  const [state, dispatch] = useReducer(todoReducer, initialState);
  
  return (
    <TodoContext.Provider value={{ state, dispatch }}>
      {children}
    </TodoContext.Provider>
  );
};

// 自定义 Hook
export const useTodoContext = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodoContext must be within TodoProvider');
  }
  return context;
};

// Component.tsx
const TodoComponent = () => {
  const { state, dispatch } = useTodoContext();
  
  const addTodo = (todo: Todo) => {
    dispatch({ type: 'ADD_TODO', payload: todo });
  };
  
  return <div>{/* 组件内容 */}</div>;
};`}
            </pre>
          </div>
        </div>

        <div className='mt-6'>
          <h3 className='text-lg font-medium text-gray-800 mb-3'>性能特点</h3>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm'>
            <div className='bg-white p-4 rounded-lg border'>
              <h4 className='font-medium text-green-600 mb-2'>🎯 组件树共享</h4>
              <p className='text-gray-600'>
                通过 Context 避免 prop drilling，让深层组件直接访问状态
              </p>
            </div>
            <div className='bg-white p-4 rounded-lg border'>
              <h4 className='font-medium text-blue-600 mb-2'>🔄 可预测更新</h4>
              <p className='text-gray-600'>
                useReducer 确保状态更新的一致性和可预测性
              </p>
            </div>
            <div className='bg-white p-4 rounded-lg border'>
              <h4 className='font-medium text-purple-600 mb-2'>⚠️ 性能注意</h4>
              <p className='text-gray-600'>
                Context 变化会导致所有消费者重新渲染，需要优化策略
              </p>
            </div>
          </div>
        </div>

        <div className='mt-6'>
          <h3 className='text-lg font-medium text-gray-800 mb-3'>
            与其他方案的对比
          </h3>
          <div className='overflow-x-auto'>
            <table className='w-full text-sm border-collapse'>
              <thead>
                <tr className='bg-gray-100'>
                  <th className='border border-gray-300 px-4 py-2 text-left'>
                    特性
                  </th>
                  <th className='border border-gray-300 px-4 py-2 text-left'>
                    Context + useReducer
                  </th>
                  <th className='border border-gray-300 px-4 py-2 text-left'>
                    Redux Toolkit
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className='border border-gray-300 px-4 py-2'>
                    第三方依赖
                  </td>
                  <td className='border border-gray-300 px-4 py-2 text-green-600'>
                    无
                  </td>
                  <td className='border border-gray-300 px-4 py-2 text-yellow-600'>
                    需要
                  </td>
                </tr>
                <tr>
                  <td className='border border-gray-300 px-4 py-2'>DevTools</td>
                  <td className='border border-gray-300 px-4 py-2 text-red-600'>
                    无
                  </td>
                  <td className='border border-gray-300 px-4 py-2 text-green-600'>
                    强大
                  </td>
                </tr>
                <tr>
                  <td className='border border-gray-300 px-4 py-2'>性能优化</td>
                  <td className='border border-gray-300 px-4 py-2 text-yellow-600'>
                    手动
                  </td>
                  <td className='border border-gray-300 px-4 py-2 text-green-600'>
                    自动
                  </td>
                </tr>
                <tr>
                  <td className='border border-gray-300 px-4 py-2'>学习成本</td>
                  <td className='border border-gray-300 px-4 py-2 text-green-600'>
                    低
                  </td>
                  <td className='border border-gray-300 px-4 py-2 text-yellow-600'>
                    中等
                  </td>
                </tr>
                <tr>
                  <td className='border border-gray-300 px-4 py-2'>中间件</td>
                  <td className='border border-gray-300 px-4 py-2 text-red-600'>
                    无
                  </td>
                  <td className='border border-gray-300 px-4 py-2 text-green-600'>
                    丰富
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className='mt-6'>
          <h3 className='text-lg font-medium text-gray-800 mb-3'>
            性能优化策略
          </h3>
          <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800'>
            <div className='space-y-2'>
              <p>
                <strong>1. 分割 Context：</strong> 将不同类型的状态分离到不同的
                Context 中，减少不必要的重新渲染。
              </p>
              <p>
                <strong>2. 使用 useMemo：</strong> 对计算状态使用 useMemo
                缓存，避免重复计算。
              </p>
              <p>
                <strong>3. React.memo：</strong> 对子组件使用 React.memo
                包装，防止父组件更新导致的无关重新渲染。
              </p>
              <p>
                <strong>4. 选择器模式：</strong> 创建自定义 hooks
                来"选择"特定的状态片段，类似 Redux 的 selector。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContextReducerExample;
