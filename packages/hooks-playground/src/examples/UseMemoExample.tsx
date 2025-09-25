import { useState, useMemo, useCallback, memo } from 'react';

// 模拟复杂计算函数
const expensiveCalculation = (num: number): number => {
  console.log('🔥 执行复杂计算...');
  let result = 0;
  for (let i = 0; i < 1000000; i++) {
    result += num * Math.random();
  }
  return Math.floor(result);
};

// 模拟过滤和排序大数据
const generateLargeDataset = (size: number) => {
  return Array.from({ length: size }, (_, i) => ({
    id: i,
    name: `Item ${i}`,
    value: Math.floor(Math.random() * 1000),
    category: ['A', 'B', 'C'][Math.floor(Math.random() * 3)],
  }));
};

// 子组件 - 使用 memo 优化
const ExpensiveChild = memo(
  ({
    data,
    onUpdate,
  }: {
    data: Array<{ id: number; name: string; value: number }>;
    onUpdate: () => void;
  }) => {
    console.log('🔄 ExpensiveChild 重新渲染');

    return (
      <div className='bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4'>
        <h4 className='font-semibold text-yellow-800 dark:text-yellow-200 mb-2'>
          ExpensiveChild 组件
        </h4>
        <p className='text-yellow-700 dark:text-yellow-300 text-sm mb-3'>
          数据项数量: {data.length}
        </p>
        <button onClick={onUpdate} className='btn-warning'>
          更新数据
        </button>
        <p className='text-xs text-yellow-600 dark:text-yellow-400 mt-2'>
          这个组件使用了 React.memo，只有 props 改变时才重新渲染
        </p>
      </div>
    );
  }
);

