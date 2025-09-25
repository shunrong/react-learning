import { useState, useEffect, useRef } from 'react';

const UseEffectExample = () => {
  // 基础用法示例
  const [count, setCount] = useState(0);
  const [title, setTitle] = useState('React Hooks');

  // 网络请求示例
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 定时器示例
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 窗口大小示例
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  // 1. 基础 useEffect - 每次渲染后执行
  useEffect(() => {
    console.log('组件渲染完成');
  });

  // 2. 依赖数组为空 - 只在挂载时执行一次
  useEffect(() => {
    console.log('组件挂载完成');

    return () => {
      console.log('组件即将卸载');
    };
  }, []);

  // 3. 监听特定状态变化
  useEffect(() => {
    document.title = `${title} - Count: ${count}`;
  }, [title, count]);

  // 4. 网络请求示例
  useEffect(() => {
    const fetchPosts = async () => {
      if (!loading) return;

      try {
        setError(null);
        const response = await fetch(
          'https://jsonplaceholder.typicode.com/posts?_limit=5'
        );
        if (!response.ok) throw new Error('请求失败');
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '未知错误');
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [loading]);

  // 5. 定时器示例
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  // 6. 窗口大小监听
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const startTimer = () => setIsRunning(true);
  const stopTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setIsRunning(false);
    setSeconds(0);
  };

  const loadPosts = () => {
    setPosts([]);
    setError(null);
    setLoading(true);
  };

  return (
    <div className='max-w-4xl mx-auto space-y-8'>
      {/* 页面标题 */}
      <div>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4'>
          useEffect Hook
        </h1>
        <p className='text-lg text-gray-600 dark:text-gray-400'>
          useEffect 用于处理副作用，如数据获取、订阅、DOM 操作等。它相当于
          componentDidMount、componentDidUpdate 和 componentWillUnmount 的组合。
        </p>
      </div>

      {/* 基础用法 */}
      <div className='hook-example'>
        <h2 className='hook-title'>基础用法与依赖数组</h2>
        <p className='hook-description'>
          useEffect 的行为取决于依赖数组的不同形式。
        </p>

        <div className='hook-demo'>
          <div className='grid md:grid-cols-2 gap-6'>
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
                状态更新测试
              </h3>
              <div className='state-display'>当前计数: {count}</div>
              <div className='flex space-x-2'>
                <button
                  onClick={() => setCount(count + 1)}
                  className='btn-primary'
                >
                  增加计数
                </button>
                <button onClick={() => setCount(0)} className='btn-secondary'>
                  重置
                </button>
              </div>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                查看浏览器控制台，观察 useEffect 的执行
              </p>
            </div>

            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
                文档标题更新
              </h3>
              <div className='state-display'>当前标题: {title}</div>
              <input
                type='text'
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder='修改页面标题'
                className='input'
              />
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                修改输入框会同时更新浏览器标签页标题
              </p>
            </div>
          </div>
        </div>

        <div className='hook-code'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3'>
            代码示例
          </h3>
          <pre className='code-block'>
            {`// 1. 无依赖数组 - 每次渲染后执行
useEffect(() => {
  console.log('每次渲染都会执行');
});

// 2. 空依赖数组 - 只在挂载时执行
useEffect(() => {
  console.log('只在组件挂载时执行一次');
  
  return () => {
    console.log('组件卸载时的清理函数');
  };
}, []);

// 3. 有依赖的 useEffect - 依赖变化时执行
useEffect(() => {
  document.title = \`\${title} - Count: \${count}\`;
}, [title, count]); // 当 title 或 count 变化时执行`}
          </pre>
        </div>
      </div>

      {/* 定时器示例 */}
      <div className='hook-example'>
        <h2 className='hook-title'>定时器管理</h2>
        <p className='hook-description'>
          使用 useEffect 管理定时器，确保在组件卸载时清理资源。
        </p>

        <div className='hook-demo'>
          <div className='space-y-4'>
            <div className='text-center'>
              <div className='state-display inline-block'>
                计时器: {Math.floor(seconds / 60)}:
                {(seconds % 60).toString().padStart(2, '0')}
              </div>
            </div>

            <div className='flex justify-center space-x-4'>
              <button
                onClick={startTimer}
                disabled={isRunning}
                className={
                  isRunning ? 'btn-secondary opacity-50' : 'btn-success'
                }
              >
                开始
              </button>
              <button
                onClick={stopTimer}
                disabled={!isRunning}
                className={
                  !isRunning ? 'btn-secondary opacity-50' : 'btn-warning'
                }
              >
                暂停
              </button>
              <button onClick={resetTimer} className='btn-secondary'>
                重置
              </button>
            </div>

            <div className='info-message'>
              <strong>状态:</strong> {isRunning ? '运行中' : '已暂停'}
            </div>
          </div>
        </div>

        <div className='hook-code'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3'>
            代码示例
          </h3>
          <pre className='code-block'>
            {`const [seconds, setSeconds] = useState(0);
const [isRunning, setIsRunning] = useState(false);
const intervalRef = useRef<NodeJS.Timeout | null>(null);

useEffect(() => {
  if (isRunning) {
    intervalRef.current = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
  } else {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  // 清理函数 - 组件卸载或依赖变化时执行
  return () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };
}, [isRunning]); // 当 isRunning 变化时重新执行`}
          </pre>
        </div>
      </div>

      {/* 网络请求示例 */}
      <div className='hook-example'>
        <h2 className='hook-title'>数据获取</h2>
        <p className='hook-description'>
          使用 useEffect 进行异步数据获取，处理加载状态和错误。
        </p>

        <div className='hook-demo'>
          <div className='space-y-4'>
            <div className='flex justify-between items-center'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
                文章列表
              </h3>
              <button
                onClick={loadPosts}
                disabled={loading}
                className={loading ? 'btn-secondary opacity-50' : 'btn-primary'}
              >
                {loading ? (
                  <>
                    <span className='loading-spinner mr-2'></span>
                    加载中...
                  </>
                ) : (
                  '加载数据'
                )}
              </button>
            </div>

            {error && <div className='error-message'>错误: {error}</div>}

            {posts.length > 0 && (
              <div className='space-y-3'>
                {posts.map(post => (
                  <div
                    key={post.id}
                    className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4'
                  >
                    <h4 className='font-semibold text-gray-900 dark:text-gray-100 mb-2'>
                      {post.title}
                    </h4>
                    <p className='text-sm text-gray-600 dark:text-gray-400 line-clamp-2'>
                      {post.body}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {!loading && posts.length === 0 && !error && (
              <div className='info-message text-center'>
                点击"加载数据"按钮获取文章列表
              </div>
            )}
          </div>
        </div>

        <div className='hook-code'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3'>
            代码示例
          </h3>
          <pre className='code-block'>
            {`const [posts, setPosts] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

useEffect(() => {
  const fetchPosts = async () => {
    if (!loading) return;
    
    try {
      setError(null);
      const response = await fetch('https://api.example.com/posts');
      if (!response.ok) throw new Error('请求失败');
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      setError(err.message);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  fetchPosts();
}, [loading]); // 当 loading 状态变化时触发请求`}
          </pre>
        </div>
      </div>

      {/* 事件监听示例 */}
      <div className='hook-example'>
        <h2 className='hook-title'>事件监听</h2>
        <p className='hook-description'>
          使用 useEffect 添加和清理事件监听器。
        </p>

        <div className='hook-demo'>
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
              窗口大小监听
            </h3>
            <div className='state-display'>
              窗口大小: {windowSize.width} × {windowSize.height}
            </div>
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              调整浏览器窗口大小，观察数值变化
            </p>
          </div>
        </div>

        <div className='hook-code'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3'>
            代码示例
          </h3>
          <pre className='code-block'>
            {`const [windowSize, setWindowSize] = useState({
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

  // 添加事件监听器
  window.addEventListener('resize', handleResize);
  
  // 清理函数 - 移除事件监听器
  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []); // 空依赖数组，只在挂载时添加监听器`}
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
              <li>• 总是在依赖数组中包含所有使用的值</li>
              <li>• 在清理函数中移除事件监听器和定时器</li>
              <li>• 使用多个 useEffect 分离不同的副作用逻辑</li>
              <li>• 避免在 useEffect 中直接修改 DOM</li>
              <li>• 使用 useCallback 和 useMemo 优化依赖</li>
            </ul>
          </div>

          <div>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3'>
              ❌ 避免做法
            </h3>
            <ul className='space-y-2 text-gray-600 dark:text-gray-400'>
              <li>• 忘记清理定时器和事件监听器</li>
              <li>• 依赖数组中遗漏变量</li>
              <li>• 在 useEffect 中进行无限循环更新</li>
              <li>• 过度使用 useEffect 处理简单的状态更新</li>
              <li>• 忽略 ESLint 的 exhaustive-deps 警告</li>
            </ul>
          </div>
        </div>

        <div className='hook-code'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3'>
            常见陷阱与解决方案
          </h3>
          <pre className='code-block'>
            {`// ❌ 错误：依赖数组不完整
useEffect(() => {
  const timer = setInterval(() => {
    setCount(count + 1); // count 没有在依赖数组中
  }, 1000);
  
  return () => clearInterval(timer);
}, []); // 缺少 count 依赖

// ✅ 正确：使用函数式更新
useEffect(() => {
  const timer = setInterval(() => {
    setCount(prev => prev + 1); // 不依赖外部的 count
  }, 1000);
  
  return () => clearInterval(timer);
}, []); // 现在依赖数组是正确的

// ❌ 错误：忘记清理
useEffect(() => {
  const subscription = api.subscribe(handleUpdate);
  // 没有清理函数
}, []);

// ✅ 正确：总是清理副作用
useEffect(() => {
  const subscription = api.subscribe(handleUpdate);
  
  return () => {
    subscription.unsubscribe(); // 清理订阅
  };
}, []);`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default UseEffectExample;
