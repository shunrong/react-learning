import { useState, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Zap,
  Clock,
  Download,
  Code,
  Activity,
  ArrowRight,
  CheckCircle,
  Layers,
  Globe,
  Cpu,
  BarChart3,
} from 'lucide-react';

// 懒加载组件示例
const HeavyDashboard = lazy(
  () =>
    new Promise<{ default: React.ComponentType }>(resolve => {
      setTimeout(() => {
        resolve({
          default: () => (
            <div className='bg-white rounded-lg p-6'>
              <h2 className='text-xl font-semibold text-gray-900 mb-4'>
                仪表盘模块
              </h2>
              <p className='text-gray-600'>这是一个模拟的重型仪表盘组件</p>
            </div>
          ),
        });
      }, 1000);
    })
);

const DataVisualization = lazy(
  () =>
    new Promise<{ default: React.ComponentType }>(resolve => {
      setTimeout(() => {
        resolve({
          default: () => (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className='bg-white rounded-lg p-6'
            >
              <h2 className='text-xl font-semibold text-gray-900 mb-4 flex items-center'>
                <BarChart3 className='w-5 h-5 mr-2 text-blue-600' />
                数据可视化模块
              </h2>
              <div className='grid grid-cols-2 gap-4'>
                <div className='bg-blue-50 rounded-lg p-4'>
                  <h3 className='font-medium text-blue-900 mb-2'>图表组件</h3>
                  <div className='w-full h-20 bg-blue-200 rounded flex items-center justify-center'>
                    📊 模拟图表
                  </div>
                </div>
                <div className='bg-green-50 rounded-lg p-4'>
                  <h3 className='font-medium text-green-900 mb-2'>数据表格</h3>
                  <div className='w-full h-20 bg-green-200 rounded flex items-center justify-center'>
                    📋 模拟表格
                  </div>
                </div>
              </div>
              <p className='text-gray-600 mt-4'>
                这个组件模拟了一个复杂的数据可视化模块，包含了大量的图表库和数据处理逻辑。
                通过懒加载，只有在用户真正需要时才会下载和执行。
              </p>
            </motion.div>
          ),
        });
      }, 2000); // 模拟2秒加载时间
    })
);

const UserManagement = lazy(
  () =>
    new Promise<{ default: React.ComponentType }>(resolve => {
      setTimeout(() => {
        resolve({
          default: () => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className='bg-white rounded-lg p-6'
            >
              <h2 className='text-xl font-semibold text-gray-900 mb-4 flex items-center'>
                <Layers className='w-5 h-5 mr-2 text-purple-600' />
                用户管理系统
              </h2>
              <div className='space-y-4'>
                {[
                  { name: 'Alice Johnson', role: 'Admin', status: 'active' },
                  { name: 'Bob Smith', role: 'User', status: 'active' },
                  {
                    name: 'Carol Williams',
                    role: 'Editor',
                    status: 'inactive',
                  },
                ].map((user, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between p-3 border border-gray-200 rounded-lg'
                  >
                    <div>
                      <h3 className='font-medium text-gray-900'>{user.name}</h3>
                      <p className='text-sm text-gray-600'>{user.role}</p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        user.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {user.status}
                    </span>
                  </div>
                ))}
              </div>
              <p className='text-gray-600 mt-4'>
                用户管理模块包含复杂的权限控制、批量操作等功能，是一个相对独立的大型模块。
              </p>
            </motion.div>
          ),
        });
      }, 1500);
    })
);

// 加载指示器组件
function LoadingSpinner({ message = '正在加载...' }: { message?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className='flex flex-col items-center justify-center py-12'
    >
      <div className='animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mb-4'></div>
      <p className='text-gray-600'>{message}</p>
      <div className='flex items-center mt-2 text-sm text-gray-500'>
        <Download className='w-4 h-4 mr-1' />
        模拟下载组件中...
      </div>
    </motion.div>
  );
}

