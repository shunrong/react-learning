import { useState, useDebugValue, useMemo, useCallback } from 'react';

// 自定义 Hook 1: useCounter with Debug
const useCounter = (initialValue = 0, step = 1) => {
  const [count, setCount] = useState(initialValue);

  // 基础调试信息
  useDebugValue(count);

  // 更复杂的调试信息
  useDebugValue(count, count => `计数器: ${count} (步长: ${step})`);

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

// 自定义 Hook 2: useToggle with Debug
const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);

  // 使用格式化函数的调试值
  useDebugValue(value, value => (value ? '开启' : '关闭'));

  const toggle = useCallback(() => {
    setValue(prev => !prev);
  }, []);

  return { value, toggle, setValue };
};

// 自定义 Hook 3: 复杂状态的调试
const useUserState = () => {
  const [user, setUser] = useState<{
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'user' | 'guest';
  } | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 复杂状态的调试信息
  useDebugValue({ user, isLoading, error }, state => {
    if (state.isLoading) return '加载中...';
    if (state.error) return `错误: ${state.error}`;
    if (state.user) return `用户: ${state.user.name} (${state.user.role})`;
    return '未登录';
  });

  const login = useCallback(
    async (credentials: { email: string; password: string }) => {
      setIsLoading(true);
      setError(null);

      try {
        // 模拟 API 调用
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 模拟成功登录
        setUser({
          id: 1,
          name: credentials.email.split('@')[0],
          email: credentials.email,
          role: 'user',
        });
      } catch (err) {
        setError('登录失败');
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
    setError(null);
  }, []);

  return {
    user,
    isLoading,
    error,
    login,
    logout,
  };
};

// 自定义 Hook 4: 性能监控
const usePerformanceMonitor = (componentName: string) => {
  const renderCount = useState(0)[0];
  const [renderTimes, setRenderTimes] = useState<number[]>([]);

  // 监控渲染性能
  useMemo(() => {
    const startTime = performance.now();

    // 在下一个渲染周期记录时间
    Promise.resolve().then(() => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      setRenderTimes(prev => [...prev.slice(-9), renderTime]);
    });

    return renderCount + 1;
  }, [renderCount]);

  const averageRenderTime = useMemo(() => {
    if (renderTimes.length === 0) return 0;
    return (
      renderTimes.reduce((sum, time) => sum + time, 0) / renderTimes.length
    );
  }, [renderTimes]);

  // 调试信息包含性能数据
  useDebugValue(
    { componentName, renderCount, averageRenderTime },
    data =>
      `${data.componentName}: ${data.renderCount} 次渲染, 平均 ${data.averageRenderTime.toFixed(2)}ms`
  );

  return {
    renderCount,
    renderTimes,
    averageRenderTime,
  };
};

