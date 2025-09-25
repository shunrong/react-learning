import { useState } from 'react';
import { Routes, Route, Link, useParams, useLocation, Outlet, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layers, 
  User, 
  Settings, 
  BarChart3, 
  Mail, 
  Bell,
  Shield,
  Code,
  ArrowLeft,
  ExternalLink,
  Users,
  MessageSquare,
  Calendar,
  FileText
} from 'lucide-react';

// 模拟用户数据
const users = {
  '123': { id: '123', name: 'Alice Johnson', role: 'Admin', email: 'alice@example.com', avatar: '👩‍💻' },
  '456': { id: '456', name: 'Bob Smith', role: 'Developer', email: 'bob@example.com', avatar: '👨‍💼' },
  '789': { id: '789', name: 'Carol Williams', role: 'Designer', email: 'carol@example.com', avatar: '👩‍🎨' }
};

// 用户资料组件
function UserProfile() {
  const { userId } = useParams();
  const user = users[userId];
  
  if (!user) {
    return (
      <div className='text-center py-8'>
        <User className='w-16 h-16 text-gray-400 mx-auto mb-4' />
        <p className='text-gray-600'>用户不存在</p>
      </div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className='bg-white rounded-lg p-6'
    >
      <div className='flex items-center space-x-4 mb-6'>
        <div className='w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl'>
          {user.avatar}
        </div>
        <div>
          <h2 className='text-2xl font-bold text-gray-900'>{user.name}</h2>
          <p className='text-gray-600'>{user.role}</p>
          <p className='text-sm text-gray-500'>{user.email}</p>
        </div>
      </div>
      
      <div className='grid grid-cols-2 gap-4'>
        <div className='bg-blue-50 rounded-lg p-4'>
          <h3 className='font-medium text-blue-900 mb-2'>项目数量</h3>
          <p className='text-2xl font-bold text-blue-600'>12</p>
        </div>
        <div className='bg-green-50 rounded-lg p-4'>
          <h3 className='font-medium text-green-900 mb-2'>完成任务</h3>
          <p className='text-2xl font-bold text-green-600'>89</p>
        </div>
      </div>
    </motion.div>
  );
}

// 用户设置组件
function UserSettings() {
  const { userId } = useParams();
  const user = users[userId];
  
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className='bg-white rounded-lg p-6'
    >
      <h2 className='text-xl font-semibold text-gray-900 mb-6 flex items-center'>
        <Settings className='w-5 h-5 mr-2' />
        {user?.name} 的设置
      </h2>
      
      <div className='space-y-6'>
        <div>
          <h3 className='text-lg font-medium text-gray-900 mb-4'>通知设置</h3>
          <div className='space-y-3'>
            <label className='flex items-center justify-between'>
              <span className='text-gray-700'>推送通知</span>
              <input
                type='checkbox'
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className='rounded border-gray-300'
              />
            </label>
            <label className='flex items-center justify-between'>
              <span className='text-gray-700'>邮件更新</span>
              <input
                type='checkbox'
                checked={emailUpdates}
                onChange={(e) => setEmailUpdates(e.target.checked)}
                className='rounded border-gray-300'
              />
            </label>
          </div>
        </div>
        
        <div>
          <h3 className='text-lg font-medium text-gray-900 mb-4'>账户安全</h3>
          <div className='space-y-3'>
            <button className='w-full btn btn-outline text-left justify-start'>
              <Shield className='w-4 h-4 mr-2' />
              更改密码
            </button>
            <button className='w-full btn btn-outline text-left justify-start'>
              <Users className='w-4 h-4 mr-2' />
              双因素认证
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// 用户分析组件
function UserAnalytics() {
  const { userId } = useParams();
  
  const stats = [
    { label: '页面浏览', value: '2,847', trend: '+12%' },
    { label: '活动时间', value: '45.2h', trend: '+8%' },
    { label: '完成率', value: '94.2%', trend: '+5%' },
    { label: '评分', value: '4.8/5', trend: '0%' }
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className='bg-white rounded-lg p-6'
    >
      <h2 className='text-xl font-semibold text-gray-900 mb-6 flex items-center'>
        <BarChart3 className='w-5 h-5 mr-2' />
        数据分析
      </h2>
      
      <div className='grid grid-cols-2 gap-4 mb-6'>
        {stats.map((stat, index) => (
          <div key={index} className='bg-gray-50 rounded-lg p-4'>
            <h3 className='text-sm font-medium text-gray-600 mb-1'>{stat.label}</h3>
            <div className='flex items-center justify-between'>
              <span className='text-2xl font-bold text-gray-900'>{stat.value}</span>
              <span className={`text-sm ${
                stat.trend.startsWith('+') ? 'text-green-600' : 'text-gray-500'
              }`}>
                {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <div className='bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4'>
        <div className='w-full h-32 bg-gradient-to-r from-blue-200 to-purple-200 rounded opacity-50 flex items-center justify-center'>
          <span className='text-gray-600'>📊 图表占位符</span>
        </div>
      </div>
    </motion.div>
  );
}

// 用户消息组件
function UserMessages() {
  const messages = [
    { id: 1, from: 'System', content: '欢迎使用我们的平台！', time: '2小时前', unread: true },
    { id: 2, from: 'Alice', content: '项目进展如何？', time: '1天前', unread: false },
    { id: 3, from: 'Support', content: '您的问题已解决', time: '3天前', unread: false }
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className='bg-white rounded-lg p-6'
    >
      <h2 className='text-xl font-semibold text-gray-900 mb-6 flex items-center'>
        <MessageSquare className='w-5 h-5 mr-2' />
        消息中心
      </h2>
      
      <div className='space-y-3'>
        {messages.map((message) => (
          <div key={message.id} className={`p-4 rounded-lg border ${
            message.unread ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
          }`}>
            <div className='flex items-center justify-between mb-2'>
              <span className='font-medium text-gray-900'>{message.from}</span>
              <span className='text-sm text-gray-500'>{message.time}</span>
            </div>
            <p className='text-gray-700'>{message.content}</p>
            {message.unread && (
              <div className='w-2 h-2 bg-blue-500 rounded-full mt-2'></div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// 主用户详情页面（包含嵌套路由）
function UserDetailPage() {
  const { userId } = useParams();
  const location = useLocation();
  const user = users[userId];
  
  if (!user) {
    return <Navigate to='/examples/nested' replace />;
  }
  
  const tabs = [
    { id: 'profile', label: '个人资料', icon: User, path: 'profile' },
    { id: 'settings', label: '设置', icon: Settings, path: 'settings' },
    { id: 'analytics', label: '分析', icon: BarChart3, path: 'analytics' },
    { id: 'messages', label: '消息', icon: MessageSquare, path: 'messages', badge: '3' }
  ];
  
  const currentTab = location.pathname.split('/').pop();
  
  return (
    <div>
      {/* 用户头部信息 */}
      <div className='bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6 mb-6'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <div className='w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl'>
              {user.avatar}
            </div>
            <div>
              <h1 className='text-2xl font-bold'>{user.name}</h1>
              <p className='text-blue-100'>{user.role} • ID: {userId}</p>
            </div>
          </div>
          <Link to='/examples/nested' className='btn bg-white/20 text-white border-white/30 hover:bg-white/30'>
            <ArrowLeft className='w-4 h-4 mr-2' />
            返回列表
          </Link>
        </div>
      </div>
      
      {/* 标签导航 */}
      <div className='bg-white rounded-lg border border-gray-200 mb-6'>
        <div className='border-b border-gray-200'>
          <nav className='flex space-x-8 px-6'>
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                to={tab.path}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center relative ${
                  currentTab === tab.path
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className='w-4 h-4 mr-2' />
                {tab.label}
                {tab.badge && (
                  <span className='ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>
                    {tab.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </div>
        
        {/* 嵌套路由内容 */}
        <div className='p-6'>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

// 用户列表页面
function UserListPage() {
  return (
    <div>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-900 mb-2'>用户管理</h1>
        <p className='text-gray-600'>点击用户查看详细信息和嵌套路由演示</p>
      </div>
      
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {Object.values(users).map((user) => (
          <Link
            key={user.id}
            to={`user/${user.id}/profile`}
            className='card hover:shadow-lg transition-all duration-200 transform hover:scale-105'
          >
            <div className='card-content'>
              <div className='flex items-center space-x-4 mb-4'>
                <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-xl'>
                  {user.avatar}
                </div>
                <div>
                  <h3 className='font-semibold text-gray-900'>{user.name}</h3>
                  <p className='text-gray-600 text-sm'>{user.role}</p>
                </div>
              </div>
              <p className='text-gray-500 text-sm'>{user.email}</p>
              <div className='mt-4 flex items-center text-blue-600 text-sm font-medium'>
                查看详情
                <ExternalLink className='w-4 h-4 ml-1' />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// 主嵌套路由示例组件
function NestedRoutingExample() {
  const location = useLocation();
  
  const codeExample = `// 嵌套路由配置
import { Routes, Route, Outlet } from 'react-router-dom';

// App.tsx - 主路由配置
function App() {
  return (
    <Routes>
      <Route path="/users" element={<UsersLayout />}>
        <Route index element={<UserList />} />
        <Route path=":userId" element={<UserDetail />}>
          <Route path="profile" element={<UserProfile />} />
          <Route path="settings" element={<UserSettings />} />
          <Route path="analytics" element={<UserAnalytics />} />
        </Route>
      </Route>
    </Routes>
  );
}

// UsersLayout.tsx - 用户模块布局
function UsersLayout() {
  return (
    <div className="users-layout">
      <Header />
      <Sidebar />
      <main>
        <Outlet /> {/* 子路由渲染位置 */}
      </main>
    </div>
  );
}

// UserDetail.tsx - 用户详情布局
function UserDetail() {
  const { userId } = useParams();
  
  return (
    <div>
      <UserHeader userId={userId} />
      <TabNavigation />
      <div className="content">
        <Outlet /> {/* 嵌套子路由渲染位置 */}
      </div>
    </div>
  );
}`;

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
            <div className='flex items-center justify-between mb-4'>
              <div className='flex items-center'>
                <div className='w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4'>
                  <Layers className='w-6 h-6 text-purple-600' />
                </div>
                <div>
                  <h1 className='text-3xl font-bold text-gray-900'>嵌套路由示例</h1>
                  <p className='text-gray-600 mt-1'>构建复杂的多层页面结构</p>
                </div>
              </div>
              
              <Link to='/examples/basic' className='btn btn-outline'>
                <ArrowLeft className='w-4 h-4 mr-2' />
                返回基础示例
              </Link>
            </div>
            
            <div className='bg-purple-50 border border-purple-200 rounded-lg p-4'>
              <div className='flex items-center text-sm text-purple-800'>
                <Layers className='w-4 h-4 mr-2' />
                <span className='font-medium'>当前路径:</span>
                <code className='ml-2 px-2 py-1 bg-purple-100 rounded text-purple-900'>
                  {location.pathname}
                </code>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-6 py-8'>
        <div className='grid grid-cols-1 xl:grid-cols-3 gap-8'>
          {/* 左侧：嵌套路由演示 */}
          <div className='xl:col-span-2'>
            <Routes>
              <Route index element={<UserListPage />} />
              <Route path='user/:userId' element={<UserDetailPage />}>
                <Route index element={<Navigate to='profile' replace />} />
                <Route path='profile' element={<UserProfile />} />
                <Route path='settings' element={<UserSettings />} />
                <Route path='analytics' element={<UserAnalytics />} />
                <Route path='messages' element={<UserMessages />} />
              </Route>
            </Routes>
          </div>
          
          {/* 右侧：代码示例和说明 */}
          <div className='space-y-6'>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className='card'
            >
              <div className='card-header'>
                <h2 className='text-lg font-semibold text-gray-900 flex items-center'>
                  <Code className='w-5 h-5 mr-2' />
                  嵌套路由结构
                </h2>
              </div>
              <div className='card-content'>
                <div className='bg-gray-900 rounded-lg overflow-hidden'>
                  <div className='px-4 py-2 bg-gray-800 text-gray-400 text-sm'>
                    nested-routing.tsx
                  </div>
                  <pre className='p-4 text-xs text-gray-100 overflow-x-auto leading-relaxed'>
                    <code>{codeExample}</code>
                  </pre>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className='card'
            >
              <div className='card-header'>
                <h2 className='text-lg font-semibold text-gray-900'>💡 核心概念</h2>
              </div>
              <div className='card-content space-y-4'>
                <div>
                  <h3 className='font-medium text-gray-900 mb-2'>Outlet 组件</h3>
                  <p className='text-gray-600 text-sm'>
                    <code className='bg-gray-100 px-1 rounded'>&lt;Outlet /&gt;</code> 是子路由的渲染位置，
                    类似于插槽机制。
                  </p>
                </div>
                
                <div>
                  <h3 className='font-medium text-gray-900 mb-2'>路由层级</h3>
                  <p className='text-gray-600 text-sm'>
                    通过嵌套的 <code className='bg-gray-100 px-1 rounded'>Route</code> 组件
                    定义多层路由结构。
                  </p>
                </div>
                
                <div>
                  <h3 className='font-medium text-gray-900 mb-2'>相对路径</h3>
                  <p className='text-gray-600 text-sm'>
                    子路由使用相对路径，会自动继承父路由的路径前缀。
                  </p>
                </div>
                
                <div>
                  <h3 className='font-medium text-gray-900 mb-2'>Index 路由</h3>
                  <p className='text-gray-600 text-sm'>
                    <code className='bg-gray-100 px-1 rounded'>index</code> 属性定义默认子路由，
                    当访问父路径时显示。
                  </p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className='bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6'
            >
              <h3 className='text-lg font-semibold text-gray-900 mb-3'>
                🎯 使用场景
              </h3>
              <ul className='space-y-2 text-gray-600 text-sm'>
                <li className='flex items-start'>
                  <span className='text-purple-500 mr-2'>•</span>
                  管理后台的模块化页面结构
                </li>
                <li className='flex items-start'>
                  <span className='text-purple-500 mr-2'>•</span>
                  用户资料页面的多个标签页
                </li>
                <li className='flex items-start'>
                  <span className='text-purple-500 mr-2'>•</span>
                  电商网站的产品分类浏览
                </li>
                <li className='flex items-start'>
                  <span className='text-purple-500 mr-2'>•</span>
                  文档网站的章节导航
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NestedRoutingExample;