import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Puzzle,
  Code,
  Settings,
  Shield,
  Layers,
  Zap,
  CheckCircle,
  ArrowRight,
  ExternalLink,
  BookOpen,
  Target,
  Globe,
} from 'lucide-react';

function RoutePatterns() {
  const patterns = [
    {
      title: '路由守卫模式',
      category: 'Security',
      description: '保护路由不被未授权访问',
      icon: Shield,
      color: 'red',
      examples: [
        {
          name: '高阶组件守卫',
          code: `function withAuth(Component, requiredRole) {
  return function AuthGuard(props) {
    const { user, hasRole } = useAuth();
    
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    
    if (requiredRole && !hasRole(requiredRole)) {
      return <Unauthorized />;
    }
    
    return <Component {...props} />;
  };
}

// 使用方式
const ProtectedDashboard = withAuth(Dashboard, 'admin');`,
        },
        {
          name: '组件级守卫',
          code: `function ProtectedRoute({ 
  children, 
  requiredPermission,
  fallback = <Unauthorized />
}) {
  const { user, hasPermission } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return fallback;
  }
  
  return children;
}

// 路由配置
<Route path="/admin" element={
  <ProtectedRoute requiredPermission="admin">
    <AdminPanel />
  </ProtectedRoute>
} />`,
        },
      ],
    },
    {
      title: '懒加载模式',
      category: 'Performance',
      description: '按需加载路由组件，优化性能',
      icon: Zap,
      color: 'green',
      examples: [
        {
          name: '基础懒加载',
          code: `import { lazy, Suspense } from 'react';

// 懒加载组件
const Dashboard = lazy(() => import('./Dashboard'));
const UserManagement = lazy(() => import('./UserManagement'));

function App() {
  return (
    <Routes>
      <Route 
        path="/dashboard" 
        element={
          <Suspense fallback={<Loading />}>
            <Dashboard />
          </Suspense>
        } 
      />
    </Routes>
  );
}`,
        },
        {
          name: '错误边界懒加载',
          code: `const AsyncComponent = lazy(() => 
  import('./Component')
    .catch(() => ({
      default: () => <ErrorFallback message="组件加载失败" />
    }))
);

function LazyWrapper({ children }) {
  return (
    <ErrorBoundary fallback={<ErrorPage />}>
      <Suspense fallback={<LoadingSpinner />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}`,
        },
      ],
    },
    {
      title: '嵌套路由模式',
      category: 'Structure',
      description: '构建层次化的路由结构',
      icon: Layers,
      color: 'indigo',
      examples: [
        {
          name: '布局嵌套',
          code: `function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        
        <Route path="dashboard" element={<DashboardLayout />}>
          <Route index element={<Overview />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>
    </Routes>
  );
}

function Layout() {
  return (
    <div>
      <Header />
      <main>
        <Outlet /> {/* 子路由渲染位置 */}
      </main>
      <Footer />
    </div>
  );
}`,
        },
        {
          name: '动态嵌套',
          code: `function UserProfile() {
  const { userId } = useParams();
  
  return (
    <div>
      <UserHeader userId={userId} />
      <div className="content">
        <Routes>
          <Route index element={<Navigate to="info" replace />} />
          <Route path="info" element={<UserInfo />} />
          <Route path="posts" element={<UserPosts />} />
          <Route path="settings" element={<UserSettings />} />
        </Routes>
      </div>
    </div>
  );
}`,
        },
      ],
    },
    {
      title: '模态路由模式',
      category: 'UI/UX',
      description: 'URL 驱动的模态窗口管理',
      icon: Settings,
      color: 'purple',
      examples: [
        {
          name: '背景路由模式',
          code: `function App() {
  const location = useLocation();
  const background = location.state?.background;
  
  return (
    <>
      {/* 主要路由 */}
      <Routes location={background || location}>
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/users" element={<UserList />} />
      </Routes>
      
      {/* 模态路由 */}
      {background && (
        <Routes>
          <Route path="/gallery/:id" element={<ImageModal />} />
          <Route path="/users/:id" element={<UserModal />} />
        </Routes>
      )}
    </>
  );
}`,
        },
        {
          name: '模态管理',
          code: `function useModalRouter() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const openModal = (path, component) => {
    navigate(path, {
      state: { 
        background: location,
        modal: component 
      }
    });
  };
  
  const closeModal = () => {
    navigate(-1);
  };
  
  return { openModal, closeModal };
}`,
        },
      ],
    },
    {
      title: '动态路由模式',
      category: 'Flexibility',
      description: '运行时动态生成和管理路由',
      icon: Globe,
      color: 'blue',
      examples: [
        {
          name: '配置驱动路由',
          code: `const routeConfig = [
  {
    path: "/dashboard",
    component: "Dashboard",
    children: [
      { path: "analytics", component: "Analytics" },
      { path: "reports", component: "Reports" }
    ]
  }
];

function DynamicRoutes({ config }) {
  return (
    <Routes>
      {config.map(route => (
        <Route 
          key={route.path}
          path={route.path}
          element={<LazyComponent name={route.component} />}
        >
          {route.children?.map(child => (
            <Route 
              key={child.path}
              path={child.path}
              element={<LazyComponent name={child.component} />}
            />
          ))}
        </Route>
      ))}
    </Routes>
  );
}`,
        },
        {
          name: '权限驱动路由',
          code: `function usePermissionRoutes() {
  const { user } = useAuth();
  
  const routes = useMemo(() => {
    const allRoutes = [
      { path: "/dashboard", component: Dashboard, permission: "read" },
      { path: "/admin", component: Admin, permission: "admin" },
      { path: "/super", component: Super, permission: "super_admin" }
    ];
    
    return allRoutes.filter(route => 
      user?.permissions?.includes(route.permission)
    );
  }, [user]);
  
  return routes;
}`,
        },
      ],
    },
  ];

  const antiPatterns = [
    {
      title: '深层嵌套',
      description: '避免超过 3-4 层的路由嵌套',
      problem: '/app/dashboard/analytics/reports/details/settings',
      solution: '/analytics/reports/:id/settings',
    },
    {
      title: '状态依赖路由',
      description: '路由不应该依赖组件内部状态',
      problem: 'URL 不反映实际的应用状态',
      solution: '将重要状态提升到 URL 参数中',
    },
    {
      title: '硬编码路径',
      description: '避免在组件中硬编码路由路径',
      problem: 'navigate("/dashboard/settings")',
      solution: 'navigate(routes.dashboard.settings)',
    },
  ];

  const checklist = [
    {
      category: '设计原则',
      items: ['路由层级清晰', 'URL 语义化', '状态可恢复', '用户友好'],
    },
    {
      category: '性能优化',
      items: ['懒加载实现', '预加载策略', '缓存机制', '错误边界'],
    },
    {
      category: '安全考虑',
      items: ['权限验证', '参数校验', '防 CSRF', '敏感信息保护'],
    },
    {
      category: '用户体验',
      items: ['加载状态', '错误处理', '动画过渡', '无障碍访问'],
    },
  ];

  return (
    <div className='min-h-full bg-gray-50'>
      {/* 头部 */}
      <div className='bg-gradient-to-r from-indigo-600 to-purple-600 text-white'>
        <div className='max-w-7xl mx-auto px-6 py-16'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className='flex items-center mb-4'>
              <Puzzle className='w-8 h-8 mr-3' />
              <h1 className='text-3xl md:text-4xl font-bold'>路由设计模式</h1>
            </div>
            <p className='text-xl text-indigo-100 max-w-3xl'>
              掌握常见的路由设计模式和最佳实践，构建可维护、可扩展的路由架构
            </p>
          </motion.div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-6 py-12'>
        {/* 设计模式 */}
        <section className='mb-16'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className='text-2xl font-bold text-gray-900 mb-8 flex items-center'>
              <Code className='w-6 h-6 mr-2 text-indigo-600' />
              核心设计模式
            </h2>

            <div className='space-y-12'>
              {patterns.map((pattern, index) => (
                <motion.div
                  key={pattern.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  className='card'
                >
                  <div className='card-header'>
                    <div className='flex items-center justify-between mb-4'>
                      <div className='flex items-center'>
                        <div
                          className={`w-10 h-10 bg-${pattern.color}-100 rounded-lg flex items-center justify-center mr-3`}
                        >
                          <pattern.icon
                            className={`w-5 h-5 text-${pattern.color}-600`}
                          />
                        </div>
                        <div>
                          <h3 className='text-xl font-semibold text-gray-900'>
                            {pattern.title}
                          </h3>
                          <p className='text-gray-600'>{pattern.description}</p>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 bg-${pattern.color}-100 text-${pattern.color}-700 rounded text-xs font-medium`}
                      >
                        {pattern.category}
                      </span>
                    </div>
                  </div>

                  <div className='card-content'>
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                      {pattern.examples.map((example, idx) => (
                        <div key={idx} className='space-y-3'>
                          <h4 className='font-medium text-gray-900'>
                            {example.name}
                          </h4>
                          <div className='bg-gray-900 rounded-lg overflow-hidden'>
                            <div className='px-4 py-2 bg-gray-800 text-gray-400 text-sm'>
                              {example.name}.tsx
                            </div>
                            <pre className='p-4 text-sm text-gray-100 overflow-x-auto leading-relaxed'>
                              <code>{example.code}</code>
                            </pre>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* 反模式 */}
        <section className='mb-16'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className='text-2xl font-bold text-gray-900 mb-8 flex items-center'>
              <Target className='w-6 h-6 mr-2 text-red-600' />
              常见反模式
            </h2>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              {antiPatterns.map((antiPattern, index) => (
                <motion.div
                  key={antiPattern.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                  className='card border-l-4 border-l-red-500'
                >
                  <div className='card-header'>
                    <h3 className='text-lg font-semibold text-gray-900'>
                      {antiPattern.title}
                    </h3>
                    <p className='text-gray-600 text-sm mt-1'>
                      {antiPattern.description}
                    </p>
                  </div>

                  <div className='card-content space-y-3'>
                    <div>
                      <h4 className='text-sm font-medium text-red-700 mb-1'>
                        ❌ 问题
                      </h4>
                      <p className='text-sm text-gray-600 bg-red-50 p-2 rounded'>
                        {antiPattern.problem}
                      </p>
                    </div>
                    <div>
                      <h4 className='text-sm font-medium text-green-700 mb-1'>
                        ✅ 解决方案
                      </h4>
                      <p className='text-sm text-gray-600 bg-green-50 p-2 rounded'>
                        {antiPattern.solution}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* 设计检查清单 */}
        <section className='mb-16'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h2 className='text-2xl font-bold text-gray-900 mb-8 flex items-center'>
              <CheckCircle className='w-6 h-6 mr-2 text-green-600' />
              设计检查清单
            </h2>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
              {checklist.map((section, index) => (
                <motion.div
                  key={section.category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
                  className='card'
                >
                  <div className='card-header'>
                    <h3 className='text-lg font-semibold text-gray-900'>
                      {section.category}
                    </h3>
                  </div>

                  <div className='card-content'>
                    <ul className='space-y-2'>
                      {section.items.map((item, idx) => (
                        <li
                          key={idx}
                          className='flex items-center text-sm text-gray-600'
                        >
                          <CheckCircle className='w-4 h-4 text-green-500 mr-2 flex-shrink-0' />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* 实践建议 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className='bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8'
        >
          <div className='text-center mb-6'>
            <BookOpen className='w-12 h-12 text-indigo-600 mx-auto mb-4' />
            <h3 className='text-2xl font-bold text-gray-900 mb-2'>
              应用设计模式
            </h3>
            <p className='text-gray-600'>
              将这些模式应用到你的项目中，构建更好的路由架构
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <Link
              to='/examples/protected'
              className='card hover:shadow-lg transition-all transform hover:scale-105'
            >
              <div className='card-content text-center'>
                <Shield className='w-8 h-8 text-red-600 mx-auto mb-3' />
                <h4 className='font-semibold text-gray-900 mb-2'>路由守卫</h4>
                <p className='text-sm text-gray-600 mb-3'>实践安全模式</p>
                <div className='flex items-center justify-center text-red-600 text-sm font-medium'>
                  查看示例
                  <ArrowRight className='w-4 h-4 ml-1' />
                </div>
              </div>
            </Link>

            <Link
              to='/examples/lazy'
              className='card hover:shadow-lg transition-all transform hover:scale-105'
            >
              <div className='card-content text-center'>
                <Zap className='w-8 h-8 text-green-600 mx-auto mb-3' />
                <h4 className='font-semibold text-gray-900 mb-2'>懒加载</h4>
                <p className='text-sm text-gray-600 mb-3'>性能优化模式</p>
                <div className='flex items-center justify-center text-green-600 text-sm font-medium'>
                  学习实现
                  <ArrowRight className='w-4 h-4 ml-1' />
                </div>
              </div>
            </Link>

            <Link
              to='/examples/nested'
              className='card hover:shadow-lg transition-all transform hover:scale-105'
            >
              <div className='card-content text-center'>
                <Layers className='w-8 h-8 text-indigo-600 mx-auto mb-3' />
                <h4 className='font-semibold text-gray-900 mb-2'>嵌套路由</h4>
                <p className='text-sm text-gray-600 mb-3'>结构化模式</p>
                <div className='flex items-center justify-center text-indigo-600 text-sm font-medium'>
                  深入了解
                  <ArrowRight className='w-4 h-4 ml-1' />
                </div>
              </div>
            </Link>
          </div>

          <div className='mt-6 text-center'>
            <a
              href='https://patterns.dev/posts/client-side-routing'
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium'
            >
              了解更多路由模式
              <ExternalLink className='w-4 h-4 ml-1' />
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default RoutePatterns;
