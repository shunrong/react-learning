import { useState } from 'react';
import {
  Link,
  useNavigate,
  useLocation,
  useSearchParams,
} from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Navigation,
  ArrowRight,
  Code,
  Play,
  RefreshCw,
  MapPin,
  Search,
  Settings,
  User,
  ExternalLink,
} from 'lucide-react';

function BasicExample() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('navigation');

  // 演示数据
  const [userId, setUserId] = useState('123');
  const [category, setCategory] = useState('tech');

  const handleProgrammaticNavigation = () => {
    navigate(
      `/examples/nested/user/${userId}?tab=profile&category=${category}`
    );
  };

  const handleSearchParamsDemo = () => {
    setSearchParams({
      tab: 'settings',
      view: 'grid',
      sort: 'name',
    });
  };

  const currentTab = searchParams.get('tab') || 'home';
  const currentView = searchParams.get('view') || 'list';

  const codeExamples = {
    navigation: `// 声明式导航 - Link 组件
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav>
      <Link to="/">首页</Link>
      <Link to="/about">关于</Link>
      <Link to="/user/123">用户资料</Link>
      
      {/* 带查询参数 */}
      <Link to="/products?category=tech&sort=price">
        科技产品
      </Link>
      
      {/* 替换当前历史记录 */}
      <Link to="/login" replace>登录</Link>
      
      {/* 带状态传递 */}
      <Link 
        to="/profile" 
        state={{ from: location.pathname }}
      >
        个人资料
      </Link>
    </nav>
  );
}`,

    programmatic: `// 程序化导航 - useNavigate Hook
import { useNavigate } from 'react-router-dom';

function Component() {
  const navigate = useNavigate();
  
  const handleSubmit = async (data) => {
    const result = await saveData(data);
    
    if (result.success) {
      // 导航到成功页面
      navigate('/success', { 
        replace: true,
        state: { message: '保存成功!' }
      });
    }
  };
  
  const goBack = () => {
    navigate(-1); // 后退一步
  };
  
  const goForward = () => {
    navigate(1); // 前进一步
  };
  
  return (
    <div>
      <button onClick={handleSubmit}>保存</button>
      <button onClick={goBack}>返回</button>
    </div>
  );
}`,

    parameters: `// 路由参数 - useParams Hook
import { useParams, useSearchParams } from 'react-router-dom';

function UserProfile() {
  // URL: /user/123?tab=profile&category=tech
  const { userId } = useParams(); // "123"
  const [searchParams, setSearchParams] = useSearchParams();
  
  const tab = searchParams.get('tab'); // "profile"
  const category = searchParams.get('category'); // "tech"
  
  const updateTab = (newTab) => {
    setSearchParams(prev => {
      prev.set('tab', newTab);
      return prev;
    });
  };
  
  return (
    <div>
      <h1>用户 {userId} 的资料</h1>
      <p>当前标签: {tab}</p>
      <p>分类: {category}</p>
      
      <button onClick={() => updateTab('settings')}>
        切换到设置
      </button>
    </div>
  );
}`,

    hooks: `// 路由信息 - useLocation Hook
import { useLocation } from 'react-router-dom';

function Component() {
  const location = useLocation();
  
  console.log('当前路径:', location.pathname);
  console.log('查询参数:', location.search);
  console.log('Hash:', location.hash);
  console.log('状态:', location.state);
  
  // 监听路由变化
  useEffect(() => {
    console.log('路由已变化:', location.pathname);
    // 发送页面浏览统计
    analytics.pageView(location.pathname);
  }, [location]);
  
  return (
    <div>
      <p>当前页面: {location.pathname}</p>
      {location.state?.from && (
        <p>来自: {location.state.from}</p>
      )}
    </div>
  );
}`,
  };

  const tabs = [
    { id: 'navigation', label: 'Link 导航', icon: Navigation },
    { id: 'programmatic', label: '程序化导航', icon: Settings },
    { id: 'parameters', label: '参数处理', icon: Search },
    { id: 'hooks', label: '路由 Hooks', icon: Code },
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
              <div className='w-12 h-12 bg-route-100 rounded-xl flex items-center justify-center mr-4'>
                <Navigation className='w-6 h-6 text-route-600' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-gray-900'>
                  基础路由示例
                </h1>
                <p className='text-gray-600 mt-1'>
                  掌握 React Router 的核心用法
                </p>
              </div>
            </div>

            <div className='bg-route-50 border border-route-200 rounded-lg p-4'>
              <div className='flex items-center text-sm text-route-800'>
                <MapPin className='w-4 h-4 mr-2' />
                <span className='font-medium'>当前路径:</span>
                <code className='ml-2 px-2 py-1 bg-route-100 rounded text-route-900'>
                  {location.pathname}
                </code>
                {location.search && (
                  <>
                    <span className='ml-2 font-medium'>查询参数:</span>
                    <code className='ml-2 px-2 py-1 bg-route-100 rounded text-route-900'>
                      {location.search}
                    </code>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-6 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* 左侧：交互演示 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className='card'>
              <div className='card-header'>
                <h2 className='text-xl font-semibold text-gray-900'>
                  🎮 交互演示
                </h2>
                <p className='text-sm text-gray-600 mt-1'>实际体验路由功能</p>
              </div>

              <div className='card-content space-y-6'>
                {/* Link 导航演示 */}
                <div>
                  <h3 className='text-lg font-medium text-gray-900 mb-3 flex items-center'>
                    <Navigation className='w-5 h-5 mr-2 text-route-600' />
                    声明式导航
                  </h3>
                  <div className='space-y-3'>
                    <div className='grid grid-cols-2 gap-3'>
                      <Link
                        to='/examples/nested'
                        className='btn btn-outline text-sm flex items-center justify-center'
                      >
                        <ArrowRight className='w-4 h-4 mr-1' />
                        嵌套路由
                      </Link>
                      <Link
                        to='/examples/dynamic'
                        className='btn btn-outline text-sm flex items-center justify-center'
                      >
                        <ArrowRight className='w-4 h-4 mr-1' />
                        动态路由
                      </Link>
                    </div>

                    <Link
                      to={`/examples/nested/user/${userId}?tab=profile&category=${category}`}
                      className='w-full btn btn-primary text-sm flex items-center justify-center'
                    >
                      <User className='w-4 h-4 mr-2' />
                      访问用户资料 (ID: {userId})
                    </Link>
                  </div>
                </div>

                {/* 程序化导航演示 */}
                <div>
                  <h3 className='text-lg font-medium text-gray-900 mb-3 flex items-center'>
                    <Settings className='w-5 h-5 mr-2 text-route-600' />
                    程序化导航
                  </h3>
                  <div className='space-y-3'>
                    <div className='grid grid-cols-2 gap-3'>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          用户 ID
                        </label>
                        <input
                          type='text'
                          value={userId}
                          onChange={e => setUserId(e.target.value)}
                          className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm'
                          placeholder='输入用户ID'
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          分类
                        </label>
                        <select
                          value={category}
                          onChange={e => setCategory(e.target.value)}
                          className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm'
                        >
                          <option value='tech'>科技</option>
                          <option value='design'>设计</option>
                          <option value='business'>商业</option>
                        </select>
                      </div>
                    </div>

                    <button
                      onClick={handleProgrammaticNavigation}
                      className='w-full btn btn-primary text-sm flex items-center justify-center'
                    >
                      <Play className='w-4 h-4 mr-2' />
                      执行导航 (useNavigate)
                    </button>
                  </div>
                </div>

                {/* 查询参数演示 */}
                <div>
                  <h3 className='text-lg font-medium text-gray-900 mb-3 flex items-center'>
                    <Search className='w-5 h-5 mr-2 text-route-600' />
                    查询参数控制
                  </h3>
                  <div className='space-y-3'>
                    <div className='bg-gray-50 rounded-lg p-3'>
                      <div className='text-sm text-gray-600 mb-2'>
                        当前参数:
                      </div>
                      <div className='space-y-1'>
                        <div className='flex justify-between'>
                          <span className='font-medium'>tab:</span>
                          <code className='text-route-600'>{currentTab}</code>
                        </div>
                        <div className='flex justify-between'>
                          <span className='font-medium'>view:</span>
                          <code className='text-route-600'>{currentView}</code>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleSearchParamsDemo}
                      className='w-full btn btn-secondary text-sm flex items-center justify-center'
                    >
                      <RefreshCw className='w-4 h-4 mr-2' />
                      更新查询参数
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 右侧：代码示例 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className='card h-full'>
              <div className='card-header'>
                <h2 className='text-xl font-semibold text-gray-900'>
                  📝 代码示例
                </h2>
                <p className='text-sm text-gray-600 mt-1'>学习实现细节</p>
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
                          ? 'bg-route-100 text-route-700'
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
                  <pre className='p-4 text-sm text-gray-100 overflow-x-auto leading-relaxed'>
                    <code>
                      {codeExamples[activeTab as keyof typeof codeExamples]}
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 底部学习要点 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className='mt-8'
        >
          <div className='bg-gradient-to-r from-route-50 to-primary-50 rounded-2xl p-6'>
            <h3 className='text-xl font-semibold text-gray-900 mb-4'>
              💡 核心学习要点
            </h3>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <h4 className='font-medium text-gray-900 mb-2'>
                  声明式 vs 程序化
                </h4>
                <ul className='text-gray-600 text-sm space-y-1'>
                  <li>
                    • <code className='bg-gray-200 px-1 rounded'>Link</code>{' '}
                    组件用于用户主动点击的导航
                  </li>
                  <li>
                    •{' '}
                    <code className='bg-gray-200 px-1 rounded'>
                      useNavigate
                    </code>{' '}
                    用于程序逻辑触发的导航
                  </li>
                  <li>• 声明式更利于 SEO 和可访问性</li>
                  <li>• 程序化更适合表单提交、权限检查等场景</li>
                </ul>
              </div>

              <div>
                <h4 className='font-medium text-gray-900 mb-2'>
                  参数传递最佳实践
                </h4>
                <ul className='text-gray-600 text-sm space-y-1'>
                  <li>
                    • 路径参数{' '}
                    <code className='bg-gray-200 px-1 rounded'>/user/:id</code>{' '}
                    用于必须参数
                  </li>
                  <li>
                    • 查询参数{' '}
                    <code className='bg-gray-200 px-1 rounded'>
                      ?tab=profile
                    </code>{' '}
                    用于可选参数
                  </li>
                  <li>• State 传递用于临时数据，不出现在 URL 中</li>
                  <li>• 参数变化会触发组件重新渲染</li>
                </ul>
              </div>
            </div>

            <div className='mt-6 pt-4 border-t border-gray-200'>
              <div className='flex items-center justify-between'>
                <div className='text-sm text-gray-600'>
                  🎯 掌握这些基础概念后，就可以进入高级路由特性学习了
                </div>
                <Link
                  to='/examples/nested'
                  className='btn btn-primary text-sm flex items-center'
                >
                  下一步：嵌套路由
                  <ExternalLink className='w-4 h-4 ml-1' />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default BasicExample;
