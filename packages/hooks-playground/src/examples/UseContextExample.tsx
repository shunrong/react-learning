import { createContext, useContext, useState, ReactNode } from 'react';

// 1. 主题上下文
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

// 2. 用户上下文
interface User {
  id: number;
  name: string;
  role: 'admin' | 'user' | 'guest';
}

interface UserContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | null>(null);

// 3. 计数器上下文（多层嵌套示例）
interface CounterContextType {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

const CounterContext = createContext<CounterContextType | null>(null);

// 主题提供者组件
const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={theme === 'dark' ? 'dark' : ''}>{children}</div>
    </ThemeContext.Provider>
  );
};

// 用户提供者组件
const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// 计数器提供者组件
const CounterProvider = ({ children }: { children: ReactNode }) => {
  const [count, setCount] = useState(0);

  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => prev - 1);
  const reset = () => setCount(0);

  return (
    <CounterContext.Provider value={{ count, increment, decrement, reset }}>
      {children}
    </CounterContext.Provider>
  );
};

// 自定义 Hook
const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

const useCounter = () => {
  const context = useContext(CounterContext);
  if (!context) {
    throw new Error('useCounter must be used within a CounterProvider');
  }
  return context;
};

// 主题切换组件
const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className='space-y-4'>
      <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
        主题切换
      </h3>
      <div className='state-display'>
        当前主题: {theme === 'light' ? '浅色' : '深色'}
      </div>
      <button onClick={toggleTheme} className='btn-primary'>
        切换到{theme === 'light' ? '深色' : '浅色'}主题
      </button>
      <p className='text-sm text-gray-600 dark:text-gray-400'>
        主题切换会影响整个示例区域的颜色
      </p>
    </div>
  );
};

