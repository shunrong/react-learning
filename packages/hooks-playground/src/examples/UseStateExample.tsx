import { useState, useCallback } from 'react';

const UseStateExample = () => {
  // 基础用法示例
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');
  const [isVisible, setIsVisible] = useState(true);

  // 对象状态示例
  const [user, setUser] = useState({
    name: 'John Doe',
    age: 25,
    email: 'john@example.com',
  });

  // 数组状态示例
  const [items, setItems] = useState<string[]>(['React', 'Vue', 'Angular']);
  const [newItem, setNewItem] = useState('');

  // 函数式更新示例
  const incrementCount = useCallback(() => {
    setCount(prevCount => prevCount + 1);
  }, []);

  const decrementCount = useCallback(() => {
    setCount(prevCount => prevCount - 1);
  }, []);

  // 重置计数器
  const resetCount = useCallback(() => {
    setCount(0);
  }, []);

  // 更新用户信息
  const updateUser = useCallback(
    (field: keyof typeof user, value: string | number) => {
      setUser(prevUser => ({
        ...prevUser,
        [field]: value,
      }));
    },
    []
  );

  // 添加新项目
  const addItem = useCallback(() => {
    if (newItem.trim()) {
      setItems(prevItems => [...prevItems, newItem.trim()]);
      setNewItem('');
    }
  }, [newItem]);

  // 删除项目
  const removeItem = useCallback((index: number) => {
    setItems(prevItems => prevItems.filter((_, i) => i !== index));
  }, []);

  // 清空所有项目
  const clearItems = useCallback(() => {
    setItems([]);
  }, []);

  return (
    <div className='max-w-4xl mx-auto space-y-8'>
      {/* 页面标题 */}
      <div>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4'>
          useState Hook
        </h1>
        <p className='text-lg text-gray-600 dark:text-gray-400'>
          useState 是 React 中最基础的 Hook，用于在函数组件中添加状态管理功能。
        </p>
      </div>

      {/* 基础用法 */}
      <div className='hook-example'>
        <h2 className='hook-title'>基础用法</h2>
        <p className='hook-description'>
          useState 返回一个状态值和一个更新函数，可以用于管理各种类型的状态。
        </p>

        <div className='hook-demo'>
          <div className='grid md:grid-cols-2 gap-6'>
            {/* 数字状态 */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
                数字状态
              </h3>
              <div className='state-display'>当前计数: {count}</div>
              <div className='flex space-x-2'>
                <button onClick={incrementCount} className='btn-primary'>
                  +1
                </button>
                <button onClick={decrementCount} className='btn-secondary'>
                  -1
                </button>
                <button onClick={resetCount} className='btn-secondary'>
                  重置
                </button>
              </div>
            </div>

            {/* 字符串状态 */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
                字符串状态
              </h3>
              <div className='state-display'>当前名称: {name || '(空)'}</div>
              <input
                type='text'
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder='输入你的名字'
                className='input'
              />
            </div>

            {/* 布尔状态 */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
                布尔状态
              </h3>
              <div className='state-display'>
                可见性: {isVisible ? '显示' : '隐藏'}
              </div>
              <button
                onClick={() => setIsVisible(!isVisible)}
                className='btn-primary'
              >
                切换可见性
              </button>
              {isVisible && (
                <div className='success-message animate-fade-in'>
                  🎉 我现在是可见的！
                </div>
              )}
            </div>
          </div>
        </div>

        <div className='hook-code'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3'>
            代码示例
          </h3>
          <pre className='code-block'>
            {`// 基础 useState 用法
const [count, setCount] = useState(0)
const [name, setName] = useState('')
const [isVisible, setIsVisible] = useState(true)

// 函数式更新 - 推荐用法
const incrementCount = () => {
  setCount(prevCount => prevCount + 1)
}

// 直接更新
const updateName = (newName: string) => {
  setName(newName)
}

// 切换布尔值
const toggleVisibility = () => {
  setIsVisible(prev => !prev)
}`}
          </pre>
        </div>
      </div>

      {/* 对象状态管理 */}
      <div className='hook-example'>
        <h2 className='hook-title'>对象状态管理</h2>
        <p className='hook-description'>
          当状态是对象时，需要使用展开运算符来保持不可变性原则。
        </p>

        <div className='hook-demo'>
          <div className='space-y-4'>
            <div className='state-display'>
              用户信息: {JSON.stringify(user, null, 2)}
            </div>

            <div className='grid md:grid-cols-3 gap-4'>
              <div>
                <label className='label'>姓名</label>
                <input
                  type='text'
                  value={user.name}
                  onChange={e => updateUser('name', e.target.value)}
                  className='input'
                />
              </div>
              <div>
                <label className='label'>年龄</label>
                <input
                  type='number'
                  value={user.age}
                  onChange={e =>
                    updateUser('age', parseInt(e.target.value) || 0)
                  }
                  className='input'
                />
              </div>
              <div>
                <label className='label'>邮箱</label>
                <input
                  type='email'
                  value={user.email}
                  onChange={e => updateUser('email', e.target.value)}
                  className='input'
                />
              </div>
            </div>
          </div>
        </div>

        <div className='hook-code'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3'>
            代码示例
          </h3>
          <pre className='code-block'>
            {`// 对象状态
const [user, setUser] = useState({
  name: 'John Doe',
  age: 25,
  email: 'john@example.com'
})

// 更新对象状态 - 使用展开运算符
const updateUser = (field: string, value: any) => {
  setUser(prevUser => ({
    ...prevUser,        // 保留其他属性
    [field]: value      // 更新指定属性
  }))
}

// ❌ 错误用法 - 直接修改对象
// user.name = 'New Name'  // 这样不会触发重新渲染

// ❌ 错误用法 - 丢失其他属性
// setUser({ name: 'New Name' })  // age 和 email 会丢失`}
          </pre>
        </div>
      </div>

      {/* 数组状态管理 */}
      <div className='hook-example'>
        <h2 className='hook-title'>数组状态管理</h2>
        <p className='hook-description'>
          管理数组状态时，同样需要保持不可变性，使用数组的不可变方法。
        </p>

        <div className='hook-demo'>
          <div className='space-y-4'>
            <div className='state-display'>
              项目列表: [{items.join(', ')}] (共 {items.length} 项)
            </div>

            <div className='flex space-x-2'>
              <input
                type='text'
                value={newItem}
                onChange={e => setNewItem(e.target.value)}
                placeholder='添加新项目'
                className='input flex-1'
                onKeyPress={e => e.key === 'Enter' && addItem()}
              />
              <button onClick={addItem} className='btn-primary'>
                添加
              </button>
              <button onClick={clearItems} className='btn-secondary'>
                清空
              </button>
            </div>

            <div className='space-y-2'>
              {items.map((item, index) => (
                <div
                  key={index}
                  className='flex items-center justify-between bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3'
                >
                  <span className='text-gray-900 dark:text-gray-100'>
                    {item}
                  </span>
                  <button
                    onClick={() => removeItem(index)}
                    className='text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300'
                  >
                    删除
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className='hook-code'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3'>
            代码示例
          </h3>
          <pre className='code-block'>
            {`// 数组状态
const [items, setItems] = useState(['React', 'Vue', 'Angular'])

// 添加项目
const addItem = (newItem: string) => {
  setItems(prevItems => [...prevItems, newItem])
}

// 删除项目
const removeItem = (index: number) => {
  setItems(prevItems => prevItems.filter((_, i) => i !== index))
}

// 更新项目
const updateItem = (index: number, newValue: string) => {
  setItems(prevItems => 
    prevItems.map((item, i) => i === index ? newValue : item)
  )
}

// 清空数组
const clearItems = () => {
  setItems([])
}

// ❌ 错误用法 - 直接修改数组
// items.push(newItem)     // 不会触发重新渲染
// items[0] = 'New Value'  // 不会触发重新渲染`}
          </pre>
        </div>
      </div>

      {/* 最佳实践 */}
      <div className='hook-example'>
        <h2 className='hook-title'>最佳实践</h2>
        <div className='space-y-6'>
          <div>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3'>
              ✅ 推荐做法
            </h3>
            <ul className='space-y-2 text-gray-600 dark:text-gray-400'>
              <li>• 使用函数式更新，避免闭包陷阱</li>
              <li>• 保持状态的不可变性</li>
              <li>• 使用 TypeScript 声明状态类型</li>
              <li>• 合理拆分状态，避免过度嵌套</li>
              <li>• 使用 useCallback 优化更新函数</li>
            </ul>
          </div>

          <div>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3'>
              ❌ 避免做法
            </h3>
            <ul className='space-y-2 text-gray-600 dark:text-gray-400'>
              <li>• 直接修改状态对象或数组</li>
              <li>• 在条件语句中调用 useState</li>
              <li>• 过度使用对象状态</li>
              <li>• 忘记函数式更新的依赖</li>
              <li>• 在循环中调用 useState</li>
            </ul>
          </div>
        </div>

        <div className='hook-code'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3'>
            最佳实践代码
          </h3>
          <pre className='code-block'>
            {`// ✅ 好的做法
const [count, setCount] = useState<number>(0)

// 函数式更新 - 避免闭包陷阱
const increment = useCallback(() => {
  setCount(prev => prev + 1)
}, [])

// 合理拆分状态
const [firstName, setFirstName] = useState('')
const [lastName, setLastName] = useState('')

// ❌ 避免的做法
const [user, setUser] = useState({
  firstName: '',
  lastName: '',
  age: 0,
  address: {
    street: '',
    city: '',
    country: ''
  }
}) // 过度嵌套

// ❌ 条件调用
if (someCondition) {
  const [state, setState] = useState(0) // 错误！
}`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default UseStateExample;
