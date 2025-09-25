import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

// 1. useCounter - 计数器 Hook
const useCounter = (initialValue = 0, step = 1) => {
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => {
    setCount(prev => prev + step);
  }, [step]);

  const decrement = useCallback(() => {
    setCount(prev => prev - step);
  }, [step]);

  const reset = useCallback(() => {
    setCount(initialValue);
  }, [initialValue]);

  const setValue = useCallback((value: number) => {
    setCount(value);
  }, []);

  return {
    count,
    increment,
    decrement,
    reset,
    setValue,
  };
};

// 2. useToggle - 布尔切换 Hook
const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue(prev => !prev);
  }, []);

  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  return {
    value,
    toggle,
    setTrue,
    setFalse,
    setValue,
  };
};

// 3. useLocalStorage - 本地存储 Hook
const useLocalStorage = <T,>(key: string, initialValue: T) => {
  // 从 localStorage 读取初始值
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      if (typeof window !== 'undefined') {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
      }
      return initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // 更新 localStorage 和状态
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // 移除 localStorage 项
  const removeValue = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue] as const;
};

// 4. useFetch - 数据获取 Hook
const useFetch = <T,>(url: string, options?: RequestInit) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch,
  };
};

// 5. useDebounce - 防抖 Hook
const useDebounce = <T,>(value: T, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// 6. useInterval - 定时器 Hook
const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef<() => void>();

  // 保存最新的回调函数
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // 设置定时器
  useEffect(() => {
    if (delay !== null) {
      const tick = () => {
        savedCallback.current?.();
      };

      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

// 7. usePrevious - 获取前一个值
const usePrevious = <T,>(value: T): T | undefined => {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
};

// 8. useWindowSize - 窗口大小 Hook
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

const CustomHooksExample = () => {
  // 使用自定义 Hooks
  const counter = useCounter(0, 2);
  const toggle = useToggle(false);
  const [name, setName, removeName] = useLocalStorage('user-name', '');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 500);
  const previousSearch = usePrevious(debouncedSearch);
  const windowSize = useWindowSize();

  // 获取示例数据
  const {
    data: posts,
    loading,
    error,
    refetch,
  } = useFetch<any[]>('https://jsonplaceholder.typicode.com/posts?_limit=3');

  // 定时器示例
  const [timerCount, setTimerCount] = useState(0);
  const [intervalDelay, setIntervalDelay] = useState<number | null>(null);

  useInterval(() => {
    setTimerCount(prev => prev + 1);
  }, intervalDelay);

  // 搜索效果监听
  useEffect(() => {
    if (debouncedSearch) {
      console.log('执行搜索:', debouncedSearch);
    }
  }, [debouncedSearch]);

  return (
    <div className='max-w-4xl mx-auto space-y-8'>
      {/* 页面标题 */}
      <div>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4'>
          自定义 Hooks
        </h1>
        <p className='text-lg text-gray-600 dark:text-gray-400'>
          自定义 Hook 是复用组件逻辑的强大方式。通过组合内置
          Hook，可以创建可复用的状态逻辑。
        </p>
      </div>

      {/* useCounter 示例 */}
      <div className='hook-example'>
        <h2 className='hook-title'>useCounter - 计数器 Hook</h2>
        <p className='hook-description'>
          封装计数器逻辑，支持自定义初始值和步长。
        </p>

        <div className='hook-demo'>
          <div className='space-y-4'>
            <div className='state-display'>计数值: {counter.count}</div>
            <div className='flex space-x-2'>
              <button onClick={counter.increment} className='btn-primary'>
                +{2} (步长)
              </button>
              <button onClick={counter.decrement} className='btn-secondary'>
                -{2}
              </button>
              <button onClick={counter.reset} className='btn-secondary'>
                重置
              </button>
              <button
                onClick={() => counter.setValue(100)}
                className='btn-warning'
              >
                设为 100
              </button>
            </div>
          </div>
        </div>

        <div className='hook-code'>
          <pre className='code-block'>
            {`const useCounter = (initialValue = 0, step = 1) => {
  const [count, setCount] = useState(initialValue);
  
  const increment = useCallback(() => {
    setCount(prev => prev + step);
  }, [step]);
  
  const decrement = useCallback(() => {
    setCount(prev => prev - step);
  }, [step]);
  
  const reset = useCallback(() => {
    setCount(initialValue);
  }, [initialValue]);
  
  return { count, increment, decrement, reset };
};

// 使用
const { count, increment, decrement, reset } = useCounter(0, 2);`}
          </pre>
        </div>
      </div>

      {/* useToggle 和 useLocalStorage 示例 */}
      <div className='hook-example'>
        <h2 className='hook-title'>useToggle & useLocalStorage</h2>
        <p className='hook-description'>布尔值切换和本地存储的便捷 Hook。</p>

        <div className='hook-demo'>
          <div className='grid md:grid-cols-2 gap-6'>
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
                useToggle
              </h3>
              <div className='state-display'>
                开关状态: {toggle.value ? '开启' : '关闭'}
              </div>
              <div className='flex space-x-2'>
                <button onClick={toggle.toggle} className='btn-primary'>
                  切换
                </button>
                <button onClick={toggle.setTrue} className='btn-success'>
                  开启
                </button>
                <button onClick={toggle.setFalse} className='btn-warning'>
                  关闭
                </button>
              </div>
            </div>

            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
                useLocalStorage
              </h3>
              <div className='state-display'>
                存储的名字: {name || '(未设置)'}
              </div>
              <div className='space-y-2'>
                <input
                  type='text'
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder='输入你的名字'
                  className='input'
                />
                <button onClick={removeName} className='btn-warning'>
                  清除存储
                </button>
              </div>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                刷新页面，名字会保持不变
              </p>
            </div>
          </div>
        </div>

        <div className='hook-code'>
          <pre className='code-block'>
            {`// useToggle Hook
const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);
  
  const toggle = useCallback(() => setValue(prev => !prev), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  
  return { value, toggle, setTrue, setFalse, setValue };
};

// useLocalStorage Hook
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });
  
  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error setting localStorage:', error);
    }
  }, [key, storedValue]);
  
  return [storedValue, setValue];
};`}
          </pre>
        </div>
      </div>

      {/* 防抖和数据获取 */}
      <div className='hook-example'>
        <h2 className='hook-title'>useDebounce & useFetch</h2>
        <p className='hook-description'>防抖输入和数据获取的实用 Hook 组合。</p>

        <div className='hook-demo'>
          <div className='space-y-6'>
            {/* 防抖搜索 */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
                防抖搜索
              </h3>
              <input
                type='text'
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder='输入搜索内容 (500ms 防抖)'
                className='input'
              />
              <div className='state-display'>
                <div>实时输入: "{searchQuery}"</div>
                <div>防抖后值: "{debouncedSearch}"</div>
                <div>前一个搜索: "{previousSearch}"</div>
              </div>
            </div>

            {/* 数据获取 */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
                数据获取状态
              </h3>
              <div className='flex space-x-2 mb-4'>
                <button
                  onClick={refetch}
                  disabled={loading}
                  className='btn-primary'
                >
                  {loading ? '加载中...' : '重新获取'}
                </button>
              </div>

              {loading && (
                <div className='info-message'>
                  <div className='flex items-center'>
                    <span className='loading-spinner mr-2'></span>
                    正在获取数据...
                  </div>
                </div>
              )}

              {error && <div className='error-message'>错误: {error}</div>}

              {posts && posts.length > 0 && (
                <div className='space-y-2'>
                  {posts.map((post: any) => (
                    <div
                      key={post.id}
                      className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3'
                    >
                      <h4 className='font-semibold text-gray-900 dark:text-gray-100'>
                        {post.title}
                      </h4>
                      <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
                        {post.body.substring(0, 100)}...
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className='hook-code'>
          <pre className='code-block'>
            {`// useDebounce Hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
};

// useFetch Hook
const useFetch = (url, options) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(url, options);
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [url, options]);
  
  useEffect(() => { fetchData(); }, [fetchData]);
  
  return { data, loading, error, refetch: fetchData };
};`}
          </pre>
        </div>
      </div>

      {/* 定时器和窗口大小 */}
      <div className='hook-example'>
        <h2 className='hook-title'>useInterval & useWindowSize</h2>
        <p className='hook-description'>
          定时器管理和窗口大小监听的实用 Hook。
        </p>

        <div className='hook-demo'>
          <div className='grid md:grid-cols-2 gap-6'>
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
                定时器控制
              </h3>
              <div className='state-display'>定时器计数: {timerCount}</div>
              <div className='flex space-x-2'>
                <button
                  onClick={() => setIntervalDelay(intervalDelay ? null : 1000)}
                  className={intervalDelay ? 'btn-warning' : 'btn-success'}
                >
                  {intervalDelay ? '停止' : '开始'} (1秒间隔)
                </button>
                <button
                  onClick={() => setTimerCount(0)}
                  className='btn-secondary'
                >
                  重置计数
                </button>
              </div>
            </div>

            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
                窗口大小监听
              </h3>
              <div className='state-display'>
                窗口大小: {windowSize.width} × {windowSize.height}
                <br />
                设备类型:{' '}
                {windowSize.width < 768
                  ? '移动设备'
                  : windowSize.width < 1024
                    ? '平板'
                    : '桌面'}
              </div>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                调整浏览器窗口大小观察变化
              </p>
            </div>
          </div>
        </div>

        <div className='hook-code'>
          <pre className='code-block'>
            {`// useInterval Hook
const useInterval = (callback, delay) => {
  const savedCallback = useRef();
  
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  
  useEffect(() => {
    if (delay !== null) {
      const tick = () => savedCallback.current?.();
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

// useWindowSize Hook
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return windowSize;
};`}
          </pre>
        </div>
      </div>

      {/* Hook 组合示例 */}
      <div className='hook-example'>
        <h2 className='hook-title'>Hook 组合示例</h2>
        <p className='hook-description'>
          展示如何组合多个 Hook 创建复杂的自定义 Hook。
        </p>

        <div className='hook-demo'>
          <div className='space-y-4'>
            <div className='bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-6'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4'>
                多 Hook 组合演示
              </h3>
              <div className='grid md:grid-cols-2 gap-4'>
                <div className='space-y-3'>
                  <h4 className='font-medium text-gray-900 dark:text-gray-100'>
                    状态管理
                  </h4>
                  <ul className='text-sm text-gray-600 dark:text-gray-400 space-y-1'>
                    <li>✅ useCounter: 步长为 2 的计数器</li>
                    <li>✅ useToggle: 布尔值切换</li>
                    <li>✅ useLocalStorage: 持久化名字存储</li>
                  </ul>
                </div>
                <div className='space-y-3'>
                  <h4 className='font-medium text-gray-900 dark:text-gray-100'>
                    副作用管理
                  </h4>
                  <ul className='text-sm text-gray-600 dark:text-gray-400 space-y-1'>
                    <li>✅ useDebounce: 500ms 防抖搜索</li>
                    <li>✅ useFetch: 自动数据获取</li>
                    <li>✅ useInterval: 定时器管理</li>
                    <li>✅ useWindowSize: 窗口大小监听</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 最佳实践 */}
      <div className='hook-example'>
        <h2 className='hook-title'>自定义 Hook 最佳实践</h2>
        <div className='space-y-6'>
          <div className='grid md:grid-cols-2 gap-6'>
            <div>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3'>
                ✅ 设计原则
              </h3>
              <ul className='space-y-2 text-gray-600 dark:text-gray-400 text-sm'>
                <li>
                  • <strong>单一职责</strong>：每个 Hook 专注一个功能
                </li>
                <li>
                  • <strong>可复用性</strong>：在多个组件间复用逻辑
                </li>
                <li>
                  • <strong>参数化</strong>：通过参数提供灵活性
                </li>
                <li>
                  • <strong>返回对象</strong>：返回对象而非数组（除非顺序重要）
                </li>
                <li>
                  • <strong>类型安全</strong>：使用 TypeScript 定义类型
                </li>
              </ul>
            </div>

            <div>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3'>
                🎯 命名规范
              </h3>
              <ul className='space-y-2 text-gray-600 dark:text-gray-400 text-sm'>
                <li>
                  • <strong>use 前缀</strong>：必须以 use 开头
                </li>
                <li>
                  • <strong>描述性名称</strong>：清晰表达功能
                </li>
                <li>
                  • <strong>动词命名</strong>：useCounter, useFetch, useToggle
                </li>
                <li>
                  • <strong>避免缩写</strong>：使用完整单词
                </li>
                <li>
                  • <strong>一致性</strong>：项目内保持命名风格一致
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className='hook-code'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3'>
            自定义 Hook 设计模板
          </h3>
          <pre className='code-block'>
            {`// 自定义 Hook 设计模板
const useCustomHook = <T,>(
  initialValue: T,
  options?: { 
    onSuccess?: () => void;
    onError?: (error: Error) => void;
  }
) => {
  // 1. 内部状态
  const [state, setState] = useState<T>(initialValue);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // 2. 副作用管理
  useEffect(() => {
    // 副作用逻辑
  }, [/* 依赖项 */]);
  
  // 3. 回调函数
  const doSomething = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // 执行操作
      options?.onSuccess?.();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      options?.onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [options]);
  
  // 4. 返回值
  return {
    state,
    loading,
    error,
    doSomething,
    // 其他有用的方法
  };
};

// 使用示例
const MyComponent = () => {
  const { state, loading, doSomething } = useCustomHook('initial', {
    onSuccess: () => console.log('成功'),
    onError: (error) => console.error('失败:', error)
  });
  
  return <div>{/* 组件内容 */}</div>;
};`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CustomHooksExample;
