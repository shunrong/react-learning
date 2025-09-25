import { useState, useCallback, memo, useMemo, useRef, useEffect } from 'react';

// 子组件 - 使用 memo 包装
const Button = memo(
  ({
    onClick,
    children,
    color = 'primary',
  }: {
    onClick: () => void;
    children: React.ReactNode;
    color?: 'primary' | 'secondary' | 'success' | 'warning';
  }) => {
    const renderCount = useRef(0);
    renderCount.current += 1;

    console.log(`🔄 Button "${children}" 渲染第 ${renderCount.current} 次`);

    return (
      <button onClick={onClick} className={`btn-${color} relative`}>
        {children}
        <span className='absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>
          {renderCount.current}
        </span>
      </button>
    );
  }
);

// 列表项组件
const ListItem = memo(
  ({
    item,
    onEdit,
    onDelete,
  }: {
    item: { id: number; name: string; completed: boolean };
    onEdit: (id: number, name: string) => void;
    onDelete: (id: number) => void;
  }) => {
    const renderCount = useRef(0);
    renderCount.current += 1;

    console.log(`🔄 ListItem ${item.id} 渲染第 ${renderCount.current} 次`);

    return (
      <div className='flex items-center justify-between bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3'>
        <span
          className={`flex-1 ${item.completed ? 'line-through text-gray-500' : ''}`}
        >
          {item.name}
        </span>
        <div className='flex space-x-2'>
          <button
            onClick={() => onEdit(item.id, item.name)}
            className='text-blue-600 dark:text-blue-400 hover:underline text-sm'
          >
            编辑
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className='text-red-600 dark:text-red-400 hover:underline text-sm'
          >
            删除
          </button>
        </div>
        <span className='ml-2 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs px-2 py-1 rounded'>
          {renderCount.current}
        </span>
      </div>
    );
  }
);

// 计数器组件
const Counter = memo(
  ({
    onIncrement,
    onDecrement,
    onReset,
  }: {
    onIncrement: () => void;
    onDecrement: () => void;
    onReset: () => void;
  }) => {
    const renderCount = useRef(0);
    renderCount.current += 1;

    console.log(`🔄 Counter 组件渲染第 ${renderCount.current} 次`);

    return (
      <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4'>
        <h4 className='font-semibold text-blue-800 dark:text-blue-200 mb-3'>
          计数器控制组件 (渲染次数: {renderCount.current})
        </h4>
        <div className='flex space-x-2'>
          <Button onClick={onIncrement} color='success'>
            +1
          </Button>
          <Button onClick={onDecrement} color='warning'>
            -1
          </Button>
          <Button onClick={onReset} color='secondary'>
            重置
          </Button>
        </div>
      </div>
    );
  }
);

