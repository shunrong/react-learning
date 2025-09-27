import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Navigation,
  GitBranch,
  Zap,
  Shield,
  Layers,
  BarChart3,
  ArrowRight,
  Star,
  Users,
  Download,
  Clock,
  Settings,
} from 'lucide-react';

const features = [
  {
    icon: GitBranch,
    title: 'Router 演进历史',
    description: '深入了解 React Router 从 v3 到 v6 的完整演进过程',
    link: '/evolution',
    color: 'bg-blue-500',
  },
  {
    icon: Navigation,
    title: '基础路由概念',
    description: '掌握路由的核心概念和基本用法',
    link: '/basic',
    color: 'bg-green-500',
  },
  {
    icon: Settings,
    title: '高级路由特性',
    description: '嵌套路由、动态路由、路由守卫等高级功能',
    link: '/advanced',
    color: 'bg-purple-500',
  },
  {
    icon: Layers,
    title: '设计模式',
    description: '路由设计的最佳实践和常见模式',
    link: '/patterns',
    color: 'bg-orange-500',
  },
  {
    icon: Zap,
    title: '性能优化',
    description: '代码分割、懒加载、预取等性能优化技巧',
    link: '/performance',
    color: 'bg-yellow-500',
  },
  {
    icon: BarChart3,
    title: '方案对比',
    description: '对比不同路由方案的优缺点和适用场景',
    link: '/comparison',
    color: 'bg-red-500',
  },
];

const stats = [
  { label: '路由示例', value: '15+', icon: Navigation },
  { label: '代码演示', value: '30+', icon: Star },
  { label: '最佳实践', value: '20+', icon: Shield },
  { label: '性能优化', value: '10+', icon: Zap },
];

const quickLinks = [
  { label: '嵌套路由示例', path: '/examples/nested' },
  { label: '动态路由示例', path: '/examples/dynamic' },
  { label: '路由守卫示例', path: '/examples/protected' },
  { label: '懒加载示例', path: '/examples/lazy' },
];

function Home() {
  return (
    <div className='min-h-full'>
      {/* Hero Section */}
      <section className='bg-gradient-to-br from-route-50 via-primary-50 to-white'>
        <div className='max-w-7xl mx-auto px-6 py-16 sm:py-24'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className='text-center'
          >
            <div className='flex justify-center mb-8'>
              <div className='relative'>
                <div className='w-24 h-24 bg-gradient-to-br from-route-500 to-primary-600 rounded-3xl flex items-center justify-center'>
                  <Navigation className='w-12 h-12 text-white' />
                </div>
                <div className='absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center'>
                  <Star className='w-4 h-4 text-yellow-900' />
                </div>
              </div>
            </div>

            <h1 className='text-4xl md:text-6xl font-bold text-gray-900 mb-6'>
              React Router
              <span className='gradient-text block'>演进历史</span>
            </h1>

            <p className='text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed'>
              从基础概念到高级特性，从版本演进到性能优化， 全面掌握 React
              路由系统的方方面面
            </p>

            <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
              <Link
                to='/evolution'
                className='btn btn-primary text-base px-8 py-3'
              >
                <GitBranch className='w-5 h-5 mr-2' />
                开始学习
              </Link>
              <Link
                to='/examples/basic'
                className='btn btn-outline text-base px-8 py-3'
              >
                查看示例
                <ArrowRight className='w-5 h-5 ml-2' />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 统计数据 */}
      <section className='py-16 bg-white border-b border-gray-200'>
        <div className='max-w-7xl mx-auto px-6'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className='grid grid-cols-2 md:grid-cols-4 gap-8'
          >
            {stats.map(stat => (
              <div key={stat.label} className='text-center'>
                <div className='flex justify-center mb-3'>
                  <div className='w-12 h-12 bg-route-100 rounded-xl flex items-center justify-center'>
                    <stat.icon className='w-6 h-6 text-route-600' />
                  </div>
                </div>
                <div className='text-3xl font-bold text-gray-900 mb-1'>
                  {stat.value}
                </div>
                <div className='text-sm text-gray-600'>{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 主要功能 */}
      <section className='py-20 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-6'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className='text-center mb-16'
          >
            <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-6'>
              全面的学习体系
            </h2>
            <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
              从理论到实践，从基础到高级，系统性地学习现代 React 路由开发
            </p>
          </motion.div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              >
                <Link
                  to={feature.link}
                  className='card hover:shadow-lg transition-all duration-300 transform hover:scale-105 h-full flex flex-col'
                >
                  <div className='card-content flex-1'>
                    <div className='flex items-center mb-4'>
                      <div
                        className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mr-4`}
                      >
                        <feature.icon className='w-6 h-6 text-white' />
                      </div>
                      <h3 className='text-xl font-semibold text-gray-900'>
                        {feature.title}
                      </h3>
                    </div>
                    <p className='text-gray-600 mb-4 flex-1'>
                      {feature.description}
                    </p>
                    <div className='flex items-center text-route-600 font-medium'>
                      了解更多
                      <ArrowRight className='w-4 h-4 ml-1 transition-transform group-hover:translate-x-1' />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 快速链接 */}
      <section className='py-16 bg-white'>
        <div className='max-w-7xl mx-auto px-6'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <h3 className='text-2xl md:text-3xl font-bold text-gray-900 mb-6'>
                快速开始
              </h3>
              <p className='text-lg text-gray-600 mb-8'>
                通过这些精选示例快速上手 React Router 的核心功能
              </p>
              <div className='space-y-3'>
                {quickLinks.map(link => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className='flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group'
                  >
                    <span className='font-medium text-gray-900'>
                      {link.label}
                    </span>
                    <ArrowRight className='w-4 h-4 text-gray-400 group-hover:text-route-600 transition-colors' />
                  </Link>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className='bg-gradient-to-br from-route-50 to-primary-50 rounded-2xl p-8'
            >
              <div className='text-center'>
                <div className='w-16 h-16 bg-route-600 rounded-2xl flex items-center justify-center mx-auto mb-6'>
                  <Users className='w-8 h-8 text-white' />
                </div>
                <h4 className='text-xl font-semibold text-gray-900 mb-4'>
                  加入学习社区
                </h4>
                <p className='text-gray-600 mb-6'>
                  与其他开发者一起讨论、学习和分享 React Router 经验
                </p>
                <div className='space-y-3'>
                  <div className='flex items-center justify-center text-sm text-gray-500'>
                    <Clock className='w-4 h-4 mr-2' />
                    最后更新: 2024年9月
                  </div>
                  <div className='flex items-center justify-center text-sm text-gray-500'>
                    <Download className='w-4 h-4 mr-2' />
                    已有 1000+ 开发者学习
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-16 bg-gradient-to-r from-route-600 to-primary-600'>
        <div className='max-w-4xl mx-auto text-center px-6'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <h3 className='text-2xl md:text-3xl font-bold text-white mb-6'>
              准备好深入学习了吗？
            </h3>
            <p className='text-lg text-route-100 mb-8'>
              从 React Router 的历史演进开始，系统性地掌握现代路由开发
            </p>
            <Link
              to='/evolution'
              className='inline-flex items-center px-8 py-3 bg-white text-route-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors'
            >
              开始学习之旅
              <ArrowRight className='w-5 h-5 ml-2' />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default Home;
