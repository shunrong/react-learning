import { useState } from 'react';
import {
  useNavigate,
  useLocation,
  Link,
  Routes,
  Route,
} from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Plus,
  Edit,
  Eye,
  Settings,
  Image,
  User,
  FileText,
  ArrowRight,
  Code,
  Layers,
  MousePointer,
  Zap,
} from 'lucide-react';

// 模态路由组件
function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className='bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[80vh] overflow-hidden'
          onClick={e => e.stopPropagation()}
        >
          <div className='flex items-center justify-between p-4 border-b border-gray-200'>
            <h2 className='text-lg font-semibold text-gray-900'>模态内容</h2>
            <button onClick={onClose} className='p-1 hover:bg-gray-100 rounded'>
              <X className='w-5 h-5 text-gray-500' />
            </button>
          </div>
          <div className='p-4 overflow-y-auto'>{children}</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// 用户详情模态
function UserModal({ userId }: { userId: string }) {
  const navigate = useNavigate();
  const users = {
    '1': {
      id: '1',
      name: 'Alice Johnson',
      role: 'Admin',
      email: 'alice@example.com',
      avatar: '👩‍💻',
    },
    '2': {
      id: '2',
      name: 'Bob Smith',
      role: 'Developer',
      email: 'bob@example.com',
      avatar: '👨‍💼',
    },
    '3': {
      id: '3',
      name: 'Carol Williams',
      role: 'Designer',
      email: 'carol@example.com',
      avatar: '👩‍🎨',
    },
  };

  const user = users[userId as keyof typeof users];

  return (
    <Modal onClose={() => navigate('/examples/modal')}>
      {user ? (
        <div className='space-y-4'>
          <div className='flex items-center space-x-4'>
            <div className='w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl'>
              {user.avatar}
            </div>
            <div>
              <h3 className='text-xl font-bold text-gray-900'>{user.name}</h3>
              <p className='text-gray-600'>{user.role}</p>
              <p className='text-sm text-gray-500'>{user.email}</p>
            </div>
          </div>

          <div className='bg-gray-50 rounded-lg p-4'>
            <h4 className='font-medium text-gray-900 mb-2'>用户信息</h4>
            <p className='text-sm text-gray-600'>
              这是一个通过路由控制的模态窗口，URL 会反映当前显示的用户 ID，
              支持浏览器的前进后退，也可以直接通过 URL 访问。
            </p>
          </div>

          <div className='flex space-x-2'>
            <button className='btn btn-primary text-sm'>
              <Edit className='w-4 h-4 mr-1' />
              编辑
            </button>
            <button className='btn btn-outline text-sm'>
              <Settings className='w-4 h-4 mr-1' />
              设置
            </button>
          </div>
        </div>
      ) : (
        <div className='text-center py-8'>
          <User className='w-16 h-16 text-gray-400 mx-auto mb-4' />
          <p className='text-gray-600'>用户不存在</p>
        </div>
      )}
    </Modal>
  );
}

// 图片预览模态
function ImageModal({ imageId }: { imageId: string }) {
  const navigate = useNavigate();
  const images = {
    '1': {
      id: '1',
      title: '山水风景',
      url: '🏔️',
      description: '美丽的山水风景照片',
    },
    '2': {
      id: '2',
      title: '城市夜景',
      url: '🌃',
      description: '繁华的城市夜景',
    },
    '3': {
      id: '3',
      title: '森林小径',
      url: '🌲',
      description: '宁静的森林小径',
    },
  };

  const image = images[imageId as keyof typeof images];

  return (
    <Modal onClose={() => navigate('/examples/modal')}>
      {image ? (
        <div className='space-y-4'>
          <div className='text-center'>
            <div className='w-full h-48 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center text-6xl mb-4'>
              {image.url}
            </div>
            <h3 className='text-xl font-bold text-gray-900'>{image.title}</h3>
            <p className='text-gray-600 mt-2'>{image.description}</p>
          </div>

          <div className='bg-gray-50 rounded-lg p-4'>
            <h4 className='font-medium text-gray-900 mb-2'>图片详情</h4>
            <div className='grid grid-cols-2 gap-4 text-sm'>
              <div>
                <span className='text-gray-500'>ID:</span>
                <span className='ml-2 font-medium'>{image.id}</span>
              </div>
              <div>
                <span className='text-gray-500'>类型:</span>
                <span className='ml-2 font-medium'>风景</span>
              </div>
            </div>
          </div>

          <div className='flex space-x-2'>
            <button className='btn btn-primary text-sm'>
              <Plus className='w-4 h-4 mr-1' />
              收藏
            </button>
            <button className='btn btn-outline text-sm'>
              <FileText className='w-4 h-4 mr-1' />
              详情
            </button>
          </div>
        </div>
      ) : (
        <div className='text-center py-8'>
          <Image className='w-16 h-16 text-gray-400 mx-auto mb-4' />
          <p className='text-gray-600'>图片不存在</p>
        </div>
      )}
    </Modal>
  );
}