const UseMemoExample = () => {
  // 基础示例状态
  const [count, setCount] = useState(1);
  const [multiplier, setMultiplier] = useState(1);
  const [theme, setTheme] = useState('light');

  // 大数据处理示例
  const [dataSize, setDataSize] = useState(1000);
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // 子组件测试
  const [childData, setChildData] = useState([
    { id: 1, name: 'Item 1', value: 100 },
    { id: 2, name: 'Item 2', value: 200 },
  ]);

  // ❌ 没有使用 useMemo 的昂贵计算
  const expensiveResult = expensiveCalculation(count * multiplier);

  // ✅ 使用 useMemo 缓存昂贵计算
  const memoizedExpensiveResult = useMemo(() => {
    console.log('💾 useMemo: 重新计算');
    return expensiveCalculation(count * multiplier);
  }, [count, multiplier]);

  // ✅ 使用 useMemo 生成和处理大数据集
  const largeDataset = useMemo(() => {
    console.log('📊 生成大数据集...');
    return generateLargeDataset(dataSize);
  }, [dataSize]);

  const filteredAndSortedData = useMemo(() => {
    console.log('🔍 过滤和排序数据...');
    let filtered = largeDataset;

    if (filterCategory !== 'all') {
      filtered = largeDataset.filter(item => item.category === filterCategory);
    }

    return filtered.sort((a, b) => {
      return sortOrder === 'asc' ? a.value - b.value : b.value - a.value;
    });
  }, [largeDataset, filterCategory, sortOrder]);

  // ✅ 使用 useMemo 创建复杂对象
  const chartConfig = useMemo(() => {
    console.log('📈 生成图表配置...');
    return {
      type: 'bar',
      data: filteredAndSortedData.slice(0, 10).map(item => ({
        label: item.name,
        value: item.value,
      })),
      options: {
        theme,
        responsive: true,
        animations: theme === 'dark',
      },
    };
  }, [filteredAndSortedData, theme]);

  // ✅ 使用 useCallback 缓存函数（配合 useMemo 使用）
  const handleChildDataUpdate = useCallback(() => {
    setChildData(prev => [
      ...prev,
      {
        id: prev.length + 1,
        name: `Item ${prev.length + 1}`,
        value: Math.floor(Math.random() * 1000),
      },
    ]);
  }, []);

  // 性能统计
  const performanceStats = useMemo(() => {
    return {
      totalItems: largeDataset.length,
      filteredItems: filteredAndSortedData.length,
      memoryUsage: `${Math.round(largeDataset.length * 0.1)}KB`,
    };
  }, [largeDataset.length, filteredAndSortedData.length]);

  return (
    <div className='max-w-4xl mx-auto space-y-8'>
      {/* 页面标题 */}
      <div>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4'>
          useMemo Hook
        </h1>
        <p className='text-lg text-gray-600 dark:text-gray-400'>
          useMemo
          用于缓存计算结果，避免在每次渲染时重复执行昂贵的计算。只有当依赖项发生变化时，才会重新计算。
        </p>
      </div>

      {/* 基础用法示例 */}
      <div className='hook-example'>
        <h2 className='hook-title'>基础用法 - 缓存计算结果</h2>
        <p className='hook-description'>
          对比有无 useMemo 的性能差异，观察控制台输出了解重新计算的时机。
        </p>

        <div className='hook-demo'>
          <div className='grid md:grid-cols-2 gap-6'>
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
                控制参数
              </h3>

              <div className='space-y-3'>
                <div>
                  <label className='label'>计数: {count}</label>
                  <input
                    type='range'
                    min='1'
                    max='10'
                    value={count}
                    onChange={e => setCount(Number(e.target.value))}
                    className='w-full'
                  />
                </div>

                <div>
                  <label className='label'>乘数: {multiplier}</label>
                  <input
                    type='range'
                    min='1'
                    max='5'
                    value={multiplier}
                    onChange={e => setMultiplier(Number(e.target.value))}
                    className='w-full'
                  />
                </div>

                <div>
                  <label className='label'>主题 (不影响计算)</label>
                  <select
                    value={theme}
                    onChange={e => setTheme(e.target.value)}
                    className='input'
                  >
                    <option value='light'>浅色</option>
                    <option value='dark'>深色</option>
                  </select>
                </div>
              </div>
            </div>

            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
                计算结果对比
              </h3>

              <div className='error-message'>
                <strong>❌ 未缓存结果:</strong> {expensiveResult}
                <br />
                <small>每次渲染都重新计算（检查控制台）</small>
              </div>

              <div className='success-message'>
                <strong>✅ useMemo 缓存结果:</strong> {memoizedExpensiveResult}
                <br />
                <small>只有依赖变化时才重新计算</small>
              </div>

              <div className='info-message'>
                <strong>当前输入:</strong> {count} × {multiplier} ={' '}
                {count * multiplier}
                <br />
                <strong>主题:</strong> {theme}
              </div>
            </div>
          </div>
        </div>

        <div className='hook-code'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3'>
            代码示例
          </h3>
          <pre className='code-block'>
            {`// ❌ 每次渲染都执行昂贵计算
const expensiveResult = expensiveCalculation(count * multiplier);

// ✅ 使用 useMemo 缓存计算结果
const memoizedResult = useMemo(() => {
  console.log('重新计算...');
  return expensiveCalculation(count * multiplier);
}, [count, multiplier]); // 只有这些依赖变化时才重新计算

// 模拟昂贵计算
const expensiveCalculation = (num: number) => {
  let result = 0;
  for (let i = 0; i < 1000000; i++) {
    result += num * Math.random();
  }
  return Math.floor(result);
};`}
          </pre>
        </div>
      </div>

      {/* 大数据处理示例 */}
      <div className='hook-example'>
        <h2 className='hook-title'>大数据处理优化</h2>
        <p className='hook-description'>
          使用 useMemo 优化大数据集的过滤、排序等操作，避免不必要的重复计算。
        </p>

        <div className='hook-demo'>
          <div className='space-y-6'>
            {/* 控制面板 */}
            <div className='grid md:grid-cols-3 gap-4'>
              <div>
                <label className='label'>
                  数据大小: {dataSize.toLocaleString()}
                </label>
                <input
                  type='range'
                  min='100'
                  max='10000'
                  step='100'
                  value={dataSize}
                  onChange={e => setDataSize(Number(e.target.value))}
                  className='w-full'
                />
              </div>

              <div>
                <label className='label'>过滤分类</label>
                <select
                  value={filterCategory}
                  onChange={e => setFilterCategory(e.target.value)}
                  className='input'
                >
                  <option value='all'>全部</option>
                  <option value='A'>分类 A</option>
                  <option value='B'>分类 B</option>
                  <option value='C'>分类 C</option>
                </select>
              </div>

              <div>
                <label className='label'>排序</label>
                <select
                  value={sortOrder}
                  onChange={e => setSortOrder(e.target.value as 'asc' | 'desc')}
                  className='input'
                >
                  <option value='asc'>升序</option>
                  <option value='desc'>降序</option>
                </select>
              </div>
            </div>

            {/* 性能统计 */}
            <div className='state-display'>
              <div className='grid grid-cols-3 gap-4 text-center'>
                <div>
                  <div className='text-lg font-bold'>
                    {performanceStats.totalItems.toLocaleString()}
                  </div>
                  <div className='text-sm'>总数据量</div>
                </div>
                <div>
                  <div className='text-lg font-bold'>
                    {performanceStats.filteredItems.toLocaleString()}
                  </div>
                  <div className='text-sm'>过滤后数量</div>
                </div>
                <div>
                  <div className='text-lg font-bold'>
                    {performanceStats.memoryUsage}
                  </div>
                  <div className='text-sm'>估算内存</div>
                </div>
              </div>
            </div>

            {/* 数据预览 */}
            <div>
              <h4 className='font-semibold text-gray-900 dark:text-gray-100 mb-3'>
                数据预览 (前 5 项)
              </h4>
              <div className='space-y-2'>
                {filteredAndSortedData.slice(0, 5).map(item => (
                  <div
                    key={item.id}
                    className='flex justify-between items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-3'
                  >
                    <span className='font-medium'>{item.name}</span>
                    <span className='px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm'>
                      {item.category}
                    </span>
                    <span className='font-bold text-blue-600 dark:text-blue-400'>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className='hook-code'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3'>
            代码示例
          </h3>
          <pre className='code-block'>
            {`// 生成大数据集 - 只有 dataSize 变化时才重新生成
const largeDataset = useMemo(() => {
  console.log('生成大数据集...');
  return generateLargeDataset(dataSize);
}, [dataSize]);

// 过滤和排序 - 依赖多个状态
const filteredAndSortedData = useMemo(() => {
  console.log('过滤和排序数据...');
  let filtered = largeDataset;
  
  if (filterCategory !== 'all') {
    filtered = largeDataset.filter(item => item.category === filterCategory);
  }
  
  return filtered.sort((a, b) => {
    return sortOrder === 'asc' ? a.value - b.value : b.value - a.value;
  });
}, [largeDataset, filterCategory, sortOrder]);

// 复杂对象配置 - 避免每次都创建新对象
const chartConfig = useMemo(() => {
  return {
    type: 'bar',
    data: filteredAndSortedData.slice(0, 10),
    options: { theme, responsive: true }
  };
}, [filteredAndSortedData, theme]);`}
          </pre>
        </div>
      </div>

      {/* 配合 React.memo 使用 */}
      <div className='hook-example'>
        <h2 className='hook-title'>配合 React.memo 优化子组件</h2>
        <p className='hook-description'>
          useMemo 与 React.memo、useCallback
          配合使用，可以有效避免子组件的不必要渲染。
        </p>

        <div className='hook-demo'>
          <div className='space-y-4'>
            <div className='flex justify-between items-center'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
                子组件渲染测试
              </h3>
              <button
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className='btn-secondary'
              >
                切换主题 (不影响子组件)
              </button>
            </div>

            <ExpensiveChild data={childData} onUpdate={handleChildDataUpdate} />

            <div className='info-message'>
              <p className='font-semibold mb-2'>观察要点:</p>
              <ul className='list-disc list-inside space-y-1 text-sm'>
                <li>
                  点击"切换主题"按钮，子组件不会重新渲染（因为 props 没变）
                </li>
                <li>
                  点击"更新数据"按钮，子组件会重新渲染（因为 data prop 改变）
                </li>
                <li>查看控制台输出了解渲染时机</li>
              </ul>
            </div>
          </div>
        </div>

        <div className='hook-code'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3'>
            代码示例
          </h3>
          <pre className='code-block'>
            {`// 子组件使用 React.memo 包装
const ExpensiveChild = memo(({ data, onUpdate }) => {
  console.log('ExpensiveChild 重新渲染');
  return (
    <div>
      <p>数据项数量: {data.length}</p>
      <button onClick={onUpdate}>更新数据</button>
    </div>
  );
});

// 父组件中使用 useCallback 缓存函数
const Parent = () => {
  const [childData, setChildData] = useState([...]);
  const [theme, setTheme] = useState('light');
  
  // ✅ 缓存更新函数，避免每次都创建新函数
  const handleChildDataUpdate = useCallback(() => {
    setChildData(prev => [...prev, newItem]);
  }, []); // 空依赖数组，函数永远不会改变
  
  return (
    <ExpensiveChild 
      data={childData}     // 只有这个改变时子组件才重新渲染
      onUpdate={handleChildDataUpdate}  // 函数引用保持不变
    />
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
                ✅ 适合使用 useMemo 的场景
              </h3>
              <ul className='space-y-2 text-gray-600 dark:text-gray-400 text-sm'>
                <li>• 昂贵的计算操作（复杂算法、大数据处理）</li>
                <li>• 复杂对象的创建（避免引用变化）</li>
                <li>• 数组的过滤、排序、映射操作</li>
                <li>• 传递给 memo 组件的 props</li>
                <li>• 依赖计算结果的其他 Hook</li>
              </ul>
            </div>

            <div>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3'>
                ❌ 不适合使用 useMemo 的场景
              </h3>
              <ul className='space-y-2 text-gray-600 dark:text-gray-400 text-sm'>
                <li>• 简单的计算（如基本数学运算）</li>
                <li>• 基本类型值的简单变换</li>
                <li>• 每次都会变化的值</li>
                <li>• 依赖项经常变化的计算</li>
                <li>• 创建成本很低的操作</li>
              </ul>
            </div>
          </div>
        </div>

        <div className='hook-code'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3'>
            最佳实践代码
          </h3>
          <pre className='code-block'>
            {`// ✅ 好的用法
const expensiveValue = useMemo(() => {
  return largeArray.filter(item => item.active)
                   .sort((a, b) => a.priority - b.priority)
                   .slice(0, 10);
}, [largeArray]);

// ✅ 好的用法 - 创建稳定的对象引用
const config = useMemo(() => ({
  theme: currentTheme,
  locale: userLocale,
  features: enabledFeatures
}), [currentTheme, userLocale, enabledFeatures]);

// ❌ 不必要的用法 - 简单计算
const sum = useMemo(() => a + b, [a, b]); // 直接用 a + b 即可

// ❌ 不必要的用法 - 每次都变化
const timestamp = useMemo(() => Date.now(), []); // 会导致缓存失效

// ✅ 配合其他 Hook 使用
const sortedData = useMemo(() => 
  data.sort((a, b) => a[sortField] - b[sortField]), 
  [data, sortField]
);

const tableColumns = useMemo(() => [
  { key: 'name', label: '名称', sortable: true },
  { key: 'value', label: '值', sortable: true },
], []); // 稳定的列定义`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default UseMemoExample;
