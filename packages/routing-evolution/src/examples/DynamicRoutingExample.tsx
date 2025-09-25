import { useEffect } from 'react';
import {
  useParams,
  useNavigate,
  useSearchParams,
  Link,
} from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Package, Search, AlertCircle, ArrowLeft } from 'lucide-react';

// 模拟数据库
const mockDatabase = {
  users: {
    alice: {
      id: 'alice',
      name: 'Alice Johnson',
      role: 'Admin',
      joinDate: '2023-01-15',
      posts: 42,
    },
    bob: {
      id: 'bob',
      name: 'Bob Smith',
      role: 'Developer',
      joinDate: '2023-03-20',
      posts: 28,
    },
    carol: {
      id: 'carol',
      name: 'Carol Williams',
      role: 'Designer',
      joinDate: '2023-05-10',
      posts: 35,
    },
  },
  products: {
    'laptop-001': {
      id: 'laptop-001',
      name: 'MacBook Pro M3',
      category: 'laptop',
      price: 12999,
      stock: 15,
    },
    'phone-002': {
      id: 'phone-002',
      name: 'iPhone 15 Pro',
      category: 'phone',
      price: 7999,
      stock: 8,
    },
    'tablet-003': {
      id: 'tablet-003',
      name: 'iPad Air',
      category: 'tablet',
      price: 4599,
      stock: 20,
    },
  },
  categories: {
    laptop: { name: '笔记本电脑', description: '高性能移动工作站' },
    phone: { name: '智能手机', description: '便携通讯设备' },
    tablet: { name: '平板电脑', description: '轻薄便携平板' },
  },
};