const UseCallbackExample = () => {
  // 基础示例状态
  const [count, setCount] = useState(0);
  const [theme, setTheme] = useState('light');
  const [name, setName] = useState('');

  // 列表示例状态
  const [items, setItems] = useState([
    { id: 1, name: '学习 useCallback', completed: false },
    { id: 2, name: '理解函数缓存', completed: true },
    { id: 3, name: '优化组件性能', completed: false },
  ]);
  const [newItem, setNewItem] = useState('');

  // 性能监控
  const [renderCount, setRenderCount] = useState(0);

  useEffect(() => {
    setRenderCount(prev => prev + 1);
  });

  // ❌ 没有使用 useCallback 的函数（每次都创建新函数）
  const handleIncrementBad = () => {
    setCount(prev => prev + 1);
  };

  const handleDecrementBad = () => {
    setCount(prev => prev - 1);
  };

  const handleResetBad = () => {
    setCount(0);
  };

  // ✅ 使用 useCallback 缓存的函数
  const handleIncrement = useCallback(() => {
    setCount(prev => prev + 1);
  }, []); // 空依赖数组，函数永远不会改变

  const handleDecrement = useCallback(() => {
    setCount(prev => prev - 1);
  }, []);

  const handleReset = useCallback(() => {
    setCount(0);
  }, []);

  // ✅ 依赖外部值的 useCallback
  const handleAddItem = useCallback(() => {
    if (newItem.trim()) {
      setItems(prev => [
        ...prev,
        {
          id: Date.now(),
          name: newItem.trim(),
          completed: false,
        },
      ]);
      setNewItem('');
    }
  }, [newItem]); // 依赖 newItem

  const handleEditItem = useCallback((id: number, newName: string) => {
    const updatedName = prompt('编辑项目名称:', newName);
    if (updatedName && updatedName.trim()) {
      setItems(prev =>
        prev.map(item =>
          item.id === id ? { ...item, name: updatedName.trim() } : item
        )
      );
    }
  }, []); // 不依赖外部值

  const handleDeleteItem = useCallback((id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const handleToggleItem = useCallback((id: number) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  }, []);

  // ✅ 复杂的 useCallback 示例
  const handleBatchOperation = useCallback(
    (operation: 'complete' | 'delete' | 'reset') => {
      setItems(prev => {
        switch (operation) {
          case 'complete':
            return prev.map(item => ({ ...item, completed: true }));
          case 'delete':
            return prev.filter(item => !item.completed);
          case 'reset':
            return prev.map(item => ({ ...item, completed: false }));
          default:
            return prev;
        }
      });
    },
    []
  );

  // 计算值（使用 useMemo）
  const itemStats = useMemo(() => {
    const total = items.length;
    const completed = items.filter(item => item.completed).length;
    const pending = total - completed;
    return { total, completed, pending };
  }, [items]);

  return (
    <div className='max-w-4xl mx-auto space-y-8'>
      {/* 页面标题 */}
      <div>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4'>
          useCallback Hook
        </h1>
        <p className='text-lg text-gray-600 dark:text-gray-400'>
          useCallback
          用于缓存函数引用，避免子组件因为函数引用变化而不必要地重新渲染。它返回一个记忆化的回调函数。
        </p>
      </div>

      {/* 渲染性能监控 */}
      <div className='info-message'>
        <strong>当前页面渲染次数:</strong> {renderCount} |
        <strong> 当前主题:</strong> {theme} |<strong> 计数值:</strong> {count}
        <br />
        <small>观察控制台输出和组件上的渲染计数器</small>
      </div>

      {/* 基础用法对比 */}
      <div className='hook-example'>
        <h2 className='hook-title'>基础用法对比</h2>
        <p className='hook-description'>
          对比使用和不使用 useCallback 的性能差异，观察子组件的重新渲染次数。
        </p>

        <div className='hook-demo'>
          <div className='grid md:grid-cols-2 gap-6'>
            {/* 没有使用 useCallback */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
                ❌ 没有使用 useCallback
              </h3>
              <div className='state-display'>计数: {count}</div>
              <div className='space-y-2'>
                <Button onClick={handleIncrementBad} color='success'>
                  +1 (未优化)
                </Button>
                <Button onClick={handleDecrementBad} color='warning'>
                  -1 (未优化)
                </Button>
                <Button onClick={handleResetBad} color='secondary'>
                  重置 (未优化)
                </Button>
              </div>
              <p className='text-sm text-red-600 dark:text-red-400'>
                每次父组件渲染时，这些按钮都会重新渲染
              </p>
            </div>

            {/* 使用了 useCallback */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
                ✅ 使用了 useCallback
              </h3>
              <Counter
                onIncrement={handleIncrement}
                onDecrement={handleDecrement}
                onReset={handleReset}
              />
              <p className='text-sm text-green-600 dark:text-green-400'>
                函数引用被缓存，组件避免不必要的重新渲染
              </p>
            </div>
          </div>

          {/* 触发重新渲染的控制 */}
          <div className='mt-6 space-y-4'>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
              触发父组件重新渲染
            </h3>
            <div className='flex space-x-4'>
              <button
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className='btn-primary'
              >
                切换主题 (触发重新渲染)
              </button>
              <input
                type='text'
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder='输入文字 (触发重新渲染)'
                className='input'
              />
            </div>
          </div>
        </div>

        <div className='hook-code'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3'>
            代码示例
          </h3>
          <pre className='code-block'>
            {`// ❌ 每次渲染都创建新函数
const handleClick = () => {
  setCount(prev => prev + 1);
}; // 新的函数引用，会导致子组件重新渲染

// ✅ 使用 useCallback 缓存函数
const handleClick = useCallback(() => {
  setCount(prev => prev + 1);
}, []); // 函数引用保持不变

// 子组件使用 memo 包装
const Button = memo(({ onClick, children }) => {
  console.log('Button 重新渲染');
  return <button onClick={onClick}>{children}</button>;
});

// 使用
<Button onClick={handleClick}>点击</Button>`}
          </pre>
        </div>
      </div>

      {/* 列表操作示例 */}
      <div className='hook-example'>
        <h2 className='hook-title'>列表操作示例</h2>
        <p className='hook-description'>
          在列表操作中使用 useCallback 优化性能，避免列表项的不必要重新渲染。
        </p>

        <div className='hook-demo'>
          <div className='space-y-6'>
            {/* 添加新项目 */}
            <div className='flex space-x-2'>
              <input
                type='text'
                value={newItem}
                onChange={e => setNewItem(e.target.value)}
                placeholder='添加新项目...'
                className='input flex-1'
                onKeyPress={e => e.key === 'Enter' && handleAddItem()}
              />
              <button onClick={handleAddItem} className='btn-primary'>
                添加
              </button>
            </div>

            {/* 统计信息 */}
            <div className='state-display'>
              <div className='grid grid-cols-3 gap-4 text-center'>
                <div>
                  <div className='text-lg font-bold'>{itemStats.total}</div>
                  <div className='text-sm'>总计</div>
                </div>
                <div>
                  <div className='text-lg font-bold text-green-600'>
                    {itemStats.completed}
                  </div>
                  <div className='text-sm'>已完成</div>
                </div>
                <div>
                  <div className='text-lg font-bold text-yellow-600'>
                    {itemStats.pending}
                  </div>
                  <div className='text-sm'>待完成</div>
                </div>
              </div>
            </div>

            {/* 批量操作 */}
            <div className='flex space-x-2'>
              <button
                onClick={() => handleBatchOperation('complete')}
                className='btn-success'
              >
                全部完成
              </button>
              <button
                onClick={() => handleBatchOperation('reset')}
                className='btn-warning'
              >
                全部重置
              </button>
              <button
                onClick={() => handleBatchOperation('delete')}
                className='btn-danger'
              >
                删除已完成
              </button>
            </div>

            {/* 项目列表 */}
            <div className='space-y-2'>
              {items.map(item => (
                <div key={item.id} className='flex items-center space-x-3'>
                  <input
                    type='checkbox'
                    checked={item.completed}
                    onChange={() => handleToggleItem(item.id)}
                    className='w-4 h-4'
                  />
                  <div className='flex-1'>
                    <ListItem
                      item={item}
                      onEdit={handleEditItem}
                      onDelete={handleDeleteItem}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className='info-message'>
              <p className='font-semibold mb-2'>性能优化说明:</p>
              <ul className='list-disc list-inside space-y-1 text-sm'>
                <li>每个列表项都使用 React.memo 包装</li>
                <li>编辑和删除函数使用 useCallback 缓存</li>
                <li>只有被操作的项目会重新渲染</li>
                <li>查看每个项目右侧的渲染计数器</li>
              </ul>
            </div>
          </div>
        </div>

        <div className='hook-code'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3'>
            代码示例
          </h3>
          <pre className='code-block'>
            {`// 列表操作的 useCallback 优化
const handleEditItem = useCallback((id: number, newName: string) => {
  const updatedName = prompt('编辑项目名称:', newName);
  if (updatedName && updatedName.trim()) {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, name: updatedName.trim() } : item
      )
    );
  }
}, []); // 不依赖外部值

const handleDeleteItem = useCallback((id: number) => {
  setItems(prev => prev.filter(item => item.id !== id));
}, []);

// 依赖外部值的情况
const handleAddItem = useCallback(() => {
  if (newItem.trim()) {
    setItems(prev => [...prev, { 
      id: Date.now(), 
      name: newItem.trim(), 
      completed: false 
    }]);
    setNewItem('');
  }
}, [newItem]); // 依赖 newItem 状态

// 列表项组件
const ListItem = memo(({ item, onEdit, onDelete }) => {
  return (
    <div>
      <span>{item.name}</span>
      <button onClick={() => onEdit(item.id, item.name)}>编辑</button>
      <button onClick={() => onDelete(item.id)}>删除</button>
    </div>
  );
});`}
          </pre>
        </div>
      </div>

      {/* useCallback vs useMemo 对比 */}
      <div className='hook-example'>
        <h2 className='hook-title'>useCallback vs useMemo</h2>
        <div className='space-y-6'>
          <div className='grid md:grid-cols-2 gap-6'>
            <div>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3'>
                useCallback
              </h3>
              <ul className='space-y-2 text-gray-600 dark:text-gray-400 text-sm'>
                <li>
                  • <strong>缓存函数</strong>：返回记忆化的回调函数
                </li>
                <li>
                  • <strong>用途</strong>：避免子组件不必要的重新渲染
                </li>
                <li>
                  • <strong>场景</strong>：传递给子组件的事件处理函数
                </li>
                <li>
                  • <strong>语法</strong>：useCallback(fn, deps)
                </li>
                <li>
                  • <strong>返回</strong>：函数本身
                </li>
              </ul>
            </div>

            <div>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3'>
                useMemo
              </h3>
              <ul className='space-y-2 text-gray-600 dark:text-gray-400 text-sm'>
                <li>
                  • <strong>缓存值</strong>：返回记忆化的计算结果
                </li>
                <li>
                  • <strong>用途</strong>：避免昂贵计算的重复执行
                </li>
                <li>
                  • <strong>场景</strong>：复杂计算、大数据处理
                </li>
                <li>
                  • <strong>语法</strong>：useMemo(() =&gt; value, deps)
                </li>
                <li>
                  • <strong>返回</strong>：计算结果
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className='hook-code'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3'>
            对比示例
          </h3>
          <pre className='code-block'>
            {`// useCallback - 缓存函数
const handleClick = useCallback(() => {
  console.log('点击了');
}, []);

// useMemo - 缓存计算结果
const expensiveValue = useMemo(() => {
  return heavyCalculation(data);
}, [data]);

// 等价关系
useCallback(fn, deps) 等价于 useMemo(() => fn, deps)

// 实际使用场景对比
const Component = () => {
  const [count, setCount] = useState(0);
  const [items, setItems] = useState([]);
  
  // ✅ useCallback - 缓存事件处理函数
  const handleIncrement = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);
  
  // ✅ useMemo - 缓存计算结果
  const filteredItems = useMemo(() => {
    return items.filter(item => item.active);
  }, [items]);
  
  return (
    <div>
      <ChildComponent onClick={handleIncrement} />
      <List items={filteredItems} />
    </div>
  );
};`}
          </pre>
        </div>
      </div>

      {/* 最佳实践 */}
      <div className='hook-example'>
        <h2 className='hook-title'>最佳实践</h2>
        <div className='space-y-6'>
          <div className='grid md:grid-cols-2 gap-6'>
            <div>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3'>
                ✅ 适合使用 useCallback 的场景
              </h3>
              <ul className='space-y-2 text-gray-600 dark:text-gray-400 text-sm'>
                <li>• 传递给使用 memo 包装的子组件的函数</li>
                <li>• 作为其他 Hook 的依赖项的函数</li>
                <li>• 在列表中传递给每个项目的回调函数</li>
                <li>• 昂贵的事件处理函数</li>
                <li>• 防抖或节流函数</li>
              </ul>
            </div>

            <div>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3'>
                ❌ 不需要使用 useCallback 的场景
              </h3>
              <ul className='space-y-2 text-gray-600 dark:text-gray-400 text-sm'>
                <li>• 简单的事件处理函数</li>
                <li>• 不传递给子组件的函数</li>
                <li>• 依赖项经常变化的函数</li>
                <li>• 内联的简单函数</li>
                <li>• 组件内部使用的临时函数</li>
              </ul>
            </div>
          </div>
        </div>

        <div className='hook-code'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3'>
            最佳实践代码
          </h3>
          <pre className='code-block'>
            {`// ✅ 好的用法 - 传递给 memo 组件
const ChildComponent = memo(({ onClick }) => {
  return <button onClick={onClick}>点击</button>;
});

const Parent = () => {
  const [count, setCount] = useState(0);
  
  const handleClick = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);
  
  return <ChildComponent onClick={handleClick} />;
};

// ✅ 好的用法 - 作为 useEffect 的依赖
const fetchData = useCallback(async (id) => {
  const response = await api.getData(id);
  setData(response);
}, []);

useEffect(() => {
  fetchData(userId);
}, [fetchData, userId]);

// ❌ 不必要的用法 - 简单内联函数
<button onClick={useCallback(() => setCount(0), [])}>
  重置
</button>
// 应该直接写成：
<button onClick={() => setCount(0)}>重置</button>

// ❌ 不必要的用法 - 依赖经常变化
const handleSubmit = useCallback(() => {
  submitForm(formData);
}, [formData]); // formData 经常变化，缓存意义不大`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default UseCallbackExample;
