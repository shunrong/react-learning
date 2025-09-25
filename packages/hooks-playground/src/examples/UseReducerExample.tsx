import { useReducer, useState } from 'react';

// 1. 简单计数器的 reducer
interface CounterState {
  count: number;
}

type CounterAction =
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'reset' }
  | { type: 'set'; payload: number };

const counterReducer = (
  state: CounterState,
  action: CounterAction
): CounterState => {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return { count: 0 };
    case 'set':
      return { count: action.payload };
    default:
      return state;
  }
};

const UseReducerExample = () => {
  // 简单计数器示例
  const [counterState, counterDispatch] = useReducer(counterReducer, {
    count: 0,
  });
  const [inputValue, setInputValue] = useState('');

  const handleSetCount = () => {
    const value = parseInt(inputValue);
    if (!isNaN(value)) {
      counterDispatch({ type: 'set', payload: value });
      setInputValue('');
    }
  };

  return (
    <div className='max-w-4xl mx-auto space-y-8'>
      {/* 页面标题 */}
      <div>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4'>
          useReducer Hook
        </h1>
        <p className='text-lg text-gray-600 dark:text-gray-400'>
          useReducer 是 useState 的替代方案，适用于复杂的状态逻辑。它接受一个
          reducer 函数和初始状态，返回当前状态和 dispatch 函数。
        </p>
      </div>

      {/* 基础计数器示例 */}
      <div className='hook-example'>
        <h2 className='hook-title'>基础计数器示例</h2>
        <p className='hook-description'>
          使用 useReducer 管理简单的计数器状态，展示基本的 action 分发模式。
        </p>

        <div className='hook-demo'>
          <div className='space-y-4'>
            <div className='state-display'>当前计数: {counterState.count}</div>

            <div className='flex flex-wrap gap-2'>
              <button
                onClick={() => counterDispatch({ type: 'increment' })}
                className='btn-primary'
              >
                增加
              </button>
              <button
                onClick={() => counterDispatch({ type: 'decrement' })}
                className='btn-secondary'
              >
                减少
              </button>
              <button
                onClick={() => counterDispatch({ type: 'reset' })}
                className='btn-secondary'
              >
                重置
              </button>
            </div>

            <div className='flex space-x-2'>
              <input
                type='number'
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder='输入数字'
                className='input flex-1'
              />
              <button onClick={handleSetCount} className='btn-primary'>
                设置值
              </button>
            </div>
          </div>
        </div>

        <div className='hook-code'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3'>
            代码示例
          </h3>
          <pre className='code-block'>
            {`// 1. 定义状态类型
interface CounterState {
  count: number;
}

// 2. 定义 action 类型
type CounterAction = 
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'reset' }
  | { type: 'set'; payload: number };

// 3. 定义 reducer 函数
const counterReducer = (state: CounterState, action: CounterAction) => {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return { count: 0 };
    case 'set':
      return { count: action.payload };
    default:
      return state;
  }
};

// 4. 在组件中使用
const [state, dispatch] = useReducer(counterReducer, { count: 0 });`}
          </pre>
        </div>
      </div>

      {/* useReducer vs useState */}
      <div className='hook-example'>
        <h2 className='hook-title'>useReducer vs useState</h2>
        <div className='space-y-6'>
          <div className='grid md:grid-cols-2 gap-6'>
            <div>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3'>
                ✅ 使用 useReducer 的场景
              </h3>
              <ul className='space-y-2 text-gray-600 dark:text-gray-400 text-sm'>
                <li>• 状态逻辑复杂，包含多个子值</li>
                <li>• 下一个状态依赖于之前的状态</li>
                <li>• 需要对组件的更新逻辑进行优化</li>
                <li>• 状态更新逻辑可以通过 action 来表达</li>
              </ul>
            </div>

            <div>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3'>
                ✅ 使用 useState 的场景
              </h3>
              <ul className='space-y-2 text-gray-600 dark:text-gray-400 text-sm'>
                <li>• 状态值是基本类型</li>
                <li>• 状态逻辑简单，更新独立</li>
                <li>• 组件状态较少</li>
                <li>• 快速原型开发</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 最佳实践 */}
      <div className='hook-example'>
        <h2 className='hook-title'>最佳实践</h2>
        <div className='space-y-6'>
          <div>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3'>
              💡 设计原则
            </h3>
            <ul className='space-y-2 text-gray-600 dark:text-gray-400 text-sm'>
              <li>
                • <strong>单一职责</strong>：每个 action 只做一件事
              </li>
              <li>
                • <strong>不可变性</strong>：总是返回新的状态对象
              </li>
              <li>
                • <strong>可预测性</strong>：相同的输入总是产生相同的输出
              </li>
              <li>
                • <strong>类型安全</strong>：使用 TypeScript 确保类型正确
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UseReducerExample;
