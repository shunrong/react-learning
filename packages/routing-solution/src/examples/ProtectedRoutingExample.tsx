import { useState, createContext, useContext, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield,
  User,
  Lock,
  AlertCircle,
  ArrowRight,
  LogIn,
  LogOut,
  Eye,
  EyeOff,
  Code,
  Key,
  Settings,
} from 'lucide-react';

// 类型定义
type UserRole = 'guest' | 'user' | 'admin' | 'super_admin';
type Permission = 'read' | 'write' | 'delete' | 'manage_users' | 'system_admin';

interface User {
  id: string;
  username: string;
  role: UserRole;
  permissions: Permission[];
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
  hasRole: (role: UserRole) => boolean;
}

// 模拟用户数据
const mockUsers: Record<string, { password: string; user: User }> = {
  guest: {
    password: 'guest',
    user: {
      id: '1',
      username: 'guest',
      role: 'guest',
      permissions: ['read'],
      avatar: '👤',
    },
  },
  alice: {
    password: 'alice123',
    user: {
      id: '2',
      username: 'alice',
      role: 'user',
      permissions: ['read', 'write'],
      avatar: '👩‍💻',
    },
  },
  admin: {
    password: 'admin123',
    user: {
      id: '3',
      username: 'admin',
      role: 'admin',
      permissions: ['read', 'write', 'delete', 'manage_users'],
      avatar: '👨‍💼',
    },
  },
  super: {
    password: 'super123',
    user: {
      id: '4',
      username: 'super',
      role: 'super_admin',
      permissions: ['read', 'write', 'delete', 'manage_users', 'system_admin'],
      avatar: '👑',
    },
  },
};

