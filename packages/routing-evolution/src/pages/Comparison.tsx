import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  CheckCircle, 
  XCircle, 
  ExternalLink,
  Star,
  Download,
  Calendar,
  Code,
  Zap,
  Layers,
  Globe,
} from 'lucide-react';

interface RouterLibrary {
  name: string;
  description: string;
  logo: string;
  version: string;
  npmWeekly: string;
  stars: string;
  maintainer: string;
  firstRelease: string;
  latestRelease: string;
  bundleSize: string;
  pros: string[];
  cons: string[];
  useCases: string[];
  codeExample: string;
  documentation: string;
  popularity: number;
  performance: number;
  ecosystem: number;
  learningCurve: number;
}

function Comparison() {
  const [selectedMetric, setSelectedMetric] = useState('popularity');
  
  const routers: RouterLibrary[] = [
    {
      name: 'React Router',
      description: 'React 生态系统中最流行和成熟的路由解决方案',
      logo: '🔀',
      version: 'v6.8.1',
      npmWeekly: '20M+',
      stars: '50.2k',
      maintainer: 'Remix Team',
      firstRelease: '2014',
      latestRelease: '2023年2月',
      bundleSize: '12.8kB',
      pros: [
        '成熟稳定，社区支持强大',
        'v6 API 简化，Hook 友好',
        '支持嵌套路由和代码分割',
        '丰富的生态系统和插件',
        '优秀的 TypeScript 支持',
        '支持 SSR 和静态生成'
      ],
      cons: [
        '学习曲线相对陡峭',
        '包体积相对较大',
        'v5 到 v6 迁移成本较高',
        '某些高级功能配置复杂'
      ],
      useCases: [
        '大型复杂的单页应用',
        '需要复杂嵌套路由的应用',
        '企业级应用开发',
        '需要 SSR 支持的项目'
      ],
      codeExample: `import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/users/:id" element={<UserProfile />} />
      </Routes>
    </BrowserRouter>
  );
}`,
      documentation: 'https://reactrouter.com',
      popularity: 95,
      performance: 85,
      ecosystem: 95,
      learningCurve: 70
    },
    {
      name: 'Next.js Router',
      description: '基于文件系统的路由，Next.js 框架内置',
      logo: '▲',
      version: 'v13.1.6',
      npmWeekly: '5M+',
      stars: '105k',
      maintainer: 'Vercel',
      firstRelease: '2016',
      latestRelease: '2023年1月',
      bundleSize: '内置',
      pros: [
        '零配置的文件系统路由',
        '自动代码分割和优化',
        '内置 SSR 和 SSG 支持',
        '优秀的开发体验',
        'App Router 提供更强大功能',
        'API 路由集成'
      ],
      cons: [
        '只能在 Next.js 项目中使用',
        '文件结构即路由，灵活性受限',
        'App Router 学习成本较高',
        '某些自定义需求难以实现'
      ],
      useCases: [
        'Next.js 全栈应用',
        '需要 SSR/SSG 的项目',
        '静态网站生成',
        'JAMstack 应用'
      ],
      codeExample: `// pages/index.js
export default function Home() {
  return <h1>Welcome to Next.js!</h1>
}

// pages/users/[id].js
import { useRouter } from 'next/router'

export default function User() {
  const router = useRouter()
  const { id } = router.query
  
  return <p>User ID: {id}</p>
}

// app/users/[id]/page.tsx (App Router)
export default function UserPage({ params }) {
  return <h1>User {params.id}</h1>
}`,
      documentation: 'https://nextjs.org/docs/routing/introduction',
      popularity: 90,
      performance: 95,
      ecosystem: 85,
      learningCurve: 85
    },
    {
      name: 'Reach Router',
      description: '已合并到 React Router v6，专注于可访问性',
      logo: '🏃‍♂️',
      version: 'v1.3.4',
      npmWeekly: '2M+',
      stars: '7.1k',
      maintainer: 'React Training (已停止)',
      firstRelease: '2018',
      latestRelease: '2019年3月',
      bundleSize: '7.2kB',
      pros: [
        '卓越的可访问性支持',
        '简洁直观的 API',
        '轻量级实现',
        '优秀的焦点管理'
      ],
      cons: [
        '已停止维护，合并到 React Router',
        '功能相对有限',
        '生态系统较小',
        '不推荐新项目使用'
      ],
      useCases: [
        '历史项目维护',
        '学习路由概念',
        '简单的单页应用'
      ],
      codeExample: `import { Router, Link } from '@reach/router';

function App() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>
      
      <Router>
        <Home path="/" />
        <About path="/about" />
        <UserProfile path="/users/:userId" />
      </Router>
    </div>
  );
}`,
      documentation: 'https://reach.tech/router',
      popularity: 20,
      performance: 90,
      ecosystem: 30,
      learningCurve: 95
    },
    {
      name: 'Wouter',
      description: '极简的 React 路由库，体积小巧',
      logo: '🪶',
      version: 'v2.9.1',
      npmWeekly: '180k',
      stars: '5.8k',
      maintainer: 'molefrog',
      firstRelease: '2019',
      latestRelease: '2023年1月',
      bundleSize: '1.5kB',
      pros: [
        '极小的包体积 (1.5kB)',
        '简单易用的 API',
        '支持 TypeScript',
        '零依赖',
        '支持 Hook 模式',
        '性能优异'
      ],
      cons: [
        '功能相对基础',
        '生态系统有限',
        '不支持复杂的嵌套路由',
        '社区相对较小'
      ],
      useCases: [
        '小型项目和原型',
        '对包体积敏感的项目',
        '简单的 SPA 应用',
        '嵌入式组件路由'
      ],
      codeExample: `import { Router, Route, Link } from 'wouter';

function App() {
  return (
    <div>
      <nav>
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
      </nav>
      
      <Router>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/users/:id">
          {params => <UserProfile id={params.id} />}
        </Route>
      </Router>
    </div>
  );
}`,
      documentation: 'https://github.com/molefrog/wouter',
      popularity: 60,
      performance: 95,
      ecosystem: 40,
      learningCurve: 90
    }
  ];

  const metrics = [
    { key: 'popularity', label: '受欢迎程度', icon: Star, color: 'yellow' },
    { key: 'performance', label: '性能表现', icon: Zap, color: 'green' },
    { key: 'ecosystem', label: '生态系统', icon: Globe, color: 'blue' },
    { key: 'learningCurve', label: '易学程度', icon: Code, color: 'purple' }
  ];

  const comparisonMatrix = [
    { feature: '包体积', reactRouter: '12.8kB', nextjs: '内置', reach: '7.2kB', wouter: '1.5kB' },
    { feature: 'TypeScript 支持', reactRouter: '✅ 优秀', nextjs: '✅ 优秀', reach: '✅ 良好', wouter: '✅ 良好' },
    { feature: '嵌套路由', reactRouter: '✅ 强大', nextjs: '✅ 文件系统', reach: '✅ 基础', wouter: '❌ 不支持' },
    { feature: '代码分割', reactRouter: '✅ 支持', nextjs: '✅ 自动', reach: '✅ 手动', wouter: '❌ 需自实现' },
    { feature: 'SSR 支持', reactRouter: '✅ 支持', nextjs: '✅ 内置', reach: '✅ 支持', wouter: '✅ 基础' },
    { feature: '学习成本', reactRouter: '中等', nextjs: '中等', reach: '低', wouter: '低' },
    { feature: '维护状态', reactRouter: '✅ 活跃', nextjs: '✅ 活跃', reach: '❌ 停止', wouter: '✅ 活跃' }
  ];

  const getMetricColor = (value: number) => {
    if (value >= 80) return 'bg-green-500';
    if (value >= 60) return 'bg-yellow-500';
    if (value >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className='min-h-full bg-gray-50'>
      {/* 头部 */}
      <div className='bg-gradient-to-r from-blue-600 to-purple-600 text-white'>
        <div className='max-w-7xl mx-auto px-6 py-16'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className='flex items-center mb-4'>
              <BarChart3 className='w-8 h-8 mr-3' />
              <h1 className='text-3xl md:text-4xl font-bold'>路由方案对比</h1>
            </div>
            <p className='text-xl text-blue-100 max-w-3xl'>
              深入对比主流 React 路由解决方案，帮助你选择最适合项目需求的路由库
            </p>
          </motion.div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-6 py-12'>
        {/* 指标选择 */}
        <section className='mb-12'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className='text-2xl font-bold text-gray-900 mb-6'>评估维度</h2>
            <div className='flex flex-wrap gap-4 mb-8'>
              {metrics.map((metric) => (
                <button
                  key={metric.key}
                  onClick={() => setSelectedMetric(metric.key)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center ${
                    selectedMetric === metric.key
                      ? `bg-${metric.color}-100 text-${metric.color}-700 border-2 border-${metric.color}-300`
                      : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <metric.icon className='w-4 h-4 mr-2' />
                  {metric.label}
                </button>
              ))}
            </div>
            
            {/* 指标对比图 */}
            <div className='bg-white rounded-lg p-6 shadow-sm border border-gray-200'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                {metrics.find(m => m.key === selectedMetric)?.label}对比
              </h3>
              <div className='space-y-4'>
                {routers.map((router, index) => (
                  <motion.div
                    key={router.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className='flex items-center'
                  >
                    <div className='w-32 text-sm font-medium text-gray-900'>
                      <span className='mr-2'>{router.logo}</span>
                      {router.name}
                    </div>
                    <div className='flex-1 mx-4'>
                      <div className='bg-gray-200 rounded-full h-3'>
                        <div
                          className={`h-3 rounded-full transition-all duration-1000 ${getMetricColor(router[selectedMetric as keyof RouterLibrary] as number)}`}
                          style={{ width: `${router[selectedMetric as keyof RouterLibrary]}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className='w-12 text-sm font-medium text-gray-600'>
                      {router[selectedMetric as keyof RouterLibrary]}%
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* 详细对比 */}
        <section className='mb-12'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className='text-2xl font-bold text-gray-900 mb-8'>详细对比</h2>
            
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
              {routers.map((router, index) => (
                <motion.div
                  key={router.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  className='card'
                >
                  <div className='card-header'>
                    <div className='flex items-center justify-between mb-4'>
                      <div className='flex items-center'>
                        <span className='text-2xl mr-3'>{router.logo}</span>
                        <div>
                          <h3 className='text-xl font-semibold text-gray-900'>{router.name}</h3>
                          <p className='text-gray-600 text-sm'>{router.description}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className='grid grid-cols-2 gap-4 text-sm'>
                      <div className='flex items-center'>
                        <Star className='w-4 h-4 text-yellow-500 mr-1' />
                        <span>{router.stars} stars</span>
                      </div>
                      <div className='flex items-center'>
                        <Download className='w-4 h-4 text-green-500 mr-1' />
                        <span>{router.npmWeekly}/week</span>
                      </div>
                      <div className='flex items-center'>
                        <Calendar className='w-4 h-4 text-blue-500 mr-1' />
                        <span>{router.latestRelease}</span>
                      </div>
                      <div className='flex items-center'>
                        <Zap className='w-4 h-4 text-purple-500 mr-1' />
                        <span>{router.bundleSize}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className='card-content space-y-4'>
                    <div>
                      <h4 className='font-medium text-green-700 mb-2'>✅ 优势</h4>
                      <ul className='text-sm text-gray-600 space-y-1'>
                        {router.pros.slice(0, 3).map((pro, idx) => (
                          <li key={idx} className='flex items-start'>
                            <CheckCircle className='w-3 h-3 text-green-500 mr-2 mt-1 flex-shrink-0' />
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className='font-medium text-red-700 mb-2'>❌ 劣势</h4>
                      <ul className='text-sm text-gray-600 space-y-1'>
                        {router.cons.slice(0, 2).map((con, idx) => (
                          <li key={idx} className='flex items-start'>
                            <XCircle className='w-3 h-3 text-red-500 mr-2 mt-1 flex-shrink-0' />
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className='pt-4 border-t border-gray-200'>
                      <a
                        href={router.documentation}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium'
                      >
                        查看文档
                        <ExternalLink className='w-3 h-3 ml-1' />
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* 功能对比表 */}
        <section className='mb-12'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className='text-2xl font-bold text-gray-900 mb-8'>功能对比表</h2>
            
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        功能特性
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        React Router
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Next.js Router
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Reach Router
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Wouter
                      </th>
                    </tr>
                  </thead>
                  <tbody className='bg-white divide-y divide-gray-200'>
                    {comparisonMatrix.map((row, index) => (
                      <tr key={row.feature} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                          {row.feature}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {row.reactRouter}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {row.nextjs}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {row.reach}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {row.wouter}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </section>

        {/* 选择建议 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className='bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8'
        >
          <div className='text-center mb-8'>
            <Layers className='w-12 h-12 text-blue-600 mx-auto mb-4' />
            <h3 className='text-2xl font-bold text-gray-900 mb-2'>选择建议</h3>
            <p className='text-gray-600'>根据项目需求选择最适合的路由解决方案</p>
          </div>
          
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            <div className='bg-white rounded-lg p-6 border border-gray-200'>
              <div className='text-center mb-4'>
                <span className='text-3xl'>🔀</span>
                <h4 className='font-semibold text-gray-900 mt-2'>React Router</h4>
              </div>
              <div className='text-sm text-gray-600 space-y-2'>
                <p><strong>适用于:</strong></p>
                <ul className='list-disc list-inside space-y-1'>
                  <li>大型复杂应用</li>
                  <li>需要丰富功能</li>
                  <li>团队开发项目</li>
                  <li>长期维护项目</li>
                </ul>
              </div>
            </div>
            
            <div className='bg-white rounded-lg p-6 border border-gray-200'>
              <div className='text-center mb-4'>
                <span className='text-3xl'>▲</span>
                <h4 className='font-semibold text-gray-900 mt-2'>Next.js Router</h4>
              </div>
              <div className='text-sm text-gray-600 space-y-2'>
                <p><strong>适用于:</strong></p>
                <ul className='list-disc list-inside space-y-1'>
                  <li>Next.js 项目</li>
                  <li>需要 SSR/SSG</li>
                  <li>全栈应用</li>
                  <li>SEO 重要项目</li>
                </ul>
              </div>
            </div>
            
            <div className='bg-white rounded-lg p-6 border border-gray-200 opacity-60'>
              <div className='text-center mb-4'>
                <span className='text-3xl'>🏃‍♂️</span>
                <h4 className='font-semibold text-gray-900 mt-2'>Reach Router</h4>
              </div>
              <div className='text-sm text-gray-600 space-y-2'>
                <p><strong>不推荐:</strong></p>
                <ul className='list-disc list-inside space-y-1'>
                  <li>已停止维护</li>
                  <li>合并到 React Router</li>
                  <li>仅限历史项目</li>
                </ul>
              </div>
            </div>
            
            <div className='bg-white rounded-lg p-6 border border-gray-200'>
              <div className='text-center mb-4'>
                <span className='text-3xl'>🪶</span>
                <h4 className='font-semibold text-gray-900 mt-2'>Wouter</h4>
              </div>
              <div className='text-sm text-gray-600 space-y-2'>
                <p><strong>适用于:</strong></p>
                <ul className='list-disc list-inside space-y-1'>
                  <li>小型项目</li>
                  <li>原型开发</li>
                  <li>包体积敏感</li>
                  <li>简单路由需求</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className='mt-8 text-center'>
            <div className='inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-sm font-medium'>
              💡 建议：90% 的项目选择 React Router 或 Next.js Router
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Comparison;