// 用户信息组件
const UserProfile = () => {
  const { user, login, logout } = useUser();

  const handleLogin = (role: 'admin' | 'user' | 'guest') => {
    const users = {
      admin: { id: 1, name: '管理员', role: 'admin' as const },
      user: { id: 2, name: '普通用户', role: 'user' as const },
      guest: { id: 3, name: '访客', role: 'guest' as const },
    };
    login(users[role]);
  };

  return (
    <div className='space-y-4'>
      <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
        用户管理
      </h3>

      {user ? (
        <div className='space-y-3'>
          <div className='state-display'>
            用户: {user.name} (ID: {user.id})
            <br />
            角色:{' '}
            {user.role === 'admin'
              ? '管理员'
              : user.role === 'user'
                ? '普通用户'
                : '访客'}
          </div>
          <button onClick={logout} className='btn-secondary'>
            退出登录
          </button>
        </div>
      ) : (
        <div className='space-y-3'>
          <div className='info-message'>当前未登录，请选择角色登录</div>
          <div className='flex space-x-2'>
            <button
              onClick={() => handleLogin('admin')}
              className='btn-primary'
            >
              管理员登录
            </button>
            <button onClick={() => handleLogin('user')} className='btn-primary'>
              用户登录
            </button>
            <button
              onClick={() => handleLogin('guest')}
              className='btn-secondary'
            >
              访客登录
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// 权限检查组件
const PermissionCheck = () => {
  const { user } = useUser();

  const getPermissions = (role: string) => {
    switch (role) {
      case 'admin':
        return ['读取', '写入', '删除', '管理用户'];
      case 'user':
        return ['读取', '写入'];
      case 'guest':
        return ['读取'];
      default:
        return [];
    }
  };

  if (!user) {
    return <div className='error-message'>请先登录以查看权限信息</div>;
  }

  const permissions = getPermissions(user.role);

  return (
    <div className='space-y-4'>
      <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
        权限检查
      </h3>
      <div className='state-display'>
        {user.name} 的权限:
        <ul className='list-disc list-inside mt-2 space-y-1'>
          {permissions.map(permission => (
            <li key={permission}>{permission}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// 深层嵌套的计数器组件
const NestedCounter = () => {
  const { count, increment, decrement, reset } = useCounter();

  return (
    <div className='space-y-4'>
      <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
        嵌套计数器
      </h3>
      <div className='state-display'>计数值: {count}</div>
      <div className='flex space-x-2'>
        <button onClick={increment} className='btn-primary'>
          +1
        </button>
        <button onClick={decrement} className='btn-secondary'>
          -1
        </button>
        <button onClick={reset} className='btn-secondary'>
          重置
        </button>
      </div>
      <p className='text-sm text-gray-600 dark:text-gray-400'>
        这个计数器的状态通过 Context 在组件树中共享
      </p>
    </div>
  );
};

// 另一个访问同一计数器的组件
const CounterDisplay = () => {
  const { count } = useCounter();

  return (
    <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4'>
      <h4 className='font-semibold text-blue-800 dark:text-blue-200 mb-2'>
        计数器显示组件
      </h4>
      <p className='text-blue-700 dark:text-blue-300'>
        从不同组件访问相同的计数值: <strong>{count}</strong>
      </p>
      <p className='text-sm text-blue-600 dark:text-blue-400 mt-2'>
        这证明了 Context 可以让多个组件共享状态
      </p>
    </div>
  );
};

// 主组件内容
const ContextDemoContent = () => {
  return (
    <div className='max-w-4xl mx-auto space-y-8'>
      {/* 页面标题 */}
      <div>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4'>
          useContext Hook
        </h1>
        <p className='text-lg text-gray-600 dark:text-gray-400'>
          useContext 让你在组件树中传递数据，避免了 props 的逐层传递。它是 React
          Context API 的 Hook 版本。
        </p>
      </div>

      {/* 基础用法 */}
      <div className='hook-example'>
        <h2 className='hook-title'>主题管理示例</h2>
        <p className='hook-description'>
          使用 Context 管理全局主题状态，任何组件都可以访问和修改主题。
        </p>

        <div className='hook-demo'>
          <ThemeToggle />
        </div>

        <div className='hook-code'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3'>
            代码示例
          </h3>
          <pre className='code-block'>
            {`// 1. 创建 Context
const ThemeContext = createContext<ThemeContextType | null>(null);

// 2. 创建 Provider 组件
const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 3. 创建自定义 Hook
const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// 4. 在组件中使用
const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      切换到{theme === 'light' ? '深色' : '浅色'}主题
    </button>
  );
};`}
          </pre>
        </div>
      </div>

      {/* 用户管理示例 */}
      <div className='hook-example'>
        <h2 className='hook-title'>用户状态管理</h2>
        <p className='hook-description'>
          使用 Context 管理用户登录状态和权限信息。
        </p>

        <div className='hook-demo'>
          <div className='grid md:grid-cols-2 gap-6'>
            <UserProfile />
            <PermissionCheck />
          </div>
        </div>

        <div className='hook-code'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3'>
            代码示例
          </h3>
          <pre className='code-block'>
            {`// 用户 Context
interface UserContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | null>(null);

// Provider 组件
const UserProvider = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  const login = (userData: User) => setUser(userData);
  const logout = () => setUser(null);
  
  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// 使用 Hook
const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};`}
          </pre>
        </div>
      </div>

      {/* 多组件共享状态 */}
      <div className='hook-example'>
        <h2 className='hook-title'>多组件状态共享</h2>
        <p className='hook-description'>
          演示如何让多个组件访问和修改同一个 Context 状态。
        </p>

        <div className='hook-demo'>
          <div className='space-y-6'>
            <NestedCounter />
            <CounterDisplay />
          </div>
        </div>

        <div className='hook-code'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3'>
            代码示例
          </h3>
          <pre className='code-block'>
            {`// 多个组件使用同一个 Context
const CounterComponent1 = () => {
  const { count, increment } = useCounter();
  return (
    <div>
      <p>计数: {count}</p>
      <button onClick={increment}>增加</button>
    </div>
  );
};

const CounterComponent2 = () => {
  const { count } = useCounter();
  return <p>另一个组件中的计数: {count}</p>;
};

// 两个组件共享同一个状态
const App = () => (
  <CounterProvider>
    <CounterComponent1 />
    <CounterComponent2 />
  </CounterProvider>
);`}
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
              <li>• 为每个 Context 创建自定义 Hook</li>
              <li>• 在自定义 Hook 中进行错误检查</li>
              <li>• 使用 TypeScript 为 Context 添加类型</li>
              <li>• 按功能拆分不同的 Context</li>
              <li>• 只有真正需要全局访问的状态才放入 Context</li>
            </ul>
          </div>

          <div>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3'>
              ❌ 避免做法
            </h3>
            <ul className='space-y-2 text-gray-600 dark:text-gray-400'>
              <li>• 将所有状态都放在一个巨大的 Context 中</li>
              <li>• 频繁更新 Context 导致不必要的重渲染</li>
              <li>• 直接使用 useContext 而不进行错误检查</li>
              <li>• 过度嵌套 Provider 组件</li>
              <li>• 将局部状态错误地提升到 Context</li>
            </ul>
          </div>
        </div>

        <div className='hook-code'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3'>
            性能优化建议
          </h3>
          <pre className='code-block'>
            {`// ❌ 避免：将不相关的状态放在一起
const AppContext = createContext({
  user: null,
  theme: 'light',
  notifications: [],
  settings: {},
  // ... 更多不相关的状态
});

// ✅ 推荐：按功能分离 Context
const UserContext = createContext(null);
const ThemeContext = createContext(null);
const NotificationContext = createContext(null);

// ✅ 推荐：使用 memo 减少重渲染
const ExpensiveComponent = memo(() => {
  const { someValue } = useContext(SomeContext);
  return <div>{someValue}</div>;
});

// ✅ 推荐：拆分 Context 的值
const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  
  // 将稳定的值和变化的值分开
  const themeValue = useMemo(() => ({ theme }), [theme]);
  const themeActions = useMemo(() => ({ setTheme }), []);
  
  return (
    <ThemeValueContext.Provider value={themeValue}>
      <ThemeActionContext.Provider value={themeActions}>
        {children}
      </ThemeActionContext.Provider>
    </ThemeValueContext.Provider>
  );
};`}
          </pre>
        </div>
      </div>
    </div>
  );
};

// 主组件 - 包装所有 Provider
const UseContextExample = () => {
  return (
    <ThemeProvider>
      <UserProvider>
        <CounterProvider>
          <ContextDemoContent />
        </CounterProvider>
      </UserProvider>
    </ThemeProvider>
  );
};

export default UseContextExample;