// 用户详情组件
function UserDetail() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const user = userId
    ? mockDatabase.users[userId as keyof typeof mockDatabase.users]
    : null;
  const tab = searchParams.get('tab') || 'profile';

  useEffect(() => {
    if (userId && !user) {
      const timer = setTimeout(() => {
        navigate('/examples/dynamic/user/not-found', { replace: true });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [userId, user, navigate]);

  if (userId && !user) {
    return (
      <div className='text-center py-8'>
        <div className='animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4'></div>
        <p className='text-gray-600'>正在验证用户...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className='text-center py-8'>
        <AlertCircle className='w-16 h-16 text-red-400 mx-auto mb-4' />
        <h2 className='text-xl font-semibold text-gray-900 mb-2'>用户不存在</h2>
        <p className='text-gray-600 mb-4'>ID "{userId}" 对应的用户未找到</p>
        <Link to='/examples/dynamic' className='btn btn-primary'>
          <ArrowLeft className='w-4 h-4 mr-2' />
          返回示例
        </Link>
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
      <div className='flex items-center justify-between mb-6'>
        <div className='flex items-center space-x-4'>
          <div className='w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold'>
            {user.name
              .split(' ')
              .map(n => n[0])
              .join('')}
          </div>
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>{user.name}</h1>
            <p className='text-gray-600'>{user.role}</p>
            <p className='text-sm text-gray-500'>用户ID: {user.id}</p>
          </div>
        </div>

        <Link to='/examples/dynamic' className='btn btn-outline'>
          <ArrowLeft className='w-4 h-4 mr-2' />
          返回
        </Link>
      </div>

      {/* 标签导航 */}
      <div className='border-b border-gray-200 mb-6'>
        <nav className='flex space-x-8'>
          {[
            { id: 'profile', label: '个人资料', icon: User },
            { id: 'posts', label: '发布内容', icon: Package },
            { id: 'settings', label: '设置', icon: Search },
          ].map(tabItem => (
            <Link
              key={tabItem.id}
              to={`/examples/dynamic/user/${userId}?tab=${tabItem.id}`}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                tab === tabItem.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tabItem.icon className='w-4 h-4 mr-1' />
              {tabItem.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* 标签内容 */}
      <div className='space-y-4'>
        {tab === 'profile' && (
          <div className='grid grid-cols-2 gap-4'>
            <div className='bg-gray-50 rounded-lg p-4'>
              <h3 className='font-medium text-gray-900 mb-2'>加入日期</h3>
              <p className='text-gray-600'>{user.joinDate}</p>
            </div>
            <div className='bg-gray-50 rounded-lg p-4'>
              <h3 className='font-medium text-gray-900 mb-2'>发布数量</h3>
              <p className='text-gray-600'>{user.posts} 篇</p>
            </div>
          </div>
        )}

        {tab === 'posts' && (
          <div className='text-center py-8'>
            <Package className='w-12 h-12 text-gray-400 mx-auto mb-4' />
            <p className='text-gray-600'>用户共发布了 {user.posts} 篇内容</p>
          </div>
        )}

        {tab === 'settings' && (
          <div className='text-center py-8'>
            <Search className='w-12 h-12 text-gray-400 mx-auto mb-4' />
            <p className='text-gray-600'>设置页面内容</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// 产品详情组件
function ProductDetail() {
  const { productId, categoryId } = useParams();
  const navigate = useNavigate();

  const product = productId
    ? mockDatabase.products[productId as keyof typeof mockDatabase.products]
    : null;
  const category = categoryId
    ? mockDatabase.categories[
        categoryId as keyof typeof mockDatabase.categories
      ]
    : null;

  useEffect(() => {
    if (product && categoryId && product.category !== categoryId) {
      navigate('/examples/dynamic/category/mismatch', { replace: true });
    }
  }, [product, categoryId, navigate]);

  if (!product) {
    return (
      <div className='text-center py-8'>
        <AlertCircle className='w-16 h-16 text-red-400 mx-auto mb-4' />
        <h2 className='text-xl font-semibold text-gray-900 mb-2'>产品不存在</h2>
        <p className='text-gray-600 mb-4'>ID "{productId}" 对应的产品未找到</p>
        <Link to='/examples/dynamic' className='btn btn-primary'>
          返回示例
        </Link>
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
      <div className='flex items-center justify-between mb-6'>
        <div>
          <div className='flex items-center mb-2'>
            {category && (
              <span className='bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm mr-2'>
                {category.name}
              </span>
            )}
            <span className='text-sm text-gray-500'>#{product.id}</span>
          </div>
          <h1 className='text-2xl font-bold text-gray-900'>{product.name}</h1>
          <p className='text-gray-600'>¥{product.price.toLocaleString()}</p>
        </div>

        <Link to='/examples/dynamic' className='btn btn-outline'>
          <ArrowLeft className='w-4 h-4 mr-2' />
          返回
        </Link>
      </div>

      <div className='grid grid-cols-3 gap-4'>
        <div className='bg-green-50 rounded-lg p-4'>
          <h3 className='font-medium text-green-900 mb-2'>库存状态</h3>
          <p className='text-green-600'>{product.stock} 件</p>
        </div>
        <div className='bg-blue-50 rounded-lg p-4'>
          <h3 className='font-medium text-blue-900 mb-2'>产品分类</h3>
          <p className='text-blue-600'>{product.category}</p>
        </div>
        <div className='bg-purple-50 rounded-lg p-4'>
          <h3 className='font-medium text-purple-900 mb-2'>产品状态</h3>
          <p className='text-purple-600'>正常销售</p>
        </div>
      </div>
    </motion.div>
  );
}

export { UserDetail, ProductDetail };
export default function DynamicRoutingExample() {
  return (
    <div className='min-h-full bg-gray-50 p-8'>
      <div className='text-center'>
        <h1 className='text-3xl font-bold text-gray-900 mb-4'>动态路由示例</h1>
        <p className='text-gray-600 mb-8'>点击下面的链接体验动态路由</p>

        <div className='space-y-4'>
          <Link
            to='/examples/dynamic/user/alice?tab=profile'
            className='btn btn-primary mr-4'
          >
            查看用户 Alice
          </Link>
          <Link
            to='/examples/dynamic/category/laptop/product/laptop-001'
            className='btn btn-secondary'
          >
            查看笔记本产品
          </Link>
        </div>
      </div>
    </div>
  );
}