// 错误边界组件
function LazyErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<LoadingSpinner message='加载组件中，请稍候...' />}>
      {children}
    </Suspense>
  );
}

function LazyRoutingExample() {
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  const [loadingStats, setLoadingStats] = useState({
    dashboard: { loaded: false, loadTime: 0 },
    visualization: { loaded: false, loadTime: 0 },
    management: { loaded: false, loadTime: 0 },
  });

  const handleDemoLoad = (demo: string) => {
    if (activeDemo === demo) return;

    setActiveDemo(demo);
    const startTime = Date.now();

    // 模拟记录加载时间
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setLoadingStats(prev => ({
        ...prev,
        [demo]: { loaded: false, loadTime: elapsed },
      }));
    }, 100);

    // 模拟加载完成
    setTimeout(
      () => {
        clearInterval(interval);
        const totalTime = Date.now() - startTime;
        setLoadingStats(prev => ({
          ...prev,
          [demo]: { loaded: true, loadTime: totalTime },
        }));
      },
      demo === 'visualization' ? 2000 : demo === 'management' ? 1500 : 1000
    );
  };

  const codeExamples = {
    basic: `// 基础懒加载
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// 懒加载组件
const Dashboard = lazy(() => import('./Dashboard'));
const UserManagement = lazy(() => import('./UserManagement'));

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route 
        path="/dashboard" 
        element={
          <Suspense fallback={<div>Loading...</div>}>
            <Dashboard />
          </Suspense>
        } 
      />
      <Route 
        path="/users" 
        element={
          <Suspense fallback={<LoadingSpinner />}>
            <UserManagement />
          </Suspense>
        } 
      />
    </Routes>
  );
}`,

    advanced: `// 高级懒加载配置
import { lazy, Suspense } from 'react';

// 带错误处理的懒加载
const DataVisualization = lazy(() => 
  import('./DataVisualization')
    .catch(() => ({
      default: () => <ErrorFallback message="组件加载失败" />
    }))
);

// 带延迟和重试的懒加载
const HeavyComponent = lazy(() => 
  new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      import('./HeavyComponent')
        .then(resolve)
        .catch(reject);
    }, 1000); // 1秒后开始加载
  })
);

// 预加载策略
const preloadComponent = () => {
  const componentImport = () => import('./UserManagement');
  
  // 鼠标悬停时预加载
  const link = document.querySelector('[data-preload="users"]');
  link?.addEventListener('mouseenter', componentImport);
  
  // 或在空闲时预加载
  if ('requestIdleCallback' in window) {
    requestIdleCallback(componentImport);
  }
};`,

    optimization: `// 性能优化策略
import { lazy, Suspense, memo } from 'react';

// 组件级别的代码分割
const UserProfile = lazy(() => 
  import('./UserProfile').then(module => ({
    default: memo(module.default) // 添加 memo 优化
  }))
);

// 基于路由的分割
const adminRoutes = lazy(() => import('./routes/AdminRoutes'));
const userRoutes = lazy(() => import('./routes/UserRoutes'));

// Webpack 魔法注释
const Dashboard = lazy(() => 
  import(
    /* webpackChunkName: "dashboard" */
    /* webpackPreload: true */
    './Dashboard'
  )
);

const Analytics = lazy(() => 
  import(
    /* webpackChunkName: "analytics" */
    /* webpackPrefetch: true */
    './Analytics'
  )
);

// 错误边界 + 加载状态
function LazyRoute({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary fallback={<ErrorPage />}>
      <Suspense fallback={<SkeletonLoader />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}`,

    bundle: `// 包分析和优化
// package.json 脚本
{
  "scripts": {
    "analyze": "npm run build && npx webpack-bundle-analyzer build/static/js/*.js"
  }
}

// Vite 配置
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // 第三方库单独打包
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['framer-motion', 'lucide-react'],
          
          // 功能模块分组
          admin: ['./src/admin/index.ts'],
          charts: ['./src/charts/index.ts']
        }
      }
    }
  }
}

// 动态导入最佳实践
const loadFeature = async (featureName: string) => {
  try {
    const module = await import(\`./features/\${featureName}\`);
    return module.default;
  } catch (error) {
    console.error(\`Failed to load \${featureName}\`, error);
    return null;
  }
};`,
  };

  const [activeTab, setActiveTab] = useState('basic');
  const tabs = [
    { id: 'basic', label: '基础用法', icon: Code },
    { id: 'advanced', label: '高级配置', icon: Zap },
    { id: 'optimization', label: '性能优化', icon: Activity },
    { id: 'bundle', label: '包分析', icon: Globe },
  ];

  const features = [
    {
      title: '代码分割',
      description: '按需加载，减少初始包大小',
      icon: Layers,
      benefits: ['首屏加载更快', '带宽使用更少', '缓存策略更灵活'],
    },
    {
      title: '用户体验',
      description: '渐进式加载，优雅的等待状态',
      icon: Clock,
      benefits: ['平滑的加载动画', '智能预加载', '错误状态处理'],
    },
    {
      title: '性能监控',
      description: '实时监控加载性能和成功率',
      icon: Activity,
      benefits: ['加载时间统计', '失败率监控', '用户行为分析'],
    },
  ];

  return (
    <div className='min-h-full bg-gray-50'>
      {/* 头部 */}
      <div className='bg-white border-b border-gray-200'>
        <div className='max-w-7xl mx-auto px-6 py-8'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className='flex items-center mb-4'>
              <div className='w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4'>
                <Zap className='w-6 h-6 text-green-600' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-gray-900'>
                  懒加载路由示例
                </h1>
                <p className='text-gray-600 mt-1'>按需加载提升应用性能</p>
              </div>
            </div>

            <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
              <div className='flex items-center text-sm text-green-800'>
                <Download className='w-4 h-4 mr-2' />
                <span className='font-medium'>性能优化:</span>
                <span className='ml-2'>只加载用户真正需要的代码模块</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-6 py-8'>
        <div className='grid grid-cols-1 xl:grid-cols-2 gap-8'>
          {/* 左侧：功能演示 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className='space-y-6'
          >
            {/* 懒加载演示 */}
            <div className='card'>
              <div className='card-header'>
                <h2 className='text-xl font-semibold text-gray-900'>
                  🚀 懒加载演示
                </h2>
                <p className='text-sm text-gray-600 mt-1'>
                  点击按钮体验动态加载
                </p>
              </div>

              <div className='card-content space-y-4'>
                <div className='grid grid-cols-1 gap-3'>
                  <button
                    onClick={() => handleDemoLoad('dashboard')}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      activeDemo === 'dashboard'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center'>
                        <Cpu className='w-5 h-5 mr-2 text-blue-600' />
                        <span className='font-medium'>仪表盘模块</span>
                      </div>
                      {loadingStats.dashboard.loaded && (
                        <span className='text-sm text-green-600 flex items-center'>
                          <CheckCircle className='w-4 h-4 mr-1' />
                          {loadingStats.dashboard.loadTime}ms
                        </span>
                      )}
                    </div>
                    <p className='text-sm text-gray-600 mt-1'>
                      复杂的数据看板组件
                    </p>
                  </button>

                  <button
                    onClick={() => handleDemoLoad('visualization')}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      activeDemo === 'visualization'
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center'>
                        <BarChart3 className='w-5 h-5 mr-2 text-purple-600' />
                        <span className='font-medium'>数据可视化</span>
                      </div>
                      {loadingStats.visualization.loaded && (
                        <span className='text-sm text-green-600 flex items-center'>
                          <CheckCircle className='w-4 h-4 mr-1' />
                          {loadingStats.visualization.loadTime}ms
                        </span>
                      )}
                    </div>
                    <p className='text-sm text-gray-600 mt-1'>
                      大型图表库和数据处理 (2s 加载)
                    </p>
                  </button>

                  <button
                    onClick={() => handleDemoLoad('management')}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      activeDemo === 'management'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center'>
                        <Layers className='w-5 h-5 mr-2 text-green-600' />
                        <span className='font-medium'>用户管理</span>
                      </div>
                      {loadingStats.management.loaded && (
                        <span className='text-sm text-green-600 flex items-center'>
                          <CheckCircle className='w-4 h-4 mr-1' />
                          {loadingStats.management.loadTime}ms
                        </span>
                      )}
                    </div>
                    <p className='text-sm text-gray-600 mt-1'>
                      用户权限和管理功能 (1.5s 加载)
                    </p>
                  </button>
                </div>

                {activeDemo && (
                  <div className='mt-6 border-t pt-4'>
                    <LazyErrorBoundary>
                      {activeDemo === 'dashboard' && <HeavyDashboard />}
                      {activeDemo === 'visualization' && <DataVisualization />}
                      {activeDemo === 'management' && <UserManagement />}
                    </LazyErrorBoundary>
                  </div>
                )}
              </div>
            </div>

            {/* 性能统计 */}
            <div className='card'>
              <div className='card-header'>
                <h3 className='text-lg font-semibold text-gray-900'>
                  📊 加载性能
                </h3>
              </div>
              <div className='card-content'>
                <div className='space-y-3'>
                  {Object.entries(loadingStats).map(([key, stats]) => (
                    <div
                      key={key}
                      className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'
                    >
                      <span className='font-medium capitalize'>{key}</span>
                      <div className='flex items-center'>
                        {stats.loaded ? (
                          <span className='text-green-600 text-sm flex items-center'>
                            <CheckCircle className='w-4 h-4 mr-1' />
                            {stats.loadTime}ms
                          </span>
                        ) : stats.loadTime > 0 ? (
                          <span className='text-blue-600 text-sm'>
                            加载中... {stats.loadTime}ms
                          </span>
                        ) : (
                          <span className='text-gray-400 text-sm'>未加载</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* 右侧：代码示例 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className='space-y-6'
          >
            <div className='card h-full'>
              <div className='card-header'>
                <h2 className='text-xl font-semibold text-gray-900'>
                  📝 代码实现
                </h2>
              </div>

              <div className='card-content'>
                {/* 标签切换 */}
                <div className='flex flex-wrap gap-2 mb-4'>
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center ${
                        activeTab === tab.id
                          ? 'bg-green-100 text-green-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <tab.icon className='w-4 h-4 mr-1' />
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* 代码显示 */}
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

        {/* 底部功能特性 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className='mt-8'
        >
          <div className='bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6'>
            <h3 className='text-xl font-semibold text-gray-900 mb-6'>
              ⚡ 懒加载的核心优势
            </h3>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                  className='bg-white rounded-lg p-6'
                >
                  <div className='flex items-center mb-4'>
                    <div className='w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3'>
                      <feature.icon className='w-5 h-5 text-green-600' />
                    </div>
                    <div>
                      <h4 className='font-semibold text-gray-900'>
                        {feature.title}
                      </h4>
                      <p className='text-sm text-gray-600'>
                        {feature.description}
                      </p>
                    </div>
                  </div>
                  <ul className='space-y-1'>
                    {feature.benefits.map((benefit, idx) => (
                      <li
                        key={idx}
                        className='text-sm text-gray-600 flex items-center'
                      >
                        <CheckCircle className='w-3 h-3 text-green-500 mr-2' />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            <div className='mt-6 pt-4 border-t border-gray-200'>
              <div className='flex items-center justify-between'>
                <div className='text-sm text-gray-600'>
                  🎯 合理使用懒加载可显著提升大型应用的用户体验
                </div>
                <Link
                  to='/examples/protected'
                  className='btn btn-primary text-sm flex items-center'
                >
                  下一步：路由守卫
                  <ArrowRight className='w-4 h-4 ml-1' />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default LazyRoutingExample;