// 设置模态
function SettingsModal() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <Modal onClose={() => navigate('/examples/modal')}>
      <div className='space-y-6'>
        <div>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>应用设置</h3>

          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div>
                <h4 className='font-medium text-gray-900'>推送通知</h4>
                <p className='text-sm text-gray-600'>接收应用推送消息</p>
              </div>
              <label className='relative inline-flex items-center cursor-pointer'>
                <input
                  type='checkbox'
                  checked={notifications}
                  onChange={e => setNotifications(e.target.checked)}
                  className='sr-only peer'
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className='flex items-center justify-between'>
              <div>
                <h4 className='font-medium text-gray-900'>深色模式</h4>
                <p className='text-sm text-gray-600'>切换应用主题</p>
              </div>
              <label className='relative inline-flex items-center cursor-pointer'>
                <input
                  type='checkbox'
                  checked={darkMode}
                  onChange={e => setDarkMode(e.target.checked)}
                  className='sr-only peer'
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        <div className='pt-4 border-t border-gray-200'>
          <div className='flex space-x-2'>
            <button className='btn btn-primary text-sm'>保存设置</button>
            <button
              onClick={() => navigate('/examples/modal')}
              className='btn btn-outline text-sm'
            >
              取消
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

// 主要示例组件
function ModalRoutingExample() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('basic');

  const isModalRoute = location.pathname !== '/examples/modal';

  const codeExamples = {
    basic: `// 基础模态路由
import { Routes, Route, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

function Modal({ children, onClose }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg max-w-lg mx-auto mt-20"
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function UserModal({ userId }) {
  const navigate = useNavigate();
  
  return (
    <Modal onClose={() => navigate('/users')}>
      <div className="p-6">
        <h2>用户详情 #{userId}</h2>
        {/* 用户详情内容 */}
      </div>
    </Modal>
  );
}`,

    advanced: `// 高级模态路由配置
function App() {
  const location = useLocation();
  const background = location.state?.background;
  
  return (
    <div>
      <Routes location={background || location}>
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/users" element={<UserList />} />
      </Routes>
      
      {/* 模态路由 */}
      {background && (
        <Routes>
          <Route path="/gallery/:imageId" element={<ImageModal />} />
          <Route path="/users/:userId" element={<UserModal />} />
          <Route path="/settings" element={<SettingsModal />} />
        </Routes>
      )}
    </div>
  );
}

// 带背景状态的导航
function GalleryItem({ image }) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const openModal = () => {
    navigate(\`/gallery/\${image.id}\`, {
      state: { background: location }
    });
  };
  
  return (
    <div onClick={openModal} className="cursor-pointer">
      <img src={image.src} alt={image.title} />
    </div>
  );
}`,

    patterns: `// 模态路由设计模式

// 1. 嵌套模态支持
function NestedModal({ children, level = 1 }) {
  const zIndex = 50 + level * 10;
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-30"
      style={{ zIndex }}
    >
      <div className="modal-content">
        {children}
      </div>
    </div>
  );
}

// 2. 模态状态管理
const ModalContext = createContext();

function ModalProvider({ children }) {
  const [modals, setModals] = useState([]);
  
  const openModal = (component, props = {}) => {
    setModals(prev => [...prev, { id: Date.now(), component, props }]);
  };
  
  const closeModal = (id) => {
    setModals(prev => prev.filter(modal => modal.id !== id));
  };
  
  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {modals.map(modal => (
        <modal.component 
          key={modal.id} 
          {...modal.props}
          onClose={() => closeModal(modal.id)}
        />
      ))}
    </ModalContext.Provider>
  );
}

// 3. 键盘导航支持
function useModalKeyboard(onClose) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);
}`,

    accessibility: `// 无障碍访问优化
function AccessibleModal({ children, onClose, title }) {
  const modalRef = useRef();
  
  useEffect(() => {
    // 聚焦管理
    const previousActiveElement = document.activeElement;
    modalRef.current?.focus();
    
    // 焦点陷阱
    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    const handleTabKey = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };
    
    document.addEventListener('keydown', handleTabKey);
    
    return () => {
      document.removeEventListener('keydown', handleTabKey);
      previousActiveElement?.focus();
    };
  }, []);
  
  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      tabIndex={-1}
      className="modal"
    >
      <h2 id="modal-title">{title}</h2>
      <div id="modal-description">
        {children}
      </div>
      <button onClick={onClose} aria-label="关闭模态窗口">
        ×
      </button>
    </div>
  );
}`,
  };

  const tabs = [
    { id: 'basic', label: '基础实现', icon: Code },
    { id: 'advanced', label: '高级配置', icon: Layers },
    { id: 'patterns', label: '设计模式', icon: Zap },
    { id: 'accessibility', label: '无障碍访问', icon: Eye },
  ];

  const features = [
    {
      title: 'URL 同步',
      description: '模态状态与 URL 保持同步',
      icon: MousePointer,
      benefits: ['SEO 友好', '可直接分享', '浏览器历史支持'],
    },
    {
      title: '动画过渡',
      description: '流畅的打开关闭动画',
      icon: Zap,
      benefits: ['用户体验佳', 'Framer Motion', 'CSS Transitions'],
    },
    {
      title: '状态管理',
      description: '复杂模态状态的管理',
      icon: Settings,
      benefits: ['嵌套模态', '多模态并存', '全局状态'],
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
              <div className='w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mr-4'>
                <Layers className='w-6 h-6 text-indigo-600' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-gray-900'>
                  模态路由示例
                </h1>
                <p className='text-gray-600 mt-1'>URL 驱动的模态窗口管理</p>
              </div>
            </div>

            <div className='bg-indigo-50 border border-indigo-200 rounded-lg p-4'>
              <div className='flex items-center text-sm text-indigo-800'>
                <Layers className='w-4 h-4 mr-2' />
                <span className='font-medium'>模态路由:</span>
                <span className='ml-2'>通过 URL 控制模态窗口的显示和隐藏</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-6 py-8'>
        <div className='grid grid-cols-1 xl:grid-cols-2 gap-8'>
          {/* 左侧：交互演示 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className='space-y-6'
          >
            <div className='card'>
              <div className='card-header'>
                <h2 className='text-xl font-semibold text-gray-900'>
                  🎭 模态演示
                </h2>
                <p className='text-sm text-gray-600 mt-1'>
                  点击按钮体验不同类型的模态路由
                </p>
              </div>

              <div className='card-content space-y-4'>
                <div className='grid grid-cols-1 gap-3'>
                  <h3 className='font-medium text-gray-900'>用户模态</h3>
                  <div className='grid grid-cols-3 gap-2'>
                    {[1, 2, 3].map(id => (
                      <Link
                        key={id}
                        to={`/examples/modal/user/${id}`}
                        className='p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-center transition-colors'
                      >
                        <User className='w-5 h-5 mx-auto mb-1 text-blue-600' />
                        <span className='text-sm font-medium'>用户 {id}</span>
                      </Link>
                    ))}
                  </div>

                  <h3 className='font-medium text-gray-900 mt-6'>图片预览</h3>
                  <div className='grid grid-cols-3 gap-2'>
                    {[1, 2, 3].map(id => (
                      <Link
                        key={id}
                        to={`/examples/modal/image/${id}`}
                        className='p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-center transition-colors'
                      >
                        <Image className='w-5 h-5 mx-auto mb-1 text-green-600' />
                        <span className='text-sm font-medium'>图片 {id}</span>
                      </Link>
                    ))}
                  </div>

                  <h3 className='font-medium text-gray-900 mt-6'>设置模态</h3>
                  <Link
                    to='/examples/modal/settings'
                    className='p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center'
                  >
                    <Settings className='w-5 h-5 mr-3 text-purple-600' />
                    <div>
                      <span className='font-medium'>应用设置</span>
                      <p className='text-sm text-gray-600'>打开设置模态窗口</p>
                    </div>
                  </Link>
                </div>

                <div className='bg-gray-50 rounded-lg p-4'>
                  <h4 className='font-medium text-gray-900 mb-2'>当前状态</h4>
                  <div className='text-sm space-y-1'>
                    <div className='flex justify-between'>
                      <span>模态状态:</span>
                      <span
                        className={
                          isModalRoute ? 'text-green-600' : 'text-gray-500'
                        }
                      >
                        {isModalRoute ? '已打开' : '已关闭'}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span>当前路径:</span>
                      <code className='text-indigo-600 text-xs'>
                        {location.pathname}
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 特性展示 */}
            <div className='grid grid-cols-1 gap-4'>
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                  className='bg-white rounded-lg p-4 border border-gray-200'
                >
                  <div className='flex items-center mb-3'>
                    <div className='w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3'>
                      <feature.icon className='w-4 h-4 text-indigo-600' />
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
                  <div className='flex flex-wrap gap-1'>
                    {feature.benefits.map((benefit, idx) => (
                      <span
                        key={idx}
                        className='text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded'
                      >
                        {benefit}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
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
                          ? 'bg-indigo-100 text-indigo-700'
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

        {/* 底部学习要点 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className='mt-8'
        >
          <div className='bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6'>
            <h3 className='text-xl font-semibold text-gray-900 mb-6'>
              🎭 模态路由核心优势
            </h3>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <h4 className='font-medium text-gray-900 mb-2'>URL 驱动</h4>
                <ul className='text-gray-600 text-sm space-y-1'>
                  <li>• 模态状态反映在 URL 中</li>
                  <li>• 支持浏览器前进后退</li>
                  <li>• 可以直接分享模态链接</li>
                  <li>• SEO 友好的结构</li>
                </ul>
              </div>

              <div>
                <h4 className='font-medium text-gray-900 mb-2'>用户体验</h4>
                <ul className='text-gray-600 text-sm space-y-1'>
                  <li>• 平滑的动画过渡效果</li>
                  <li>• 键盘导航支持 (ESC 关闭)</li>
                  <li>• 焦点管理和无障碍访问</li>
                  <li>• 响应式设计适配</li>
                </ul>
              </div>
            </div>

            <div className='mt-6 pt-4 border-t border-gray-200'>
              <div className='flex items-center justify-between'>
                <div className='text-sm text-gray-600'>
                  🎯 模态路由让复杂的界面交互变得简单而优雅
                </div>
                <Link
                  to='/comparison'
                  className='btn btn-primary text-sm flex items-center'
                >
                  查看路由对比
                  <ArrowRight className='w-4 h-4 ml-1' />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 模态路由定义 */}
      <Routes>
        <Route
          path='/examples/modal/user/:userId'
          element={
            <UserModal userId={location.pathname.split('/').pop() || ''} />
          }
        />
        <Route
          path='/examples/modal/image/:imageId'
          element={
            <ImageModal imageId={location.pathname.split('/').pop() || ''} />
          }
        />
        <Route path='/examples/modal/settings' element={<SettingsModal />} />
      </Routes>
    </div>
  );
}

export default ModalRoutingExample;