const UseDebugValueExample = () => {
  // 使用带调试信息的 Hook
  const counter = useCounter(0, 2);
  const toggle = useToggle(false);
  const userState = useUserState();
  const performance = usePerformanceMonitor('UseDebugValueExample');

  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');

  return (
    <div className='max-w-4xl mx-auto space-y-8'>
      {/* 页面标题 */}
      <div>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4'>
          useDebugValue Hook
        </h1>
        <p className='text-lg text-gray-600 dark:text-gray-400'>
          useDebugValue 用于在 React DevTools 中显示自定义 Hook
          的调试信息。它只在开发模式下有效，不会影响生产性能。
        </p>
      </div>

      {/* 开发工具提示 */}
      <div className='info-message'>
        <p className='font-semibold mb-2'>🛠️ 如何查看调试信息:</p>
        <ol className='list-decimal list-inside space-y-1 text-sm'>
          <li>打开浏览器开发者工具 (F12)</li>
          <li>切换到 "Components" 标签页 (需要安装 React DevTools 扩展)</li>
          <li>选择当前组件</li>
          <li>在右侧面板查看 "hooks" 部分的调试信息</li>
        </ol>
      </div>

      {/* 基础调试示例 */}
      <div className='hook-example'>
        <h2 className='hook-title'>基础调试信息</h2>
        <p className='hook-description'>
          为自定义 Hook 添加调试信息，在 React DevTools 中更好地理解 Hook 状态。
        </p>

        <div className='hook-demo'>
          <div className='grid md:grid-cols-2 gap-6'>
            {/* 计数器调试 */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
                计数器 Hook 调试
              </h3>
              <div className='state-display'>
                当前计数: {counter.count} (步长: 2)
              </div>
              <div className='flex space-x-2'>
                <button onClick={counter.increment} className='btn-primary'>
                  +2
                </button>
                <button onClick={counter.decrement} className='btn-secondary'>
                  -2
                </button>
                <button onClick={counter.reset} className='btn-secondary'>
                  重置
                </button>
              </div>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                在 DevTools 中查看 "useCounter" 的调试信息
              </p>
            </div>

            {/* 切换开关调试 */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
                切换开关 Hook 调试
              </h3>
              <div className='state-display'>
                开关状态: {toggle.value ? '开启' : '关闭'}
              </div>
              <button onClick={toggle.toggle} className='btn-primary'>
                切换状态
              </button>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                在 DevTools 中查看 "useToggle" 的中文调试信息
              </p>
            </div>
          </div>
        </div>

        <div className='hook-code'>
          <pre className='code-block'>
            {`// 基础 useDebugValue 用法
const useCounter = (initialValue = 0, step = 1) => {
  const [count, setCount] = useState(initialValue);
  
  // 1. 显示原始值
  useDebugValue(count);
  
  // 2. 使用格式化函数
  useDebugValue(count, count => \`计数器: \${count} (步长: \${step})\`);
  
  return { count, /* 其他方法 */ };
};

// 布尔值的友好显示
const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);
  
  useDebugValue(value, value => value ? '开启' : '关闭');
  
  return { value, toggle: () => setValue(!value) };
};`}
          </pre>
        </div>
      </div>

      {/* 复杂状态调试 */}
      <div className='hook-example'>
        <h2 className='hook-title'>复杂状态调试</h2>
        <p className='hook-description'>
          为包含多个状态的复杂 Hook 提供有意义的调试信息。
        </p>

        <div className='hook-demo'>
          <div className='space-y-6'>
            {/* 用户状态管理 */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
                用户状态管理
              </h3>

              {userState.user ? (
                <div className='space-y-3'>
                  <div className='success-message'>
                    已登录: {userState.user.name} ({userState.user.email})
                    <br />
                    角色: {userState.user.role}
                  </div>
                  <button onClick={userState.logout} className='btn-warning'>
                    退出登录
                  </button>
                </div>
              ) : (
                <div className='space-y-3'>
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <label className='label'>邮箱</label>
                      <input
                        type='email'
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className='input'
                      />
                    </div>
                    <div>
                      <label className='label'>密码</label>
                      <input
                        type='password'
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className='input'
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => userState.login({ email, password })}
                    disabled={userState.isLoading}
                    className={
                      userState.isLoading
                        ? 'btn-secondary opacity-50'
                        : 'btn-primary'
                    }
                  >
                    {userState.isLoading ? '登录中...' : '登录'}
                  </button>

                  {userState.error && (
                    <div className='error-message'>{userState.error}</div>
                  )}
                </div>
              )}

              <p className='text-sm text-gray-600 dark:text-gray-400'>
                在 DevTools 中查看 "useUserState" 的复合状态调试信息
              </p>
            </div>

            {/* 性能监控 */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
                组件性能监控
              </h3>
              <div className='state-display'>
                渲染次数: {performance.renderCount} | 平均渲染时间:{' '}
                {performance.averageRenderTime.toFixed(2)}ms
              </div>
              <div className='bg-gray-100 dark:bg-gray-800 rounded-lg p-3'>
                <h4 className='font-semibold text-gray-900 dark:text-gray-100 mb-2'>
                  最近 10 次渲染时间 (ms):
                </h4>
                <div className='flex space-x-1'>
                  {performance.renderTimes.map((time, index) => (
                    <div
                      key={index}
                      className={`px-2 py-1 rounded text-xs ${
                        time > 5
                          ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                          : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                      }`}
                    >
                      {time.toFixed(1)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='hook-code'>
          <pre className='code-block'>
            {`// 复杂状态的调试信息
const useUserState = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // 根据状态提供不同的调试信息
  useDebugValue(
    { user, isLoading, error },
    state => {
      if (state.isLoading) return '加载中...';
      if (state.error) return \`错误: \${state.error}\`;
      if (state.user) return \`用户: \${state.user.name} (\${state.user.role})\`;
      return '未登录';
    }
  );
  
  return { user, isLoading, error, login, logout };
};

// 性能监控的调试信息
const usePerformanceMonitor = (componentName) => {
  const [renderCount, setRenderCount] = useState(0);
  const [renderTimes, setRenderTimes] = useState([]);
  
  useDebugValue(
    { componentName, renderCount, averageTime },
    data => \`\${data.componentName}: \${data.renderCount} 次渲染, 平均 \${data.averageTime}ms\`
  );
  
  return { renderCount, renderTimes };
};`}
          </pre>
        </div>
      </div>

      {/* useDebugValue 最佳实践 */}
      <div className='hook-example'>
        <h2 className='hook-title'>最佳实践</h2>
        <div className='space-y-6'>
          <div className='grid md:grid-cols-2 gap-6'>
            <div>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3'>
                ✅ 推荐做法
              </h3>
              <ul className='space-y-2 text-gray-600 dark:text-gray-400 text-sm'>
                <li>• 为复杂的自定义 Hook 添加调试信息</li>
                <li>• 使用格式化函数提供有意义的显示</li>
                <li>• 显示 Hook 的关键状态信息</li>
                <li>• 帮助团队成员理解 Hook 的当前状态</li>
                <li>• 在开发阶段提供有用的调试信息</li>
              </ul>
            </div>

            <div>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3'>
                💡 使用技巧
              </h3>
              <ul className='space-y-2 text-gray-600 dark:text-gray-400 text-sm'>
                <li>• 只在开发模式下有效，不影响生产性能</li>
                <li>• 格式化函数只在 DevTools 查看时执行</li>
                <li>• 可以显示计算后的状态或统计信息</li>
                <li>• 支持对象和复杂数据结构</li>
                <li>• 有助于调试 Hook 的行为和性能</li>
              </ul>
            </div>
          </div>
        </div>

        <div className='hook-code'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3'>
            实用示例
          </h3>
          <pre className='code-block'>
            {`// 1. 简单值的调试
const useCounter = (initialValue = 0) => {
  const [count, setCount] = useState(initialValue);
  
  useDebugValue(count); // 直接显示值
  
  return { count, setCount };
};

// 2. 格式化显示
const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);
  
  useDebugValue(value, v => v ? '✅ 开启' : '❌ 关闭');
  
  return { value, toggle: () => setValue(!value) };
};

// 3. 复杂对象的调试
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  
  useDebugValue(
    { user, loading },
    state => {
      if (state.loading) return '🔄 加载中';
      return state.user ? \`👤 \${state.user.name}\` : '👻 未登录';
    }
  );
  
  return { user, loading, login, logout };
};

// 4. 性能调试
const useExpensiveCalculation = (input) => {
  const result = useMemo(() => {
    const start = performance.now();
    const value = expensiveFunction(input);
    const duration = performance.now() - start;
    
    // 调试计算性能
    useDebugValue(
      { input, result, duration },
      data => \`计算耗时: \${data.duration.toFixed(2)}ms\`
    );
    
    return value;
  }, [input]);
  
  return result;
};`}
          </pre>
        </div>
      </div>

      {/* DevTools 使用指南 */}
      <div className='hook-example'>
        <h2 className='hook-title'>React DevTools 使用指南</h2>
        <div className='space-y-4'>
          <div className='bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-6'>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4'>
              📱 实时调试信息
            </h3>
            <div className='grid md:grid-cols-3 gap-4'>
              <div className='bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700'>
                <h4 className='font-semibold text-gray-900 dark:text-gray-100 mb-2'>
                  useCounter
                </h4>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  显示: "计数器: {counter.count} (步长: 2)"
                </p>
              </div>

              <div className='bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700'>
                <h4 className='font-semibold text-gray-900 dark:text-gray-100 mb-2'>
                  useToggle
                </h4>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  显示: "{toggle.value ? '开启' : '关闭'}"
                </p>
              </div>

              <div className='bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700'>
                <h4 className='font-semibold text-gray-900 dark:text-gray-100 mb-2'>
                  useUserState
                </h4>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  显示: 当前用户状态描述
                </p>
              </div>
            </div>
          </div>

          <div className='info-message'>
            <p className='font-semibold mb-2'>🎯 调试价值:</p>
            <ul className='list-disc list-inside space-y-1 text-sm'>
              <li>快速了解自定义 Hook 的当前状态</li>
              <li>调试复杂的 Hook 组合和交互</li>
              <li>监控 Hook 的性能和行为</li>
              <li>提供团队开发时的上下文信息</li>
              <li>简化组件状态的调试过程</li>
            </ul>
          </div>
        </div>

        <div className='hook-code'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3'>
            调试策略
          </h3>
          <pre className='code-block'>
            {`// 调试信息的设计原则

// 1. 提供有意义的信息
useDebugValue(isLoading ? '加载中' : \`已加载 \${data.length} 项\`);

// 2. 包含关键状态
useDebugValue({ 
  status: loading ? 'loading' : 'idle',
  itemCount: data.length,
  lastUpdate: lastUpdateTime 
});

// 3. 性能相关的调试
useDebugValue(
  { computationTime, cacheHit },
  debug => \`计算: \${debug.computationTime}ms, 缓存: \${debug.cacheHit ? '命中' : '未命中'}\`
);

// 4. 条件调试 - 只在需要时显示
const shouldDebug = process.env.NODE_ENV === 'development';
if (shouldDebug) {
  useDebugValue(complexState, formatComplexState);
}

// 5. 嵌套 Hook 的调试
const useCompositeHook = () => {
  const auth = useAuth();
  const data = useData();
  
  useDebugValue(
    { auth: auth.isLoggedIn, dataCount: data.items.length },
    state => \`认证: \${state.auth}, 数据: \${state.dataCount} 项\`
  );
  
  return { auth, data };
};`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default UseDebugValueExample;
