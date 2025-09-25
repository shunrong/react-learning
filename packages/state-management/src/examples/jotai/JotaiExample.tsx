import React from 'react';
import { Provider } from 'jotai';
import JotaiTodoApp from './JotaiTodoApp';

const JotaiExample: React.FC = () => {
  return (
    <div className='space-y-8'>
      {/* 标题和介绍 */}
      <div className='text-center'>
        <h1 className='text-3xl font-bold text-gray-900 mb-4'>⚛️ Jotai 示例</h1>
        <p className='text-lg text-gray-600 mb-6'>
          原子化状态管理 - 底层向上的组合式状态
        </p>

        <div className='bg-green-50 border border-green-200 rounded-lg p-6 text-left max-w-4xl mx-auto'>
          <h2 className='text-lg font-semibold text-green-900 mb-3'>
            🎯 Jotai 特点
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-800'>
            <div>
              <h3 className='font-medium mb-2'>✨ 优势</h3>
              <ul className='space-y-1'>
                <li>• 原子化的状态管理</li>
                <li>• 底层向上的组合</li>
                <li>• 避免多余的重新渲染</li>
                <li>• 支持异步和派生状态</li>
                <li>• TypeScript 友好</li>
                <li>• 无样板代码</li>
              </ul>
            </div>
            <div>
              <h3 className='font-medium mb-2'>🎯 适用场景</h3>
              <ul className='space-y-1'>
                <li>• 复杂的状态依赖关系</li>
                <li>• 需要精细化更新控制</li>
                <li>• 大量计算状态</li>
                <li>• 组件间状态共享</li>
                <li>• 异步状态处理</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Jotai Provider 包装 */}
      <Provider>
        <JotaiTodoApp />
      </Provider>

      {/* 实现细节 */}
      <div className='bg-gray-50 rounded-lg p-6'>
        <h2 className='text-xl font-semibold text-gray-900 mb-4'>
          📝 实现解析
        </h2>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <div>
            <h3 className='text-lg font-medium text-gray-800 mb-3'>原子定义</h3>
            <pre className='code-block text-xs overflow-x-auto'>
              {`// atoms.ts
import { atom } from 'jotai';
import { atomWithImmer } from 'jotai-immer';

// 基础原子
export const todosAtom = atomWithImmer<Todo[]>([]);
export const filterAtom = atomWithImmer<Filter>({...});

// 派生原子 (只读)
export const filteredTodosAtom = atom(get => {
  const todos = get(todosAtom);
  const filter = get(filterAtom);
  return todos.filter(/* 过滤逻辑 */);
});

// 写入原子 (只写)
export const addTodoAtom = atom(
  null, // 无读取逻辑
  (get, set, newTodo) => {
    set(todosAtom, draft => {
      draft.unshift(newTodo);
    });
  }
);

// 异步原子
export const saveTodoAtom = atom(
  null,
  async (get, set, todo) => {
    await saveTodoToServer(todo);
    set(todosAtom, /* 更新本地状态 */);
  }
);`}
            </pre>
          </div>

          <div>
            <h3 className='text-lg font-medium text-gray-800 mb-3'>组件使用</h3>
            <pre className='code-block text-xs overflow-x-auto'>
              {`// Component.tsx
import { useAtom, useAtomValue, useSetAtom } from 'jotai';

const TodoComponent = () => {
  // 读写原子
  const [todos, setTodos] = useAtom(todosAtom);
  
  // 只读原子
  const filteredTodos = useAtomValue(filteredTodosAtom);
  const stats = useAtomValue(todoStatsAtom);
  
  // 只写原子
  const addTodo = useSetAtom(addTodoAtom);
  const deleteTodo = useSetAtom(deleteTodoAtom);
  
  // 组件只在依赖的原子变化时重新渲染
  return (
    <div>
      <div>Total: {stats.total}</div>
      {filteredTodos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
      <button onClick={() => addTodo(newTodo)}>
        Add Todo
      </button>
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
              <h4 className='font-medium text-green-600 mb-2'>⚛️ 原子化更新</h4>
              <p className='text-gray-600'>
                每个原子独立更新，组件只在使用的原子变化时重新渲染
              </p>
            </div>
            <div className='bg-white p-4 rounded-lg border'>
              <h4 className='font-medium text-blue-600 mb-2'>🎯 精准订阅</h4>
              <p className='text-gray-600'>
                派生原子自动计算依赖，避免不必要的计算和渲染
              </p>
            </div>
            <div className='bg-white p-4 rounded-lg border'>
              <h4 className='font-medium text-purple-600 mb-2'>
                🔄 组合式设计
              </h4>
              <p className='text-gray-600'>
                原子可以自由组合，构建复杂的状态依赖关系
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
                    Jotai
                  </th>
                  <th className='border border-gray-300 px-4 py-2 text-left'>
                    Zustand
                  </th>
                  <th className='border border-gray-300 px-4 py-2 text-left'>
                    Redux
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className='border border-gray-300 px-4 py-2'>状态粒度</td>
                  <td className='border border-gray-300 px-4 py-2 text-green-600'>
                    原子级
                  </td>
                  <td className='border border-gray-300 px-4 py-2 text-yellow-600'>
                    选择器级
                  </td>
                  <td className='border border-gray-300 px-4 py-2 text-yellow-600'>
                    选择器级
                  </td>
                </tr>
                <tr>
                  <td className='border border-gray-300 px-4 py-2'>状态组合</td>
                  <td className='border border-gray-300 px-4 py-2 text-green-600'>
                    声明式
                  </td>
                  <td className='border border-gray-300 px-4 py-2 text-yellow-600'>
                    命令式
                  </td>
                  <td className='border border-gray-300 px-4 py-2 text-yellow-600'>
                    命令式
                  </td>
                </tr>
                <tr>
                  <td className='border border-gray-300 px-4 py-2'>派生状态</td>
                  <td className='border border-gray-300 px-4 py-2 text-green-600'>
                    自动
                  </td>
                  <td className='border border-gray-300 px-4 py-2 text-yellow-600'>
                    手动
                  </td>
                  <td className='border border-gray-300 px-4 py-2 text-green-600'>
                    reselect
                  </td>
                </tr>
                <tr>
                  <td className='border border-gray-300 px-4 py-2'>异步处理</td>
                  <td className='border border-gray-300 px-4 py-2 text-green-600'>
                    内置
                  </td>
                  <td className='border border-gray-300 px-4 py-2 text-yellow-600'>
                    手动
                  </td>
                  <td className='border border-gray-300 px-4 py-2 text-green-600'>
                    强大
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className='mt-6'>
          <h3 className='text-lg font-medium text-gray-800 mb-3'>
            原子化状态的优势
          </h3>
          <div className='bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-800'>
            <p className='mb-2'>
              <strong>原子化设计模式：</strong> Jotai
              将状态分解为最小的原子单位，每个原子负责一个独立的状态片段。
              这种设计使得状态更新更加精确，避免了大状态对象变化导致的整体重新渲染。
            </p>
            <p>
              <strong>组合式状态：</strong>{' '}
              通过派生原子可以自由组合基础原子，构建复杂的状态逻辑，
              同时保持了状态间的依赖关系清晰明确。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JotaiExample;