// 认证上下文
const AuthContext = createContext<AuthContextType | null>(null);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const userData = mockUsers[username];
    if (userData && userData.password === password) {
      setUser(userData.user);
      localStorage.setItem('auth_user', JSON.stringify(userData.user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  const hasPermission = (permission: Permission): boolean => {
    return user?.permissions.includes(permission) ?? false;
  };

  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('auth_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('auth_user');
      }
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, login, logout, hasPermission, hasRole }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// 路由守卫组件

// 登录组件
function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('请输入用户名和密码');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const success = await login(username, password);
      if (success) {
        const from = (location.state as any)?.from || '/examples/protected';
        window.location.href = from;
      } else {
        setError('用户名或密码错误');
      }
    } catch {
      setError('登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (user: string) => {
    setUsername(user);
    setPassword(mockUsers[user].password);
  };

  return (
    <div className='min-h-full bg-gray-50 flex items-center justify-center py-12 px-4'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='max-w-md w-full space-y-8'
      >
        <div className='text-center'>
          <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
            <Lock className='w-8 h-8 text-blue-600' />
          </div>
          <h2 className='text-3xl font-bold text-gray-900'>登录系统</h2>
          <p className='mt-2 text-gray-600'>请选择角色体验不同的权限控制</p>
        </div>

        <div className='bg-white rounded-lg shadow p-6'>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                用户名
              </label>
              <input
                type='text'
                value={username}
                onChange={e => setUsername(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='输入用户名'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                密码
              </label>
              <div className='relative'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10'
                  placeholder='输入密码'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute inset-y-0 right-0 pr-3 flex items-center'
                >
                  {showPassword ? (
                    <EyeOff className='w-4 h-4 text-gray-400' />
                  ) : (
                    <Eye className='w-4 h-4 text-gray-400' />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className='bg-red-50 border border-red-200 rounded-md p-3'>
                <div className='flex items-center'>
                  <AlertCircle className='w-4 h-4 text-red-500 mr-2' />
                  <span className='text-sm text-red-700'>{error}</span>
                </div>
              </div>
            )}

            <button
              type='submit'
              disabled={loading}
              className='w-full btn btn-primary flex items-center justify-center'
            >
              {loading ? (
                <div className='animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2' />
              ) : (
                <LogIn className='w-4 h-4 mr-2' />
              )}
              {loading ? '登录中...' : '登录'}
            </button>
          </form>

          <div className='mt-6 pt-4 border-t border-gray-200'>
            <p className='text-sm text-gray-600 mb-3'>快速登录（演示用）：</p>
            <div className='grid grid-cols-2 gap-2'>
              {Object.entries(mockUsers).map(([key, { user }]) => (
                <button
                  key={key}
                  onClick={() => quickLogin(key)}
                  className='p-2 text-xs border border-gray-200 rounded hover:bg-gray-50 flex items-center'
                >
                  <span className='mr-1'>{user.avatar}</span>
                  <div className='text-left'>
                    <div className='font-medium'>{user.username}</div>
                    <div className='text-gray-500'>{user.role}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Dashboard 组件
function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='bg-white rounded-lg p-6'
    >
      <div className='flex items-center justify-between mb-6'>
        <div className='flex items-center space-x-4'>
          <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl'>
            {user?.avatar}
          </div>
          <div>
            <h1 className='text-xl font-bold text-gray-900'>
              欢迎，{user?.username}！
            </h1>
            <p className='text-gray-600'>角色: {user?.role}</p>
          </div>
        </div>
        <button onClick={logout} className='btn btn-outline text-sm'>
          <LogOut className='w-4 h-4 mr-1' />
          退出登录
        </button>
      </div>

      <div className='grid grid-cols-2 gap-4 mb-6'>
        <div className='bg-blue-50 rounded-lg p-4'>
          <h3 className='font-medium text-blue-900 mb-2'>当前权限</h3>
          <div className='space-y-1'>
            {user?.permissions.map(permission => (
              <span
                key={permission}
                className='inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mr-1'
              >
                {permission}
              </span>
            ))}
          </div>
        </div>
        <div className='bg-green-50 rounded-lg p-4'>
          <h3 className='font-medium text-green-900 mb-2'>访问级别</h3>
          <p className='text-green-600 text-sm'>
            {user?.role === 'super_admin'
              ? '超级管理员'
              : user?.role === 'admin'
                ? '管理员'
                : user?.role === 'user'
                  ? '普通用户'
                  : '访客'}
          </p>
        </div>
      </div>

      <div className='space-y-4'>
        <h3 className='text-lg font-medium text-gray-900'>可用功能</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <Link
            to='/examples/protected/users'
            className='p-4 border border-gray-200 rounded-lg hover:bg-gray-50'
          >
            <div className='flex items-center justify-between'>
              <div className='flex items-center'>
                <User className='w-5 h-5 text-blue-600 mr-3' />
                <span className='font-medium'>用户管理</span>
              </div>
              <ArrowRight className='w-4 h-4 text-gray-400' />
            </div>
            <p className='text-sm text-gray-600 mt-1'>需要 manage_users 权限</p>
          </Link>

          <Link
            to='/examples/protected/admin'
            className='p-4 border border-gray-200 rounded-lg hover:bg-gray-50'
          >
            <div className='flex items-center justify-between'>
              <div className='flex items-center'>
                <Settings className='w-5 h-5 text-purple-600 mr-3' />
                <span className='font-medium'>系统管理</span>
              </div>
              <ArrowRight className='w-4 h-4 text-gray-400' />
            </div>
            <p className='text-sm text-gray-600 mt-1'>需要 admin 角色</p>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// 主要示例组件
function ProtectedRoutingExample() {
  const [activeTab, setActiveTab] = useState('guards');

  const codeExamples = {
    guards: `// 路由守卫实现
function ProtectedRoute({ children, requiredPermission, requiredRole }) {
  const { user, hasPermission, hasRole } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <UnauthorizedPage />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return <ForbiddenPage />;
  }

  return <>{children}</>;
}`,

    auth: `// 认证上下文
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async (username, password) => {
    const response = await authAPI.login(username, password);
    if (response.success) {
      setUser(response.user);
      return true;
    }
    return false;
  };

  const hasPermission = (permission) => {
    return user?.permissions.includes(permission) ?? false;
  };

  return (
    <AuthContext.Provider value={{ user, login, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}`,

    routing: `// 路由配置
function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="admin">
            <AdminPanel />
          </ProtectedRoute>
        } />
      </Routes>
    </AuthProvider>
  );
}`,

    patterns: `// 最佳实践
// 高阶组件模式
function withAuth(Component, requiredPermission) {
  return function AuthenticatedComponent(props) {
    return (
      <ProtectedRoute requiredPermission={requiredPermission}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}

// 权限装饰器
function RequirePermission({ permission, children, fallback }) {
  const { hasPermission } = useAuth();
  return hasPermission(permission) ? children : fallback;
}`,
  };

  const tabs = [
    { id: 'guards', label: '路由守卫', icon: Shield },
    { id: 'auth', label: '认证上下文', icon: Key },
    { id: 'routing', label: '路由配置', icon: Settings },
    { id: 'patterns', label: '最佳实践', icon: Code },
  ];

  return (
    <AuthProvider>
      <div className='min-h-full bg-gray-50'>
        <div className='bg-white border-b border-gray-200'>
          <div className='max-w-7xl mx-auto px-6 py-8'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className='flex items-center mb-4'>
                <div className='w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mr-4'>
                  <Shield className='w-6 h-6 text-red-600' />
                </div>
                <div>
                  <h1 className='text-3xl font-bold text-gray-900'>
                    路由守卫示例
                  </h1>
                  <p className='text-gray-600 mt-1'>权限控制与认证守卫</p>
                </div>
              </div>

              <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
                <div className='flex items-center text-sm text-red-800'>
                  <Lock className='w-4 h-4 mr-2' />
                  <span className='font-medium'>安全保护:</span>
                  <span className='ml-2'>基于角色和权限的访问控制</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className='max-w-7xl mx-auto px-6 py-8'>
          <div className='grid grid-cols-1 xl:grid-cols-2 gap-8'>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className='space-y-6'
            >
              <Dashboard />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className='space-y-6'
            >
              <div className='card h-full'>
                <div className='card-header'>
                  <h2 className='text-xl font-semibold text-gray-900'>
                    🔒 守卫实现
                  </h2>
                </div>

                <div className='card-content'>
                  <div className='flex flex-wrap gap-2 mb-4'>
                    {tabs.map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center ${
                          activeTab === tab.id
                            ? 'bg-red-100 text-red-700'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                      >
                        <tab.icon className='w-4 h-4 mr-1' />
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div className='bg-gray-900 rounded-lg overflow-hidden'>
                    <div className='flex items-center justify-between px-4 py-2 bg-gray-800'>
                      <div className='flex items-center space-x-2'>
                        <div className='w-3 h-3 bg-red-500 rounded-full'></div>
                        <div className='w-3 h-3 bg-yellow-500 rounded-full'></div>
                        <div className='w-3 h-3 bg-green-500 rounded-full'></div>
                      </div>
                      <span className='text-gray-400 text-sm'>
                        {tabs.find(t => t.id === activeTab)?.label}.tsx
                      </span>
                    </div>
                    <pre className='p-4 text-sm text-gray-100 overflow-x-auto leading-relaxed max-h-96'>
                      <code>
                        {codeExamples[activeTab as keyof typeof codeExamples]}
                      </code>
                    </pre>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='mt-8'
          >
            <div className='bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6'>
              <h3 className='text-xl font-semibold text-gray-900 mb-6'>
                🛡️ 路由守卫核心要点
              </h3>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <h4 className='font-medium text-gray-900 mb-2'>认证守卫</h4>
                  <ul className='text-gray-600 text-sm space-y-1'>
                    <li>• 验证用户登录状态</li>
                    <li>• 未认证用户自动重定向</li>
                    <li>• 保存重定向前的路径</li>
                    <li>• 支持记住登录状态</li>
                  </ul>
                </div>

                <div>
                  <h4 className='font-medium text-gray-900 mb-2'>权限控制</h4>
                  <ul className='text-gray-600 text-sm space-y-1'>
                    <li>• 基于角色的访问控制</li>
                    <li>• 细粒度权限验证</li>
                    <li>• 多重权限组合检查</li>
                    <li>• 优雅的权限不足处理</li>
                  </ul>
                </div>
              </div>

              <div className='mt-6 pt-4 border-t border-gray-200'>
                <div className='flex items-center justify-between'>
                  <div className='text-sm text-gray-600'>
                    🎯 路由守卫是构建安全应用的重要基础设施
                  </div>
                  <Link
                    to='/advanced'
                    className='btn btn-primary text-sm flex items-center'
                  >
                    查看高级路由
                    <ArrowRight className='w-4 h-4 ml-1' />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AuthProvider>
  );
}

export function LoginPage() {
  return (
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  );
}

export default ProtectedRoutingExample;
